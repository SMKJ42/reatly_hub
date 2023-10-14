import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/articles/:path*",
    "/public/:path*",
    /*
     * exposes mortgage rate & article routers to public
     */
    "/api/cron/updateMortgageRates(.*)",
    "/api/trpc/mortgageRates(.*)",
    "/api/trpc/articles(.*)",
  ],

  afterAuth(auth, req) {
    /*
     * if user is not logged in and tries to access a private route
     */
    if (!auth.userId && !auth.isPublicRoute) {
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
    /*
     * redirects to dashboard if user is logged in and tries to
     * access public route while also respecting api routes
     */
    if (auth.userId && auth.isPublicRoute) {
      const redirectUrl = new URL(req.url);
      if (!redirectUrl.pathname.includes("/api/trpc/")) {
        redirectUrl.pathname = "/user/dashboard";
        return NextResponse.redirect(redirectUrl);
      }
    }
  },
});

/*
 * middleware runs on the following routes
 */
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
