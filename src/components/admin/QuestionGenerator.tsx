import { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Loader2, BookOpen, GraduationCap, Brain, Plus, RefreshCw } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  level: string;
  parent_id: string | null;
}

interface Level {
  id: string;
  name: string;
  description: string;
}

const cognitivelevels = [
  { value: 'knowledge', label: 'Knowledge - Recall facts and basic concepts' },
  { value: 'comprehension', label: 'Comprehension - Understand ideas and concepts' },
  { value: 'application', label: 'Application - Apply knowledge in new situations' },
  { value: 'analysis', label: 'Analysis - Draw connections among ideas' }
];

const QuestionGenerator = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedCognitiveLevel, setSelectedCognitiveLevel] = useState<string>('application');
  const [quantity, setQuantity] = useState<number>(5);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [useCustomPrompt, setUseCustomPrompt] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; jobId?: string }>({});
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  // Fetch topics and levels on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch topics
        const { data: topicsData, error: topicsError } = await supabase
          .from('question_topics')
          .select('*')
          .order('name');
          
        if (topicsError) throw topicsError;
        setTopics(topicsData || []);
        
        // Fetch levels
        const { data: levelsData, error: levelsError } = await supabase
          .from('question_levels')
          .select('*')
          .order('name');
          
        if (levelsError) throw levelsError;
        setLevels(levelsData || []);
        
        // Fetch recent jobs
        fetchRecentJobs();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [supabase]);
  
  // Fetch recent jobs
  const fetchRecentJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_generation_jobs')
        .select(`
          id, 
          status, 
          created_at, 
          completed_at, 
          questions_generated,
          question_topics(name),
          question_levels(name),
          cognitive_level
        `)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      setRecentJobs(data || []);
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
    }
  };

  // Generate questions
  const generateQuestions = async () => {
    if (!selectedTopic || !selectedLevel) {
      setResult({ success: false, message: 'Please select a topic and level' });
      return;
    }
    
    try {
      setLoading(true);
      setResult({});
      
      // Create a new generation job
      const { data: job, error: jobError } = await supabase
        .from('ai_generation_jobs')
        .insert({
          topic_id: selectedTopic,
          level_id: selectedLevel,
          cognitive_level: selectedCognitiveLevel,
          quantity: quantity,
          prompt: useCustomPrompt ? customPrompt : '',
          created_by: user?.id
        })
        .select()
        .single();
        
      if (jobError) throw jobError;
      
      // Trigger the edge function to process the job
      const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-questions', {
        body: { jobId: job.id }
      });
      
      if (functionError) throw functionError;
      
      // Refresh the jobs list
      fetchRecentJobs();
      
      setResult({ 
        success: true, 
        message: `Successfully generated ${functionData.questionsGenerated || 0} questions!`,
        jobId: job.id
      });
    } catch (error: any) {
      console.error('Error generating questions:', error);
      setResult({ success: false, message: error.message || 'Failed to generate questions' });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get job status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
        <Brain className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
        Generate Math Questions with AI
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
            <GraduationCap className="w-4 h-4 mr-1" />
            Academic Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a level</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name} - {level.description}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
            <Brain className="w-4 h-4 mr-1" />
            Cognitive Level
          </label>
          <select
            value={selectedCognitiveLevel}
            onChange={(e) => setSelectedCognitiveLevel(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            {cognitivelevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
            <Plus className="w-4 h-4 mr-1" />
            Number of Questions
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="useCustomPrompt"
            checked={useCustomPrompt}
            onChange={(e) => setUseCustomPrompt(e.target.checked)}
            className="mr-2 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="useCustomPrompt" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Use custom prompt
          </label>
        </div>
        
        {useCustomPrompt && (
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter a custom prompt for the AI..."
            rows={4}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        )}
      </div>
      
      <div className="flex justify-end mb-6">
        <button
          onClick={generateQuestions}
          disabled={loading || !selectedTopic || !selectedLevel}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Generate Questions
            </>
          )}
        </button>
      </div>
      
      {result.message && (
        <div className={`p-4 mb-6 rounded-md ${result.success ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {result.message}
        </div>
      )}
      
      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Recent Generation Jobs</h3>
          <button 
            onClick={fetchRecentJobs}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topic</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cognitive</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Generated</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{job.question_topics?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{job.question_levels?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white capitalize">{job.cognitive_level}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{job.questions_generated || 0}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(job.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-sm text-center text-slate-500 dark:text-slate-400">
                    No recent jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator;