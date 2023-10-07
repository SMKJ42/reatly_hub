import { TRPCError } from "@trpc/server";
import { t } from "../../trpc";

import { checkRateLimit } from "../../error";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";
import { serverRateLimit } from "~/server/lib/rateLimits";

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

export const rolesRouter = t.router({
  //TODO:

  DANGER_createOwner: t.procedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // if (!ctx.userId || ctx.role !== "owner") {
      //   throw new TRPCError({
      //     code: "UNAUTHORIZED",
      //     message: "You don't have access to this resource",
      //   });
      // }

      const { success } = await serverRateLimit.limit(ctx.userId as string);
      checkRateLimit(success);

      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: "owner",
        },
      });
    }),

  createAuthor: t.procedure
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

      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: "author",
        },
      });
    }),

  createAdmin: t.procedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || !superAdminPriveledges.includes(ctx.role as string)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: "admin",
        },
      });
    }),
  createSuperAdmin: t.procedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || !ownerPriveledges.includes(ctx.role as string)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: "superAdmin",
        },
      });
    }),

  demoteSuperAdmin: t.procedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["admin", "user", "author"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || !ownerPriveledges.includes(ctx.role as string)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: input.role,
        },
      });
    }),

  demoteAdmin: t.procedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["author", "user"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || !superAdminPriveledges.includes(ctx.role as string)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: input.role,
        },
      });
    }),

  deleteUser: t.procedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId || !superAdminPriveledges.includes(ctx.role as string)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have access to this resource",
        });
      }

      const { success } = await serverRateLimit.limit(ctx.userId);
      checkRateLimit(success);

      await clerkClient.users.deleteUser(input.userId);
    }),
});
