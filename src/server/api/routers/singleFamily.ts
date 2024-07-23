import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import { checkRateLimit } from "../error";

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

export const singleFamilyRouter = createTRPCRouter({
  create: userProcedure
    .input(
      z.object({
        address: z.string(),
        price: z.string(),
        interest: z.string(),
        downPaymentPerc: z.string(),
        downPaymentDoll: z.string(),
        closingCostsPerc: z.string(),
        closingCostsDoll: z.string(),
        loanTerm: z.string(),
        loanType: z.string(),
        repairs: z.string(),
        ARV: z.string(),
        taxes: z.string(),
        insurance: z.string(),
        hoa: z.string(),
        vacancy: z.string(),
        capEx: z.string(),
        rennovations: z.string(),
        maintenance: z.string(),
        management: z.string(),
        expOther: z.string(),
        rents: z.string(),
        incOther: z.string(),
        appreciation: z.string(),
        loanBalance: z.string(),
        costOfRenno: z.string(),
        totalAquisitionReturn: z.string(),
        aquisitionCosts: z.string(),
        equity: z.string(),
        LTV: z.string(),
        mortgagePayment: z.string(),
        cashFlow: z.string(),
        expenses: z.string(),
        monthlyPayment: z.string(),
        cashOnCash: z.string(),
        rennoEquity: z.string(),
        rennoReturn: z.string(),
        closingCosts: z.string(),
        capRate: z.string(),
        ROE: z.string(),
        ROI: z.string(),
        fixed: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId: string = ctx.userId;

      const singleFamilyPod = await ctx.prisma.singleFamily.create({
        data: {
          authorId,
          ...input,
        },
      });
      return { ...singleFamilyPod };
    }),

  update: userProcedure
    .input(
      z.object({
        id: z.string(),
        address: z.string(),
        price: z.string(),
        interest: z.string(),
        downPaymentPerc: z.string(),
        downPaymentDoll: z.string(),
        closingCostsPerc: z.string(),
        closingCostsDoll: z.string(),
        loanTerm: z.string(),
        loanType: z.string(),
        repairs: z.string(),
        ARV: z.string(),
        taxes: z.string(),
        insurance: z.string(),
        hoa: z.string(),
        vacancy: z.string(),
        capEx: z.string(),
        rennovations: z.string(),
        maintenance: z.string(),
        management: z.string(),
        expOther: z.string(),
        rents: z.string(),
        incOther: z.string(),
        appreciation: z.string(),
        loanBalance: z.string(),
        costOfRenno: z.string(),
        totalAquisitionReturn: z.string(),
        aquisitionCosts: z.string(),
        equity: z.string(),
        LTV: z.string(),
        mortgagePayment: z.string(),
        cashFlow: z.string(),
        expenses: z.string(),
        monthlyPayment: z.string(),
        cashOnCash: z.string(),
        rennoEquity: z.string(),
        rennoReturn: z.string(),
        closingCosts: z.string(),
        capRate: z.string(),
        ROE: z.string(),
        ROI: z.string(),
        fixed: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId: string = ctx.userId;

      const singleFamilyPod = await ctx.prisma.singleFamily.update({
        where: {
          id: input.id,
        },
        data: {
          authorId,
          ...input,
        },
      });
      return singleFamilyPod;
    }),

  delete: userProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteSingleFamilyPod = await ctx.prisma.singleFamily.delete({
        where: {
          id: input.id,
        },
      });
      return deleteSingleFamilyPod;
    }),

  getAll: userProcedure.query(async ({ ctx }) => {
    const authorId = ctx.userId;

    const { success } = await ratelimit.limit(authorId);
    checkRateLimit(success);

    const singleFamilyPod = await ctx.prisma.singleFamily.findMany({
      where: {
        authorId,
      },
    });
    return singleFamilyPod;
  }),

  getMostRecent: userProcedure.query(async ({ ctx }) => {
    const authorId = ctx.userId;

    const singleFamilyPod = await ctx.prisma.singleFamily.findMany({
      take: 4,
      where: {
        authorId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return singleFamilyPod;
  }),
});
