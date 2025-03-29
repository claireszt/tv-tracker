import { watchSeasonEpisodes } from "@/lib/services/watchlistService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const result = await watchSeasonEpisodes(request);
    if (result?.error) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("Error marking season episodes as watched:", error);
    return NextResponse.json(
      { error: "Failed to mark season episodes as watched" },
      { status: 500 }
    );
  }
}
