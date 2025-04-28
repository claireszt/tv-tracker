global.fetch = jest.fn();

let tvdbService: typeof import("@/lib/services/tvdbService");

beforeEach(async () => {
  jest.resetModules();
  (fetch as jest.Mock).mockClear();

  tvdbService = await import("@/lib/services/tvdbService");
  (tvdbService as any).cachedToken = null;
  (tvdbService as any).tokenExpiry = null;
});

describe("getTVDBToken", () => {
  it("should throw an error if no credentials", async () => {
    process.env.TVDB_API_URL = "";
    process.env.TVDB_API_KEY = "";

    await expect(tvdbService.getTVDBToken()).rejects.toThrow("TVDB API credentials are missing");
  });

  it("should return a token on success", async () => {
    process.env.TVDB_API_URL = "https://fake-tvdb.com";
    process.env.TVDB_API_KEY = "fake-api-key";

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { token: "fake-token" }, // ✅ not empty
      }),
    });

    const token = await tvdbService.getTVDBToken();
    expect(token).toBe("fake-token");
  });

  it("should throw an error if token retrieval fails", async () => {
    process.env.TVDB_API_URL = "https://fake-tvdb.com";
    process.env.TVDB_API_KEY = "fake-api-key";

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}), // ❌ missing data.token
    });

    await expect(tvdbService.getTVDBToken()).rejects.toThrow("Failed to retrieve TVDB token");
  });
});

describe("searchTVShows", () => {
  it("should return empty array if query is empty", async () => {
    const result = await tvdbService.searchTVShows("");
    expect(result.data).toEqual([]);
  });

  it("should return shows if search is successful", async () => {
    // 🔥 Mock TVDB token fetch first
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { token: "fake-token" },
      }),
    });
    // 🔥 Then mock search response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ type: "series", id: "1", name: "Fake Show" }],
      }),
    });

    const result = await tvdbService.searchTVShows("fake");
    expect(result.data).toHaveLength(1);
    expect(result.data[0].type).toBe("series");
  });

  it("should return empty array on API error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { token: "fake-token" },
      }),
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const result = await tvdbService.searchTVShows("fake");
    expect(result.data).toEqual([]);
  });
});

describe("getShowDetails", () => {
  it("should return null if series details cannot be fetched", async () => {
    // 🔥 Mock TVDB token fetch
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { token: "fake-token" },
      }),
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const result = await tvdbService.getShowDetails("123");
    expect(result).toBeNull();
  });
});

describe("getEpisodesFromTVDB", () => {
  it("should return episodes on success", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { token: "fake-token" },
      }),
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          episodes: [
            {
              id: 1,
              name: "Ep1",
              overview: "Overview",
              number: 1,
              seasonNumber: 1,
              aired: "2023-01-01",
            },
          ],
        },
      }),
    });

    const episodes = await tvdbService.getEpisodesFromTVDB("123");
    expect(episodes).toHaveLength(1);
    expect(episodes[0].title).toBe("Ep1");
  });

  it("should return empty array if episodes fetch fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { token: "fake-token" },
      }),
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const episodes = await tvdbService.getEpisodesFromTVDB("123");
    expect(episodes).toEqual([]);
  });
});
