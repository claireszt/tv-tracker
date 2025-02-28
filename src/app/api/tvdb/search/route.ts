/* global process, console, fetch, URL */

import { getTVDBToken } from "@/lib/tvdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ message: "Query parameter 'q' is required." }, { status: 400 });
  }

  const TVDB_API_KEY = process.env.TVDB_API_KEY;
  const TVDB_API_URL = process.env.TVDB_API_URL;
  if (!TVDB_API_KEY || !TVDB_API_URL) {
    return NextResponse.json({ message: "TVDB configuration missing." }, { status: 500 });
  }

  try {
    const token = await getTVDBToken();

    const searchResponse = await fetch(
      `${TVDB_API_URL}/search?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!searchResponse.ok) {
      const searchError = await searchResponse.json();

      return NextResponse.json(
        { message: "Search request failed", error: searchError },
        { status: searchResponse.status }
      );
    }

    const data = await searchResponse.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching from TVDB API:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
