import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

export const mortgageRatesRouter = createTRPCRouter({
  create: publicProcedure
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
      if (input.key !== env.CRON_KEY) {
        return new TRPCError({
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
  update: publicProcedure
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
      if (input.key !== env.CRON_KEY) {
        return new TRPCError({
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
    const data = await ctx.prisma.mortgageRates.findMany({});
    return data;
  }),
});
