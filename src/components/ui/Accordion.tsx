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
                icon={
                  allEpisodesWatched ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )
                }
              />
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
