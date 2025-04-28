import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "../prisma";
import { syncEpisodesForShow } from "./episodeService";
import { getShowDetails } from "./tvdbService";

export async function addShowToWatchlist(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = session.user.id;
  const { tvdbId } = await req.json();

  if (!tvdbId) {
    return { error: "Missing TVDB ID", status: 400 };
  }

  const showDetail = await getShowDetails(tvdbId);
  if (!showDetail) {
    throw new Error("Failed to fetch show details");
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
}

export async function getWatchlist() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = session.user.id;

  const watchlist = await prisma.userWatchlist.findMany({
    where: { userId },
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
    where: { userId },
    select: { episodeId: true },
  });

  const watchedEpisodeIds = new Set(watchedEpisodes.map((ep) => ep.episodeId));

  const now = new Date();
  const watchlistWithProgress = watchlist.map((entry) => {
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
}

export async function removeShowFromWatchlist(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = session.user.id;
  const { tvdbId } = await req.json();

  await prisma.userWatchlist.deleteMany({
    where: {
      userId,
      show: { tvdbId },
    },
  });

  return { message: "Show removed from Watchlist!" };
}

export async function toggleEpisodeWatched(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = session.user.id;
  const { episodeId, tvdbId, title, season, episodeNumber } = await req.json();

  if (!episodeId || !tvdbId || !title || season == null || episodeNumber == null) {
    return { error: "Invalid data", status: 400 };
  }

  return await prisma.$transaction(async (tx) => {
    const show = await tx.show.findUnique({ where: { tvdbId } });
    if (!show) {
      return { error: "Show not found in watchlist", status: 400 };
    }

    let episode = await tx.episode.findUnique({ where: { id: episodeId } });
    if (!episode) {
      episode = await tx.episode.create({
        data: {
          id: episodeId,
          showId: show.id,
          title,
          season,
          episodeNumber,
        },
      });
    }

    const existingEntry = await tx.watchedEpisode.findUnique({
      where: { userId_episodeId: { userId, episodeId } },
    });

    if (existingEntry) {
      await tx.watchedEpisode.delete({ where: { id: existingEntry.id } });
      return { message: "Episode marked as UNWATCHED" };
    } else {
      await tx.watchedEpisode.create({
        data: { userId, episodeId },
      });
      return { message: "Episode marked as WATCHED" };
    }
  });
}

export async function getWatchedEpisodes() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = session.user.id;

  const watchedEpisodes = await prisma.watchedEpisode.findMany({
    where: { userId },
    select: { episodeId: true },
  });

  return { watchedEpisodes };
}

export async function toggleAllEpisodes(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = session.user.id;
  const { tvdbId, episodeIds } = await req.json();

  if (!tvdbId || !Array.isArray(episodeIds)) {
    return { error: "Invalid data", status: 400 };
  }

  return await prisma.$transaction(async (tx) => {
    const show = await tx.show.findUnique({
      where: { tvdbId: parseInt(tvdbId) },
    });

    if (!show) {
      return { error: "Show not found in watchlist", status: 400 };
    }

    if (episodeIds.length === 0) {
      await tx.watchedEpisode.deleteMany({
        where: {
          userId,
          episode: { showId: show.id },
        },
      });
      return { message: "All episodes marked as unwatched" };
    }

    const existingEpisodes = await tx.episode.findMany({
      where: { id: { in: episodeIds } },
    });

    const existingEpisodeIds = new Set(existingEpisodes.map((ep) => ep.id));
    const missingEpisodes = episodeIds.filter((id) => !existingEpisodeIds.has(id));

    if (missingEpisodes.length > 0) {
      await tx.episode.createMany({
        data: missingEpisodes.map((id) => ({
          id,
          showId: show.id,
          title: `Episode ${id}`,
          season: 0,
          episodeNumber: 0,
        })),
        skipDuplicates: true,
      });
    }

    await tx.watchedEpisode.createMany({
      data: episodeIds.map((episodeId: string) => ({
        userId,
        episodeId,
      })),
      skipDuplicates: true,
    });

    return { message: "All episodes marked as watched" };
  });
}

export async function watchAllEpisodes(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = session.user.id;
  const { tvdbId } = await req.json();

  if (!tvdbId) {
    return { error: "Invalid show ID", status: 400 };
  }

  return await prisma.$transaction(async (tx) => {
    const show = await tx.show.findUnique({ where: { tvdbId } });

    if (!show) {
      return { error: "Show not found in watchlist", status: 400 };
    }

    const episodes = await tx.episode.findMany({
      where: { showId: show.id },
      select: { id: true },
    });

    if (episodes.length === 0) {
      return { error: "No episodes found for this show", status: 400 };
    }

    await tx.watchedEpisode.createMany({
      data: episodes.map((episode) => ({
        userId,
        episodeId: episode.id,
      })),
      skipDuplicates: true,
    });

    return { message: "All episodes marked as watched" };
  });
}

export async function watchSeasonEpisodes(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const userId = session.user.id;
  const { seasonNumber } = await req.json();

  if (!seasonNumber || isNaN(Number(seasonNumber))) {
    return { error: "Invalid season number", status: 400 };
  }

  return await prisma.$transaction(async (tx) => {
    const episodes = await tx.episode.findMany({
      where: { season: seasonNumber },
      select: { id: true },
    });

    await tx.watchedEpisode.createMany({
      data: episodes.map((episode) => ({
        userId,
        episodeId: episode.id,
      })),
      skipDuplicates: true,
    });

    return { message: "All season episodes marked as watched" };
  });
}
