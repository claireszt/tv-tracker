"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 100);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function fetchSearchResults() {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/tvdb/search?q=${debouncedQuery}`);
    const data = await res.json();

    setResults(data.data ?? []);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchSearchResults();
  }, [debouncedQuery]);

  return (
    <div className="max-w-xl mx-auto p-m">
      <h1 className="text-2xl font-heading text-light-text mb-4">Search for a TV Show</h1>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter show name..."
          className="w-full p-s border border-light-border rounded-1 text-light-text bg-light-surface"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="px-s py-xs bg-error text-white rounded-1 hover:bg-red-600 transition-all"
          >
            ✖
          </button>
        )}
      </div>

      {!loading && results.length === 0 && debouncedQuery && (
        <p className="mt-4 text-light-text opacity-70">No results found for "{debouncedQuery}".</p>
      )}

      {loading && (
        <div className="mt-2 flex items-center gap-2 text-light-text opacity-70">
          <span className="animate-spin h-4 w-4 border-2 border-light-border border-t-transparent rounded-full"></span>
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-4 border border-light-border rounded-1 p-m bg-light-surface">
          {results.map((show) => (
            <li
              key={show.id}
              className="p-s hover:bg-light-border cursor-pointer transition-all rounded-1"
              onClick={() => router.push(`/show/${show.tvdb_id}`)}
            >
              {show.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
