import { createUser, findUserByEmail } from "@/lib/services/authService";
import { saveVerificationToken } from "@/lib/services/tokenService";
import sendEmail from "@/lib/utils/sendEmail";
import { generateVerificationToken } from "@/lib/utils/tokens";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, email, password, confirmPassword } = await req.json();

    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields (username, email, password, confirmPassword) are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (await findUserByEmail(email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    await createUser(username, email, password);

    const { token, expires } = generateVerificationToken();
    await saveVerificationToken(email, token, expires);

    const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <p>Hi ${username},</p>
        <p>Thanks for signing up. Please verify your email by clicking the link below:</p>
        <p><a href="${verificationLink}">Verify Email</a></p>
      `,
    });

    return NextResponse.json({ message: "Verification email sent" }, { status: 201 });
  } catch (error: any) {
    console.error("Error during sign-up: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
