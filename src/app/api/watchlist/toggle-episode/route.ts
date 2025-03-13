import { toggleEpisodeWatched } from "@/lib/services/watchlistService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const result = await toggleEpisodeWatched(req);
  if (result?.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ message: result.message });
}
