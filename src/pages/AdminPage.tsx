import { useNavigate } from 'react-router-dom';
import { 
  Lock,
  ShieldAlert
} from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();


  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
              <ShieldAlert className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Admin Access Required
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Authentication is currently disabled. Admin features are not available at this time.
            </p>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    Admin features require authentication, which includes:
                  </p>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                    <li>User management</li>
                    <li>Content administration</li>
                    <li>Question generation and review</li>
                    <li>Analytics and reporting</li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;