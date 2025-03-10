export default function Input({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-light-text dark:text-dark-text">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full mt-1 p-3 border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary/50 dark:focus:ring-dark-primary/50 placeholder:text-light-text/50 dark:placeholder:text-dark-text/50"
      />
    </div>
  );
}
