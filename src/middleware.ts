import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    const publicPaths = ["/auth/signup", "/auth/complete-profile", "/auth/start", "/auth/login"];

    if (publicPaths.includes(req.nextUrl.pathname)) return NextResponse.next();

    if (token && !token.username && !req.nextUrl.pathname.includes("/auth/complete-profile")) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/complete-profile";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/error|auth/start|auth/login|auth/signup|auth/complete-profile).*)",
  ],
};
