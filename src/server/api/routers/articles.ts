import { z } from "zod";
import { authurProcedure, createTRPCRouter, t } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/server/db";
import sanitizeHtml from "sanitize-html";
import type { StagedArticleConstructor } from "../../lib/types/serverRoutes";
import { type ServerContext } from "../types";

export function getArticlePreview(html: string) {
  html = html
    // reduce the string into a manageable size before removing html tags
    .slice(0, 600)
    // remove html tags
    .replaceAll(/(<([^>]+)>)/gi, " ")
    .trim();

  if (html.length < 180) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Article must be at least 180 characters long",
    });
  }
  // reduce the string further into a manageable size to display on UI
  html = html.slice(0, 200);

  return { content: html };
}

export async function checkUserHas_Article_CRUD_Priviledge(
  ctx: ServerContext,
  articleId: string
) {
  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });

  if (
    article?.authorId === ctx.userId &&
    ["super-admin", "owner"].includes(ctx.role)
  ) {
    // do nothing, user has access
  } else {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You don't have access to this resource",
    });
  }

  return article;
}

export const articleAuthorRouter = createTRPCRouter({
  stageArticle: authurProcedure
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
  updateStagedArticle: authurProcedure
    .input(
      z.object({
        content: z.string(),
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkUserHas_Article_CRUD_Priviledge(ctx, input.articleId);
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
  deletePublicArticle: authurProcedure
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkUserHas_Article_CRUD_Priviledge(ctx, input.articleId);

      await ctx.prisma.article.delete({
        where: {
          id: input.articleId,
        },
      });
    }),
  deleteStagedArticle: authurProcedure
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkUserHas_Article_CRUD_Priviledge(ctx, input.articleId);

      await ctx.prisma.staged_article.delete({
        where: {
          id: input.articleId,
        },
      });
    }),

  /*
   * deletes published and staged articles
   */
  deepDeleteArticle: authurProcedure
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkUserHas_Article_CRUD_Priviledge(ctx, input.articleId);

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

  requestPublish: authurProcedure
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkUserHas_Article_CRUD_Priviledge(ctx, input.articleId);

      await ctx.prisma.staged_article.update({
        where: {
          id: input.articleId,
        },
        data: {
          status: "pending",
        },
      });
    }),

  getPublishRequests: authurProcedure
    .input(
      z.object({
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const requests = await ctx.prisma.staged_article.findMany({
        where: {
          status: "pending",
        },
        take: 10,
        skip: (input.page - 1) * 10,
        orderBy: {
          createdAt: "desc",
        },
      });

      return requests;
    }),

  acceptPublishRequest: authurProcedure
    .input(
      z.object({
        articleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkUserHas_Article_CRUD_Priviledge(ctx, input.articleId);

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

  denyPublishRequest: authurProcedure
    .input(z.object({ articleId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkUserHas_Article_CRUD_Priviledge(ctx, input.articleId);

      await ctx.prisma.staged_article.update({
        where: {
          id: input.articleId,
        },
        data: {
          status: "draft",
        },
      });
    }),

  getAuthorsLastStagedArticle: authurProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      const article = await prisma.staged_article.findFirst({
        where: {
          authorId: ctx.userId,
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

  getAuthorsStagedArticles: authurProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx, input }) => {
      const articles = await prisma.staged_article.findMany({
        take: 10,
        skip: (input.page - 1) * 10,
        where: {
          authorId: ctx.userId,
        },
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

      const count = await prisma.staged_article.count({
        where: {
          authorId: ctx.userId,
        },
      });

      return { articles, count };
    }),

  getAuthorsArticles: authurProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx, input }) => {
      const articles = await prisma.article.findMany({
        take: 10,
        skip: (input.page - 1) * 10,
        where: {
          authorId: ctx.userId,
        },
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

      const count = await prisma.article.count({
        where: {
          authorId: ctx.userId,
        },
      });

      return { articles, count };
    }),
});

export const articleRouter = createTRPCRouter({
  //TODO:

  previewMostRecent: t.procedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx, input }) => {
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
      const count = await prisma.article.count();
      return { articles, count };
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
});
