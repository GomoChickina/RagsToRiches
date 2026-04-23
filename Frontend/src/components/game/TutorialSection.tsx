import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ExternalLink, Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { learnContent } from '@/data/learnContent';

export const TutorialSection = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeCategory = learnContent[activeTabIndex];

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden font-sans pb-32 flex">
      {/* ========================================= */}
      {/* 1. BACKGROUND DECORATION                  */}
      {/* ========================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      {/* ========================================= */}
      {/* 2. MOBILE MENU BUTTON                     */}
      {/* ========================================= */}
      <button 
        className="md:hidden fixed top-24 left-4 z-50 p-2 bg-emerald-900 border border-emerald-500/30 rounded-lg text-emerald-100 shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* ========================================= */}
      {/* 3. SIDEBAR NAVIGATION                     */}
      {/* ========================================= */}
      <div className={cn(
        "fixed md:relative z-40 w-72 h-screen pt-24 md:pt-12 pb-32 overflow-y-auto bg-emerald-950/80 md:bg-emerald-950/40 backdrop-blur-xl border-r border-emerald-500/20 transition-transform duration-300 ease-in-out shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="px-6 mb-8">
          <div className="inline-flex items-center gap-3 p-2 bg-emerald-900/50 rounded-xl mb-2 border border-white/10 shadow-lg">
            <Lightbulb className="w-6 h-6 text-gold" />
            <h2 className="font-display text-xl font-bold text-white tracking-tight">Learn</h2>
          </div>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {learnContent.map((category, index) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveTabIndex(index);
                setIsSidebarOpen(false); // Close mobile sidebar on selection
              }}
              className={cn(
                "flex items-center justify-between text-left w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                activeTabIndex === index
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md"
                  : "text-emerald-100/70 hover:bg-emerald-800/30 hover:text-emerald-100"
              )}
            >
              <span className="truncate pr-2">{category.title}</span>
              {activeTabIndex === index && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>
      </div>

      {/* ========================================= */}
      {/* 4. MAIN CONTENT AREA                      */}
      {/* ========================================= */}
      <div className="relative z-10 flex-1 pt-24 md:pt-12 px-6 lg:px-12 pb-32 h-screen overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Category Header */}
              <div>
                <h1 className="font-display text-4xl md:text-5xl mb-4 text-white font-black tracking-tight drop-shadow-md">
                  {activeCategory.title}
                </h1>
                {activeCategory.intro && (
                  <p className="text-xl text-emerald-100/80 font-medium leading-relaxed bg-emerald-900/30 p-6 rounded-2xl border border-emerald-500/10">
                    {activeCategory.intro}
                  </p>
                )}
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {activeCategory.sections.map((section, idx) => (
                  <div key={idx} className="bg-emerald-950/60 p-6 md:p-8 rounded-3xl border border-emerald-500/20 backdrop-blur-md shadow-xl">
                    <h3 className="font-display text-2xl font-bold text-emerald-300 mb-6 pb-2 border-b border-emerald-500/20">
                      {section.heading}
                    </h3>
                    <div className="space-y-4">
                      {section.content.map((paragraph, pIdx) => (
                        <p 
                          key={pIdx} 
                          className="text-emerald-100/80 text-lg leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong className="text-emerald-200 font-bold">$1</strong>')
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Table rendering if exists */}
              {activeCategory.table && (
                <div className="bg-emerald-950/60 rounded-3xl border border-emerald-500/20 backdrop-blur-md shadow-xl overflow-hidden mt-8">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-emerald-900/60">
                          {activeCategory.table.headers.map((header, i) => (
                            <th key={i} className="p-4 border-b border-emerald-500/20 font-bold text-emerald-300">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeCategory.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-emerald-800/30 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-4 border-b border-emerald-500/10 text-emerald-100/80">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Resources / Links */}
              {activeCategory.links && activeCategory.links.length > 0 && (
                <div className="mt-12 bg-emerald-900/40 p-6 md:p-8 rounded-3xl border border-emerald-500/20">
                  <h4 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-emerald-400" />
                    Additional Resources
                  </h4>
                  <ul className="space-y-3">
                    {activeCategory.links.map((link, lIdx) => {
                      // Extract domain name for display if it's a long url
                      let displayUrl = link;
                      try {
                        const urlObj = new URL(link);
                        displayUrl = urlObj.hostname + (urlObj.pathname.length > 1 ? '/...' : '');
                      } catch(e) {}
                      
                      return (
                        <li key={lIdx}>
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 break-all transition-colors inline-flex items-center gap-1 group"
                          >
                            <span className="group-hover:underline">{displayUrl}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
