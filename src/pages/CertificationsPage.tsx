import { useState, useEffect, useRef } from 'react';
import { Award, ExternalLink, Calendar, CheckCircle, Star, Brain, Sparkles, Zap, Globe, Lightbulb } from 'lucide-react';

const CertificationsPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState<Array<{ id: number; x: number; y: number; targetX: number; targetY: number; connections: number[] }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate initial nodes
  useEffect(() => {
    const initialNodes = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * window.innerHeight,
      connections: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        Math.floor(Math.random() * 40)
      ).filter(conn => conn !== i),
    }));
    setNodes(initialNodes);
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Update nodes to move towards mouse
      setNodes(prevNodes => 
        prevNodes.map(node => {
          const dx = e.clientX - node.x;
          const dy = e.clientY - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            return {
              ...node,
              targetX: node.x + dx * force * 0.08,
              targetY: node.y + dy * force * 0.08,
            };
          }
          return {
            ...node,
            targetX: node.x + (Math.random() - 0.5) * 0.5,
            targetY: node.y + (Math.random() - 0.5) * 0.5,
          };
        })
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate nodes
  useEffect(() => {
    const animateNodes = () => {
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          x: node.x + (node.targetX - node.x) * 0.03,
          y: node.y + (node.targetY - node.y) * 0.03,
        }))
      );
    };

    const interval = setInterval(animateNodes, 16);
    return () => clearInterval(interval);
  }, []);

  const certifications = [
    {
      id: 1,
      title: 'MBA in AI, Data Science and Big Data for Business',
      description: 'Strategic qualification in artificial intelligence implementation, driving business transformation through intelligent data systems and advanced analytics.',
      category: 'Business Intelligence',
      issuer: 'Business School',
      date: '2024',
      imageUrl: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/68483a180007091353bb/files/68483a25000acf33a06c/view?project=680e68b10024125b5c0b&mode=admin',
      featured: true,
      icon: <Zap className="w-6 h-6" />,
    },
    {
      id: 2,
      title: 'MBA in Leadership, Innovation and Technology',
      description: 'Advanced qualification in leadership excellence, technological innovation, and strategic business transformation in the digital age.',
      category: 'Leadership & Innovation',
      issuer: 'Leadership Institute',
      date: '2024',
      imageUrl: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/6848300b00355f3446b7/files/68483015002e0a348a5f/view?project=680e68b10024125b5c0b&mode=admin',
      featured: true,
      icon: <Star className="w-6 h-6" />,
    },
    {
      id: 3,
      title: 'Prompt Engineering and AI Communication',
      description: 'Advanced mastery in prompt engineering techniques, AI communication strategies, and intelligent dialogue system optimization.',
      category: 'AI Communication',
      issuer: 'AI Communication Institute',
      date: '2024',
      imageUrl: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/68483186000351912090/files/684831ae000cb076eaf5/view?project=680e68b10024125b5c0b&mode=admin',
      featured: true,
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: 4,
      title: 'AI, Data Science and Intelligent Systems Projects',
      description: 'Hands-on expertise in developing and implementing AI projects, data science solutions, and intelligent system architectures.',
      category: 'AI Projects',
      issuer: 'Technical Innovation Lab',
      date: '2024',
      imageUrl: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/684831400019c6f073fa/files/68483158003c0c302eae/view?project=680e68b10024125b5c0b&mode=admin',
      featured: true,
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: 5,
      title: 'AI Applied to Business and Data-Driven Intelligence',
      description: 'Practical application of artificial intelligence in business contexts, focusing on data-driven decision making and intelligent automation.',
      category: 'Business AI',
      issuer: 'Business Intelligence Academy',
      date: '2024',
      imageUrl: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/68483038001fc8572a67/files/6848304c00035f496fca/view?project=680e68b10024125b5c0b&mode=admin',
      featured: true,
      icon: <Lightbulb className="w-6 h-6" />,
    },
    {
      id: 6,
      title: 'Introduction to Generative AI',
      description: 'Foundational mastery of generative artificial intelligence technologies, transforming creativity and innovation across industries.',
      category: 'Generative AI',
      issuer: 'Leading Tech Institute',
      date: '2024',
      imageUrl: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/683512fe002f611a996c/files/68482913001d93fc7b40/view?project=680e68b10024125b5c0b&mode=admin',
      featured: true,
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: 7,
      title: 'Fundamentals of AI, Data Science, Big Data and Innovation',
      description: 'Comprehensive foundation in artificial intelligence principles, data science methodologies, and innovative big data solutions.',
      category: 'AI Fundamentals',
      issuer: 'AI Research Institute',
      date: '2024',
      imageUrl: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/683512fe002f611a996c/files/6848290d00221db76d7b/view?project=680e68b10024125b5c0b&mode=admin',
      featured: true,
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: 8,
      title: 'Artificial Intelligence in Education',
      description: 'Revolutionary expertise in implementing AI technologies within educational environments and intelligent learning systems.',
      category: 'Educational AI',
      issuer: 'Educational Innovation Council',
      date: '2024',
      imageUrl: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/68482fc6002854f58e62/files/68482fd000087c244291/view?project=680e68b10024125b5c0b&mode=admin',
      featured: true,
      icon: <Lightbulb className="w-6 h-6" />,
    },
    {
      id: 9,
      title: 'GitHub Foundations Certification',
      description: 'Comprehensive understanding of GitHub fundamentals, version control, and collaborative development practices for AI projects.',
      category: 'Development Platform',
      issuer: 'GitHub',
      date: '2024',
      imageUrl: 'https://nyc.cloud.appwrite.io/v1/storage/buckets/683512fe002f611a996c/files/684829160014d4ac3115/view?project=680e68b10024125b5c0b&mode=admin',
      featured: true,
      icon: <Globe className="w-6 h-6" />,
    },
  ];

  return (
    <div ref={containerRef} className="pt-20 pb-16 bg-black min-h-screen relative overflow-hidden">
      {/* Interactive Graph Theory Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" style={{ zIndex: 1 }}>
          {/* Connections between nodes */}
          {nodes.map(node => 
            node.connections.map(connId => {
              const connectedNode = nodes[connId];
              if (!connectedNode) return null;
              
              const dx = connectedNode.x - node.x;
              const dy = connectedNode.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 200) {
                const opacity = Math.max(0.1, (200 - distance) / 200 * 0.4);
                return (
                  <line
                    key={`${node.id}-${connId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={connectedNode.x}
                    y2={connectedNode.y}
                    stroke="url(#graphGradient)"
                    strokeWidth="1"
                    opacity={opacity}
                    className="animate-pulse"
                  />
                );
              }
              return null;
            })
          )}
          
          {/* Nodes */}
          {nodes.map(node => {
            const mouseDistance = Math.sqrt(
              Math.pow(mousePosition.x - node.x, 2) + Math.pow(mousePosition.y - node.y, 2)
            );
            const isNearMouse = mouseDistance < 100;
            
            return (
              <circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r={isNearMouse ? 4 : 2}
                fill={isNearMouse ? '#00ffff' : '#3b82f6'}
                opacity={isNearMouse ? 1 : 0.6}
                className={isNearMouse ? 'animate-pulse' : ''}
              />
            );
          })}
          
          {/* Mouse cursor glow */}
          <circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="50"
            fill="url(#mouseGlow)"
            opacity="0.3"
            className="animate-pulse"
          />
          
          <defs>
            <linearGradient id="graphGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="mouseGlow">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Code Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cyan-400 text-xs font-mono opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          >
            {['AI', '01', 'ML', 'NN', '{}', '</>'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative" style={{ zIndex: 10 }}>
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-20">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl mb-8 shadow-2xl group">
            {/* AI Neural Activity */}
            <div className="absolute -inset-4">
              <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-0 right-0 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-0 left-0 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-80" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-70" style={{animationDelay: '1.5s'}}></div>
            </div>
            
            {/* Neural Network Pattern */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 80 80">
                <path 
                  d="M20,20 Q40,10 60,20 Q70,40 60,60 Q40,70 20,60 Q10,40 20,20" 
                  stroke="rgba(255,255,255,0.5)" 
                  strokeWidth="0.5" 
                  fill="none"
                  className="animate-pulse"
                />
                <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.8)" className="animate-pulse" />
                <circle cx="60" cy="20" r="1" fill="rgba(255,255,255,0.6)" className="animate-pulse" style={{animationDelay: '0.3s'}} />
                <circle cx="60" cy="60" r="1" fill="rgba(255,255,255,0.7)" className="animate-pulse" style={{animationDelay: '0.6s'}} />
                <circle cx="20" cy="60" r="1" fill="rgba(255,255,255,0.5)" className="animate-pulse" style={{animationDelay: '0.9s'}} />
              </svg>
            </div>
            
            <Brain className="w-10 h-10 text-white relative z-10 group-hover:animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6">
            From AI Mastery to Global Impact
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Pioneering the Future Through Artificial Intelligence Excellence
          </p>
          
          <p className="text-lg text-slate-400 max-w-5xl mx-auto leading-relaxed">
            Transforming industries, revolutionising education, and shaping tomorrow's world through 
            comprehensive AI expertise and innovative intelligence solutions.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/20 text-center transform hover:scale-105 transition-all duration-500 hover:shadow-cyan-400/20 hover:shadow-2xl">
            <div className="text-5xl font-bold text-cyan-400 mb-3">9</div>
            <div className="text-slate-300 font-medium">AI Certifications</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/20 text-center transform hover:scale-105 transition-all duration-500 hover:shadow-blue-400/20 hover:shadow-2xl">
            <div className="text-5xl font-bold text-blue-400 mb-3">6</div>
            <div className="text-slate-300 font-medium">AI Specialisations</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/20 text-center transform hover:scale-105 transition-all duration-500 hover:shadow-purple-400/20 hover:shadow-2xl">
            <div className="text-5xl font-bold text-purple-400 mb-3">5</div>
            <div className="text-slate-300 font-medium">Elite Qualifications</div>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-70 transition duration-500"></div>
              
              {/* AI Scan Line Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-2000"></div>
              </div>
              
              {/* Matrix Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 overflow-hidden rounded-3xl pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-cyan-400 text-xs font-mono animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`,
                    }}
                  >
                    {Math.random() > 0.5 ? '1' : '0'}
                  </div>
                ))}
              </div>
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/30 hover:shadow-cyan-500/20 transition-all duration-500 transform group-hover:-translate-y-3 group-hover:border-cyan-400/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {cert.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-400">{cert.category}</p>
                      <p className="text-xs text-slate-400">{cert.issuer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 mb-1">Certificate #{index + 1}</div>
                    <div className="text-sm font-bold text-slate-300">{cert.date}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300 leading-tight">
                  {cert.title}
                </h3>
                
                <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                  {cert.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">Verified</span>
                  </div>
                  
                  <a
                    href={cert.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 text-sm"
                  >
                    <span>View Certificate</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6">
              Shaping the Future with AI Excellence
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              These certifications represent a commitment to advancing artificial intelligence education, 
              driving innovation, and transforming how we approach technology in learning and business.
            </p>
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 text-lg">
              <Brain className="w-6 h-6" />
              <span>Pioneering AI Innovation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationsPage; 