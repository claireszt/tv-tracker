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

export function formatRelativeDate(dateString: string | null): string | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 30) {
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `in ${diffDays} days`;
  }

  return formatFullDate(dateString);
}
