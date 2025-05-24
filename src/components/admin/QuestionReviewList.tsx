import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Check, X, Eye, Search, Filter, RefreshCw } from 'lucide-react';

interface Question {
  id: string;
  statement_md: string;
  options: string[];
  correct_option: number;
  solution_md: string;
  academic_level: string;
  topic_name: string;
  cognitive_level: string;
  reviewed: boolean;
  created_at: string;
}

const QuestionReviewList = () => {
  const supabase = useSupabaseClient();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [reviewStatus, setReviewStatus] = useState<string>('pending');
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const questionsPerPage = 10;

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('v_ai_generated_questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (reviewStatus !== 'all') {
        query = query.eq('reviewed', reviewStatus === 'reviewed');
      }
      
      if (selectedLevel !== 'all') {
        query = query.eq('academic_level', selectedLevel);
      }
      
      if (searchQuery) {
        query = query.or(`statement_md.ilike.%${searchQuery}%,topic_name.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setQuestions(data || []);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedLevel, reviewStatus]);

  const approveQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ 
          reviewed: true,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setQuestions(questions.map(q => 
        q.id === id ? { ...q, reviewed: true } : q
      ));
    } catch (error) {
      console.error('Error approving question:', error);
    }
  };

  const rejectQuestion = async (id: string) => {
    try {
      // Instead of deleting, we could flag it
      const { error } = await supabase
        .from('questions')
        .update({ 
          flagged: true,
          reviewed: true,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from the list
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error rejecting question:', error);
    }
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format options for display
  const formatOptions = (options: string[], correctOption: number) => {
    return options.map((option, index) => (
      <div key={index} className={`${index === correctOption ? 'font-bold text-green-600 dark:text-green-400' : ''}`}>
        {String.fromCharCode(65 + index)}. {option}
      </div>
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
        <Eye className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
        AI-Generated Question Review
      </h2>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchQuestions()}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="block w-full pl-3 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Levels</option>
            <option value="KS3">KS3</option>
            <option value="pre-IGCSE">pre-IGCSE</option>
            <option value="IGCSE">IGCSE</option>
          </select>
          
          <select
            value={reviewStatus}
            onChange={(e) => setReviewStatus(e.target.value)}
            className="block w-full pl-3 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="pending">Pending Review</option>
            <option value="reviewed">Reviewed</option>
            <option value="all">All Questions</option>
          </select>
          
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 rounded-md flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Questions list */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : currentQuestions.length > 0 ? (
        <div className="space-y-6">
          {currentQuestions.map((question) => (
            <div key={question.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {question.academic_level}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      {question.topic_name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300 capitalize">
                      {question.cognitive_level}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Created: {new Date(question.created_at).toLocaleString()}
                  </div>
                </div>
                {!question.reviewed && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => approveQuestion(question.id)}
                      className="p-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-600 dark:text-green-400 rounded-md"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => rejectQuestion(question.id)}
                      className="p-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 rounded-md"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div 
                className="text-slate-900 dark:text-white mb-3" 
                dangerouslySetInnerHTML={{ __html: question.statement_md.replace(/\n/g, '<br>') }}
              />
              
              <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {formatOptions(question.options, question.correct_option)}
              </div>
              
              <button
                onClick={() => setPreviewQuestion(question)}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                View Full Question & Solution
              </button>
            </div>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2" aria-label="Pagination">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => (
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ))
                  .map((page, i, arr) => (
                    <div key={page}>
                      {i > 0 && arr[i - 1] !== page - 1 && (
                        <span className="text-slate-500 dark:text-slate-400">...</span>
                      )}
                      <button
                        onClick={() => paginate(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          No questions found matching your criteria.
        </div>
      )}
      
      {/* Question preview modal */}
      {previewQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Question Details</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Question:</h4>
                <div 
                  className="text-slate-900 dark:text-white" 
                  dangerouslySetInnerHTML={{ __html: previewQuestion.statement_md.replace(/\n/g, '<br>') }}
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Options:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formatOptions(previewQuestion.options, previewQuestion.correct_option)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Solution:</h4>
                <div 
                  className="text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700/50 p-3 rounded-md" 
                  dangerouslySetInnerHTML={{ __html: previewQuestion.solution_md.replace(/\n/g, '<br>') }}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {previewQuestion.academic_level}
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                  {previewQuestion.topic_name}
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300 capitalize">
                  {previewQuestion.cognitive_level}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              {!previewQuestion.reviewed && (
                <>
                  <button
                    onClick={() => {
                      approveQuestion(previewQuestion.id);
                      setPreviewQuestion(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      rejectQuestion(previewQuestion.id);
                      setPreviewQuestion(null);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setPreviewQuestion(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionReviewList;