import { ReactNode } from 'react';

interface Activity {
  title: string;
  time: string;
  score?: string;
  duration?: string;
  progress?: string;
  icon: ReactNode;
}

interface RecentActivityCardProps {
  activity: Activity;
}

const RecentActivityCard = ({ activity }: RecentActivityCardProps) => {
  // Determine what additional info to display based on what's available
  const getAdditionalInfo = () => {
    if (activity.score) {
      return <span className="text-green-600 dark:text-green-400">{activity.score}</span>;
    }
    if (activity.duration) {
      return <span className="text-blue-600 dark:text-blue-400">{activity.duration}</span>;
    }
    if (activity.progress) {
      return <span className="text-amber-600 dark:text-amber-400">{activity.progress}</span>;
    }
    return null;
  };
  
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200">
      <div className="mt-0.5">
        {activity.icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
          {activity.title}
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">{activity.time}</span>
          {getAdditionalInfo()}
        </div>
      </div>
    </div>
  );
};

export default RecentActivityCard;