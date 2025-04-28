import { toggleAllEpisodes } from "@/lib/services/watchlistService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const result = await toggleAllEpisodes(req);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ message: result.message }, { status: 200 });
}
