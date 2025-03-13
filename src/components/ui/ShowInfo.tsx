import CountryFlag from "@/components/ui/CountryFlag";
import LanguagePill from "@/components/ui/LanguagePill";
import { TVShowDetail } from "@/models/tvShow";
import { formatFullDate } from "@/utils/date";
import { useState } from "react";

const ShowInfo = ({ showDetail }: { showDetail: TVShowDetail }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 p-4 sm:p-6 bg-light-surface dark:bg-dark-surface rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 font-semibold text-light-text dark:text-dark-text "
      >
        Show Details {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-3">
          <p className="flex items-center gap-2 text-lg">
            <strong>Original Country:</strong>
            <CountryFlag countryCode={showDetail.originalCountry} />
          </p>

          <p className="flex items-center gap-2 text-lg">
            <strong>Original Language:</strong>
            <LanguagePill languageCode={showDetail.originalLanguage} />
          </p>

          <p>
            <strong>First Aired:</strong> {formatFullDate(showDetail.firstAired)}
          </p>
          {showDetail.lastAired && (
            <p>
              <strong>Last Aired:</strong> {formatFullDate(showDetail.lastAired)}
            </p>
          )}
          {showDetail.nextAired && (
            <p>
              <strong>Next Episode:</strong> {formatFullDate(showDetail.nextAired)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowInfo;
