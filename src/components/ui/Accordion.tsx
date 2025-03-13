interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

export default function Accordion({ title, children, isOpen, onClick }: AccordionProps) {
  return (
    <div className="mb-3">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-lg text-white bg-light-secondary dark:bg-dark-secondary font-semibold transition-all
          ${isOpen ? "bg-primary shadow-md" : "bg-secondary hover:bg-secondary/90"}`}
      >
        <span className="text-lg">{title}</span>
        <span className="text-sm opacity-80">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-2 bg-light-surface dark:bg-dark-surface p-3 rounded-lg">{children}</div>
      )}
    </div>
  );
}
