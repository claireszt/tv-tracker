import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "../prisma";

export async function addShowToWatchlist(
  req: Request
): Promise<{ error?: string; message?: string; status?: number }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const userId = session.user.id;
    const body = await req.json();

    await prisma.$transaction(async (tx) => {
      const show = await tx.show.upsert({
        where: { tvdbId: body.tvdbId },
        update: {},
        create: {
          tvdbId: body.tvdbId,
          title: body.title,
        },
      });

      await tx.userWatchlist.upsert({
        where: {
          userId_showId: {
            userId: userId,
            showId: show.id,
          },
        },
        update: {},
        create: {
          userId: userId,
          showId: show.id,
        },
      });
    });

    return { message: "Show added successfully to Watchlist!" };
  } catch (error) {
    console.error("❌ Prisma Transaction Error:", error);
    return { error: "Internal server error", status: 500 };
  }
}

export async function getWatchlist(): Promise<{
  error?: string;
  watchlist?: any[];
  status?: number;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const userId = session.user.id;

    const watchlist = await prisma.userWatchlist.findMany({
      where: { userId: userId },
      include: {
        show: true,
      },
    });

    return { watchlist };
  } catch (error) {
    console.error("❌ Prisma Query Error:", error);
    return { error: "Internal server error", status: 500 };
  }
}
