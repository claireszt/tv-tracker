"use client";

import Button from "@/components/ui/Button";
import Navbar from "@/components/ui/NavBar";
import { TVShowDetail } from "@/models/tvShow";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShowDetailPage() {
  const { id } = useParams();
  const [showDetail, setShowDetail] = useState<TVShowDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tvdb/show/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setShowDetail(data);
      } catch (error) {
        console.error("Error fetching show details:", error);
        setShowDetail(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetails();
  }, [id]);

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

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 pt-[100px] md:pt-[120px]">
        <h1 className="text-3xl font-heading text-light-text dark:text-dark-text">
          {showDetail.title}
        </h1>
        <p className="mt-4 text-base text-light-text dark:text-dark-text">{showDetail.synopsis}</p>

        {/* Display Seasons & Episodes */}
        {showDetail.seasons.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-heading text-light-text dark:text-dark-text mb-4">
              Seasons
            </h2>
            {showDetail.seasons.map((season, i) => (
              <div key={`${season.seasonNumber}-${i}`} className="mb-6">
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
                  Season {season.seasonNumber}
                </h3>
                <ul className="list-disc list-inside mt-2">
                  {season.episodes.map((ep, j) => (
                    <li
                      key={`${ep.id}-${j}`}
                      className="text-base text-light-text dark:text-dark-text"
                    >
                      {ep.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* "Add to Watchlist" Button */}
        <div className="mt-8">
          <Button
            text="Add to Watchlist"
            onClick={() => {
              // Implement actual watchlist logic
              alert("Added to Watchlist!");
            }}
          />
        </div>
      </div>
    </>
  );
}
