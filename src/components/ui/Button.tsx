type ButtonVariant = "primary" | "nav";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  isActive?: boolean;
}

export default function Button({
  text,
  onClick,
  disabled = false,
  variant = "primary",
  isActive = false,
}: ButtonProps) {
  const baseClasses = "transition duration-200 px-4 py-2 rounded-full";

  const activeNavClasses = "bg-light-primary dark:bg-dark-primary text-white font-bold";
  const inactiveNavClasses =
    "text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary hover:bg-light-surface dark:hover:bg-dark-surface hover:font-semibold";

  const primaryClasses =
    "px-6 py-3 bg-light-primary dark:bg-dark-primary text-white text-base font-bold tracking-wider uppercase hover:bg-light-secondary dark:hover:bg-dark-secondary";

  const navClasses = isActive ? activeNavClasses : inactiveNavClasses;

  const classes =
    variant === "primary"
      ? `${baseClasses} ${primaryClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
      : `${baseClasses} ${navClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {text}
    </button>
  );
}
