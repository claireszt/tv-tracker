import prisma from "@/lib/prisma";
import { findUserByEmail } from "@/lib/services/authService";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await findUserByEmail(credentials.email);

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (!user.password) {
          throw new Error("No password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username ?? "",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/start",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      if (typeof token.id === "string") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
        });

        if (dbUser) {
          token.username = dbUser.username ?? null;
        }
      }

      if (!token.id) {
        console.warn("No token.id found – user may not be fully authenticated");
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        username: (token.username as string) || "",
      };

      if (!token.username) {
        (session as any).needsProfile = true;
      }

      return session;
    },
  },
  debug: true,
};
