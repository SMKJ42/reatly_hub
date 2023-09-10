// import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { singleFamilyRouter } from "./routers/singleFamily";
import {
  mortgageRatesRouter,
  nextMortgageRatesRouter,
} from "./routers/mortgageRates";
import { articleAuthorRouter, articleRouter } from "./routers/articles";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  singleFamily: singleFamilyRouter,
  mortgageRates: mortgageRatesRouter,
  nextMortgageRates: nextMortgageRatesRouter,
  articleAuthorRouter: articleAuthorRouter,
  articleRouter: articleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
