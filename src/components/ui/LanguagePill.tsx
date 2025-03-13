interface LanguagePillProps {
  languageCode: string;
}

const languageMap: Record<string, string> = {
  eng: "English",
  fra: "French",
  spa: "Spanish",
  ita: "Italian",
  deu: "German",
  nld: "Dutch",
  por: "Portuguese",
  pol: "Polish",
  tur: "Turkish",
  rus: "Russian",
};

const LanguagePill: React.FC<LanguagePillProps> = ({ languageCode }) => {
  return (
    <span className="px-3 py-1 text-sm font-medium rounded-full bg-light-secondary dark:bg-dark-secondary text-white">
      {languageMap[languageCode] || languageCode.toUpperCase()}
    </span>
  );
};

export default LanguagePill;
