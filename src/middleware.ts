import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/articles/:path*",
    "/public/:path*",
    "/api/trpc/:path*",
    "/api/cron/:path*",
  ],
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
    if (auth.userId && auth.isPublicRoute) {
      const redirectUrl = new URL(req.url);
      if (redirectUrl.pathname.includes("/articles")) {
        return;
      }
      redirectUrl.pathname = "/user/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
