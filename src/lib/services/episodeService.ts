import prisma from "../prisma";
import { getEpisodesFromTVDB } from "./tvdbService";

export async function syncEpisodesForShow(showId: string, tvdbId: string) {
  const episodesFromAPI = await getEpisodesFromTVDB(tvdbId);

  if (!episodesFromAPI || episodesFromAPI.length === 0) {
    throw new Error("❌ No episodes returned from TVDB");
  }

  for (const ep of episodesFromAPI) {
    await prisma.episode.upsert({
      where: { id: ep.id.toString() },
      update: {
        title: ep.title,
        episodeNumber: ep.episodeNumber,
        season: ep.season,
        airDate: ep.airDate ? new Date(ep.airDate) : null,
        lastUpdated: new Date(),
        showId,
      },
      create: {
        id: ep.id.toString(),
        showId,
        title: ep.title,
        episodeNumber: ep.episodeNumber,
        season: ep.season,
        airDate: ep.airDate ? new Date(ep.airDate) : null,
        lastUpdated: new Date(),
      },
    });
  }
}
