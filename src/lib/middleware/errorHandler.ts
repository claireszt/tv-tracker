import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
  console.error("❌ Server Error:", error);

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
