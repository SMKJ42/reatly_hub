import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError, z } from "zod";
import { prisma } from "~/server/db";
import { env } from "~/env.mjs";

export const createServerTRPCcontext = (_opts: CreateNextContextOptions) => {
  return {
    prisma,
  };
};

const s = initTRPC.context<typeof createServerTRPCcontext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// const enforceServer = s.middleware(async ({ ctx, next }) => {
//   if (env.THE_KEY_TO_RULE_THEM_ALL) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "You don't have access to this resource",
//     });
//   }
//   return next({
//     ctx: {},
//   });
// });

// export const serverProcedure = s.procedure.use(enforceServer);

export const mortgageRatesRouter = s.router({
  create: s.procedure
    .input(
      z.object({
        key: z.string(),
        name: z.string(),
        rate: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.key !== env.THE_KEY_TO_RULE_THEM_ALL) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this resource",
        });
      }
      return await ctx.prisma.mortgageRates.create({
        data: {
          name: input.name,
          rate: input.rate,
        },
      });
    }),
});
