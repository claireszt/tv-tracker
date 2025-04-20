import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });

  if (!verificationToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  if (verificationToken.expires < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: verificationToken.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  if (user.emailVerified) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json({ message: "Already verified" }, { status: 200 });
  }

  await prisma.user.update({
    where: { email: verificationToken.email },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ message: "Email verified", email: user.email });
}
