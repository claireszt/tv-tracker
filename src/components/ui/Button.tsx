import { ReactNode } from "react";

type ButtonVariant = "primary" | "nav" | "text";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  isActive?: boolean;
  icon?: ReactNode;
}

export default function Button({
  text,
  onClick,
  disabled = false,
  variant = "primary",
  isActive = false,
  icon,
}: ButtonProps) {
  const baseClasses = "transition duration-200 px-4 py-2 rounded-full";

  const activeNavClasses = "bg-light-primary dark:bg-dark-primary text-white font-bold";
  const inactiveNavClasses =
    "text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary hover:bg-light-surface dark:hover:bg-dark-surface hover:font-semibold";

  const primaryClasses =
    "px-6 py-3 bg-light-primary dark:bg-dark-primary text-white text-base font-bold tracking-wider uppercase hover:bg-light-secondary dark:hover:bg-dark-secondary";

  const textClasses =
    "px-0 py-0 text-light-primary dark:text-dark-primary text-base font-bold hover:opacity-80 flex items-center gap-2";

  const navClasses = isActive ? activeNavClasses : inactiveNavClasses;

  const classes =
    variant === "primary"
      ? `${baseClasses} ${primaryClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
      : variant === "nav"
        ? `${baseClasses} ${navClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
        : `${textClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {icon}
      {text}
    </button>
  );
}
