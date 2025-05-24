import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

interface TopicCardProps {
  title: string;
  level: string;
  progress: number;
  category: string;
}

const TopicCard = ({ title, level, progress, category }: TopicCardProps) => {
  // Get appropriate level badge color
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(level)}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {category}
        </p>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="font-medium text-slate-900 dark:text-white">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <Link
          to={`/topics/${category.toLowerCase()}/${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="flex items-center justify-between mt-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium group-hover:underline"
        >
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>Continue Learning</span>
          </div>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
};

export default TopicCard;