import { getTVDBToken } from "@/lib/tvdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: "Show ID is required." }, { status: 400 });
  }

  const TVDB_API_URL = process.env.TVDB_API_URL;
  try {
    const token = await getTVDBToken();
    const response = await fetch(`${TVDB_API_URL}/series/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch show details." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
