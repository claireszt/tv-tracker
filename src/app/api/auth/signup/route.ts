import { createUser, findUserByEmail } from "@/lib/services/authService";
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

    const newUser = await createUser(username, email, password);
    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error during sign-up: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
