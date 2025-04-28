import prisma from "@/lib/prisma";
import { syncEpisodesForShow } from "@/lib/services/episodeService";
import { getShowDetails } from "@/lib/services/tvdbService";
import { addShowToWatchlist } from "@/lib/services/watchlistService";
import { getServerSession } from "next-auth";

// Mocks
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  show: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
  },
  userWatchlist: {
    upsert: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(),
  },
  watchedEpisode: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
  },
  episode: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  $transaction: jest.fn((fn: any) =>
    fn({
      show: { findUnique: jest.fn() },
      episode: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        createMany: jest.fn(),
      },
      watchedEpisode: {
        findUnique: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
    })
  ),
}));

jest.mock("@/lib/services/tvdbService", () => ({
  getShowDetails: jest.fn(),
}));

jest.mock("@/lib/services/episodeService", () => ({
  syncEpisodesForShow: jest.fn(),
}));

describe("addShowToWatchlist", () => {
  const mockRequest = (body: any) =>
    new Request("http://localhost/api/user/watchlist/add", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

  it("should return 401 if no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({ tvdbId: "123" });
    const result = await addShowToWatchlist(req);

    expect(result.error).toBe("Unauthorized");
    expect(result.status).toBe(401);
  });

  it("should return 400 if tvdbId is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });

    const req = mockRequest({}); // Missing tvdbId
    const result = await addShowToWatchlist(req);

    expect(result.error).toBe("Missing TVDB ID");
    expect(result.status).toBe(400);
  });

  it("should throw error if show details cannot be fetched", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });
    (getShowDetails as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({ tvdbId: "123" });

    await expect(addShowToWatchlist(req)).rejects.toThrow("Failed to fetch show details");
  });

  it("should add a show successfully", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });
    (getShowDetails as jest.Mock).mockResolvedValue({
      title: "Example Show",
      image: "example.jpg",
      seasons: [{ episodes: [{}, {}, {}] }],
    });

    (prisma.show.upsert as jest.Mock).mockResolvedValue({ id: 1 });
    (syncEpisodesForShow as jest.Mock).mockResolvedValue(undefined);
    (prisma.userWatchlist.upsert as jest.Mock).mockResolvedValue(undefined);

    const req = mockRequest({ tvdbId: "123" });
    const result = await addShowToWatchlist(req);

    expect(result.message).toBe("Show added successfully to Watchlist!");
  });
});

describe("removeShowFromWatchlist", () => {
  const { removeShowFromWatchlist } = jest.requireActual("@/lib/services/watchlistService");

  const mockRequest = (body: any) =>
    new Request("http://localhost/api/user/watchlist/remove", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

  it("should return 401 if no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({ tvdbId: "123" });
    const result = await removeShowFromWatchlist(req);

    expect(result.error).toBe("Unauthorized");
    expect(result.status).toBe(401);
  });

  it("should successfully remove a show", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });
    (prisma.userWatchlist.deleteMany as jest.Mock).mockResolvedValue({});

    const req = mockRequest({ tvdbId: "123" });
    const result = await removeShowFromWatchlist(req);

    expect(result.message).toBe("Show removed from Watchlist!");
  });
});

describe("getWatchlist", () => {
  const { getWatchlist } = jest.requireActual("@/lib/services/watchlistService");

  it("should return 401 if no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const result = await getWatchlist();

    expect(result.error).toBe("Unauthorized");
    expect(result.status).toBe(401);
  });

  it("should return a watchlist with progress", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });

    (prisma.userWatchlist.findMany as jest.Mock).mockResolvedValue([
      {
        show: {
          id: 1,
          tvdbId: "123",
          title: "Test Show",
          image: "image.jpg",
          totalEpisodes: 10,
          episodes: [
            { id: "ep1", airDate: "2023-01-01", title: "Ep1", season: 1, episodeNumber: 1 },
            { id: "ep2", airDate: "2023-02-01", title: "Ep2", season: 1, episodeNumber: 2 },
          ],
        },
      },
    ]);

    (prisma.watchedEpisode.findMany as jest.Mock).mockResolvedValue([{ episodeId: "ep1" }]);

    const result = await getWatchlist();

    expect(result.watchlist).toHaveLength(1);
    expect(result.watchlist[0].progress).toBeGreaterThanOrEqual(0);
  });
});

describe("toggleEpisodeWatched", () => {
  const { toggleEpisodeWatched } = jest.requireActual("@/lib/services/watchlistService");

  const mockRequest = (body: any) =>
    new Request("http://localhost/api/user/watchlist/toggleEpisodeWatched", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

  it("should return 401 if no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({ episodeId: "ep1" });
    const result = await toggleEpisodeWatched(req);

    expect(result.error).toBe("Unauthorized");
    expect(result.status).toBe(401);
  });

  it("should return 400 if invalid request body", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });

    const req = mockRequest({}); // Missing fields
    const result = await toggleEpisodeWatched(req);

    expect(result.error).toBe("Invalid data");
    expect(result.status).toBe(400);
  });

  it("should mark episode as WATCHED if not already watched", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });

    const mockTx = {
      show: { findUnique: jest.fn().mockResolvedValue({ id: 1 }) },
      episode: { findUnique: jest.fn().mockResolvedValue({ id: "ep1" }) },
      watchedEpisode: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn() },
    };

    (prisma.$transaction as jest.Mock).mockImplementation((fn: any) => fn(mockTx));

    const req = mockRequest({
      episodeId: "ep1",
      tvdbId: "123",
      title: "Test Episode",
      season: 1,
      episodeNumber: 1,
    });

    const result = await toggleEpisodeWatched(req);

    expect(result.message).toBe("Episode marked as WATCHED");
    expect(mockTx.watchedEpisode.create).toHaveBeenCalled();
  });

  it("should mark episode as UNWATCHED if already watched", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });

    const mockTx = {
      show: { findUnique: jest.fn().mockResolvedValue({ id: 1 }) },
      episode: { findUnique: jest.fn().mockResolvedValue({ id: "ep1" }) },
      watchedEpisode: {
        findUnique: jest.fn().mockResolvedValue({ id: "existing-entry" }),
        delete: jest.fn(),
      },
    };

    (prisma.$transaction as jest.Mock).mockImplementation((fn: any) => fn(mockTx));

    const req = mockRequest({
      episodeId: "ep1",
      tvdbId: "123",
      title: "Test Episode",
      season: 1,
      episodeNumber: 1,
    });

    const result = await toggleEpisodeWatched(req);

    expect(result.message).toBe("Episode marked as UNWATCHED");
    expect(mockTx.watchedEpisode.delete).toHaveBeenCalled();
  });
});
