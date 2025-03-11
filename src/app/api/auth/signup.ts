import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

interface SignupRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

interface SignupResponse extends NextApiResponse {
  json: (body: { error?: string; user?: object }) => SignupResponse;
}

export default async function handler(req: SignupRequest, res: SignupResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and Password are required" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  res.status(201).json({ user });
}
