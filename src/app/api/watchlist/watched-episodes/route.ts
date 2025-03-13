import { getWatchedEpisodes } from "@/lib/services/watchlistService";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getWatchedEpisodes();
  if (result?.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ watchedEpisodes: result.watchedEpisodes });
}
