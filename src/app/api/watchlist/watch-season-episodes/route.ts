import { watchSeasonEpisodes } from "@/lib/services/watchlistService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const result = await watchSeasonEpisodes(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ message: result.message }, { status: 200 });
}
