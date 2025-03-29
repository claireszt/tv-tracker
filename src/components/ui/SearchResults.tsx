"use client";

import { TVShow } from "@/models/tvShow";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  results: TVShow[];
  loading: boolean;
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, loading, query }) => {
  const router = useRouter();

  if (!loading && query.trim() !== "" && results.length === 0) {
    return (
      <p className="mt-6 text-center text-lg text-light-text dark:text-dark-text opacity-70">
        No results found.
      </p>
    );
  }

  if (results.length === 0) return null;

  return (
    <ul className="mt-6 max-w-lg mx-auto border border-light-border dark:border-dark-border rounded-lg p-3 bg-light-surface dark:bg-dark-surface shadow-md">
      {results.map((show) => (
        <li
          key={show.id}
          onClick={() => router.push(`/show/${show.tvdbId}`)}
          className="p-4 rounded-md flex items-center gap-4 hover:bg-light-border dark:hover:bg-dark-border cursor-pointer transition-all text-lg text-light-text dark:text-dark-text"
        >
          {show.image ? (
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image
                src={show.image}
                alt={show.title}
                width={100} // Intrinsic width (used for aspect ratio)
                height={150} // Intrinsic height (used for aspect ratio)
                style={{
                  maxWidth: "48px", // Limit image width to container's width
                  objectFit: "contain",
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-light-border dark:bg-dark-border rounded-md" />
          )}
          <div className="flex flex-col gap-1">
            <span>{show.title}</span>
            <span className="text-xs text-light-text dark:text-dark-text opacity-70">
              {show.year}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
