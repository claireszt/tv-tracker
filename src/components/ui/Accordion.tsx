import React from "react";
import Button from "./Button";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  onMarkAllEpisodes?: () => void;
  showMarkAllButton?: boolean;
  allEpisodesWatched?: boolean;
}

export default function Accordion({
  title,
  children,
  isOpen,
  onClick,
  onMarkAllEpisodes,
  showMarkAllButton = false,
  allEpisodesWatched = false,
}: AccordionProps) {
  return (
    <div className="mb-3">
      <div
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-lg text-white bg-light-secondary dark:bg-dark-secondary font-semibold transition-all cursor-pointer
          ${isOpen ? "bg-primary shadow-md" : "bg-secondary hover:bg-secondary/90"}`}
      >
        <span className="text-lg">{title}</span>
        <span className="text-sm opacity-80">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="mt-2 bg-light-surface dark:bg-dark-surface p-3 rounded-lg">
          {showMarkAllButton && (
            <div className="mb-4 flex justify-center">
              <Button
                text={allEpisodesWatched ? "Mark All As Unwatched" : "Mark All As Watched"}
                onClick={onMarkAllEpisodes}
                variant="text"
                icon={allEpisodesWatched ? "checkbox" : "checkbox-checked"}
              />
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
