"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SearchResults from "@/components/SearchResults";
import Link from "next/link";
import { useState } from "react";

export default function ComponentsDisplay() {
  const [inputValue, setInputValue] = useState("Sample text");

  return (
    <div className="max-w-4xl mx-auto p-m space-y-m relative">
      <h1 className="text-h1 mobile:text-h1-mobile font-heading text-light-text">
        🔧 Components Display
      </h1>

      {/* Typography Display */}
      <section>
        <h2 className="text-h2 mobile:text-h2-mobile font-heading mt-l">Typography</h2>

        <div className="space-y-s">
          <h1 className="text-h1 mobile:text-h1-mobile font-heading text-light-text">
            H1 - Heading
          </h1>
          <h2 className="text-h2 mobile:text-h2-mobile font-heading text-light-text">
            H2 - Heading
          </h2>
          <h3 className="text-h3 mobile:text-h3-mobile font-heading text-light-text">
            H3 - Heading
          </h3>
          <p className="text-body-lg mobile:text-body-lg-mobile font-body text-light-text">
            Body Large - This is a paragraph with larger text.
          </p>
          <p className="text-body-sm mobile:text-body-sm-mobile font-body text-light-text">
            Body Small - This is a paragraph with smaller text.
          </p>
          <span className="text-caption mobile:text-caption-mobile font-body text-light-text opacity-70">
            Caption - Used for small descriptions.
          </span>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-h2 mobile:text-h2-mobile font-heading mt-l">Buttons</h2>
        <div className="flex flex-wrap gap-m">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="error">Error</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* Input Fields */}
      <section>
        <h2 className="text-h2 mobile:text-h2-mobile font-heading mt-l">Inputs</h2>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type here..."
        />
        <Input defaultValue="" placeholder="This is a placeholder" />
      </section>

      {/* Search Results Preview */}
      <section>
        <h2 className="text-h2 mobile:text-h2-mobile font-heading mt-l">Search Results</h2>
        <SearchResults
          results={[
            { id: "1", tvdb_id: "1001", name: "Breaking Bad" },
            { id: "2", tvdb_id: "1002", name: "Game of Thrones" },
          ]}
        />
      </section>

      {/* Button at Bottom Center */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <Link href="/">
          <Button variant="primary">🏠 Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
