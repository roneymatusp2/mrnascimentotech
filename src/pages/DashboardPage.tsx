import { useState } from 'react';
import { 
  BarChart2, 
  PieChart, 
  Clock, 
  Award, 
  TrendingUp, 
  ChevronRight, 
  BookOpen, 
  CheckCircle,
  Calendar
} from 'lucide-react';
import ProgressChart from '../components/dashboard/ProgressChart';
import TopicProgressBar from '../components/dashboard/TopicProgressBar';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState<string>('week');
  
  const topics = [
    { name: 'Algebra', progress: 65 },
    { name: 'Geometry', progress: 80 },
    { name: 'Calculus', progress: 45 },
    { name: 'Statistics', progress: 70 },
    { name: 'Trigonometry', progress: 55 },
  ];
  
  const recentActivities = [
    { 
      title: 'Completed Linear Equations Practice', 
      time: '2 hours ago', 
      score: '85%',
      icon: <CheckCircle className="text-green-500" />
    },
    { 
      title: 'Watched Triangle Congruence Video', 
      time: 'Yesterday', 
      duration: '15 min',
      icon: <BookOpen className="text-blue-500" />
    },
    { 
      title: 'Started Calculus Topic', 
      time: '3 days ago', 
      progress: '25%',
      icon: <TrendingUp className="text-purple-500" />
    },
  ];
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Your Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your progress and continue your learning journey
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">Last active: Today, 10:45 AM</span>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Total Study Time', 
              value: '32h 45m', 
              change: '+2h 30m', 
              isPositive: true,
              icon: <Clock className="w-6 h-6 text-blue-500" />,
              color: 'bg-blue-50 dark:bg-blue-900/20'
            },
            { 
              title: 'Topics Mastered', 
              value: '8', 
              change: '+2', 
              isPositive: true,
              icon: <Award className="w-6 h-6 text-amber-500" />,
              color: 'bg-amber-50 dark:bg-amber-900/20'
            },
            { 
              title: 'Practice Problems', 
              value: '145', 
              change: '+12', 
              isPositive: true,
              icon: <BookOpen className="w-6 h-6 text-green-500" />,
              color: 'bg-green-50 dark:bg-green-900/20'
            },
            { 
              title: 'Overall Progress', 
              value: '62%', 
              change: '+5%', 
              isPositive: true,
              icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
              color: 'bg-purple-50 dark:bg-purple-900/20'
            },
          ].map((stat, index) => (
            <div 
              key={index}
              className={`${stat.color} rounded-xl p-6 border border-slate-100 dark:border-slate-800`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </h3>
                </div>
                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm">
                  {stat.icon}
                </div>
              </div>
              <div className={`mt-2 text-sm ${stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change} this week
              </div>
            </div>
          ))}
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Progress Over Time Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Progress Over Time
              </h2>
              <div className="flex space-x-2">
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      timeRange === range
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ProgressChart timeRange={timeRange} />
            </div>
          </div>
          
          {/* Topic Progress */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-6">
              <PieChart className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Topic Progress
            </h2>
            <div className="space-y-6">
              {topics.map((topic, index) => (
                <TopicProgressBar key={index} topic={topic} />
              ))}
            </div>
            <a
              href="#view-all-topics"
              className="mt-6 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center justify-center"
            >
              <span>View All Topics</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-6">
              <Clock className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <RecentActivityCard key={index} activity={activity} />
              ))}
            </div>
            <a
              href="#view-all-activity"
              className="mt-6 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center justify-center"
            >
              <span>View All Activity</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          {/* Recommended Next Steps */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-6">
              <Award className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Recommended Next Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Complete Quadratic Equations',
                  description: 'You\'re 75% through this topic. Finish the remaining lessons to master it.',
                  icon: <BookOpen className="w-10 h-10 text-blue-500" />,
                  action: 'Continue',
                  color: 'bg-blue-50 dark:bg-blue-900/20',
                },
                {
                  title: 'Practice Geometry Problems',
                  description: 'Strengthen your understanding with these practice problems.',
                  icon: <CheckCircle className="w-10 h-10 text-green-500" />,
                  action: 'Start Practice',
                  color: 'bg-green-50 dark:bg-green-900/20',
                },
                {
                  title: 'Take Calculus Assessment',
                  description: 'Test your knowledge and identify areas for improvement.',
                  icon: <BarChart2 className="w-10 h-10 text-purple-500" />,
                  action: 'Take Test',
                  color: 'bg-purple-50 dark:bg-purple-900/20',
                },
                {
                  title: 'Explore Statistics Topic',
                  description: 'Based on your interests, you might enjoy this topic.',
                  icon: <PieChart className="w-10 h-10 text-amber-500" />,
                  action: 'Explore',
                  color: 'bg-amber-50 dark:bg-amber-900/20',
                },
              ].map((recommendation, index) => (
                <div 
                  key={index}
                  className={`${recommendation.color} rounded-xl p-4 flex items-start space-x-4 border border-slate-100 dark:border-slate-800`}
                >
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm">
                    {recommendation.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {recommendation.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {recommendation.description}
                    </p>
                    <a
                      href={`#${recommendation.action.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {recommendation.action}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;