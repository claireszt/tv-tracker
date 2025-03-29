import { watchAllEpisodes } from "@/lib/services/watchlistService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const result = await watchAllEpisodes(request);
    if (result?.error) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("Error marking all episodes as watched:", error);
    return NextResponse.json({ error: "Failed to mark episodes as watched" }, { status: 500 });
  }
}
