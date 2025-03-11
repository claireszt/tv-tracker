export default function Input({
  label,
  type,
  placeholder,
  error,
  ...rest
}: {
  label: string;
  type: string;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-light-text dark:text-dark-text">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full mt-1 p-3 border rounded-md bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text placeholder:text-light-text/60 dark:placeholder:text-dark-text/80 
          ${error ? "border-light-error dark:border-dark-error" : "border-light-border dark:border-dark-border"} 
          focus:outline-none focus:ring-2 focus:ring-light-primary/50 dark:focus:ring-dark-primary/50`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-light-error dark:text-dark-error">{error}</p>}
    </div>
  );
}
