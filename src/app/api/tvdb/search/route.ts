import { searchTVShows } from "@/lib/services/tvdbService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = new URL(req.url).searchParams.get("q");

  if (!query) {
    return NextResponse.json({ message: "Query parameter 'q' is required." }, { status: 400 });
  }

  const searchResults = await searchTVShows(query);
  return NextResponse.json(searchResults);
}
