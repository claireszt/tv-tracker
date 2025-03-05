import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  defaultValue?: string;
  onClear?: () => void;
}

const Input: React.FC<InputProps> = ({
  value,
  defaultValue,
  onClear,
  className,
  placeholder,
  ...props
}) => {
  return (
    <div className="relative w-full">
      <input
        {...(value !== undefined ? { value } : { defaultValue })}
        placeholder={placeholder}
        className={`w-full p-s border border-light-border dark:border-dark-border rounded-1 bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text text-body-lg mobile:text-body-lg-mobile font-body placeholder:text-gray-400 dark:placeholder:text-gray-600 ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-error text-white px-2 py-1 rounded-1 hover:bg-red-600 transition-all"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default Input;
