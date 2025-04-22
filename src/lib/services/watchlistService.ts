import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "../prisma";
import { syncEpisodesForShow } from "./episodeService";
import { getShowDetails } from "./tvdbService"; // ✅ import your helper

export async function addShowToWatchlist(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorized", status: 401 };
    }

    const userId = session.user.id;
    const body = await req.json();
    const { tvdbId } = body;

    if (!tvdbId) {
      return { error: "Missing TVDB ID", status: 400 };
    }

    const showDetail = await getShowDetails(tvdbId);
    if (!showDetail) {
      return { error: "Could not fetch show details", status: 500 };
    }

    const show = await prisma.show.upsert({
      where: { tvdbId },
      update: {},
      create: {
        tvdbId,
        title: showDetail.title,
        image: showDetail.image,
        totalEpisodes: showDetail.seasons.reduce((sum, season) => sum + season.episodes.length, 0),
      },
    });

    await syncEpisodesForShow(show.id, tvdbId);

    await prisma.userWatchlist.upsert({
      where: {
        userId_showId: {
          userId,
          showId: show.id,
        },
      },
      update: {},
      create: {
        userId,
        showId: show.id,
      },
    });

    return { message: "Show added successfully to Watchlist!" };
  } catch (error) {
    console.error("❌ Error in addShowToWatchlist:", error);
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
            image: true,
            totalEpisodes: true,
            episodes: {
              select: {
                id: true,
                title: true,
                episodeNumber: true,
                season: true,
                airDate: true,
              },
            },
          },
        },
      },
    });

    const watchedEpisodes = await prisma.watchedEpisode.findMany({
      where: { userId: userId },
      select: { episodeId: true },
    });

    const watchedEpisodeIds = new Set(watchedEpisodes.map((ep) => ep.episodeId));

    const watchlistWithProgress = watchlist.map((entry) => {
      const now = new Date();

      const airedEpisodes = entry.show.episodes.filter(
        (ep) => ep.airDate && new Date(ep.airDate) <= now
      );

      const airedCount = airedEpisodes.length;

      const watchedAiredCount = airedEpisodes.filter((ep) => watchedEpisodeIds.has(ep.id)).length;

      const progress =
        airedCount > 0 ? Math.min(Math.round((watchedAiredCount / airedCount) * 100), 100) : 0;

      const sortedEpisodes = [...entry.show.episodes].sort(
        (a, b) => new Date(a.airDate ?? 0).getTime() - new Date(b.airDate ?? 0).getTime()
      );

      const nextEpisode = sortedEpisodes.find((ep) => !watchedEpisodeIds.has(ep.id));

      return {
        ...entry,
        progress,
        nextEpisode: nextEpisode
          ? {
              id: nextEpisode.id,
              title: nextEpisode.title,
              season: nextEpisode.season,
              episodeNumber: nextEpisode.episodeNumber,
              airDate: nextEpisode.airDate,
            }
          : null,
        show: {
          ...entry.show,
          totalEpisodes: airedCount,
          imageUrl: entry.show.image,
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
