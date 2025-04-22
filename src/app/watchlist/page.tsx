"use client";
import ShowCard from "@/components/ShowCard";
import Navbar from "@/components/ui/NavBar";
import { useEffect, useState } from "react";

type WatchlistEntry = {
  show: any;
  progress: number;
  nextEpisode?: {
    id: string;
    title: string;
    season: number;
    episodeNumber: number;
    airDate: string;
  };
};

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchWatchlist() {
    try {
      const res = await fetch("/api/watchlist");
      const data = await res.json();
      if (res.ok) {
        setWatchlist(data.watchlist);
      } else {
        console.error("❌ Failed to fetch watchlist:", data.error);
      }
    } catch (error) {
      console.error("❌ API Request Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWatchlist();
  }, []);

  async function toggleWatched(episode: {
    id: string;
    tvdbId: number;
    title: string;
    season: number;
    episodeNumber: number;
  }) {
    try {
      const res = await fetch("/api/watchlist/toggle-episode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: episode.id,
          tvdbId: episode.tvdbId,
          title: episode.title,
          season: episode.season,
          episodeNumber: episode.episodeNumber,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to toggle episode");

      fetchWatchlist(); // simplest for now
    } catch (error) {
      console.error("❌ Error toggling episode:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-light-text dark:text-dark-text">
        Loading...
      </div>
    );
  }

  // Organize shows by status
  const currentlyWatching = watchlist
    .filter((entry) => entry.progress > 0 && entry.progress < 100)
    .sort((a, b) => a.show.title.localeCompare(b.show.title));
  const notStarted = watchlist
    .filter((entry) => entry.progress === 0)
    .sort((a, b) => a.show.title.localeCompare(b.show.title));
  const upToDate = watchlist
    .filter(
      (entry) =>
        entry.progress >= 100 &&
        entry.nextEpisode?.airDate &&
        new Date(entry.nextEpisode.airDate) > new Date()
    )
    .sort((a, b) => a.show.title.localeCompare(b.show.title));
  const finished = watchlist
    .filter(
      (entry) =>
        entry.progress >= 100 &&
        (!entry.nextEpisode?.airDate || new Date(entry.nextEpisode.airDate) <= new Date())
    )
    .sort((a, b) => a.show.title.localeCompare(b.show.title));

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-4 py-6 md:py-12 pt-[100px] md:pt-[120px] bg-light-background dark:bg-dark-background">
        <h1 className="text-3xl font-heading font-semibold text-light-text dark:text-dark-text text-center">
          My Watchlist
        </h1>

        {watchlist.length === 0 ? (
          <p className="text-center text-light-text dark:text-dark-text opacity-70 mt-4">
            Your watchlist is empty. Start adding shows!
          </p>
        ) : (
          <>
            {/* Currently Watching */}
            {currentlyWatching.length > 0 && (
              <>
                <h2 className="text-2xl font-body font-semibold mt-6 flex items-center">
                  Currently Watching{" "}
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-light-primary/20 dark:bg-dark-primary/20 shrink-0 ml-2">
                    <span className="text-sm font-bold text-light-primary dark:text-dark-primary">
                      {currentlyWatching.length}
                    </span>
                  </span>
                </h2>
                <div className="mt-6">
                  {currentlyWatching.map((entry) => (
                    <ShowCard
                      key={entry.show.id}
                      show={entry.show}
                      progress={entry.progress}
                      nextEpisode={entry.nextEpisode}
                      toggleNextEpisodeWatched={toggleWatched}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Up to Date */}
            {upToDate.length > 0 && (
              <>
                <h2 className="text-2xl font-body font-semibold mt-6 flex items-center">
                  Up to Date{" "}
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-light-primary/20 dark:bg-dark-primary/20 shrink-0 ml-2">
                    <span className="text-sm font-bold text-light-primary dark:text-dark-primary">
                      {upToDate.length}
                    </span>
                  </span>
                </h2>
                <div className="mt-6">
                  {upToDate.map((entry) => (
                    <ShowCard
                      key={entry.show.id}
                      show={entry.show}
                      progress={entry.progress}
                      nextEpisode={entry.nextEpisode}
                      toggleNextEpisodeWatched={toggleWatched}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Not Started */}
            {notStarted.length > 0 && (
              <>
                <h2 className="text-2xl font-body font-semibold mt-6 flex items-center">
                  Not Started{" "}
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-light-primary/20 dark:bg-dark-primary/20 shrink-0 ml-2">
                    <span className="text-sm font-bold text-light-primary dark:text-dark-primary">
                      {notStarted.length}
                    </span>
                  </span>
                </h2>
                <div className="mt-6">
                  {notStarted.map((entry) => (
                    <ShowCard
                      key={entry.show.id}
                      show={entry.show}
                      progress={entry.progress}
                      nextEpisode={entry.nextEpisode}
                      toggleNextEpisodeWatched={toggleWatched}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Finished */}
            {finished.length > 0 && (
              <>
                <h2 className="text-2xl font-body font-semibold mt-6 flex items-center">
                  Finished{" "}
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-light-primary/20 dark:bg-dark-primary/20 shrink-0 ml-2">
                    <span className="text-sm font-bold text-light-primary dark:text-dark-primary">
                      {finished.length}
                    </span>
                  </span>
                </h2>
                <div className="mt-6">
                  {finished.map((entry) => (
                    <ShowCard
                      key={entry.show.id}
                      show={entry.show}
                      progress={entry.progress}
                      nextEpisode={entry.nextEpisode}
                      toggleNextEpisodeWatched={toggleWatched}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
