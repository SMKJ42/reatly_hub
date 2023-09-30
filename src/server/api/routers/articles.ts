import { z } from "zod";
import { authorRouter, createTRPCRouter, t } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/db";
import { getArticlePreview, getUsersOwnArticle } from "~/server/lib/articles";
import sanitizeHtml from "sanitize-html";
import { batchRequestRateLimit } from "~/server/lib/rateLimits";
import { checkRateLimit } from "../error";
import type { StagedArticleConstructor } from "../../lib/types/serverRoutes";

export const articleAuthorRouter = t.router({
  //TODO:
  save_article: authorRouter
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        publicId: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sanContent = sanitizeHtml(input.content);
      const preview = getArticlePreview(sanContent);

      const article: StagedArticleConstructor = {
        title: input.title,
        content: sanContent,
        authorId: ctx.userId,
        preview: preview.content,
      };

      if (input.publicId) {
        article.id = input.publicId;
      }

      const output = await ctx.prisma.staged_article.create({
        data: {
          ...article,
        },
      });

      return output;
    }),

  stage_article: authorRouter
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        publicId: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sanContent = sanitizeHtml(input.content);
      const preview = getArticlePreview(sanContent);

      const article: StagedArticleConstructor = {
        title: input.title,
        content: sanContent,
        authorId: ctx.userId,
        preview: preview.content,
      };

      if (input.publicId) {
        article["id"] = input.publicId;
      }

      const output = await ctx.prisma.staged_article.create({
        data: {
          ...article,
        },
      });

      return output;
    }),
  updateStagedArticle: authorRouter
    .input(
      z.object({
        content: z.string(),
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await getUsersOwnArticle({
        userId: ctx.userId,
        role: ctx.role as string,
      });
      const sanContent = sanitizeHtml(input.content);
      const preview = getArticlePreview(sanContent);

      await ctx.prisma.staged_article.update({
        where: {
          id: input.articleId,
        },
        data: {
          content: sanContent,
          preview: preview.content,
        },
      });
    }),
  deletePublicArticle: authorRouter
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await getUsersOwnArticle({
        userId: ctx.userId,
        role: ctx.role as string,
      });

      await ctx.prisma.article.delete({
        where: {
          id: input.articleId,
        },
      });
    }),
  deleteStagedArticle: authorRouter
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await getUsersOwnArticle({
        userId: ctx.userId,
        role: ctx.role as string,
      });

      await ctx.prisma.staged_article.delete({
        where: {
          id: input.articleId,
        },
      });
    }),

  /*
   * deletes published and staged articles
   */
  deepDeleteArticle: authorRouter
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await getUsersOwnArticle({
        userId: ctx.userId,
        role: ctx.role as string,
      });

      await ctx.prisma.article.delete({
        where: {
          id: input.articleId,
        },
      });
      await ctx.prisma.staged_article.deleteMany({
        where: {
          publicId: input.articleId,
        },
      });
    }),

  requestPublish: authorRouter
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await getUsersOwnArticle({
        userId: ctx.userId,
        role: ctx.role as string,
      });

      await ctx.prisma.staged_article.update({
        where: {
          id: input.articleId,
        },
        data: {
          status: "pending",
        },
      });
    }),

  publishArticle: authorRouter
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await getUsersOwnArticle({
        userId: ctx.userId,
        role: ctx.role as string,
      });

      const data = await ctx.prisma.staged_article.update({
        where: {
          id: input.articleId,
        },
        data: {
          status: "published",
        },
      });

      await ctx.prisma.article.create({
        data: {
          id: data.publicId,
          title: data.title,
          content: data.content,
          authorId: data.authorId,
          preview: data.preview,
        },
      });
    }),

  getAuthorsLastArticle: authorRouter
    .input(
      z.object({
        authorId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const article = await prisma.article.findFirst({
        where: {
          authorId: input.authorId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Article not found",
        });
      }

      return {
        ...article,
      };
    }),
});

export const articleRouter = createTRPCRouter({
  //TODO:

  previewMostRecent: t.procedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx, input }) => {
      const { success } = await batchRequestRateLimit.limit(ctx.ip);
      checkRateLimit(success);
      const articles = await prisma.staged_article.findMany({
        take: 10,
        skip: (input.page - 1) * 10,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          preview: true,
          createdAt: true,
        },
      });
      return articles;
    }),

  getArticleById: t.procedure
    .input(z.object({ articleId: z.string() }))
    .query(async ({ ctx, input }) => {
      const article = await prisma.article.findUnique({
        where: {
          id: input.articleId,
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Article not found",
        });
      }

      void prisma.article.update({
        where: {
          id: input.articleId,
        },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      return {
        ...article,
      };
    }),
  getStagedArticleById: t.procedure
    .input(z.object({ articleId: z.string() }))
    .query(async ({ ctx, input }) => {
      const article = await prisma.staged_article.findUnique({
        where: {
          id: input.articleId,
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Article not found",
        });
      }

      return {
        ...article,
      };
    }),
  //getMostViewed
  //getMostRecent
  //getMostLiked
  //search
  //getByCategory
  //getByAuthor
  //getByTag
  //getTopFour
});
