import { getISO2CountryCode } from "@/utils/countryCodes";
import Image from "next/image";

const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  const flagCode = getISO2CountryCode(countryCode); // Convert to ISO-2 code
  const flagUrl = `https://flagcdn.com/w20/${flagCode}.png`;

  return <Image src={flagUrl} alt={`${countryCode} Flag`} width={20} height={15} unoptimized />;
};

export default CountryFlag;
