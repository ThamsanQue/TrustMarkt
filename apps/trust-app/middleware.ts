import NextAuth from "next-auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "routes";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    if (
      nextUrl.pathname.startsWith("/api/auth/auth/") &&
      nextUrl.searchParams.get("error")
    ) {
      const url = nextUrl;
      url.pathname = nextUrl.pathname.replace("/api/auth/", "");

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
