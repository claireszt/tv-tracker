// src/lib/services/credentialsAuthorize.ts
import { findUserByEmail } from "@/lib/services/authService";
import bcrypt from "bcryptjs";
import { User } from "next-auth";

export async function credentialsAuthorize(credentials: {
  email: string;
  password: string;
}): Promise<User | null> {
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
}
