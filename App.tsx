
import React, { useState, useEffect } from 'react';
import { AnalysisResult, Language, Memory } from './types';
import { analyzeMessageContext } from './services/geminiService';
import InputSection from './components/InputSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import Header from './components/Header';
import { translations } from './utils/translations';
import { Moon, Sun, ArrowRight } from 'lucide-react';

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
    min-h-[800px]
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
            <div className="flex flex-col items-start justify-center h-full animate-in fade-in slide-in-from-bottom-8 duration-500">
               <div className="mb-8 p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 w-fit">
                 {/* Simple Icon Representation */}
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm ${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white'}`}>
                   ✨
                 </div>
               </div>
               
               <h1 className={`text-5xl font-bold mb-6 tracking-tight leading-[1.1] ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                 Understand tone.<br/>
                 <span className="text-indigo-500">Reply with confidence.</span>
               </h1>

               <div className="space-y-4 w-full mb-12">
                 <ChatBubble theme={theme} side="left" text="Hey, can we catch up later?" />
                 <ChatBubble theme={theme} side="right" text="Sure, sounds good!" />
               </div>

               <button 
                 onClick={() => setView('input')}
                 className="w-full py-4 rounded-2xl bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
               >
                 Get started <ArrowRight size={20} />
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
    </div>
  );
};

// Helper for Hero Chat Bubbles
const ChatBubble = ({ theme, side, text }: { theme: 'light'|'dark', side: 'left'|'right', text: string }) => {
  const isLeft = side === 'left';
  const lightBg = isLeft ? 'bg-white text-stone-600' : 'bg-stone-100 text-stone-800';
  const darkBg = isLeft ? 'bg-[#2C2C2C] text-stone-200' : 'bg-[#383838] text-white';
  
  return (
    <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <div className={`px-6 py-4 rounded-2xl max-w-[80%] shadow-sm ${theme === 'dark' ? darkBg : lightBg} ${isLeft ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
        <p className="font-medium text-sm">{text}</p>
      </div>
    </div>
  );
};

export default App;
