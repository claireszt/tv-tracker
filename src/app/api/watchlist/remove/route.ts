import { authOptions } from "@/lib/auth";
import { removeShowFromWatchlist } from "@/lib/services/watchlistService";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.showId) {
    return NextResponse.json({ error: "showId is required" }, { status: 400 });
  }

  const result = await removeShowFromWatchlist(req);
  if (result?.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ message: result.message });
}
