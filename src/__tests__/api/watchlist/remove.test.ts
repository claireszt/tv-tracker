import { POST } from "@/app/api/watchlist/remove/route";
import { removeShowFromWatchlist } from "@/lib/services/watchlistService";
import { getServerSession } from "next-auth"; // 👈 import this

jest.mock("@/lib/services/watchlistService", () => ({
  removeShowFromWatchlist: jest.fn(),
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("/api/user/watchlist/remove POST", () => {
  it("should remove a show from the watchlist successfully", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } }); // 👈 Add this
    (removeShowFromWatchlist as jest.Mock).mockResolvedValue({ message: "Removed successfully" });

    const mockRequest = new Request("http://localhost/api/user/watchlist/remove", {
      method: "POST",
      body: JSON.stringify({ showId: "123" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Removed successfully");
  });

  it("should return 400 if showId is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } }); // 👈 Add this

    const mockRequest = new Request("http://localhost/api/user/watchlist/remove", {
      // (you had a typo, it said `/add` before!)
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("showId is required");
  });

  it("should return an error if removal fails", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } }); // 👈 Add this
    (removeShowFromWatchlist as jest.Mock).mockResolvedValue({ error: "Not Found", status: 404 });

    const mockRequest = new Request("http://localhost/api/user/watchlist/remove", {
      method: "POST",
      body: JSON.stringify({ showId: "non-existing-id" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Not Found");
  });
});
