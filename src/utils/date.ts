export function formatFullDate(dateString: string | null): string | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null; // Handle invalid dates

  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
  const year = date.getFullYear();

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th"; // Covers 4-20
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
}

export function hasEpisodeAired(airDate: string | null): boolean {
  if (!airDate) return false;
  const episodeDate = new Date(airDate);
  const now = new Date();
  return episodeDate <= now;
}

export function formatRelativeDate(dateString: string): string {
  if (!dateString) return "Unknown date";

  const now = new Date();
  const target = new Date(dateString);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays === -1) return "yesterday";

  if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago`;
}
