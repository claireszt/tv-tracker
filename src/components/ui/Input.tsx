export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  onClear,
  ...rest
}: {
  label?: string;
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  onClear?: () => void;
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          className={`w-full p-4 pr-12 text-lg border rounded-lg bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder:text-light-text/60 dark:placeholder:text-dark-text/80 
            border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-light-primary/50 dark:focus:ring-dark-primary/50
            ${error ? "border-light-error dark:border-dark-error" : "border-light-border dark:border-dark-border"}`}
          onChange={onChange}
          {...rest}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-light-text dark:text-dark-text opacity-70 hover:opacity-100"
          >
            ✖
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-light-error dark:text-dark-error">{error}</p>}
    </div>
  );
}
