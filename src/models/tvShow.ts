export interface TVShow {
  id: string;
  tvdbId: number;
  title: string;
  year: string;
  image?: string;
  totalEpisodes?: number;
}

export interface TVShowDetail {
  id: string;
  tvdb_id: number;
  title: string;
  synopsis: string;
  image?: string;
  seasons: Season[];
  status: string;
  originalCountry: string;
  originalLanguage: string;
  firstAired: string;
  lastAired?: string;
  nextAired?: string;
  watchedPercentage?: number;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  overview: string;
  airDate: string;
  season: number;
  episodeNumber: number;
}
