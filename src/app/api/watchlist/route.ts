import { getWatchlist } from "@/lib/services/watchlistService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const result = await getWatchlist();
  if (result?.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ watchlist: result.watchlist });
}
