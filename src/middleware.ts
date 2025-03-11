import { withAuth } from "next-auth/middleware";

// ✅ Apply `withAuth` as a middleware function, not inside another function
export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

// ✅ Exclude public routes (like /auth/signin & /auth/signup) from authentication
export const config = {
  matcher: ["/((?!auth/signin|auth/signup|public|_next/static|_next/image|favicon.ico).*)"],
};
