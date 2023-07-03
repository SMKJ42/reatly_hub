import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/blog", "/home", `/blog/[slug]`, "/api/trpc/[trpc]"],
  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = "/";
      // eslint-disable-next-line
      return NextResponse.redirect(redirectUrl);
    }
    if (auth.userId && auth.isPublicRoute) {
      // eslint-disable-next-line
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = "/user/dashboard";
      // eslint-disable-next-line
      return NextResponse.redirect(redirectUrl);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
