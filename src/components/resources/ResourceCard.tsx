import { ArrowRight, Download, Calendar } from 'lucide-react';
import { ReactNode } from 'react';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  downloads: number;
  fileSize: string | null;
  dateAdded: string;
}

interface ResourceCardProps {
  resource: Resource;
  icon: ReactNode;
}

const ResourceCard = ({ resource, icon }: ResourceCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'tool':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'video':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {resource.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(resource.type)} flex items-center`}>
            {icon}
            <span className="ml-1 capitalize">{resource.type}</span>
          </span>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Download className="w-4 h-4 mr-1" />
            <span>{resource.downloads.toLocaleString()} downloads</span>
          </div>
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(resource.dateAdded)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {resource.fileSize ? resource.fileSize : 'Online Tool'}
          </span>
          <a
            href={`#resource-${resource.id}`}
            className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            {resource.type === 'tool' ? (
              <span>Open Tool</span>
            ) : (
              <span>Download</span>
            )}
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;