import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      // ✅ Allow API requests without redirecting to /auth/signin
      if (req.nextUrl.pathname.startsWith("/api")) {
        return true; // Let API requests go through
      }

      // ✅ Redirect only for protected pages
      return !!token;
    },
  },
});

// ✅ Ensure that /auth/signin and API requests are not blocked
export const config = {
  matcher: ["/((?!auth/signin|auth/signup|public|_next/static|_next/image|favicon.svg|api).*)"],
};
