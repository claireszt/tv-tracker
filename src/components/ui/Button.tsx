export default function Button({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-md bg-light-primary dark:bg-dark-primary text-white text-base font-bold tracking-wider uppercase hover:bg-light-secondary dark:hover:bg-dark-secondary transition"
    >
      {text}
    </button>
  );
}
