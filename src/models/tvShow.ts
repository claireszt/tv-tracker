export interface TVShow {
  id: string;
  tvdb_id: string;
  name: string;
  year: string;
  image?: string;
}

export interface TVShowDetail {
  id: string;
  tvdb_id: number;
  title: string;
  synopsis: string;
  year: string;
  image?: string;
  seasons: Season[];
  status: string;
  originalCountry: string;
  originalLanguage: string;
  firstAired: string;
  lastAired?: string;
  nextAired?: string;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  name: string;
  overview: string;
  airDate: string;
  season: number;
  episodeNumber: number;
}
