import { z } from "zod";
import { createTRPCRouter, t } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "../error";
import { prisma } from "~/server/db";

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

      await ctx.prisma.article.create({
        data: {
          title: input.title,
          content: input.content,
          author: {
            connect: {
              id: ctx.userId,
            },
          },
        },
      });
    }),
  //TODO:
  update: t.procedure
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

      await getUsersOwnArticle(ctx.userId);

      await ctx.prisma.article.update({
        where: {
          id: input.articleId,
        },
        data: {
          content: input.content,
        },
      });
    }),
  //TODO:
  delete: t.procedure
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

      await getUsersOwnArticle(ctx.userId);

      await ctx.prisma.article.delete({
        where: {
          id: input.articleId,
        },
      });
    }),
});

async function getUsersOwnArticle(uid: string) {
  const article = await prisma.article.findUnique({
    where: {
      id: uid,
    },
  });

  if (article?.authorId !== uid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You don't have access to this resource",
    });
  }

  return article;
}

export const articleRouter = createTRPCRouter({
  //TODO:
  //getMostViewed
  //getMostRecent
  //getMostLiked
  //search
  //getByCategory
  //getByAuthor
  //getByTag
  //getTopFour
});
