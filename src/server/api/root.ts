// import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { singleFamilyRouter } from "./routers/singleFamily";
import {
  mortgageRatesRouter,
  nextMortgageRatesRouter,
} from "./routers/mortgageRates";
import { articleAuthorRouter, articleRouter } from "./routers/articles";
import { adminRouter } from "./routers/users/admin";
import { rolesRouter } from "./routers/users/clerkRoles";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  singleFamily: singleFamilyRouter,
  mortgageRates: { ...mortgageRatesRouter, ...nextMortgageRatesRouter },
  article: articleRouter,
  author: articleAuthorRouter,
  admin: adminRouter,
  owner: rolesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
