import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import PanicButton from './components/PanicButton';
import MemoryList from './components/MemoryList';
import { AnalysisResult, Language, Memory } from './types';
import { analyzeMessageContext } from './services/geminiService';
import { AlertCircle, ArrowLeft, Chrome, Download, X } from 'lucide-react';
import { KeyIllustration } from './components/Illustrations';
import { translations } from './utils/translations';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  
  // Memory State
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showMemories, setShowMemories] = useState(false);
  const [currentTextSnapshot, setCurrentTextSnapshot] = useState<string>('');

  // Helper to get current translations
  const t = translations[language];

  // Load memories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('neuroSense_memories');
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse memories", e);
      }
    }
  }, []);

  // Save memories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('neuroSense_memories', JSON.stringify(memories));
  }, [memories]);

  // Helper to map language code to full name for AI prompt
  const getLanguageName = (code: Language) => {
    switch (code) {
      case 'es': return 'Spanish';
      case 'fr': return 'French';
      case 'de': return 'German';
      case 'it': return 'Italian';
      case 'pt': return 'Portuguese';
      case 'ja': return 'Japanese';
      default: return 'English';
    }
  };

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
    setResult(null);
    // Capture the text context for saving later. 
    // If no text but audio/image, provide a placeholder description for the memory.
    setCurrentTextSnapshot(text || (audioBase64 ? "[Audio Message]" : (imageBase64 ? "[Image Analysis]" : "[Content]")));

    try {
      const targetLang = getLanguageName(language);
      const data = await analyzeMessageContext(
        text, 
        useDeepContext, 
        targetLang, 
        imageBase64, 
        imageMimeType,
        audioBase64,
        audioMimeType
      );
      setResult(data);
    } catch (err: any) {
      setError(t.error);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMemory = () => {
    if (!result) return;
    const newMemory: Memory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      originalText: currentTextSnapshot,
      analysis: result
    };
    // Add to beginning of list
    setMemories(prev => [newMemory, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-green-50 to-stone-100 font-sans pb-12 relative text-left flex flex-col">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        onOpenMemories={() => setShowMemories(true)}
        t={t} 
      />

      <main className="flex-grow container mx-auto px-4 md:px-8 py-4 flex flex-col items-center justify-start md:justify-center">
        
        {/* The Magical Notebook Container */}
        <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden min-h-[700px] flex flex-col">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full flex-grow relative">
            
            {/* Left Column: The "Messy Mind" Input */}
            <div className="p-8 md:p-12 flex flex-col relative">
               <div className="mb-6">
                 <h2 className="text-3xl font-bold text-stone-800 mb-2">{t.sourceTitle}</h2>
                 <p className="text-stone-600 leading-relaxed mb-4">
                   {t.sourceDesc}
                 </p>

                 {/* Chrome Extension Promo */}
                 <button 
                    onClick={() => setShowExtensionModal(true)}
                    className="w-full text-left bg-gradient-to-r from-stone-100 to-emerald-50/50 border border-stone-200 p-4 rounded-xl flex items-center gap-4 shadow-sm group cursor-pointer hover:border-forest/30 transition-all outline-none focus:ring-2 focus:ring-forest/20"
                 >
                    <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                      <Chrome className="text-forest" size={24} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                        {t.extensionTitle}
                        <span className="bg-forest/10 text-forest text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">{t.extensionDesc}</p>
                    </div>
                    <Download size={18} className="text-stone-400 group-hover:text-forest transition-colors" />
                 </button>
               </div>
               
               <div className="flex-grow">
                 <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} t={t} />
               </div>
            </div>

            {/* Vertical Divider (The "Binding") */}
            <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-stone-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)]"></div>

            {/* Right Column: The "Clarity" Decoder */}
            <div className="p-8 md:p-12 bg-stone-50/30 lg:bg-transparent flex flex-col">
              
              {/* Mobile Back Button */}
              {result && (
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors mb-6 lg:hidden"
                >
                  <ArrowLeft size={16} /> {t.back}
                </button>
              )}

              {error && (
                <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 text-rose-800 p-4 rounded-r-lg flex items-start gap-3 animate-in fade-in" role="alert">
                  <AlertCircle size={24} className="mt-0.5 flex-shrink-0" />
                  <p className="leading-relaxed">{error}</p>
                </div>
              )}

              {isAnalyzing ? (
                 <div className="flex-grow flex flex-col items-center justify-center text-stone-400 space-y-6 animate-pulse">
                    <KeyIllustration className="w-40 h-40 opacity-50 grayscale animate-bounce" />
                    <p className="text-xl font-medium font-serif italic text-stone-500">{t.unlocking}</p>
                 </div>
              ) : result ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full">
                   <h2 className="text-3xl font-bold text-stone-800 mb-6 hidden lg:block">{t.clarityTitle}</h2>
                   <AnalysisDashboard result={result} onSave={handleSaveMemory} t={t} />
                </div>
              ) : (
                /* Empty State / Magical Anchor */
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                   <div className="w-64 h-64 mb-8 text-stone-300 animate-float">
                       <KeyIllustration className="w-full h-full" />
                   </div>
                   <h3 className="text-2xl font-semibold text-stone-700 mb-2">{t.readyTitle}</h3>
                   <p className="text-stone-500 max-w-xs mx-auto">
                     {t.readyDesc}
                   </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>

      <PanicButton t={t} />

      {/* Extension Installation Modal */}
      {showExtensionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-in zoom-in-95 border border-stone-200">
             <button 
               onClick={() => setShowExtensionModal(false)}
               className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
               aria-label="Close modal"
             >
               <X size={20} />
             </button>
             
             <div className="flex items-center gap-3 mb-5 text-forest">
               <div className="bg-forest/10 p-2 rounded-lg">
                 <Chrome size={24} className="text-forest" />
               </div>
               <h3 className="text-xl font-bold text-stone-800">Install Neuro-Sense</h3>
             </div>
             
             <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
               <p className="font-medium text-stone-700">Since this is a development preview, you can install the extension manually:</p>
               
               <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                 <ol className="list-decimal pl-5 space-y-3">
                   <li>
                     <span className="font-semibold text-stone-800">Download the source code</span> from this project.
                   </li>
                   <li>
                     Open Chrome and navigate to <code className="bg-stone-200 px-1.5 py-0.5 rounded text-xs font-mono text-stone-800">chrome://extensions</code>
                   </li>
                   <li>
                     Enable <strong className="text-forest">Developer mode</strong> (toggle in top right).
                   </li>
                   <li>
                     Click the <strong className="text-forest">Load unpacked</strong> button.
                   </li>
                   <li>
                     Select the <code className="bg-stone-200 px-1.5 py-0.5 rounded text-xs font-mono text-stone-800">chrome</code> folder from the project files.
                   </li>
                 </ol>
               </div>
               
               <p className="text-xs text-stone-500 italic">
                 Once loaded, visit WhatsApp Web or Instagram to see the brain icon appear on messages!
               </p>
             </div>

             <div className="mt-6 flex justify-end">
               <button 
                 onClick={() => setShowExtensionModal(false)}
                 className="px-6 py-2.5 bg-forest text-white rounded-xl font-semibold hover:bg-[#254040] transition-colors shadow-sm hover:shadow-md"
               >
                 Got it, thanks!
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Memories Drawer */}
      {showMemories && (
        <MemoryList 
          memories={memories} 
          onClose={() => setShowMemories(false)} 
          onDelete={handleDeleteMemory}
          t={t}
        />
      )}

    </div>
  );
};

export default App;