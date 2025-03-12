"use client";
import Button from "@/components/ui/Button";
import Navbar from "@/components/ui/NavBar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((entry) => (
              <Link key={entry.show.id} href={`/show/${entry.show.tvdbId}`} passHref>
                <div className="p-4 bg-light-surface dark:bg-dark-surface rounded-lg shadow-md flex items-center gap-4 cursor-pointer hover:shadow-lg transition">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                      {entry.show.title}
                    </h2>
                    <p className="text-sm text-light-text dark:text-dark-text opacity-70">
                      Added on: {new Date(entry.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button text="View" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
