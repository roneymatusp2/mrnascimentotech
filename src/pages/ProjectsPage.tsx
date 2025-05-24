import { useState, useEffect, useRef } from 'react';
import { Search, ExternalLink, BookOpen, Compass, BookMarked, Lightbulb, Code, Brain, Sparkles, Zap } from 'lucide-react';

// Project interface
interface Project {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  image?: string;
  featured?: boolean;
}

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});
  const elementsRef = useRef<{[key: string]: HTMLElement | null}>({});

  // Project categories with icons
  const categories = [
    { id: 'all', name: 'All Projects', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'year-revision', name: 'Year Revision', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'ib-resources', name: 'IB Resources', icon: <Compass className="w-5 h-5" /> },
    { id: 'interactive-tools', name: 'Interactive Tools', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'subject-resources', name: 'Subject Resources', icon: <BookMarked className="w-5 h-5" /> },
  ];

  // Tech icons for category badges
  const getTechIcon = (category: string) => {
    switch(category) {
      case 'year-revision': return <BookOpen className="w-5 h-5" />;
      case 'ib-resources': return <Brain className="w-5 h-5" />;
      case 'interactive-tools': return <Code className="w-5 h-5" />;
      case 'subject-resources': return <Zap className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  // Projects data with images
  const projects: Project[] = [
    {
      id: 1,
      title: 'Form 3 End-of-Year Revision',
      description: 'A comprehensive revision platform for Form 3 students preparing for end-of-year examinations. Includes practice questions, interactive quizzes, and detailed explanations across all key topics.',
      url: 'https://form3eoyrevision.netlify.app/',
      category: 'year-revision',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop',
      tags: ['revision', 'form 3', 'examination prep'],
      featured: true
    },
    {
      id: 2,
      title: 'Form 4 End-of-Year Revision',
      description: 'Structured revision materials for Form 4 students with progressive difficulty levels, tailored feedback, and performance tracking to maximize exam preparation.',
      url: 'https://form4eoyrevision.netlify.app/',
      category: 'year-revision',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
      tags: ['revision', 'form 4', 'examination prep'],
      featured: true
    },
    {
      id: 3,
      title: 'Lower 6 AI Standard Level Hub',
      description: 'A specialized resource hub for Lower 6 students studying AI at the standard level, featuring interactive simulations, case studies, and concept explanations.',
      url: 'https://lower6aisl.netlify.app/',
      category: 'ib-resources',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      tags: ['IB', 'artificial intelligence', 'standard level'],
      featured: true
    },
    {
      id: 4,
      title: 'IB Maths Choice Guidance Tool',
      description: 'An interactive decision-making tool that helps students and advisors select the most appropriate IB Mathematics course based on career aspirations, interests, and aptitude.',
      url: 'https://ibmathschoice.com/',
      category: 'interactive-tools',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
      tags: ['IB', 'mathematics', 'course selection'],
      featured: true
    },
    {
      id: 5,
      title: 'History Blockbuster Resources',
      description: 'Comprehensive history teaching and learning resources featuring interactive timelines, primary source analysis tools, and thematic exploration modules.',
      url: 'https://historyblockbuster.netlify.app/',
      category: 'subject-resources',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop',
      tags: ['history', 'primary sources', 'timelines']
    },
    {
      id: 6,
      title: 'Chemistry Blockbuster Resources',
      description: 'Visual and interactive chemistry resources with 3D molecular visualization, virtual lab experiments, and step-by-step problem-solving guidance.',
      url: 'https://chemistryblockbusters.netlify.app/',
      category: 'subject-resources',
      image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=2070&auto=format&fit=crop',
      tags: ['chemistry', 'laboratory', 'molecules']
    },
    {
      id: 7,
      title: 'Voronoi Diagram Visualiser',
      description: 'An interactive mathematical tool for exploring Voronoi diagrams and their applications in computational geometry, with customizable parameters and real-time visualization.',
      url: 'https://voronoidiagram.netlify.app/',
      category: 'interactive-tools',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop',
      tags: ['geometry', 'visualization', 'computational mathematics']
    },
    {
      id: 8,
      title: 'Maths Timer for Practice',
      description: 'A specialized timing tool for mathematics practice that adaptively adjusts to student performance, providing optimal pacing for different problem types.',
      url: 'https://mathstimer.netlify.app/',
      category: 'interactive-tools',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1974&auto=format&fit=crop',
      tags: ['practice', 'timing', 'performance']
    },
    {
      id: 9,
      title: 'Magic Triangles Game',
      description: 'An educational game that reinforces understanding of triangular properties through puzzle-based challenges that progressively increase in difficulty.',
      url: 'https://magictriangles.netlify.app/',
      category: 'interactive-tools',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop',
      tags: ['game', 'triangles', 'puzzle']
    },
    {
      id: 10,
      title: 'Science IB Advisor',
      description: 'An AI-powered guidance system that provides personalized recommendations for IB Science students, suggesting resources and study approaches based on individual learning patterns.',
      url: 'https://scienceibadvisor.netlify.app/',
      category: 'ib-resources',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop',
      tags: ['IB', 'science', 'AI advisor']
    },
    {
      id: 11,
      title: 'IB Maths Pro Preparation Platform',
      description: 'A comprehensive platform for IB Mathematics that includes custom learning paths, detailed explanations, practice problems with worked solutions, and performance analytics.',
      url: 'https://ibmathspro.netlify.app/',
      category: 'ib-resources',
      image: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?q=80&w=2070&auto=format&fit=crop',
      tags: ['IB', 'mathematics', 'preparation']
    },
    {
      id: 12,
      title: 'Algebraticamente',
      description: 'Advanced AI-powered mathematics platform built with React and Supabase, featuring intelligent tutoring systems, personalized learning paths, and comprehensive analytics for Brazilian students.',
      url: 'https://algebraticamente.com.br/',
      category: 'interactive-tools',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop',
      tags: ['AI', 'mathematics', 'Brazilian curriculum', 'tutoring']
    }
  ];

  // Filter projects based on search query and selected category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      
      for (let i = 0; i < reveals.length; i++) {
        const revealElement = reveals[i] as HTMLElement;
        const elementTop = revealElement.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          revealElement.classList.add('active');
        }
      }
      
      // Check visibility of tracked elements
      Object.keys(elementsRef.current).forEach(key => {
        const element = elementsRef.current[key];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
            setIsVisible(prev => ({...prev, [key]: true}));
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Register ref for scroll animation
  const registerRef = (id: string, element: HTMLElement | null) => {
    elementsRef.current[id] = element;
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 reveal">
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            DIGITAL EDUCATIONAL TOOLS
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Educational Projects Showcase
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore my collection of innovative educational tools, interactive platforms, and curriculum resources designed for students and teachers.
          </p>
        </div>

        {/* Filters with Animation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-12 reveal">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white shadow-md shadow-primary-500/20'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid with Animation */}
        <div ref={el => registerRef('projectsGrid', el)}>
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative transform transition-all duration-500 hover:-translate-y-2 block ${isVisible['projectsGrid'] ? `animate-scaleUp delay-${(index % 6) * 100}` : 'opacity-0'}`}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer">
                    {project.image && (
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1.5 bg-slate-900/70 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                            {getTechIcon(project.category)}
                            <span>{categories.find(c => c.id === project.category)?.name || 'Project'}</span>
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex} 
                            className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto text-primary-600 group-hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                        <span>Visit Project</span>
                        <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm reveal">
              <div className="mb-6 animate-bounce-slow">
                <Search className="w-16 h-16 mx-auto text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                No projects found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Technology Mosaic Background */}
        <div className="mt-20 relative py-16 rounded-2xl overflow-hidden reveal">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-primary-900 opacity-90"></div>
          <div className="absolute inset-0">
            <div className="grid grid-cols-8 grid-rows-2 gap-1 h-full opacity-10">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="bg-white"></div>
              ))}
            </div>
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6 animate-slideIn">Leveraging Technology for Better Education</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8 animate-slideIn delay-200">
              My projects combine pedagogical expertise with technological innovation to create powerful educational tools that enhance learning outcomes.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              {["AI Integration", "Data Visualization", "Interactive Learning", "Real-time Feedback", "Personalization"].map((tech, i) => (
                <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white animate-scaleUp" style={{animationDelay: `${i * 100}ms`}}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;