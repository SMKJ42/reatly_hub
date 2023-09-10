import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/public/education", "/api/trpc/[trpc]"],
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
    if (auth.userId && auth.isPublicRoute) {
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = "/user/calculators/history";
      if (req.url.includes("user/writeArticle") && !auth.orgRole) {
        redirectUrl.pathname = "/user";
      }
      return NextResponse.redirect(redirectUrl);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
