import { Link } from 'react-router-dom';
import { Book, Mail, Twitter, Github, Linkedin, Globe, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-800 pt-16 pb-8 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 opacity-50"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Newsletter section */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/10 dark:to-primary-900/10 opacity-50"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Stay Updated</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Subscribe to receive notifications about new educational tools, resources, and updates.
              </p>
            </div>
            <div className="md:w-1/2">
              <form className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900">
                <Book className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">Mr. Nascimento</span>
                <div className="text-sm text-slate-600 dark:text-slate-400">São Paulo, SP, Brazil</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Professional mathematics educator specializing in innovative educational tools and interactive learning platforms that transform digital education.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/mrnascimento_edu"
                className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/mrnascimento"
                className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-all duration-300 transform hover:scale-110"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/roney-lima-do-nascimento-12a52192/"
                className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {['Mathematics', 'IB Resources', 'Revision Materials', 'Interactive Tools', 'Worksheets'].map((item) => (
                <li key={item}>
                  <Link
                    to="/resources"
                    className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Projects
            </h3>
            <ul className="space-y-3">
              {['Year Revision', 'IB Maths Hub', 'Magic Triangles', 'Voronoi Diagrams', 'IB Advisors'].map((item) => (
                <li key={item}>
                  <Link
                    to="/projects"
                    className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:roney.nascimento@usp.br"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Me
                </a>
              </li>
              <li>
                <a
                  href="https://mrnascimento.tech"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Personal Website
                </a>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <h4 className="font-medium text-primary-800 dark:text-primary-300 mb-2">Let's Connect</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                I'm always interested in new educational technology projects and collaborations.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <span>Get in touch</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 md:mb-0">
              © {currentYear} Mr. Nascimento Educational Tools. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-red-500 animate-pulse-slow" /> for educational innovation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;