import { z } from "zod";
import { createTRPCRouter, t } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "../error";
import { prisma } from "~/server/db";
import { getArticlePreview, getUsersOwnArticle } from "~/server/lib/articles";
import sanitizeHtml from "sanitize-html";

const serverRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 s"),
  analytics: true,
});

export const articleAuthorRouter = t.router({
  //TODO:
  stage_article: t.procedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        publicId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.role === "user") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      const sanContent = sanitizeHtml(input.content);
      const preview = getArticlePreview(sanContent);

      const output = await ctx.prisma.staged_article.create({
        data: {
          id: input.publicId,
          title: input.title,
          content: sanContent,
          authorId: ctx.userId,
          preview: preview.content,
        },
      });

      return output;
    }),
  updateStagedArticle: t.procedure
    .input(
      z.object({
        content: z.string(),
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.role === "user") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      //safe guard against updating other users articles
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
  deletePublicArticle: t.procedure
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.role === "user") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      //safe guard against updating other users articles
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
  deleteStagedArticle: t.procedure
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("ctx.role: ", ctx.role);
      console.log("ctx.userId: ", ctx.userId);

      if (!ctx.userId || ctx.role === "user") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      //safe guard against updating other users articles
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
  deepDeleteArticle: t.procedure
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || ctx.role === "user") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      //safe guard against updating other users articles
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

  // publishArticle: t.procedure
  // requestPublish: t.procedure
});

export const articleRouter = createTRPCRouter({
  //TODO:

  previewMostRecent: t.procedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx, input }) => {
      // const { success } = await serverRateLimit.limit();
      // checkRateLimit(success);

      const articles = await prisma.article.findMany({
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
  //getMostViewed
  //getMostRecent
  //getMostLiked
  //search
  //getByCategory
  //getByAuthor
  //getByTag
  //getTopFour
});
