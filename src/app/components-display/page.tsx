"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SearchResults from "@/components/SearchResults";
import { useEffect, useState } from "react";

export default function ComponentsDisplay() {
  const [inputValue, setInputValue] = useState("Sample text");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check user preference from local storage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <div className="max-w-4xl mx-auto p-m space-y-m relative">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 border rounded bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        <h1 className="text-h1 mobile:text-h1-mobile font-heading">🔧 Components Display</h1>

        {/* Typography Display */}
        <section className="bg-light-surface dark:bg-dark-surface p-m">
          <h2 className="text-h2 mobile:text-h2-mobile font-heading">Typography</h2>
          <hr className="border-t border-light-border dark:border-dark-border opacity-50 my-s" />

          <div className="space-y-s">
            <h1 className="text-h1 mobile:text-h1-mobile font-heading">H1 - Heading</h1>
            <h2 className="text-h2 mobile:text-h2-mobile font-heading">H2 - Heading</h2>
            <h3 className="text-h3 mobile:text-h3-mobile font-heading">H3 - Heading</h3>
            <p className="text-body-lg mobile:text-body-lg-mobile font-body">
              Body Large - This is a paragraph with larger text.
            </p>
            <p className="text-body-sm mobile:text-body-sm-mobile font-body">
              Body Small - This is a paragraph with smaller text.
            </p>
            <span className="text-caption mobile:text-caption-mobile font-body opacity-70">
              Caption - Used for small descriptions.
            </span>
          </div>
        </section>

        {/* Buttons */}
        <section className="bg-light-surface dark:bg-dark-surface p-m">
          <h2 className="text-h2 mobile:text-h2-mobile font-heading">Buttons</h2>
          <hr className="border-t border-light-border dark:border-dark-border opacity-50 my-s" />

          <div className="flex flex-wrap gap-m my-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="error">Error</Button>
          </div>
          <div className="flex flex-wrap gap-m">
            <Button variant="primary" disabled>
              Primary
            </Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="accent" disabled>
              Accent
            </Button>
            <Button variant="error" disabled>
              Error
            </Button>
          </div>
        </section>

        {/* Input Fields */}
        <section className="bg-light-surface dark:bg-dark-surface p-m">
          <h2 className="text-h2 mobile:text-h2-mobile font-heading">Inputs</h2>
          <hr className="border-t border-light-border dark:border-dark-border opacity-50 my-s" />

          <div className="space-y-s">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type here..."
            />
            <Input defaultValue="" placeholder="This is a placeholder" />
          </div>
        </section>

        {/* Search Results Preview */}
        <section className="bg-light-surface dark:bg-dark-surface p-m">
          <h2 className="text-h2 mobile:text-h2-mobile font-heading">Search Results</h2>
          <hr className="border-t border-light-border dark:border-dark-border opacity-50 my-s" />

          <SearchResults
            results={[
              { id: "1", tvdb_id: "1001", name: "Breaking Bad" },
              { id: "2", tvdb_id: "1002", name: "Game of Thrones" },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
