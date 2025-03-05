"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface SearchResultsProps {
  results: { id: string; tvdb_id: string; name: string }[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const router = useRouter();

  if (results.length === 0) {
    return (
      <p className="mt-4 text-body-lg mobile:text-body-lg-mobile text-light-text opacity-70">
        No results found.
      </p>
    );
  }

  return (
    <ul className="mt-4 border border-light-border rounded-1 p-m bg-light-surface">
      {results.map((show) => (
        <li
          key={show.id}
          className="p-s hover:bg-light-border cursor-pointer transition-all rounded-1 text-body-lg mobile:text-body-lg-mobile"
          onClick={() => router.push(`/show/${show.tvdb_id}`)}
        >
          {show.name}
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
