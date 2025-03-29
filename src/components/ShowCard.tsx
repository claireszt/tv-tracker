import Button from "@/components/ui/Button";
import { TVShow } from "@/models/tvShow";
import Image from "next/image";
import Link from "next/link";
import ProgressBar from "./ProgressBar";

// Define the ShowCardProps interface
interface ShowCardProps {
  show: TVShow;
  progress: number;
}

const ShowCard: React.FC<ShowCardProps> = ({ show, progress }) => {
  return (
    <Link href={`/show/${show.tvdbId}`} passHref>
      <div className="w-full p-6 bg-light-surface dark:bg-dark-surface rounded-lg shadow-md flex flex-col items-center cursor-pointer transition-transform transform mb-4">
        <div className="flex flex-row items-center w-full">
          {/* Show Image */}
          <div className="relative w-32 h-48 bg-light-border dark:bg-dark-border rounded-lg overflow-hidden shadow-md">
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
              <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-sm text-light-text dark:text-dark-text opacity-70">
                  No Image
                </span>
              </div>
            )}
          </div>

          {/* Show Details */}
          <div className="flex flex-col items-start md:ml-4 flex-grow p-3">
            {/* Show Title */}
            <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mt-3 text-center md:text-left">
              {show.title}
            </h2>

            {/* Watched Progress Bar and Percentage Pill in One Line */}
            <div className="flex items-center mt-2 w-full gap-2">
              <div className="bg-light-secondary dark:bg-dark-secondary text-white text-sm font-semibold rounded-full px-3 py-1">
                {progress}%
              </div>
              <div className="flex-grow">
                <ProgressBar progress={progress} />
              </div>
            </div>

            {/* Watched Percentage */}
            <p className="text-sm text-light-text dark:text-dark-text opacity-70 mt-1 text-center md:text-left">
              {progress === 100
                ? "Completed"
                : `${(show.totalEpisodes ?? 0) - progress} episode${(show.totalEpisodes ?? 0) <= 1 ? "" : "s"} to watch`}
            </p>
          </div>

          {/* View Button (only on desktop) */}
          <div className="hidden md:block md:ml-4">
            <Button text="View More" aria-label={`View more about ${show.title}`} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShowCard;
