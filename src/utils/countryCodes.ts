// Mapping from TVDB three-letter country codes to ISO two-letter codes
const countryCodeMap: Record<string, string> = {
  USA: "us",
  FRA: "fr",
  DEU: "de",
  ESP: "es",
  ITA: "it",
  NLD: "nl",
  BRA: "br",
  CAN: "ca",
  JPN: "jp",
  KOR: "kr",
  CHN: "cn",
  RUS: "ru",
  GBR: "gb",
  // Add more mappings as needed
};

export function getISO2CountryCode(iso3: string): string {
  return countryCodeMap[iso3.toUpperCase()];
}
