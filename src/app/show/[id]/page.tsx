"use client";

import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import Navbar from "@/components/ui/NavBar";
import ShowInfo from "@/components/ui/ShowInfo";
import StatusPill from "@/components/ui/StatusPill";
import { Episode, TVShowDetail } from "@/models/tvShow";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShowDetailPage() {
  const { id } = useParams();
  const [showDetail, setShowDetail] = useState<TVShowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState(false);
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tvdb/show/${id}`);
        const data = await res.json();
        setShowDetail(data);

        // ✅ Check if the show is in the watchlist
        const watchlistRes = await fetch("/api/watchlist");
        const watchlistData = await watchlistRes.json();

        if (watchlistRes.ok) {
          const isInWatchlist = watchlistData.watchlist.some(
            (entry: any) => entry.show.tvdbId === data.tvdb_id
          );
          setWatchlist(isInWatchlist);

          if (isInWatchlist) {
            // ✅ Fetch watched episodes
            const watchedRes = await fetch("/api/watchlist/watched-episodes");
            const watchedData = await watchedRes.json();
            if (watchedRes.ok) {
              setWatchedEpisodes(watchedData.watchedEpisodes.map((ep: any) => ep.episodeId));
            }
          }
        } else {
          console.error("❌ Failed to fetch watchlist:", watchlistData.error);
        }
      } catch (error) {
        console.error("Error fetching show details:", error);
        setShowDetail(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDetails();
  }, [id]);

  const toggleEpisode = async (episode: Episode) => {
    try {
      const res = await fetch("/api/watchlist/toggle-episode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: String(episode.id),
          tvdbId: showDetail?.tvdb_id,
          title: episode.title,
          season: episode.season,
          episodeNumber: episode.episodeNumber,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setWatchedEpisodes((prev) =>
          prev.includes(String(episode.id))
            ? prev.filter((id) => id !== String(episode.id))
            : [...prev, String(episode.id)]
        );
      } else {
        console.error("❌ Failed to toggle episode:", data.error);
      }
    } catch (error) {
      console.error("❌ API Request Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-light-text dark:text-dark-text">
        Loading...
      </div>
    );
  }

  if (!showDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-light-text dark:text-dark-text">
        Show not found.
      </div>
    );
  }

  const addToWatchlist = async () => {
    try {
      const res = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvdbId: showDetail.tvdb_id, // ✅ Use real TVDB ID
          title: showDetail.title,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setWatchlist(true);
      } else {
        console.error("❌ Failed to add show to watchlist:", data.error);
      }
    } catch (error) {
      console.error("❌ API Request Error:", error);
    }
  };

  const removeFromWatchlist = async () => {
    try {
      const res = await fetch("/api/watchlist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvdbId: showDetail.tvdb_id, // ✅ Send only TVDB ID
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setWatchlist(false);
      } else {
        console.error("❌ Failed to remove show from watchlist:", data.error);
      }
    } catch (error) {
      console.error("❌ API Request Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-4 py-6 md:py-12 pt-[100px] md:pt-[120px] bg-light-background dark:bg-dark-background">
        {/* Add to Watchlist */}
        <div className="w-full px-6 pb-4 flex items-center justify-center">
          <Button
            text={watchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            onClick={() => (watchlist ? removeFromWatchlist() : addToWatchlist())}
          />
        </div>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="relative w-32 h-48 bg-light-border dark:bg-dark-border overflow-hidden rounded-lg shadow-md">
            {showDetail.image ? (
              <Image
                src={showDetail.image}
                alt={showDetail.title}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-light-border dark:bg-dark-border" />
            )}
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 text-center sm:text-left">
            <h1 className="text-3xl font-heading font-semibold text-light-text dark:text-dark-text">
              {showDetail.title}
            </h1>
            <p className="text-base text-light-text dark:text-dark-text opacity-70">
              {showDetail.year}
            </p>
            <div className="flex justify-center sm:justify-start">
              <StatusPill status={showDetail.status} />
            </div>
          </div>
        </div>

        <ShowInfo showDetail={showDetail} />

        {/* Summary Section */}
        <div className="mt-6 p-4 sm:p-6 bg-light-surface dark:bg-dark-surface rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
            Summary
          </h2>
          <p className="text-base text-justify text-light-text dark:text-dark-text opacity-80 leading-relaxed">
            {showDetail.synopsis}
          </p>
        </div>
        {/* Seasons Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-heading text-light-text dark:text-dark-text mb-4">
            Seasons
          </h2>
          {showDetail.seasons.map((season) => (
            <Accordion
              key={season.seasonNumber}
              title={season.seasonNumber === 0 ? "Specials" : `Season ${season.seasonNumber}`}
              isOpen={activeSeason === season.seasonNumber}
              onClick={() =>
                setActiveSeason(activeSeason === season.seasonNumber ? null : season.seasonNumber)
              }
            >
              <ul className="mt-2 space-y-2">
                {season.episodes.map((ep) => (
                  <li
                    key={ep.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-light-surface dark:bg-dark-surface"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono opacity-70">{ep.episodeNumber}.</span>
                      <span className="text-base">{ep.title}</span>
                    </div>

                    {/* ✅ Show toggle button only if show is in watchlist */}
                    {watchlist && (
                      <button
                        onClick={() => toggleEpisode(ep)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition ${
                          watchedEpisodes.includes(String(ep.id))
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {watchedEpisodes.includes(String(ep.id)) ? "Watched" : "Mark as Watched"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </Accordion>
          ))}
        </div>
      </div>
    </>
  );
}
