import { useState } from 'react';
import { Search, Book, Check } from 'lucide-react';
import TopicCard from '../components/topics/TopicCard';

const TopicsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  
  const topicCategories = [
    {
      category: 'Algebra',
      topics: [
        { title: 'Linear Equations', level: 'beginner', progress: 85 },
        { title: 'Quadratic Functions', level: 'intermediate', progress: 60 },
        { title: 'Systems of Equations', level: 'intermediate', progress: 40 },
        { title: 'Polynomials', level: 'advanced', progress: 20 },
      ],
    },
    {
      category: 'Geometry',
      topics: [
        { title: 'Angles and Lines', level: 'beginner', progress: 75 },
        { title: 'Triangles', level: 'beginner', progress: 90 },
        { title: 'Circle Theorems', level: 'intermediate', progress: 50 },
        { title: 'Coordinate Geometry', level: 'advanced', progress: 30 },
      ],
    },
    {
      category: 'Calculus',
      topics: [
        { title: 'Limits', level: 'intermediate', progress: 65 },
        { title: 'Derivatives', level: 'intermediate', progress: 55 },
        { title: 'Integrals', level: 'advanced', progress: 25 },
        { title: 'Applications of Calculus', level: 'advanced', progress: 10 },
      ],
    },
    {
      category: 'Statistics',
      topics: [
        { title: 'Data Analysis', level: 'beginner', progress: 80 },
        { title: 'Probability', level: 'intermediate', progress: 45 },
        { title: 'Normal Distribution', level: 'intermediate', progress: 35 },
        { title: 'Hypothesis Testing', level: 'advanced', progress: 15 },
      ],
    },
  ];

  // Filter topics based on search query and selected level
  const filteredTopics = topicCategories
    .map(category => ({
      category: category.category,
      topics: category.topics.filter(
        topic => 
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          (selectedLevel === 'all' || topic.level === selectedLevel)
      )
    }))
    .filter(category => category.topics.length > 0);

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Mathematics Topics
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore our comprehensive collection of mathematics topics, from beginner concepts to advanced theories.
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
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Topics List */}
        {filteredTopics.length > 0 ? (
          filteredTopics.map((category, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <Book className="mr-2 h-6 w-6 text-primary-600 dark:text-primary-400" />
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.topics.map((topic, i) => (
                  <TopicCard key={i} {...topic} category={category.category} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
              No topics found matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('all');
              }}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Completed Topics */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mt-8">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-500" />
            Your Completed Topics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Basic Arithmetic', category: 'Numbers' },
              { title: 'Fractions', category: 'Numbers' },
              { title: 'Decimals', category: 'Numbers' },
            ].map((topic, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-lg p-4 border-l-4 border-green-500"
              >
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {topic.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {topic.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;