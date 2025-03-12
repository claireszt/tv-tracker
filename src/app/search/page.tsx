"use client";

import Input from "@/components/ui/Input";
import Navbar from "@/components/ui/NavBar";
import SearchResults from "@/components/ui/SearchResults";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    fetchSearchResults();
  }, [debouncedQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 pt-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 pt-[100px] md:pt-[120px]">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-heading text-light-text dark:text-dark-text mb-6 text-center flex items-center gap-2">
          🔍 Search for a TV Show
        </h1>

        <div className="flex items-center gap-3 w-full max-w-lg mx-auto">
          <Input
            type="text"
            placeholder="Find a show..."
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
          />
        </div>
      </div>

      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-light-text opacity-70 text-lg">
          <span className="animate-spin h-5 w-5 border-2 border-light-border border-t-transparent rounded-full"></span>
          Searching...
        </div>
      )}

      <SearchResults results={results} loading={loading} query={query} />
    </div>
    </>
  );
}
