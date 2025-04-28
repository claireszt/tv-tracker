import { handleApiError } from "@/lib/middleware/errorHandler";
import { watchAllEpisodes } from "@/lib/services/watchlistService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const result = await watchAllEpisodes(request);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ message: result.message }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
