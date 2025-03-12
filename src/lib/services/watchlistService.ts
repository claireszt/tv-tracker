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

    console.log("📌 Received API Data:", body); // ✅ Debugging Log

    if (!body.tvdbId || !body.title || typeof body.totalEpisodes !== "number") {
      return { error: "Invalid data: Missing required fields", status: 400 };
    }

    // ✅ Log values before inserting into the database
    console.log(`📌 Inserting Show:
      tvdbId: ${body.tvdbId}
      title: ${body.title}
      totalEpisodes: ${body.totalEpisodes}
      imageUrl: ${body.imageUrl}
    `);

    await prisma.$transaction(async (tx) => {
      const show = await tx.show.upsert({
        where: { tvdbId: body.tvdbId },
        update: {},
        create: {
          tvdbId: body.tvdbId,
          title: body.title,
          image: body.imageUrl,
          totalEpisodes: body.totalEpisodes,
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

    console.log("🔹 Fetching Watchlist for User:", userId);
    const watchlist = await prisma.userWatchlist.findMany({
      where: { userId: userId },
      include: {
        show: {
          select: {
            id: true,
            tvdbId: true,
            title: true,
            image: true, // ✅ Include image
            totalEpisodes: true, // ✅ Include total episode count
            episodes: { select: { id: true } },
          },
        },
      },
    });

    // ✅ Get watched episodes for this user
    const watchedEpisodes = await prisma.watchedEpisode.findMany({
      where: { userId: userId },
      select: { episodeId: true },
    });

    const watchedEpisodeIds = new Set(watchedEpisodes.map((ep) => ep.episodeId));

    // ✅ Calculate percentage watched per show
    const watchlistWithProgress = watchlist.map((entry) => {
      const totalEpisodes = entry.show.totalEpisodes ?? entry.show.episodes.length; // ✅ Ensure we have an episode count
      const watchedCount = entry.show.episodes.filter((ep) => watchedEpisodeIds.has(ep.id)).length;
      const progress = totalEpisodes > 0 ? Math.round((watchedCount / totalEpisodes) * 100) : 0;

      return {
        ...entry,
        progress,
        show: {
          ...entry.show,
          totalEpisodes, // ✅ Ensure total episodes are included
          imageUrl: entry.show.image, // ✅ Ensure image is included
        },
      };
    });

    console.log("✅ Watchlist Fetched:", watchlistWithProgress);

    return { watchlist: watchlistWithProgress };
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
