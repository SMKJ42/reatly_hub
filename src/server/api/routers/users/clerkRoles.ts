import { clerkClient } from "~/server/clerk";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { z } from "zod";

export const rolesRouter = createTRPCRouter({
  //TODO:

  DANGER_createOwner: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: "owner",
        },
      });
    }),

  createAuthor: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: "author",
        },
      });
    }),

  createAdmin: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: "admin",
        },
      });
    }),
  createSuperAdmin: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: "superAdmin",
        },
      });
    }),

  demoteSuperAdmin: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["admin", "user", "author"]),
      })
    )
    .mutation(async ({ input }) => {
      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: input.role,
        },
      });
    }),

  demoteAdmin: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["author", "user"]),
      })
    )
    .mutation(async ({ input }) => {
      await clerkClient.users.updateUserMetadata(input.userId, {
        publicMetadata: {
          role: input.role,
        },
      });
    }),

  deleteUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await clerkClient.users.deleteUser(input.userId);
    }),
});
