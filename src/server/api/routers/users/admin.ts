import { adminProcedure, createTRPCRouter } from "../../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";

export const adminRouter = createTRPCRouter({
  getUserCount: adminProcedure.mutation(async ({ ctx }) => {
    const count = await clerkClient.users.getCount();
    return count;
  }),
  getUserById: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx: _ctx, input }) => {
      const user = await clerkClient.users.getUser(input.userId);
      return user;
    }),

  getAllUsers: adminProcedure
    .input(
      z.object({
        page: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const offset = input.page * 20;

      const users = await clerkClient.users.getUserList({
        limit: 20,
        offset,
      });
      return users;
    }),

  getUserByUsername: adminProcedure
    .input(
      z.object({
        username: z.string(),
        page: z.number(),
      })
    )
    .mutation(async ({ ctx: _ctx, input }) => {
      const offset = input.page * 20;

      const user = await clerkClient.users.getUserList({
        query: input.username,
        limit: 20,
        offset,
      });
      return user;
    }),
  getPublishRequestCount: adminProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.staged_article.count({
      where: {
        status: "pending",
      },
    });
    return count;
  }),
});
