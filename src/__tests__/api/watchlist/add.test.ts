import { POST } from "@/app/api/watchlist/add/route";
import { addShowToWatchlist } from "@/lib/services/watchlistService";
import { getServerSession } from "next-auth";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/services/watchlistService", () => ({
  addShowToWatchlist: jest.fn(),
}));

describe("/api/user/watchlist/add POST", () => {
  it("should add a show to the watchlist when user is authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "user-1" } });
    (addShowToWatchlist as jest.Mock).mockResolvedValue({ message: "Added successfully" });

    const mockRequest = new Request("http://localhost/api/user/watchlist/add", {
      method: "POST",
      body: JSON.stringify({ showId: "123" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Added successfully");
  });

  it("should return 400 if showId is missing", async () => {
    const mockRequest = new Request("http://localhost/api/user/watchlist/add", {
      method: "POST",
      body: JSON.stringify({}), // 👈 No showId
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("showId is required");
  });

  it("should return 401 if user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const mockRequest = new Request("http://localhost/api/user/watchlist/add", {
      method: "POST",
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });
});
