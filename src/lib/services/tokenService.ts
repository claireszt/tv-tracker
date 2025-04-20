import prisma from "@/lib/prisma";

export async function saveVerificationToken(email: string, token: string, expires: Date) {
  try {
    await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
  } catch (error) {
    console.error("❌ Failed to save verification token:", error);
    throw new Error("Could not save verification token");
  }
}
