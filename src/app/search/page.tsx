"use client";

import Input from "@/components/Input";
import SearchResults from "@/components/SearchResults";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 100);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      <h1 className="text-h1 mobile:text-h1-mobile font-heading text-light-text mb-4">
        Search for a TV Show
      </h1>

      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
          placeholder="Enter show name..."
        />
      </div>

      {loading && (
        <div className="mt-2 flex items-center gap-2 text-light-text opacity-70 text-body-lg">
          <span className="animate-spin h-4 w-4 border-2 border-light-border border-t-transparent rounded-full"></span>
          Searching...
        </div>
      )}

      <SearchResults results={results} />
    </div>
  );
}
