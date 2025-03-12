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
