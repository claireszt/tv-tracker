import { Episode, Season, TVShowDetail } from "@/models/tvShow";

const TVDB_API_URL = process.env.TVDB_API_URL;

let cachedToken: string | null = process.env.TVDB_ACCESS_TOKEN || null;
let tokenExpiry: number | null = null;

export async function getTVDBToken(): Promise<string | null> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.warn("✅ Using cached TVDB token");

    return cachedToken;
  }

  console.warn("🔄 Fetching new TVDB token...");

  const TVDB_API_URL = process.env.TVDB_API_URL;
  const TVDB_API_KEY = process.env.TVDB_API_KEY;

  if (!TVDB_API_URL || !TVDB_API_KEY) {
    throw new Error("❌ TVDB API credentials are missing from .env.local");
  }

  const authResponse = await fetch(`${TVDB_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apikey: TVDB_API_KEY }),
  });

  const authData = await authResponse.json();

  if (!authData.data || !authData.data.token) {
    throw new Error("❌ Failed to retrieve TVDB token. Check API key.");
  }

  cachedToken = authData.data.token;
  tokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  return cachedToken;
}

export async function searchTVShows(query: string) {
  if (!query.trim()) return { data: [] };

  try {
    const token = await getTVDBToken();
    const response = await fetch(`${TVDB_API_URL}/search?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("TVDB Search Error:", await response.json());
      return { data: [] };
    }

    const data = await response.json();
    return { data: data.data?.filter((item: any) => item.type === "series") ?? [] };
  } catch (error: any) {
    console.error("Error fetching TVDB search results:", error);
    return { data: [] };
  }
}

export async function getShowDetails(tvdbId: string): Promise<TVShowDetail | null> {
  const TVDB_API_URL = process.env.TVDB_API_URL;
  try {
    const token = await getTVDBToken();

    const seriesRes = await fetch(`${TVDB_API_URL}/series/${tvdbId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!seriesRes.ok) {
      console.error("Failed to fetch series details. Status:", seriesRes.status);
      return null;
    }
    const { data: seriesData } = await seriesRes.json();

    const episodes = await getEpisodesFromTVDB(tvdbId);

    const seasonsMap: { [season: number]: Episode[] } = {};
    episodes.forEach((ep) => {
      const seasonNumber = ep.season || 0;
      if (!seasonsMap[seasonNumber]) {
        seasonsMap[seasonNumber] = [];
      }
      seasonsMap[seasonNumber].push({
        id: ep.id,
        title: ep.title,
        overview: ep.overview,
        airDate: ep.airDate,
        season: ep.season,
        episodeNumber: ep.episodeNumber,
      });
    });

    const seasons: Season[] = Object.entries(seasonsMap)
      .map(([season, episodes]) => ({
        seasonNumber: Number(season),
        episodes,
      }))
      .sort((a, b) => a.seasonNumber - b.seasonNumber);

    const showDetail: TVShowDetail = {
      id: seriesData.id,
      tvdb_id: seriesData.tvdbId || seriesData.id,
      title: seriesData.name,
      synopsis: seriesData.overview,
      image: seriesData.image,
      status: seriesData.status.name,
      seasons,
      originalCountry: seriesData.originalCountry,
      originalLanguage: seriesData.originalLanguage,
      firstAired: seriesData.firstAired,
      lastAired: seriesData.lastAired,
      nextAired: seriesData.nextAired,
    };

    return showDetail;
  } catch (error: any) {
    console.error("Error fetching show details:", error);
    return null;
  }
}

export async function getEpisodesFromTVDB(tvdbId: string): Promise<Episode[]> {
  const token = await getTVDBToken();

  const episodesRes = await fetch(`${TVDB_API_URL}/series/${tvdbId}/episodes/default?page=0`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!episodesRes.ok) {
    console.error("❌ Failed to fetch episodes. Status:", episodesRes.status);
    return [];
  }

  const episodesJson = await episodesRes.json();
  const episodesArray: any[] = episodesJson.data?.episodes || [];

  return episodesArray
    .filter((ep) => ep.seasonNumber > 0)
    .map((ep) => ({
      id: ep.id.toString(),
      title: ep.name || ep.overname || "Untitled",
      overview: ep.overview || "",
      episodeNumber: ep.number,
      season: ep.seasonNumber,
      airDate: ep.aired ?? "",
      seasonNumber: ep.seasonNumber,
    }));
}
