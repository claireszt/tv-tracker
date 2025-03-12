"use client";

import { useRouter } from "next/navigation";

interface SearchResultsProps {
  results: { id: string; tvdb_id: string; name: string }[];
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
          className="p-4 rounded-md hover:bg-light-border dark:hover:bg-dark-border cursor-pointer transition-all text-lg text-light-text dark:text-dark-text"
          onClick={() => router.push(`/show/${show.tvdb_id}`)}
        >
          {show.name}
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
