import { useState } from 'react';
import { Search, Filter, Clock, BarChart, BookOpen, Star } from 'lucide-react';
import ProblemCard from '../components/practice/ProblemCard';

const PracticePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const problemSets = [
    {
      id: 1,
      title: 'Linear Equations',
      topic: 'algebra',
      difficulty: 'easy',
      problems: 10,
      timeEstimate: '20 min',
      completionRate: 75,
    },
    {
      id: 2,
      title: 'Quadratic Equations',
      topic: 'algebra',
      difficulty: 'medium',
      problems: 8,
      timeEstimate: '25 min',
      completionRate: 65,
    },
    {
      id: 3,
      title: 'Triangle Congruence',
      topic: 'geometry',
      difficulty: 'medium',
      problems: 12,
      timeEstimate: '30 min',
      completionRate: 50,
    },
    {
      id: 4,
      title: 'Derivatives',
      topic: 'calculus',
      difficulty: 'hard',
      problems: 6,
      timeEstimate: '40 min',
      completionRate: 30,
    },
    {
      id: 5,
      title: 'Probability',
      topic: 'statistics',
      difficulty: 'medium',
      problems: 15,
      timeEstimate: '35 min',
      completionRate: 45,
    },
    {
      id: 6,
      title: 'Trigonometric Identities',
      topic: 'trigonometry',
      difficulty: 'hard',
      problems: 10,
      timeEstimate: '45 min',
      completionRate: 25,
    },
  ];

  // Filter problems based on search query, difficulty, and topic
  const filteredProblems = problemSets.filter(
    problem =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty) &&
      (selectedTopic === 'all' || problem.topic === selectedTopic)
  );

  const topics = [...new Set(problemSets.map(problem => problem.topic))];

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Practice Problems
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Strengthen your skills with our diverse collection of practice problems, complete with step-by-step solutions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search practice sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Topics</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Star className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Star className="mr-2 h-6 w-6 text-amber-500" />
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemSets.slice(0, 3).map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        </div>

        {/* All Practice Sets */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Filter className="mr-2 h-6 w-6 text-primary-600 dark:text-primary-400" />
          All Practice Sets
        </h2>
        
        {filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
              No practice sets found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
                setSelectedTopic('all');
              }}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
        
        {/* Recently Completed */}
        <div className="mt-12 bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
            Recently Completed
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Practice Set</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time Spent</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {[
                  { title: 'Basic Arithmetic', score: '95%', time: '15 min', date: '2 days ago' },
                  { title: 'Fractions', score: '88%', time: '22 min', date: '5 days ago' },
                  { title: 'Decimals', score: '92%', time: '18 min', date: '1 week ago' },
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{item.score}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{item.time}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;