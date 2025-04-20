import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = token.sub; // This is the user.id from the JWT
  const { username } = await req.json();

  if (!username || username.length < 3) {
    return NextResponse.json({ message: "Invalid username" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing) {
    return NextResponse.json({ message: "Username already taken" }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { username },
  });

  return NextResponse.json({ success: true });
}
