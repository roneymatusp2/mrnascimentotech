import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BookOpen, BarChart2 } from 'lucide-react';

interface Problem {
  id: number;
  title: string;
  topic: string;
  difficulty: string;
  problems: number;
  timeEstimate: string;
  completionRate: number;
}

interface ProblemCardProps {
  problem: Problem;
}

const ProblemCard = ({ problem }: ProblemCardProps) => {
  // Get appropriate difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {problem.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </span>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 capitalize">
          {problem.topic}
        </p>
        
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>{problem.problems} problems</span>
          </div>
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>{problem.timeEstimate}</span>
          </div>
        </div>
        
        {/* Completion rate */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400 flex items-center">
              <BarChart2 className="w-4 h-4 mr-1" />
              Completion Rate
            </span>
            <span className="font-medium text-slate-900 dark:text-white">{problem.completionRate}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                problem.difficulty === 'easy' 
                  ? 'bg-green-500' 
                  : problem.difficulty === 'medium' 
                    ? 'bg-amber-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${problem.completionRate}%` }}
            ></div>
          </div>
        </div>
        
        <Link
          to={`/practice/${problem.id}`}
          className="flex items-center justify-between mt-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium group-hover:underline"
        >
          <span>Start Practice</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
};

export default ProblemCard;