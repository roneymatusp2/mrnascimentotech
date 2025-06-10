import { ArrowRight, ExternalLink, BookOpen, Compass, BookMarked, Lightbulb, GraduationCap, Brain, Code, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

// Educational project interface
interface EducationalProject {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  image?: string;
  featured?: boolean;
}

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});
  const elementsRef = useRef<{[key: string]: HTMLElement | null}>({});
  
  const images = [
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop', // Modern classroom with technology
    'https://images.unsplash.com/photo-1596496050755-c923e73e42e1?q=80&w=2070&auto=format&fit=crop', // Students studying mathematics
    'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&auto=format&fit=crop'  // Digital learning environment
  ];
  
  const techImages = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', // Data visualization dashboard
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop', // Mathematical visualization
    'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=2070&auto=format&fit=crop'  // AI and education technology
  ];

  // Project categories
  const categories = [
    { name: 'Year Revision', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' },
    { name: 'IB Resources', icon: <Compass className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' },
    { name: 'Interactive Tools', icon: <Lightbulb className="w-6 h-6" />, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400' },
    { name: 'Subject Resources', icon: <BookMarked className="w-6 h-6" />, color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
  ];

  // Educational projects data
  const projects: EducationalProject[] = [
    {
      id: 1,
      title: 'Form 3 End-of-Year Revision',
      description: 'Comprehensive revision platform with tailored materials supporting Form 3 students in their end-of-year exam preparation.',
      url: 'https://form3eoyrevision.netlify.app/',
      category: 'Year Revision',
      featured: true,
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Form 4 End-of-Year Revision',
      description: 'Advanced revision platform for Form 4 students featuring interactive practice questions, detailed solutions, and progress tracking.',
      url: 'https://form4eoyrevision.netlify.app/',
      category: 'Year Revision',
      featured: true,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Lower 6 AI Standard Level Hub',
      description: 'Complete IB Mathematics AI SL resource hub featuring interactive visualizations, GDC tutorials, and real-world applications.',
      url: 'https://lower6aisl.netlify.app/',
      category: 'IB Resources',
      featured: true,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'IB Maths Choice Guidance Tool',
      description: 'AI-powered guidance system helping students select between AA and AI mathematics courses based on their strengths, interests, and university goals.',
      url: 'https://ibmathschoice.com/',
      category: 'Interactive Tools',
      featured: true,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 5,
      title: 'History Blockbuster Resources',
      description: 'Interactive history platform featuring dynamic timelines, source analysis tools, and integrated PDF resources for comprehensive learning.',
      url: 'https://historyblockbuster.netlify.app/',
      category: 'Subject Resources',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop'
    },
    {
      id: 6,
      title: 'Chemistry Blockbuster Resources',
      description: 'Dynamic chemistry learning platform with molecular visualizations, reaction simulations, and over 100 integrated PDF resources.',
      url: 'https://chemistryblockbusters.netlify.app/',
      category: 'Subject Resources',
      image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 7,
      title: 'Voronoi Diagram Visualiser',
      description: 'Real-time interactive visualization tool for exploring Voronoi diagrams, Delaunay triangulation, and computational geometry concepts.',
      url: 'https://voronoidiagram.netlify.app/',
      category: 'Interactive Tools',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 8,
      title: 'Maths Timer for Practice',
      description: 'Customizable practice timer with interval settings, progress tracking, and integration with revision materials for focused study sessions.',
      url: 'https://mathstimer.netlify.app/',
      category: 'Interactive Tools',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1974&auto=format&fit=crop'
    },
    {
      id: 9,
      title: 'Magic Triangles Game',
      description: 'Engaging mathematical puzzle game exploring number patterns, triangle properties, and logical thinking through interactive challenges.',
      url: 'https://magictriangles.netlify.app/',
      category: 'Interactive Tools',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 10,
      title: 'Science IB Advisor',
      description: 'Intelligent advisory system for IB Science students offering personalized study paths, topic recommendations, and exam preparation strategies.',
      url: 'https://scienceibadvisor.netlify.app/',
      category: 'IB Resources',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 11,
      title: 'IB Maths Pro Preparation Platform',
      description: 'Advanced IB Mathematics platform with AI-driven learning paths, semantic resource mapping, and over 1000 integrated PDF booklets.',
      url: 'https://ibmathspro.netlify.app/',
      category: 'IB Resources',
      image: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 12,
      title: 'Algebraticamente',
      description: 'Advanced AI-powered mathematics platform with React, Supabase backend, and intelligent tutoring system for Brazilian students.',
      url: 'https://algebraticamente.com.br/',
      category: 'Interactive Tools',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  // Featured projects (first 4 with featured flag)
  const featuredProjects = projects.filter(project => project.featured);
  
  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);
  
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
    <div className="pt-16">
      {/* Hero Section with Animated Elements */}
      <section className="relative h-screen overflow-hidden">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/70"></div>
          </div>
        ))}
        
        {/* Animated geometric shapes for tech feel */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-white/10 animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full border border-white/5 animate-pulse-slow" style={{animationDelay: "1s"}}></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full border-2 border-primary-500/20 animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-lg border border-primary-400/30 animate-float" style={{animationDelay: "2s"}}></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <div className="flex flex-col md:flex-row md:items-center mb-6 animate-fadeIn">
              <div className="relative mb-6 md:mb-0 md:mr-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-blue-600 rounded-full blur opacity-70 animate-pulse-slow"></div>
                <img 
                  src="https://nyc.cloud.appwrite.io/v1/storage/buckets/680e6b780020e087c6e0/files/6831b9a50005050a21c8/view?project=680e68b10024125b5c0b&mode=admin" 
                  alt="Mr. Nascimento" 
                  className="relative w-28 h-28 rounded-full object-cover border-4 border-white"
                />
              </div>
              <div className="animate-slideInLeft">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  <span className="block">Mr. Nascimento</span>
                  <span className="text-gradient bg-gradient-to-r from-blue-400 to-primary-500">Educational Tools</span>
                </h1>
                <p className="text-xl text-slate-200 mt-3">Innovating Digital Learning Experiences</p>
              </div>
            </div>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl animate-slideIn delay-300">
              Pioneering interactive educational platforms and digital resources that transform mathematics learning through technology, visualization, and personalized experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slideIn delay-500">
              <Link
                to="/projects"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 transform hover:-translate-y-1"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 glass-card text-white border border-white/20 font-medium rounded-lg text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:shadow-lg transform hover:-translate-y-1"
              >
                Get in Touch
              </Link>
            </div>
            
            {/* Floating tech elements */}
            <div className="absolute -bottom-10 right-10 md:right-32 w-64 h-64 hidden md:block">
              <div className="relative w-full h-full animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" 
                  alt="Mathematical visualization" 
                  className="absolute w-40 h-40 object-cover rounded-lg shadow-xl rotate-6 z-10"
                />
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Educational data dashboard" 
                  className="absolute w-40 h-40 object-cover rounded-lg shadow-xl -rotate-6 top-20 left-20 z-20"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Tech-themed animated wave */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24 text-white dark:text-slate-900">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V69.81C50.39,80.45,104.57,93.66,159.21,97.37,260.46,104.73,243.88,42.6,321.39,56.44Z" className="fill-current"></path>
          </svg>
        </div>
      </section>

      {/* Features Section with Animated Cards */}
      <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Tech background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-full h-full bg-repeat opacity-10" style={{backgroundImage: "url('https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=80')", backgroundSize: "80px"}}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl"></div>
          <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
              INNOVATIVE EDUCATIONAL TOOLS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Transforming Education Through Technology
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Explore my collection of cutting-edge educational platforms designed to enhance learning experiences. Each platform integrates advanced AI capabilities, semantic search, and personalized learning paths to make complex concepts accessible to all students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" ref={el => registerRef('featuresSection', el)}>
            {[
              {
                title: 'Interactive Learning',
                description: 'Immersive educational experiences that adapt to individual learning styles and pace.',
                icon: <Zap className="w-6 h-6" />,
                color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
                animation: 'animate-scaleUp delay-100'
              },
              {
                title: 'AI-Powered Tools',
                description: 'Smart educational tools using LLMs, vector search, and semantic mapping for truly personalized learning experiences.',
                icon: <Brain className="w-6 h-6" />,
                color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
                animation: 'animate-scaleUp delay-300'
              },
              {
                title: 'Data Visualization',
                description: 'Complex mathematical and scientific concepts brought to life through dynamic visualizations.',
                icon: <Code className="w-6 h-6" />,
                color: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400',
                animation: 'animate-scaleUp delay-500'
              },
              {
                title: 'Curriculum Integration',
                description: 'Seamlessly integrate digital resources with curriculum requirements for maximum educational impact.',
                icon: <Sparkles className="w-6 h-6" />,
                color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
                animation: 'animate-scaleUp delay-700'
              }
            ].map((feature, index) => (
              <div key={index} className={`bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg dark:shadow-slate-700/10 transition-all duration-300 p-6 group ${isVisible['featuresSection'] ? feature.animation : 'opacity-0'}`}>
                <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Certifications Showcase */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated AI Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 reveal">
            <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl group">
              {/* Orbiting AI Particles */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '8s'}}>
                <div className="absolute -top-2 left-1/2 w-2 h-2 bg-cyan-300 rounded-full transform -translate-x-1/2 animate-ping"></div>
                <div className="absolute top-1/2 -right-2 w-1 h-1 bg-blue-300 rounded-full transform -translate-y-1/2 animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute -bottom-2 left-1/2 w-1 h-1 bg-purple-300 rounded-full transform -translate-x-1/2 animate-ping" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 -left-2 w-2 h-2 bg-pink-300 rounded-full transform -translate-y-1/2 animate-ping" style={{animationDelay: '1.5s'}}></div>
              </div>
              
              {/* Central Brain with AI Glow */}
              <div className="relative z-10 group-hover:animate-pulse">
                <Brain className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              
              {/* AI Energy Ring */}
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl animate-pulse"></div>
            </div>
            <span className="inline-block px-4 py-2 bg-cyan-400/20 text-cyan-300 rounded-full text-sm font-bold mb-4 backdrop-blur-lg border border-cyan-400/30">
              FROM AI MASTERY TO GLOBAL IMPACT
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6">
              Artificial Intelligence Excellence
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Pioneering the future of education through comprehensive AI expertise. From generative intelligence to business applications, discover the certifications that drive innovation in learning and technology.
            </p>
          </div>

          {/* AI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-cyan-400 mb-2">9</div>
              <div className="text-slate-300 font-medium">AI Certifications</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-blue-400 mb-2">6</div>
              <div className="text-slate-300 font-medium">Specialisation Areas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-purple-400 mb-2">6</div>
              <div className="text-slate-300 font-medium">Elite Qualifications</div>
            </div>
          </div>

          {/* Featured AI Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Introduction to Generative AI',
                category: 'Generative Intelligence',
                description: 'Foundational mastery of generative artificial intelligence technologies, transforming creativity and innovation across industries.',
                icon: <Sparkles className="w-6 h-6" />,
                gradient: 'from-cyan-400 to-blue-500'
              },
              {
                title: 'AI in Education',
                category: 'Educational Technology',
                description: 'Revolutionary expertise in implementing AI technologies within educational environments and intelligent learning systems.',
                icon: <GraduationCap className="w-6 h-6" />,
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                title: 'MBA in AI & Data Science',
                category: 'Business Intelligence',
                description: 'Strategic qualification in artificial intelligence implementation, driving business transformation through intelligent systems.',
                icon: <Brain className="w-6 h-6" />,
                gradient: 'from-purple-600 to-pink-600'
              }
            ].map((cert, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${cert.gradient} rounded-3xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500`}></div>
                <div className="relative bg-slate-800/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-slate-700/50 hover:shadow-cyan-500/25 transition-all duration-500 transform group-hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 bg-gradient-to-br ${cert.gradient} rounded-xl mr-3`}>
                      {cert.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-400">{cert.category}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                    {cert.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              to="/certifications"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 text-lg"
            >
              <span>Explore Complete AI Portfolio</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-slate-400 mt-4 text-sm max-w-2xl mx-auto">
              Discover how artificial intelligence expertise shapes the future of education, business innovation, and technological advancement.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects with 3D Cards */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800 relative">
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-primary-500/20 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 50 + 10}px`,
                height: `${Math.random() * 50 + 10}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
              FEATURED PROJECTS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Educational Projects Showcase
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Explore my most impactful digital learning tools designed to make education more engaging, accessible, and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" ref={el => registerRef('projectsSection', el)}>
            {featuredProjects.map((project, idx) => {
              const category = categories.find(c => c.name === project.category);
              return (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative block ${isVisible['projectsSection'] ? `animate-scaleUp delay-${idx * 200}` : 'opacity-0'}`}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={project.image || `https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className={`${category?.color || 'bg-slate-100 text-slate-600'} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                        {category?.icon || <BookOpen className="w-5 h-5" />}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{project.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
                      <div className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                        <span>Explore</span>
                        <ExternalLink className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          
          <div className="flex justify-center mt-12">
            <Link
              to="/projects"
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-medium rounded-lg text-center transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 transform hover:-translate-y-1 reveal"
            >
              <span>View All Educational Tools</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Tech Visualization Section */}
      <section className="py-20 tech-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Digital Innovation in Education
              </h2>
              <p className="text-lg text-white/80 mb-6">
                My educational platforms leverage cutting-edge technology to create engaging learning experiences:
              </p>
              <ul className="space-y-4">
                {[
                  {
                    icon: <Brain className="w-5 h-5 text-blue-400" />,
                    title: "AI-Powered Learning Paths",
                    description: "Personalized learning experiences adapted to individual student needs"
                  },
                  {
                    icon: <Code className="w-5 h-5 text-purple-400" />,
                    title: "Interactive Visualizations",
                    description: "Complex concepts simplified through dynamic, manipulable visualizations"
                  },
                  {
                    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
                    title: "Real-time Progress Tracking",
                    description: "Sophisticated analytics to monitor learning progress and identify areas for improvement"
                  },
                  {
                    icon: <Zap className="w-5 h-5 text-green-400" />,
                    title: "Cross-platform Accessibility",
                    description: "Seamless experience across all devices for learning anywhere, anytime"
                  }
                ].map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 ${isVisible['techSection'] ? `animate-slideInLeft delay-${i * 200}` : 'opacity-0'}`}>
                    <div className="bg-white/10 p-2 rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      <p className="text-white/70">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative" ref={el => registerRef('techSection', el)}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
              
              {/* Floating tech images with parallax effect */}
              {techImages.map((img, i) => (
                <div 
                  key={i}
                  className={`rounded-lg overflow-hidden shadow-xl ${
                    i === 0 ? 'col-span-2' : ''
                  } ${isVisible['techSection'] ? `animate-scaleUp delay-${(i+1) * 200}` : 'opacity-0'}`}
                >
                  <img 
                    src={img} 
                    alt="Educational Technology" 
                    className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110" 
                  />
                </div>
              ))}
              
              <div className={`bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 col-span-2 ${isVisible['techSection'] ? 'animate-slideIn delay-800' : 'opacity-0'}`}>
                <h3 className="text-xl font-bold mb-2">Technology + Education</h3>
                <p className="text-white/80">
                  Bridging the gap between advanced technology and educational practice to create innovative learning experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Background design elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 dark:bg-primary-900/20 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 reveal">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl blur opacity-25 animate-pulse-slow"></div>
                <img 
                  src="https://nyc.cloud.appwrite.io/v1/storage/buckets/680e6b780020e087c6e0/files/6831b9a50005050a21c8/view?project=680e68b10024125b5c0b&mode=admin" 
                  alt="Mr. Nascimento" 
                  className="relative rounded-xl shadow-lg w-full max-w-md mx-auto"
                />
              </div>
            </div>
            <div className="md:w-1/2 reveal">
              <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
                ABOUT ME
              </span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Passionate About Educational Innovation
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                I'm dedicated to merging cutting-edge technology with pedagogical best practices to create transformative educational experiences for students at all levels.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                My work spans the development of interactive learning platforms, AI-enhanced educational tools, and curriculum-aligned digital resources. I've coded and integrated over 1000 PDF booklets into various platforms and designed AI-powered solutions including intelligent filtering tools, content suggestion engines, interactive revision aids, and semantic resource mapping powered by LLMs and vector search.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8" ref={el => registerRef('aboutSection', el)}>
                {[
                  { 
                    icon: <GraduationCap className="w-6 h-6 text-primary-600" />, 
                    title: 'Education Specialist',
                    description: 'Expertise in mathematics and cross-disciplinary learning'
                  },
                  { 
                    icon: <Brain className="w-6 h-6 text-blue-600" />, 
                    title: 'EdTech Innovator',
                    description: 'Creating AI-powered educational solutions'
                  },
                  { 
                    icon: <Code className="w-6 h-6 text-purple-600" />, 
                    title: 'Technical Developer',
                    description: 'Building interactive digital learning tools'
                  },
                  { 
                    icon: <Lightbulb className="w-6 h-6 text-amber-600" />, 
                    title: 'Curriculum Designer',
                    description: 'Crafting engaging learning experiences'
                  }
                ].map((item, i) => (
                  <div key={i} className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm ${isVisible['aboutSection'] ? `animate-scaleUp delay-${i * 200}` : 'opacity-0'}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{item.icon}</div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/contact"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-medium rounded-lg inline-flex items-center gap-2 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Animated Background */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-shine"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 reveal">
            Ready to Transform Your Educational Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto reveal">
            Explore my collection of educational tools and resources designed to make learning more engaging, interactive, and effective.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal">
            <Link
              to="/projects"
              className="px-8 py-4 bg-white text-primary-700 hover:text-primary-800 font-medium rounded-lg text-center transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Browse Projects
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 glass-card text-white border border-white/30 font-medium rounded-lg text-center transition-all duration-300 hover:bg-white/10 transform hover:-translate-y-1"
            >
              Contact Me
            </Link>
          </div>
          
          {/* Floating tech icons */}
          <div className="mt-12 flex justify-center gap-12 reveal">
            {[
              <Brain className="w-10 h-10 text-white/80" />,
              <Code className="w-10 h-10 text-white/80" />,
              <Zap className="w-10 h-10 text-white/80" />,
              <Sparkles className="w-10 h-10 text-white/80" />
            ].map((icon, i) => (
              <div key={i} className="animate-float" style={{animationDelay: `${i * 0.5}s`}}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;