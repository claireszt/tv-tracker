// services/episodeService.ts

import prisma from "../prisma";
import { getEpisodesFromTVDB } from "./tvdbService";

export async function syncEpisodesForShow(showId: string, tvdbId: string) {
  const episodesFromAPI = await getEpisodesFromTVDB(tvdbId);

  if (!episodesFromAPI || episodesFromAPI.length === 0) {
    throw new Error("❌ No episodes returned from TVDB");
  }

  const formattedEpisodes = episodesFromAPI.map((ep: any) => ({
    id: ep.id.toString(),
    showId,
    title: ep.title,
    episodeNumber: ep.episodeNumber,
    season: ep.season,
    airDate: ep.airDate ? new Date(ep.airDate) : null,
    lastUpdated: new Date(),
  }));

  await prisma.episode.deleteMany({ where: { showId } });

  await prisma.episode.createMany({
    data: formattedEpisodes,
    skipDuplicates: true,
  });
}
