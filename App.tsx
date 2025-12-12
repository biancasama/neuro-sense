
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult, Language, Memory } from './types';
import { analyzeMessageContext } from './services/geminiService';
import InputSection from './components/InputSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import Header, { BrainLogo } from './components/Header';
import { translations } from './utils/translations';
import { Moon, Sun, ArrowRight, Youtube, Instagram, Twitter, MessageCircle, Music } from 'lucide-react';
import { PhoneMockupIllustration } from './components/Illustrations';

// Footer Component tailored for the App Card
const Footer = ({ theme, t }: { theme: 'light' | 'dark', t: any }) => {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';
  const textSecondary = theme === 'dark' ? 'text-stone-400' : 'text-stone-500';
  const borderCol = theme === 'dark' ? 'border-white/10' : 'border-stone-200';

  return (
    <footer className={`w-full py-12 mt-16 border-t ${borderCol} transition-colors duration-500`}>
      <div className="flex flex-col gap-12 text-left max-w-5xl mx-auto">
        
        {/* Top Section: Brand + Links */}
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
            
            {/* Brand Section - Aligned with Logo on left, text column on right */}
            <div className="flex flex-row gap-4 md:max-w-xs items-start">
               <div className="pt-1 flex-shrink-0">
                 <BrainLogo size={32} />
               </div>
               <div className="flex flex-col items-start">
                   <div className="flex items-center gap-3 mb-4 h-8">
                     <span className={`font-bold text-xl md:text-2xl ${textPrimary}`}>Neuro-Sense</span>
                   </div>
                   <p className={`text-sm ${textSecondary} mb-6 leading-relaxed`}>
                     {t.heroSubtitle.split('. ').map((sent: string, i: number) => (
                       <React.Fragment key={i}>
                         {sent}{i < 2 ? '. ' : ''}{i === 1 && <br/>}
                       </React.Fragment>
                     ))}
                   </p>
                   
                   <div className={`flex items-center gap-4 ${textSecondary}`}>
                    <a href="#" className="hover:text-indigo-500 transition-colors"><Youtube size={20} /></a>
                    <a href="#" className="hover:text-indigo-500 transition-colors"><Instagram size={20} /></a>
                    <a href="#" className="hover:text-indigo-500 transition-colors"><Music size={20} /></a>
                    <a href="#" className="hover:text-indigo-500 transition-colors"><Twitter size={20} /></a>
                   </div>
               </div>
            </div>

            {/* Links Grid - Responsive */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 md:gap-x-24">
               {/* Column 1 */}
               <div>
                 <h4 className={`font-bold text-base mb-4 ${textPrimary}`}>{t.footerUseCases}</h4>
                 <ul className={`space-y-3 text-sm ${textSecondary}`}>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerSocialContext}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerEmotionalSafety}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerClarity}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerConflict}</a></li>
                 </ul>
               </div>

               {/* Column 2 */}
               <div>
                 <h4 className={`font-bold text-base mb-4 ${textPrimary}`}>{t.footerCompany}</h4>
                 <ul className={`space-y-3 text-sm ${textSecondary}`}>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerCareers}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerBlog}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerInfluencer}</a></li>
                 </ul>
               </div>

               {/* Column 3 */}
               <div className="col-span-2 md:col-span-1">
                 <h4 className={`font-bold text-base mb-4 ${textPrimary}`}>{t.footerLegal}</h4>
                 <ul className={`space-y-3 text-sm ${textSecondary} flex flex-col`}>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerTerms}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerPrivacy}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerRefund}</a></li>
                   <li><a href="#" className="hover:text-indigo-500 transition-colors">{t.footerDisclaimer}</a></li>
                 </ul>
               </div>
            </div>
        </div>

        {/* Divider */}
        <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-stone-200'}`}></div>

        {/* Bottom Section */}
        <div className={`text-sm ${textSecondary} text-center md:text-left`}>
           {t.footerRights}
        </div>

      </div>
    </footer>
  );
};

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Navigation State: 'home' (includes hero + input) | 'results'
  const [view, setView] = useState<'home' | 'results'>('home');
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const decodeSectionRef = useRef<HTMLDivElement>(null);

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
    audioMimeType?: string,
    voiceAccent?: string
  ) => {
    setIsAnalyzing(true);
    setError(null);
    
    // Move to results view immediately to show loading state
    setView('results');

    try {
      // Map short codes to full language names if needed by Gemini, or just pass the code
      // We'll pass English explicitly as 'English' in logic for now, or use mapped name
      const langNameMap: Record<Language, string> = {
          en: 'English', es: 'Spanish', fr: 'French', de: 'German', 
          it: 'Italian', pt: 'Portuguese', ja: 'Japanese'
      };
      
      const data = await analyzeMessageContext(
        text, 
        useDeepContext, 
        langNameMap[language], 
        imageBase64, 
        imageMimeType,
        audioBase64, 
        audioMimeType,
        voiceAccent
      );
      setResult(data);
    } catch (err: any) {
      setError(t.error);
      setView('home'); // Go back on error
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setView('home');
  };

  const scrollToDecode = () => {
    decodeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Responsive Container Classes
  const containerClass = `
    min-h-screen transition-colors duration-500 ease-in-out font-sans flex flex-col items-center justify-center 
    p-4 md:p-8 lg:p-12
    ${theme === 'dark' ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#F2F4F8] text-[#1F2937]'}
  `;

  // Responsive Card Classes
  const cardClass = `
    w-full relative flex flex-col shadow-2xl transition-all duration-500 overflow-hidden
    ${theme === 'dark' ? 'bg-[#1E1E1E] shadow-black/40' : 'bg-white shadow-stone-200'}
    
    /* Mobile Defaults */
    max-w-md rounded-[2.5rem] h-[85vh]
    
    /* Desktop Overrides */
    md:max-w-6xl md:h-auto md:min-h-[85vh] md:rounded-[3rem]
  `;

  return (
    <div className={containerClass}>
      
      {/* Theme Toggle (Floating) */}
      <button 
        onClick={toggleTheme}
        className={`fixed top-6 left-6 z-50 p-3 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-[#2C2C2C] text-yellow-400 hover:bg-[#383838]' : 'bg-white text-stone-600 shadow-md hover:bg-stone-50'}`}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main App Card */}
      <div className={cardClass}>
        
        {/* Header */}
        <div className="flex-none z-10 bg-inherit border-b border-transparent">
           <Header 
            view={view} 
            onBack={view === 'results' ? handleReset : undefined}
            theme={theme}
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto custom-scrollbar px-6 pb-8 md:px-16 md:pb-16 scroll-smooth">
          
          {/* VIEW 1: HOME (Hero + Input stacked) */}
          {view === 'home' && (
            <div className="flex flex-col min-h-full pt-4 md:pt-12">
               
               {/* Main Hero Content */}
               <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8 max-w-5xl mx-auto w-full">
                  
                  {/* Hero Text Side */}
                  <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                    <div className="mb-6 md:mb-8">
                        <div className="md:hidden mb-6 flex justify-center"><BrainLogo size={80} /></div> {/* Mobile Logo */}
                        <div className="hidden md:flex mb-6"><BrainLogo size={100} /></div> {/* Desktop Logo */}
                        
                        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                          Neuro-Sense
                        </h1>
                        <p className={`text-lg md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-lg ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                          {t.heroSubtitle.split('. ').map((sent: string, i: number) => (
                             <React.Fragment key={i}>
                               {sent}{i < 2 ? '. ' : ''}{i === 1 && <br/>}
                             </React.Fragment>
                          ))}
                        </p>
                    </div>
                    
                    <button 
                      onClick={scrollToDecode}
                      className="w-full md:w-auto md:px-12 py-4 md:py-5 rounded-2xl bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold text-lg md:text-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
                    >
                      {t.getStarted} <ArrowRight size={20} />
                    </button>
                  </div>

                  {/* Hero Image Side */}
                  <div className="flex-1 flex justify-center w-full max-w-sm md:max-w-md lg:max-w-lg transform md:scale-110 lg:scale-125">
                      <PhoneMockupIllustration className="w-full h-auto drop-shadow-2xl" />
                  </div>
               </div>

               {/* Separator / Scroll Indicator */}
               <div className="flex justify-center mb-16 opacity-20 hidden md:flex">
                 <div className="w-1 h-12 bg-current rounded-full animate-bounce"></div>
               </div>

               {/* INPUT SECTION */}
               <div id="decode-section" ref={decodeSectionRef} className="animate-in fade-in slide-in-from-bottom-8 duration-700 mb-12 scroll-mt-32 max-w-4xl mx-auto w-full">
                  <div className="mb-8 md:mb-12 text-center md:text-left">
                    <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{t.decodeTitle}</h2>
                    <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                      {t.decodeDesc}
                    </p>
                  </div>
                  
                  <InputSection 
                    onAnalyze={handleAnalyze} 
                    isAnalyzing={isAnalyzing} 
                    t={t} 
                    theme={theme}
                  />
               </div>

               {/* Footer */}
               <Footer theme={theme} t={t} />
            </div>
          )}

          {/* VIEW 2: RESULTS */}
          {view === 'results' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col pt-8 max-w-5xl mx-auto w-full">
               {isAnalyzing ? (
                 <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                    <div className="w-24 h-24 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div>
                      <h3 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>{t.analyzingTitle}</h3>
                      <p className={`mt-3 text-lg ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{t.analyzingDesc}</p>
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
    </div>
  );
};

export default App;
