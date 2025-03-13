import { getShowDetails } from "@/lib/services/tvdbService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ message: "Show ID is required." }, { status: 400 });
    }

    const showDetail = await getShowDetails(id);
    if (!showDetail) {
      return NextResponse.json({ message: "Failed to fetch show details." }, { status: 404 });
    }

    return NextResponse.json(showDetail);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
