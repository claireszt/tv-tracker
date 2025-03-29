"use client";
import ShowCard from "@/components/ShowCard";
import Navbar from "@/components/ui/NavBar";
import { useEffect, useState } from "react";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<{ show: any; progress: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchWatchlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-light-text dark:text-dark-text">
        Loading...
      </div>
    );
  }

  // Organize shows by status
  const currentlyWatching = watchlist.filter((entry) => entry.progress > 0 && entry.progress < 100);
  const notStarted = watchlist.filter((entry) => entry.progress === 0);
  const finished = watchlist.filter((entry) => entry.progress >= 100);

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
                    <ShowCard key={entry.show.id} show={entry.show} progress={entry.progress} />
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
                    <ShowCard key={entry.show.id} show={entry.show} progress={entry.progress} />
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
                    <ShowCard key={entry.show.id} show={entry.show} progress={entry.progress} />
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
