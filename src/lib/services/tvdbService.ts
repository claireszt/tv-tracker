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
      return { data: [] }; // Return empty array on error
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

    // Fetch series details and extract data
    const seriesRes = await fetch(`${TVDB_API_URL}/series/${tvdbId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!seriesRes.ok) {
      console.error("Failed to fetch series details. Status:", seriesRes.status);
      return null;
    }
    const { data: seriesData } = await seriesRes.json();

    // Fetch episodes from the default endpoint (page=0)
    const episodesRes = await fetch(`${TVDB_API_URL}/series/${tvdbId}/episodes/default?page=0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!episodesRes.ok) {
      console.error("Failed to fetch episodes. Status:", episodesRes.status);
      return null;
    }
    const episodesJson = await episodesRes.json();
    const episodesArray: any[] = episodesJson.data?.episodes || [];

    // Group episodes by season
    const seasonsMap: { [season: number]: Episode[] } = {};
    episodesArray.forEach((ep) => {
      const seasonNumber = ep.seasonNumber || 0;
      if (!seasonsMap[seasonNumber]) {
        seasonsMap[seasonNumber] = [];
      }
      seasonsMap[seasonNumber].push({
        id: ep.id,
        name: ep.name,
        overview: ep.overview,
        airDate: ep.aired,
        season: ep.seasonNumber,
        episodeNumber: ep.number,
      });
    });

    const seasons: Season[] = Object.entries(seasonsMap)
      .map(([season, episodes]) => ({
        seasonNumber: Number(season),
        episodes,
      }))
      .sort((a, b) => a.seasonNumber - b.seasonNumber);

    // Build and return the TVShowDetail model
    const showDetail: TVShowDetail = {
      id: seriesData.id,
      tvdb_id: seriesData.tvdbId || seriesData.id,
      title: seriesData.name,
      synopsis: seriesData.overview,
      image: seriesData.image,
      year: seriesData.year,
      status: seriesData.status.name,
      seasons,
    };

    return showDetail;
  } catch (error: any) {
    console.error("Error fetching show details:", error);
    return null;
  }
}
