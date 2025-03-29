"use client";

import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import Navbar from "@/components/ui/NavBar";
import ShowInfo from "@/components/ui/ShowInfo";
import StatusPill from "@/components/ui/StatusPill";
import { Episode, TVShowDetail } from "@/models/tvShow";
import { formatRelativeDate, hasEpisodeAired } from "@/utils/date";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck, FaClock } from "react-icons/fa";

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

  const markAllEpisodesInSeason = async (season: number) => {
    try {
      const seasonEpisodes =
        showDetail?.seasons.find((s) => s.seasonNumber === season)?.episodes || [];
      const episodeIds = seasonEpisodes.map((ep) => String(ep.id));

      // Check if all episodes are already watched
      const allWatched = episodeIds.every((id) => watchedEpisodes.includes(id));

      // Mark all episodes in the season
      await Promise.all(
        episodeIds.map(async (episodeId) => {
          const episode = seasonEpisodes.find((ep) => String(ep.id) === episodeId);
          if (episode) {
            if (allWatched) {
              // If all are watched, unwatch them
              if (watchedEpisodes.includes(episodeId)) {
                await toggleEpisode(episode);
              }
            } else {
              // If not all are watched, watch them
              if (!watchedEpisodes.includes(episodeId)) {
                await toggleEpisode(episode);
              }
            }
          }
        })
      );

      // Update local state
      setWatchedEpisodes((prev) => {
        if (allWatched) {
          // Remove all episode IDs from this season
          return prev.filter((id) => !episodeIds.includes(id));
        } else {
          // Add all episode IDs from this season
          return [...new Set([...prev, ...episodeIds])];
        }
      });
    } catch (error) {
      console.error("❌ Failed to mark all episodes:", error);
    }
  };

  const markAllEpisodes = async () => {
    try {
      const allEpisodes = showDetail?.seasons.flatMap((s) => s.episodes) || [];
      const episodeIds = allEpisodes.map((ep) => String(ep.id));

      // Check if all episodes are already watched
      const allWatched = episodeIds.every((id) => watchedEpisodes.includes(id));

      // Create or remove watched episodes in bulk
      const res = await fetch("/api/watchlist/toggle-all-episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvdbId: showDetail?.tvdb_id,
          episodeIds: allWatched ? [] : episodeIds, // If all are watched, send empty array to unwatch all
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Update local state
        setWatchedEpisodes((prev) => {
          if (allWatched) {
            // Remove all episode IDs
            return prev.filter((id) => !episodeIds.includes(id));
          } else {
            // Add all episode IDs
            return [...new Set([...prev, ...episodeIds])];
          }
        });
      } else {
        console.error("❌ Failed to mark all episodes:", data.error);
      }
    } catch (error) {
      console.error("❌ Failed to mark all episodes:", error);
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
    const imageUrl = showDetail.image || "";

    // Calculate total episodes excluding specials
    const totalEpisodes = showDetail.seasons
      .filter((season) => season.seasonNumber !== 0)
      .reduce((acc, season) => acc + season.episodes.length, 0);

    try {
      const res = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvdbId: showDetail.tvdb_id,
          title: showDetail.title,
          imageUrl,
          totalEpisodes,
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
        {/* Add to Watchlist and Mark All Episodes */}
        <div className="w-full px-6 pb-4 flex flex-col items-center gap-2">
          <Button
            text={watchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            onClick={() => (watchlist ? removeFromWatchlist() : addToWatchlist())}
          />
          {watchlist && (
            <Button
              text={
                showDetail.seasons
                  .flatMap((s) => s.episodes)
                  .every((ep) => watchedEpisodes.includes(String(ep.id)))
                  ? "Mark All As Unwatched"
                  : "Mark All As Watched"
              }
              onClick={markAllEpisodes}
              variant="text"
              icon={
                showDetail.seasons
                  .flatMap((s) => s.episodes)
                  .every((ep) => watchedEpisodes.includes(String(ep.id))) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )
              }
            />
          )}
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
          {showDetail.seasons
            .sort((a, b) => {
              // Put specials (season 0) at the end
              if (a.seasonNumber === 0) return 1;
              if (b.seasonNumber === 0) return -1;
              return a.seasonNumber - b.seasonNumber;
            })
            .map((season) => (
              <Accordion
                key={season.seasonNumber}
                title={season.seasonNumber === 0 ? "Specials" : `Season ${season.seasonNumber}`}
                isOpen={activeSeason === season.seasonNumber}
                onClick={() =>
                  setActiveSeason(activeSeason === season.seasonNumber ? null : season.seasonNumber)
                }
                onMarkAllEpisodes={() => markAllEpisodesInSeason(season.seasonNumber)}
                showMarkAllButton={watchlist}
                allEpisodesWatched={season.episodes.every((ep) =>
                  watchedEpisodes.includes(String(ep.id))
                )}
              >
                <ul className="mt-2 space-y-1">
                  {season.episodes.map((ep) => (
                    <li
                      key={ep.id}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-light-surface/50 dark:bg-dark-surface/50 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                    >
                      <div className="flex items-center min-w-0 flex-1 gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-light-primary/20 dark:bg-dark-primary/20 shrink-0">
                          <span className="text-sm font-bold text-light-primary dark:text-dark-primary">
                            {ep.episodeNumber}
                          </span>
                        </div>
                        <span className="text-base truncate">{ep.title}</span>
                      </div>

                      {/* Show air date or watch button */}
                      {watchlist && (
                        <div className="flex items-center gap-1.5 shrink-0 ml-4">
                          {!hasEpisodeAired(ep.airDate) ? (
                            <span className="flex items-center gap-1.5 text-sm text-light-text/60 dark:text-dark-text/60 min-w-[100px] justify-end">
                              {formatRelativeDate(ep.airDate)}
                              <FaClock className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleEpisode(ep);
                              }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                                watchedEpisodes.includes(String(ep.id))
                                  ? "bg-green-500/90 hover:bg-green-500"
                                  : "bg-gray-400/80 hover:bg-gray-400"
                              }`}
                              aria-label={
                                watchedEpisodes.includes(String(ep.id))
                                  ? "Mark as Unwatched"
                                  : "Mark as Watched"
                              }
                            >
                              <FaCheck className="w-3.5 h-3.5 text-white" />
                            </button>
                          )}
                        </div>
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
