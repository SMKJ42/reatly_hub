import { TRPCError } from "@trpc/server";
import { t } from "../../trpc";

import { checkRateLimit } from "../../error";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";
import { clerkClient } from "@clerk/nextjs";

const serverRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 s"),
  analytics: true,
});

export const ownerPriveledges = ["owner"];
export const superAdminPriveledges = ["owner", "superAdmin"];
export const adminPriveledges = ["owner", "superAdmin", "admin"];
export const authorPriveledges = ["owner", "superAdmin", "admin", "author"];
export const userPriveledges = [
  "owner",
  "superAdmin",
  "admin",
  "author",
  "user",
];

export const adminRouter = t.router({
  getUserCount: t.procedure.mutation(async ({ ctx }) => {
    if (!ctx.userId || !adminPriveledges.includes(ctx.role as string)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You don't have access to this resource",
      });
    }

    const { success } = await serverRateLimit.limit(ctx.userId);
    checkRateLimit(success);

    const count = await clerkClient.users.getCount();
    return count;
  }),
  getUserById: t.procedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || !adminPriveledges.includes(ctx.role as string)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      const user = await clerkClient.users.getUser(input.userId);
      return user;
    }),

  getAllUsers: t.procedure
    .input(
      z.object({
        page: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userId || !adminPriveledges.includes(ctx.role as string)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      const offset = input.page * 20;

      const users = await clerkClient.users.getUserList({
        limit: 20,
        offset,
      });
      return users;
    }),

  getUserByUsername: t.procedure
    .input(
      z.object({
        username: z.string(),
        page: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || !adminPriveledges.includes(ctx.role as string)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      const offset = input.page * 20;

      const user = await clerkClient.users.getUserList({
        query: input.username,
        limit: 20,
        offset,
      });
      return user;
    }),
});
