import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "error";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  disabled,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "px-m py-sm rounded-sm text-button mobile:text-button-mobile font-body transition-all";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-button-primary-hover disabled:bg-button-primary-disabled",
    secondary:
      "bg-secondary text-white hover:bg-button-secondary-hover disabled:bg-button-secondary-disabled",
    accent: "bg-accent text-white hover:bg-button-accent-hover disabled:bg-button-accent-disabled",
    error: "bg-error text-white hover:bg-red-600 disabled:opacity-50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
