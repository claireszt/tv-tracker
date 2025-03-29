interface ProgressBarProps {
  progress: number; // Explicitly define the type for progress
  className?: string; // Add className as an optional prop
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className }) => {
  return (
    <div className={`w-1/2 bg-gray-300 dark:bg-gray-700 rounded-full h-1.5 ${className}`}>
      <div
        className="h-1.5 rounded-full bg-light-secondary dark:bg-dark-secondary"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
