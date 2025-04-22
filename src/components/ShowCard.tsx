import { TVShow } from "@/models/tvShow";
import { formatRelativeDate, hasEpisodeAired } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { FaCheck } from "react-icons/fa";
import ProgressBar from "./ProgressBar";

interface EpisodeTogglePayload {
  id: string;
  tvdbId: number;
  title: string;
  season: number;
  episodeNumber: number;
}
interface ShowCardProps {
  show: TVShow;
  progress: number;
  nextEpisode?: {
    id: string;
    title: string;
    season: number;
    episodeNumber: number;
    airDate: string;
  };
  // eslint-disable-next-line no-unused-vars
  toggleNextEpisodeWatched?: (episode: EpisodeTogglePayload) => void;
}

const ShowCard: React.FC<ShowCardProps> = ({
  show,
  progress,
  nextEpisode,
  toggleNextEpisodeWatched,
}) => {
  const aired = nextEpisode ? hasEpisodeAired(nextEpisode.airDate) : false;
  const totalEpisodes = show.totalEpisodes ?? 0;
  const remainingAfterNext = totalEpisodes - Math.round((progress / 100) * totalEpisodes);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!nextEpisode) return;
      toggleNextEpisodeWatched?.({
        id: nextEpisode.id,
        tvdbId: show.tvdbId,
        title: nextEpisode.title,
        season: nextEpisode.season,
        episodeNumber: nextEpisode.episodeNumber,
      });
    },
    [nextEpisode, show.tvdbId, toggleNextEpisodeWatched]
  );

  return (
    <div className="w-full bg-light-surface dark:bg-dark-surface mb-4 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition">
      <div className="flex gap-4 items-start">
        {/* Poster */}
        <Link href={`/show/${show.tvdbId}`} passHref>
          <div className="relative w-24 h-36 sm:w-28 sm:h-40 rounded-lg overflow-hidden shrink-0 cursor-pointer">
            {show.image ? (
              <Image
                src={show.image}
                alt={show.title}
                layout="fill"
                objectFit="cover"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm text-light-text dark:text-dark-text opacity-70">
                No Image
              </div>
            )}
          </div>
        </Link>

        {/* Details */}
        <div className="flex flex-col justify-start w-full gap-2 pt-0.5">
          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-light-text dark:text-dark-text leading-snug">
            {show.title}
          </h2>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="bg-pink-400 text-white text-sm font-bold rounded-full px-3 py-1">
              {progress}%
            </span>
            <div className="flex-grow">
              <ProgressBar progress={progress} />
            </div>
          </div>

          {/* Next Episode */}
          {nextEpisode && (
            <div className="flex flex-col gap-1 text-sm text-light-text dark:text-dark-text mt-2">
              <p className="font-semibold">Next:</p>
              <p>
                S{nextEpisode.season.toString().padStart(2, "0")} E
                {nextEpisode.episodeNumber.toString().padStart(2, "0")} — {nextEpisode.title}
              </p>

              {aired && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-purple-100 text-purple-600 font-semibold px-2 py-0.5 rounded-full">
                    +{remainingAfterNext - 1}
                  </span>
                  <button
                    onClick={handleToggle}
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-400/80 hover:bg-gray-400 transition"
                    aria-label="Toggle watched"
                  >
                    <FaCheck className="w-3 h-3 text-white" />
                  </button>
                </div>
              )}

              {!aired && (
                <span className="text-xs italic text-gray-500 mt-1">
                  ⏳ {formatRelativeDate(nextEpisode.airDate)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
