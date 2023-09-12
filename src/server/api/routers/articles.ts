import { z } from "zod";
import { createTRPCRouter, t } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "../error";
import { prisma } from "~/server/db";
import { adminPriveledges } from "./users/admin";
import { getArticlePreview, getUsersOwnArticle } from "~/server/lib/articles";

// Create a new ratelimiter, that allows 3 requests per 20 second
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "20 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

const serverRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 s"),
  analytics: true,
});

export const articleAuthorRouter = t.router({
  //TODO:
  create: t.procedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
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

      const preview = getArticlePreview(input.content);

      if (preview.length < 200) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Article must be at least 200 characters long",
        });
      }

      await ctx.prisma.article.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.userId,
          preview,
        },
      });
    }),
  //TODO:
  DANGEROUS_update: t.procedure
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

      const preview = getArticlePreview(input.content);

      if (preview.length < 200) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Article must be at least 200 characters long",
        });
      }

      await ctx.prisma.article.update({
        where: {
          id: input.articleId,
        },
        data: {
          content: input.content,
          preview,
        },
      });
    }),

  delete: t.procedure
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

      await ctx.prisma.article.delete({
        where: {
          id: input.articleId,
        },
      });
    }),
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
      // const { success } = await serverRateLimit.limit();
      // checkRateLimit(success);

      const article = await prisma.article.findUnique({
        where: {
          id: input.articleId,
        },
      });
      return article;
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
