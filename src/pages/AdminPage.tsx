import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Brain, 
  Eye, 
  BarChart, 
  LogOut,
  UserCircle,
  ChevronRight
} from 'lucide-react';
import QuestionGenerator from '../components/admin/QuestionGenerator';
import QuestionReviewList from '../components/admin/QuestionReviewList';

const AdminPage = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalQuestions: 0,
    aiGeneratedQuestions: 0,
    pendingReview: 0,
    totalUsers: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Check if user is logged in and has admin role
    const checkAuth = async () => {
      setLoading(true);
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      // Fetch user profile to check role
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error || !data || (data.role !== 'admin' && data.role !== 'teacher')) {
        console.error('Access denied:', error || 'Not an admin');
        navigate('/');
        return;
      }
      
      setProfile(data);
      setLoading(false);
      
      // Fetch stats
      fetchStats();
    };
    
    checkAuth();
  }, [user, supabase, navigate]);
  
  const fetchStats = async () => {
    try {
      // Fetch question stats
      const { data: questionStats, error: questionError } = await supabase.rpc('get_question_stats');
      
      if (questionError) throw questionError;
      
      // Fetch user stats
      const { data: userStats, error: userError } = await supabase.rpc('get_user_stats');
      
      if (userError) throw userError;
      
      // If RPC functions don't exist, do direct counts
      if (!questionStats) {
        const [
          { count: totalQuestions },
          { count: aiGeneratedQuestions },
          { count: pendingReview },
          { count: totalUsers },
          { count: activeUsers }
        ] = await Promise.all([
          supabase.from('questions').select('*', { count: 'exact', head: true }),
          supabase.from('questions').select('*', { count: 'exact', head: true }).eq('generated_by_ai', true),
          supabase.from('questions').select('*', { count: 'exact', head: true }).eq('generated_by_ai', true).eq('reviewed', false),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true })
            .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        ]);
        
        setStats({
          totalQuestions,
          aiGeneratedQuestions,
          pendingReview,
          totalUsers,
          activeUsers
        });
      } else {
        setStats({
          ...questionStats,
          ...userStats
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="pt-24 pb-16 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'generate', label: 'Generate Questions', icon: <Brain className="w-5 h-5" /> },
    { id: 'review', label: 'Review Questions', icon: <Eye className="w-5 h-5" /> },
    { id: 'students', label: 'Student Progress', icon: <BarChart className="w-5 h-5" /> },
    { id: 'users', label: 'Manage Users', icon: <Users className="w-5 h-5" /> },
    { id: 'content', label: 'Content Library', icon: <FileText className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              {/* Admin profile */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-full p-2">
                    <UserCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {profile?.full_name || user?.email}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                      {profile?.role || 'Admin'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="p-2">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className={activeTab === item.id ? 'text-primary-600 dark:text-primary-400' : ''}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Admin Dashboard
                </h1>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Questions</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalQuestions}</h3>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">AI Generated</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.aiGeneratedQuestions}</h3>
                      </div>
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                        <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Review</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.pendingReview}</h3>
                      </div>
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                        <Eye className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalUsers}</h3>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                        <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick actions */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { 
                        title: 'Generate Questions', 
                        description: 'Create new math questions using Mistral AI',
                        icon: <Brain className="w-8 h-8 text-purple-600" />,
                        action: () => setActiveTab('generate')
                      },
                      { 
                        title: 'Review Questions', 
                        description: `${stats.pendingReview} questions awaiting review`,
                        icon: <Eye className="w-8 h-8 text-amber-600" />,
                        action: () => setActiveTab('review')
                      },
                      { 
                        title: 'View Student Progress', 
                        description: 'Monitor student performance and activity',
                        icon: <BarChart className="w-8 h-8 text-blue-600" />,
                        action: () => setActiveTab('students')
                      }
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className="bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg p-4 text-left transition-colors"
                      >
                        <div className="mb-3">{item.icon}</div>
                        <h3 className="font-medium text-slate-900 dark:text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Recent activity */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Recent Activity
                    </h2>
                    <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { action: 'Generated 10 Algebra questions', time: '2 hours ago', icon: <Brain className="text-purple-500" /> },
                      { action: 'Approved 5 questions', time: '3 hours ago', icon: <Check className="text-green-500" /> },
                      { action: 'New student registered', time: '5 hours ago', icon: <Users className="text-blue-500" /> },
                      { action: 'Updated Geometry content', time: '1 day ago', icon: <FileText className="text-amber-500" /> },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg">
                        <div className="mt-0.5">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{item.action}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'generate' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Generate Questions
                </h1>
                <QuestionGenerator />
              </div>
            )}
            
            {activeTab === 'review' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Review Questions
                </h1>
                <QuestionReviewList />
              </div>
            )}
            
            {activeTab === 'students' && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Student Progress
                </h1>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                  <p className="text-slate-600 dark:text-slate-400">
                    View detailed analytics on student performance and progress.
                  </p>
                  
                  {/* Placeholder for student analytics */}
                  <div className="mt-8 text-center py-12 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <BarChart className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Student analytics will be displayed here
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Placeholder for other tabs */}
            {(activeTab === 'users' || activeTab === 'content' || activeTab === 'settings') && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  {navItems.find(item => item.id === activeTab)?.label}
                </h1>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                  <p className="text-slate-600 dark:text-slate-400">
                    This section is under development.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;