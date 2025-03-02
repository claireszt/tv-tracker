import { getTVDBToken } from "@/lib/tvdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ message: "Query parameter 'q' is required." }, { status: 400 });
  }

  const TVDB_API_URL = process.env.TVDB_API_URL;

  try {
    const token = await getTVDBToken();
    const response = await fetch(`${TVDB_API_URL}/search?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const searchError = await response.json();

      return NextResponse.json(
        { message: "Search request failed", error: searchError },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching from TVDB API:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
