export default function Button({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-md bg-light-primary dark:bg-dark-primary text-white text-base font-bold tracking-wider uppercase 
        hover:bg-light-secondary dark:hover:bg-dark-secondary transition 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {text}
    </button>
  );
}
