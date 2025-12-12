
import React, { useState, useEffect } from 'react';
import { AnalysisResult, Language, Memory } from './types';
import { analyzeMessageContext } from './services/geminiService';
import InputSection from './components/InputSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import Header, { BrainLogo } from './components/Header';
import { translations } from './utils/translations';
import { Moon, Sun, ArrowRight, Youtube, Instagram, Twitter, MessageCircle, Music } from 'lucide-react';
import { PhoneMockupIllustration } from './components/Illustrations';

// Footer Component defined before usage
const Footer = ({ theme }: { theme: 'light' | 'dark' }) => {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';
  const textSecondary = theme === 'dark' ? 'text-stone-400' : 'text-stone-500';
  // Use a subtly different background for footer if light mode, or same as dark mode body
  const footerBg = theme === 'dark' ? 'bg-[#121212]' : 'bg-[#F2F4F8]'; 
  const borderCol = theme === 'dark' ? 'border-white/10' : 'border-stone-200';

  return (
    <footer className={`w-full py-16 px-8 mt-auto border-t ${borderCol} ${footerBg} transition-colors duration-500 relative z-20`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:w-1/3 flex flex-col items-start">
             <div className="flex items-center gap-2 mb-4">
               <BrainLogo size={32} />
               <span className={`font-bold text-xl ${textPrimary}`}>Neuro-Sense</span>
             </div>
             <p className={`text-sm ${textSecondary} mb-6 max-w-xs leading-relaxed`}>
               Magical context decoder. Understand tone, reply with confidence.
             </p>
             <button className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
               Start writing
             </button>
          </div>

          {/* Links Columns */}
          <div className="flex flex-wrap gap-12 md:gap-20">
             {/* Column 1 */}
             <div>
               <h4 className={`font-bold mb-4 ${textPrimary}`}>Use Cases</h4>
               <ul className={`space-y-3 text-sm ${textSecondary}`}>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Individuals</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Couples</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Workplace</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Therapy Support</a></li>
               </ul>
             </div>

             {/* Column 2 */}
             <div>
               <h4 className={`font-bold mb-4 ${textPrimary}`}>Company</h4>
               <ul className={`space-y-3 text-sm ${textSecondary}`}>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Careers</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Blog</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Influencer program</a></li>
               </ul>
             </div>

             {/* Column 3 */}
             <div>
               <h4 className={`font-bold mb-4 ${textPrimary}`}>Legal</h4>
               <ul className={`space-y-3 text-sm ${textSecondary}`}>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="hover:text-indigo-500 transition-colors">Refund Policy</a></li>
               </ul>
             </div>
          </div>
        </div>

        {/* Bottom Section: Divider + Copyright/Socials */}
        <div className={`pt-8 border-t ${borderCol} flex flex-col md:flex-row justify-between items-center gap-6`}>
          
          <div className={`text-sm ${textSecondary} text-center md:text-left`}>
             Copyright © 2025 Neuro-Sense, Inc.<br className="hidden md:block"/> All rights reserved.
          </div>

          <div className={`flex items-center gap-6 ${textSecondary}`}>
            <a href="#" className="hover:text-indigo-500 transition-colors hover:scale-110 transform"><Youtube size={20} /></a>
            <a href="#" className="hover:text-indigo-500 transition-colors hover:scale-110 transform"><Instagram size={20} /></a>
            <a href="#" className="hover:text-indigo-500 transition-colors hover:scale-110 transform"><Music size={20} /></a> {/* TikTok replacement */}
            <a href="#" className="hover:text-indigo-500 transition-colors hover:scale-110 transform"><Twitter size={20} /></a>
            <a href="#" className="hover:text-indigo-500 transition-colors hover:scale-110 transform"><MessageCircle size={20} /></a> {/* Discord replacement */}
          </div>
        </div>

      </div>
    </footer>
  );
};

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Navigation State: 'hero' | 'input' | 'results'
  const [view, setView] = useState<'hero' | 'input' | 'results'>('hero');
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Load theme preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  const t = translations[language];

  const handleAnalyze = async (
    text: string, 
    useDeepContext: boolean, 
    imageBase64?: string, 
    imageMimeType?: string,
    audioBase64?: string,
    audioMimeType?: string
  ) => {
    setIsAnalyzing(true);
    setError(null);
    
    // Move to results view immediately to show loading state
    setView('results');

    try {
      const data = await analyzeMessageContext(
        text, 
        useDeepContext, 
        'English', 
        imageBase64, 
        imageMimeType,
        audioBase64, 
        audioMimeType
      );
      setResult(data);
    } catch (err: any) {
      setError(t.error);
      setView('input'); // Go back on error
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setView('input');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Common Container Classes for the "Mobile App" look
  const containerClass = `
    min-h-screen transition-colors duration-500 ease-in-out font-sans flex flex-col items-center
    ${theme === 'dark' ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#F2F4F8] text-[#1F2937]'}
  `;

  const cardClass = `
    w-full max-w-md flex-grow md:flex-grow-0 md:my-10 md:rounded-[2.5rem] overflow-hidden relative flex flex-col shadow-2xl transition-all duration-500
    ${theme === 'dark' ? 'bg-[#1E1E1E] shadow-black/40' : 'bg-white shadow-stone-200'}
    min-h-[800px] z-10
  `;

  return (
    <div className={containerClass}>
      
      {/* Theme Toggle (Floating) */}
      <button 
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-[#2C2C2C] text-yellow-400 hover:bg-[#383838]' : 'bg-white text-stone-600 shadow-md hover:bg-stone-50'}`}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main App Card */}
      <div className={cardClass}>
        
        {/* Header */}
        <Header 
          view={view} 
          onBack={view === 'results' ? handleReset : (view === 'input' ? () => setView('hero') : undefined)}
          theme={theme}
        />

        {/* Content Area */}
        <div className="flex-grow flex flex-col px-8 pb-12 overflow-y-auto custom-scrollbar">
          
          {/* VIEW 1: HERO */}
          {view === 'hero' && (
            <div className="flex flex-col items-center text-center justify-center h-full animate-in fade-in slide-in-from-bottom-8 duration-500 pt-8">
               
               {/* Logo & Branding */}
               <div className="mb-6 flex flex-col items-center">
                 <BrainLogo size={80} className="mb-6" />
                 <h1 className={`text-5xl font-bold mb-3 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                   Neuro-Sense
                 </h1>
                 <p className={`text-lg font-medium ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                   Understand tone. Reply with confidence.
                 </p>
               </div>

               {/* Mockup Illustration */}
               <div className="mb-10 w-full flex justify-center">
                  <PhoneMockupIllustration className="w-64 h-64 drop-shadow-lg" />
               </div>

               {/* CTA */}
               <button 
                 onClick={() => setView('input')}
                 className="w-full py-4 rounded-2xl bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
               >
                 Get started
               </button>
            </div>
          )}

          {/* VIEW 2: INPUT */}
          {view === 'input' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
              <div className="mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>The Source</h2>
                <p className={`text-lg ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                  Paste the confusing text or upload a screenshot.
                </p>
              </div>
              
              <div className="flex-grow">
                <InputSection 
                  onAnalyze={handleAnalyze} 
                  isAnalyzing={isAnalyzing} 
                  t={t} 
                  theme={theme}
                />
              </div>
            </div>
          )}

          {/* VIEW 3: RESULTS */}
          {view === 'results' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
               {isAnalyzing ? (
                 <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>Analyzing...</h3>
                      <p className={`mt-2 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Reading between the lines</p>
                    </div>
                 </div>
               ) : (
                 <AnalysisDashboard 
                   result={result} 
                   onSave={() => {}} 
                   t={t} 
                   theme={theme}
                 />
               )}
            </div>
          )}

        </div>
      </div>

      {/* Website Footer */}
      <Footer theme={theme} />

    </div>
  );
};

export default App;
