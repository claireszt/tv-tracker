// /app/api/user/details/route.ts
import { findUserByEmail } from "@/lib/services/authService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    password: !!user.password,
    signupMethod: user.password ? "credentials" : "google",
  });
}
