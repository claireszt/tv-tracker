import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized: ({ token }) => {
      // ✅ Allow access if user is signed in, otherwise redirect
      return !!token;
    },
  },
});

// ✅ Ensure that /auth/signin doesn't get stuck in an infinite loop
export const config = {
  matcher: ["/((?!auth/signin|auth/signup|public|_next/static|_next/image|favicon.ico).*)"],
};
