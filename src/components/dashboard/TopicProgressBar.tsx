interface TopicProgressBarProps {
  topic: {
    name: string;
    progress: number;
  };
}

const TopicProgressBar = ({ topic }: TopicProgressBarProps) => {
  // Function to get color based on progress
  const getProgressColor = (progress: number) => {
    if (progress < 40) return 'bg-red-500 dark:bg-red-600';
    if (progress < 70) return 'bg-amber-500 dark:bg-amber-600';
    return 'bg-green-500 dark:bg-green-600';
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {topic.name}
        </span>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {topic.progress}%
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getProgressColor(topic.progress)}`}
          style={{ width: `${topic.progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TopicProgressBar;