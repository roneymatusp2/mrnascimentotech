import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}

const FeatureCard = ({ title, description, icon, color }: FeatureCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg dark:shadow-slate-700/10 transition-all duration-300 p-6 group">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
};

export default FeatureCard;