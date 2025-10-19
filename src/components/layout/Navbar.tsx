import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Book, FolderOpen, Home, Mail, Moon, Sun, LogIn, Sparkles, Award } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/projects', label: 'Projects', icon: <Book className="w-5 h-5" /> },
    { path: '/resources', label: 'Resources', icon: <FolderOpen className="w-5 h-5" /> },
    { path: '/certifications', label: 'Certifications', icon: <Award className="w-5 h-5" />, special: true },
    { path: '/contact', label: 'Contact', icon: <Mail className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 text-primary-600 dark:text-primary-400"
          >
            <div className="relative group">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-600 to-blue-600 opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-slate-800">
                <Book className="w-6 h-6 text-primary-600 dark:text-primary-400 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">Mr. Nascimento</span>
              <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                <Sparkles className="w-3 h-3 mr-1" />
                <span>Educational Tools</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center space-x-1 font-medium transition-all duration-300 group ${
                    link.special 
                      ? 'relative overflow-hidden'
                      : ''
                  } ${
                    isActive(link.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {link.special && (
                    <>
                      {/* AI Animated Background */}
                      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm animate-pulse"></div>
                      
                      {/* AI Particles */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                        <div className="absolute top-1 right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                        <div className="absolute bottom-0 left-3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        <div className="absolute bottom-1 right-0 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                      </div>
                      
                      {/* Neural Network Lines */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                        <svg className="w-full h-full" viewBox="0 0 100 40">
                          <path 
                            d="M10,20 Q30,10 50,20 Q70,30 90,20" 
                            stroke="url(#aiGradient)" 
                            strokeWidth="0.5" 
                            fill="none"
                            className="animate-pulse"
                          />
                          <defs>
                            <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#22d3ee" />
                              <stop offset="50%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </>
                  )}
                  
                  <div className={`relative z-10 flex items-center space-x-1 ${
                    link.special 
                      ? 'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-purple-600 transition-all duration-500' 
                      : ''
                  }`}>
                    <div className={link.special ? 'group-hover:animate-bounce' : ''}>
                      {link.icon}
                    </div>
                    <span className={link.special ? 'group-hover:font-bold transition-all duration-300' : ''}>
                      {link.label}
                    </span>
                  </div>
                  
                  {isActive(link.path) && (
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 mt-0.5 ${
                      link.special 
                        ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse'
                        : 'bg-primary-600 dark:bg-primary-400'
                    }`}></span>
                  )}
                </Link>
              ))}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200 bg-slate-100 dark:bg-slate-800"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            
            <Link
              to="/login"
              className="flex items-center space-x-2 font-medium bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-900 dark:text-white relative z-20"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation with Animation */}
        <div className={`fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 transform transition-all duration-300 md:hidden ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col space-y-6">
              {navLinks.map((link, i) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 text-lg group ${
                      isActive(link.path)
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    } ${link.special ? 'overflow-hidden' : ''}`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    {link.special && (
                      <>
                        {/* Mobile AI Background */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm"></div>
                        
                        {/* Mobile AI Particles */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                          <div className="absolute top-2 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                          <div className="absolute top-4 right-6 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                          <div className="absolute bottom-3 left-8 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                          <div className="absolute bottom-2 right-4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                        </div>
                      </>
                    )}
                    
                    <div className={`relative z-10 ${link.special ? 'group-hover:animate-pulse' : ''}`}>
                      {link.icon}
                    </div>
                    <span className={`relative z-10 ${
                      link.special 
                        ? 'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-purple-600 group-hover:font-bold transition-all duration-500' 
                        : ''
                    }`}>
                      {link.label}
                    </span>
                  </Link>
                ))}
              
              <Link
                to="/login"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-lg transition-all duration-300 text-lg"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;