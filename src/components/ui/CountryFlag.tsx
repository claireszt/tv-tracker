import { getISO2CountryCode } from "@/utils/countryCodes";

const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  const flagCode = getISO2CountryCode(countryCode); // Convert to ISO-2 code
  const flagUrl = `https://flagcdn.com/w20/${flagCode}.png`;

  return <img src={flagUrl} alt={`${countryCode} Flag`} />;
};

export default CountryFlag;
