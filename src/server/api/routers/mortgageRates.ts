import { z } from "zod";
import { privateProcedure, publicProcedure, t } from "../trpc";
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

export const mortgageRatesRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        key: z.string(),
        updatedAt: z.string().datetime(),
        code: z.string(),
        rate: z.number(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await serverRateLimit.limit(input.key);

      checkRateLimit(success);

      if (input.key !== env.THE_KEY_TO_RULE_THEM_ALL) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      } else {
        await ctx.prisma.mortgageRates.create({
          data: {
            updatedAt: input.updatedAt,
            code: input.code,
            rate: input.rate,
            name: input.name,
          },
        });
      }
    }),
  update: t.procedure
    .input(
      z.object({
        key: z.string(),
        updatedAt: z.string().datetime(),
        code: z.string(),
        rate: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(input.key);

      checkRateLimit(success);

      if (input.key !== env.THE_KEY_TO_RULE_THEM_ALL) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      } else {
        await ctx.prisma.mortgageRates.update({
          where: {
            code: input.code,
          },
          data: {
            updatedAt: input.updatedAt,
            rate: input.rate,
          },
        });
      }
    }),
  getAll: publicProcedure.input(z.null()).query(async ({ ctx }) => {
    const { success } = await ratelimit.limit(ctx.ip);
    checkRateLimit(success);

    const data = await ctx.prisma.mortgageRates.findMany({});
    return data;
  }),
});
