import { useState, useEffect, useRef } from 'react';
import { Send, Mail, MapPin, Globe, Linkedin, Github, Twitter, Sparkles, ArrowRight } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success?: boolean; message?: string} | null>(null);
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});
  const elementsRef = useRef<{[key: string]: HTMLElement | null}>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Simulate form submission
    try {
      // In a real implementation, you would send this data to your backend or a service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        success: true,
        message: 'Your message has been sent successfully! I will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'There was an error sending your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
    <div className="pt-24 pb-16 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -right-20 w-80 h-80 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 reveal">
          <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
            LET'S CONNECT
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Have questions about my educational tools or interested in collaboration? I'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" ref={el => registerRef('contactCards', el)}>
          {[
            {
              icon: <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
              title: "Email",
              subtitle: "For inquiries and collaborations",
              content: "contact@mrnascimento.com",
              link: "mailto:contact@mrnascimento.com",
              delay: "delay-100"
            },
            {
              icon: <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
              title: "Location",
              subtitle: "Based in",
              content: "London, United Kingdom",
              link: null,
              delay: "delay-300"
            },
            {
              icon: <Globe className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
              title: "Social",
              subtitle: "Connect with me",
              content: null,
              social: true,
              delay: "delay-500"
            }
          ].map((card, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 transform hover:-translate-y-1 ${isVisible['contactCards'] ? `animate-scaleUp ${card.delay}` : 'opacity-0'}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-blue-600 rounded-full blur opacity-70"></div>
                  <div className="relative w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-3">{card.subtitle}</p>
                
                {card.social ? (
                  <div className="flex space-x-4">
                    {[
                      { icon: <Linkedin className="w-5 h-5" />, url: "https://linkedin.com/in/mrnascimento", label: "LinkedIn" },
                      { icon: <Github className="w-5 h-5" />, url: "https://github.com/mrnascimento", label: "GitHub" },
                      { icon: <Twitter className="w-5 h-5" />, url: "https://twitter.com/mrnascimento", label: "Twitter" }
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200 transform hover:scale-110"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                ) : card.link ? (
                  <a 
                    href={card.link}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
                  >
                    {card.content}
                  </a>
                ) : (
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {card.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden reveal">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2" />
                Send Me a Message
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                I'm always open to discussing new projects, educational collaborations, or opportunities to innovate in digital learning.
              </p>
              
              {submitStatus && (
                <div className={`p-4 mb-6 rounded-md ${
                  submitStatus.success 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Project Collaboration">Project Collaboration</option>
                    <option value="Educational Technology">Educational Technology</option>
                    <option value="Resource Access">Resource Access</option>
                    <option value="Speaking Engagement">Speaking Engagement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 disabled:opacity-70 transform hover:-translate-y-1 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="relative hidden md:block">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent"></div>
              <img 
                src="https://nyc.cloud.appwrite.io/v1/storage/buckets/680e6b780020e087c6e0/files/6831b9a50005050a21c8/view?project=680e68b10024125b5c0b&mode=admin"
                alt="Mr. Nascimento"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Tech-themed overlay elements */}
              <div className="absolute inset-0 z-0 opacity-30">
                <div className="h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
                <h3 className="text-2xl font-bold mb-2">Mr. Nascimento</h3>
                <p className="text-white/90">Educational Innovation Specialist</p>
                <div className="flex items-center mt-4 animate-pulse-slow">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  <span>Let's work together</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20 reveal">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find answers to common questions about my educational tools and collaboration opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={el => registerRef('faqSection', el)}>
            {[
              {
                question: "Are your educational tools free to use?",
                answer: "Many of my educational tools offer free access to basic features, with premium options available for enhanced capabilities and resources."
              },
              {
                question: "Can I integrate your tools into my school's curriculum?",
                answer: "Yes! Most of my tools are designed to complement existing curricula and can be integrated into classroom teaching. Please contact me for institution-wide arrangements."
              },
              {
                question: "Do you offer customized educational solutions?",
                answer: "Absolutely. I specialize in developing tailored educational tools that address specific learning objectives and curriculum requirements."
              },
              {
                question: "How can I collaborate on a project?",
                answer: "I'm always open to collaborations. Please use the contact form to share your ideas and we can discuss potential partnerships."
              }
            ].map((faq, i) => (
              <div 
                key={i} 
                className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${isVisible['faqSection'] ? `animate-scaleUp delay-${i * 200}` : 'opacity-0'}`}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;