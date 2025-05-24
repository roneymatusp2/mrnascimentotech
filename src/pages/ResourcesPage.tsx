import { useState } from 'react';
import { Download, FileText, Calculator, Video, Book, Search } from 'lucide-react';
import ResourceCard from '../components/resources/ResourceCard';

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const resources = [
    {
      id: 1,
      title: 'Algebra Formula Sheet',
      description: 'Comprehensive list of algebra formulas for quick reference.',
      type: 'document',
      downloads: 1250,
      fileSize: '420 KB',
      dateAdded: '2023-09-15',
    },
    {
      id: 2,
      title: 'Geometry Theorems Cheat Sheet',
      description: 'Visual guide to essential geometry theorems and properties.',
      type: 'document',
      downloads: 980,
      fileSize: '650 KB',
      dateAdded: '2023-10-02',
    },
    {
      id: 3,
      title: 'Calculus Derivatives Calculator',
      description: 'Interactive calculator for finding derivatives with step-by-step solutions.',
      type: 'tool',
      downloads: 3200,
      fileSize: null,
      dateAdded: '2023-08-22',
    },
    {
      id: 4,
      title: 'Statistics Probability Distributions',
      description: 'Interactive visualizations of common probability distributions.',
      type: 'tool',
      downloads: 1540,
      fileSize: null,
      dateAdded: '2023-11-05',
    },
    {
      id: 5,
      title: 'Understanding Complex Numbers',
      description: 'Video tutorial explaining complex numbers and their applications.',
      type: 'video',
      downloads: 2800,
      fileSize: '120 MB',
      dateAdded: '2023-07-18',
    },
    {
      id: 6,
      title: 'Trigonometry Practice Worksheet',
      description: 'Printable worksheet with trigonometry problems and solutions.',
      type: 'document',
      downloads: 1750,
      fileSize: '380 KB',
      dateAdded: '2023-09-28',
    },
  ];

  // Filter resources based on search query and selected type
  const filteredResources = resources.filter(
    resource =>
      (resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedType === 'all' || resource.type === selectedType)
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'tool':
        return <Calculator className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <Book className="w-5 h-5" />;
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Learning Resources
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Access a wide range of mathematics resources including formula sheets, calculators, worksheets, and tutorial videos.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="document">Documents</option>
                <option value="tool">Tools</option>
                <option value="video">Videos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Popular Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Download className="mr-2 h-6 w-6 text-primary-600 dark:text-primary-400" />
            Popular Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 3)
              .map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  icon={getTypeIcon(resource.type)} 
                />
              ))}
          </div>
        </div>

        {/* All Resources */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Book className="mr-2 h-6 w-6 text-primary-600 dark:text-primary-400" />
          All Resources
        </h2>
        
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                icon={getTypeIcon(resource.type)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
              No resources found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;