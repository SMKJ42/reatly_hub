import { z } from "zod";
import { createTRPCRouter, privateProcedure, t } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

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
});

export const nextMortgageRatesRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.mortgageRates.findMany({});
    return data;
  }),
});
