import { z } from "zod";
import { createTRPCRouter, privateProcedure, t } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "../error";

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
  limiter: Ratelimit.slidingWindow(10, "1 d"),
  analytics: true,
});

export const articleAuthorRouter = t.router({
  //TODO:
  create: t.procedure.input(z.object({})).mutation(async ({ ctx, input }) => {
    if (!ctx.userId || ctx.role === "user") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have access to this resource",
      });
    }

    const { success } = await serverRateLimit.limit(ctx.userId);
    checkRateLimit(success);
  }),
  //TODO:
  update: t.procedure.input(z.object({})).mutation(async ({ ctx, input }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have access to this resource",
      });
    }

    const { success } = await serverRateLimit.limit(ctx.userId);
    checkRateLimit(success);
  }),
  //TODO:
  delete: t.procedure.input(z.object({})).mutation(async ({ ctx, input }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have access to this resource",
      });
    }

    const { success } = await serverRateLimit.limit(ctx.userId);
    checkRateLimit(success);
  }),
});

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
