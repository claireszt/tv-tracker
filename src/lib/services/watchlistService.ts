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

export async function removeShowFromWatchlist(
  req: Request
): Promise<{ error?: string; message?: string; status?: number }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const userId = session.user.id;
    const body = await req.json();

    await prisma.userWatchlist.deleteMany({
      where: {
        userId: userId,
        show: {
          tvdbId: body.tvdbId,
        },
      },
    });

    return { message: "Show removed from Watchlist!" };
  } catch (error) {
    console.error("❌ Prisma Query Error:", error);
    return { error: "Internal server error", status: 500 };
  }
}

export async function toggleEpisodeWatched(
  req: Request
): Promise<{ error?: string; message?: string; status?: number }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const userId = session.user.id;
    const body = await req.json();

    if (!body.episodeId || !body.tvdbId || !body.title || !body.season || !body.episodeNumber) {
      return { error: "Invalid data", status: 400 };
    }

    const episodeId = String(body.episodeId); // ✅ Ensure it's a string
    const showTvdbId = body.tvdbId;

    return await prisma.$transaction(async (tx) => {
      // ✅ Ensure the show exists
      const show = await tx.show.findUnique({
        where: { tvdbId: showTvdbId },
      });

      if (!show) {
        console.error("❌ Error: Show must be added to the watchlist before marking episodes.");
        return { error: "Show not found in watchlist", status: 400 };
      }

      // ✅ Check if the episode exists, if not, create it
      let episode = await tx.episode.findUnique({ where: { id: episodeId } });

      if (!episode) {
        episode = await tx.episode.create({
          data: {
            id: episodeId,
            showId: show.id, // ✅ Link to the correct show
            title: body.title,
            season: body.season,
            episodeNumber: body.episodeNumber,
          },
        });
      }

      // ✅ Check if the episode is already watched
      const existingEntry = await tx.watchedEpisode.findUnique({
        where: { userId_episodeId: { userId: userId, episodeId: episodeId } },
      });

      if (existingEntry) {
        await tx.watchedEpisode.delete({ where: { id: existingEntry.id } });
        return { message: "Episode marked as UNWATCHED" };
      } else {
        await tx.watchedEpisode.create({
          data: { userId: userId, episodeId: episodeId },
        });
        return { message: "Episode marked as WATCHED" };
      }
    });
  } catch (error) {
    console.error("❌ Prisma Query Error:", error);
    return { error: "Internal server error", status: 500 };
  }
}

export async function getWatchedEpisodes(): Promise<{
  error?: string;
  watchedEpisodes?: any[];
  status?: number;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const userId = session.user.id;

    const watchedEpisodes = await prisma.watchedEpisode.findMany({
      where: { userId: userId },
      select: { episodeId: true }, // ✅ Only return episode IDs
    });

    return { watchedEpisodes };
  } catch (error) {
    console.error("❌ Prisma Query Error:", error);
    return { error: "Internal server error", status: 500 };
  }
}
