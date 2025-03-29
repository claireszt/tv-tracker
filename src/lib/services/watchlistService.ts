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

    if (!body.tvdbId || !body.title || typeof body.totalEpisodes !== "number") {
      return { error: "Invalid data: Missing required fields", status: 400 };
    }

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
interface WatchSeasonEpisodesRequest {
  seasonNumber: number;
  userId: string;
}

interface ToggleAllEpisodesRequest {
  tvdbId: string;
  episodeIds: string[];
  userId: string;
}

export async function toggleAllEpisodes(
  req: Request
): Promise<{ error?: string; message?: string; status?: number }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const userId = session.user.id;
    const body = await req.json();

    if (!body.tvdbId || !Array.isArray(body.episodeIds)) {
      return { error: "Invalid data", status: 400 };
    }

    const request: ToggleAllEpisodesRequest = {
      tvdbId: body.tvdbId,
      episodeIds: body.episodeIds,
      userId,
    };

    return await prisma.$transaction(async (tx) => {
      const show = await tx.show.findUnique({
        where: { tvdbId: parseInt(request.tvdbId) },
      });

      if (!show) {
        return { error: "Show not found in watchlist", status: 400 };
      }

      // If episodeIds is empty, remove all watched episodes for this show
      if (request.episodeIds.length === 0) {
        await tx.watchedEpisode.deleteMany({
          where: {
            userId: request.userId,
            episode: {
              showId: show.id,
            },
          },
        });
        return { message: "All episodes marked as unwatched" };
      }

      // First, ensure all episodes exist in the database
      const existingEpisodes = await tx.episode.findMany({
        where: {
          id: {
            in: request.episodeIds,
          },
        },
      });

      const existingEpisodeIds = new Set(existingEpisodes.map((ep: { id: string }) => ep.id));

      // Create missing episodes
      const missingEpisodes = request.episodeIds.filter(
        (id: string) => !existingEpisodeIds.has(id)
      );
      if (missingEpisodes.length > 0) {
        await tx.episode.createMany({
          data: missingEpisodes.map((episodeId: string) => ({
            id: episodeId,
            showId: show.id,
            title: `Episode ${episodeId}`, // Placeholder title
            season: 0, // Placeholder season
            episodeNumber: 0, // Placeholder episode number
          })),
          skipDuplicates: true,
        });
      }

      // Now create watched episodes
      await tx.watchedEpisode.createMany({
        data: request.episodeIds.map((episodeId: string) => ({
          userId: request.userId,
          episodeId: episodeId,
        })),
        skipDuplicates: true,
      });

      return { message: "All episodes marked as watched" };
    });
  } catch (error) {
    console.error("❌ Prisma Transaction Error:", error);
    return { error: "Internal server error", status: 500 };
  }
}

export async function watchAllEpisodes(
  req: Request
): Promise<{ error?: string; message?: string; status?: number }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const userId = session.user.id;
    const body = await req.json();

    if (!body.tvdbId) {
      return { error: "Invalid show ID", status: 400 };
    }

    return await prisma.$transaction(async (tx) => {
      // First, ensure the show exists in the user's watchlist
      const show = await tx.show.findUnique({
        where: { tvdbId: body.tvdbId },
      });

      if (!show) {
        return { error: "Show not found in watchlist", status: 400 };
      }

      // Get all episodes for the show
      const episodes = await tx.episode.findMany({
        where: {
          showId: show.id,
        },
        select: {
          id: true,
        },
      });

      if (episodes.length === 0) {
        return { error: "No episodes found for this show", status: 400 };
      }

      // Mark all episodes as watched
      await tx.watchedEpisode.createMany({
        data: episodes.map((episode) => ({
          episodeId: episode.id,
          userId: userId,
        })),
        skipDuplicates: true, // Skip if episode is already marked as watched
      });

      return { message: "All episodes marked as watched" };
    });
  } catch (error) {
    console.error("❌ Prisma Transaction Error:", error);
    return { error: "Internal server error", status: 500 };
  }
}

export async function watchSeasonEpisodes(
  req: Request
): Promise<{ error?: string; message?: string; status?: number }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const userId = session.user.id;
    const body = await req.json();

    if (!body.seasonNumber || isNaN(Number(body.seasonNumber))) {
      return { error: "Invalid season number", status: 400 };
    }

    const request: WatchSeasonEpisodesRequest = {
      seasonNumber: Number(body.seasonNumber),
      userId,
    };

    return await prisma.$transaction(async (tx) => {
      // Get all episodes for the season
      const episodes = await tx.episode.findMany({
        where: {
          season: request.seasonNumber,
        },
        select: {
          id: true,
        },
      });

      // Mark all episodes as watched
      await tx.watchedEpisode.createMany({
        data: episodes.map((episode) => ({
          episodeId: episode.id,
          userId: request.userId,
        })),
        skipDuplicates: true,
      });

      return { message: "All season episodes marked as watched" };
    });
  } catch (error) {
    console.error("❌ Prisma Transaction Error:", error);
    return { error: "Internal server error", status: 500 };
  }
}
