
import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import PanicButton from './components/PanicButton';
import MemoryList from './components/MemoryList';
import { AnalysisResult, Language, Memory } from './types';
import { analyzeMessageContext } from './services/geminiService';
import { AlertCircle, ArrowLeft, Chrome, Download, X, MessageSquare, Sparkles, Heart, ShieldCheck, Zap, ArrowDown, Globe } from 'lucide-react';
import { KeyIllustration, DecodingIllustration } from './components/Illustrations';
import { translations } from './utils/translations';
import { BrainLogo } from './components/Header';

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
    setMemories(prev => [newMemory, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-stone-800 bg-stone-50 selection:bg-forest/20 overflow-x-hidden">
      
      {/* -------------------- SECTION 1: HERO -------------------- */}
      <section className="min-h-screen relative overflow-hidden flex flex-col bg-gradient-to-b from-purple-50 via-stone-50 to-white">
        
        {/* Nav */}
        <nav className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
           <div className="flex items-center gap-3">
             <BrainLogo size={32} />
             <span className="font-bold text-lg text-stone-900 tracking-tight">Neuro-Sense</span>
           </div>
           <div className="flex items-center gap-4">
             <button onClick={() => setShowMemories(true)} className="text-sm font-medium text-stone-600 hover:text-forest transition-colors hidden md:block">
               My Memories
             </button>
             <button 
              onClick={() => setShowExtensionModal(true)}
              className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all text-forest"
             >
               Get Extension
             </button>
           </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-[-40px]">
           <div className="inline-flex items-center gap-2 bg-white border border-purple-100 rounded-full px-3 py-1 mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
             <Sparkles size={14} className="text-purple-400" />
             <span className="text-xs font-bold uppercase tracking-wider text-purple-900">Magical Context Decoder</span>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight mb-6 leading-[1.1]">
             Understand tone. <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-emerald-400">Reply with confidence.</span>
           </h1>
           
           <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
             The assistive AI companion that decodes social cues, hidden subtext, and ambiguous messages for neurodivergent minds.
           </p>

           <div className="flex flex-col sm:flex-row items-center gap-4">
             <button 
               onClick={scrollToDemo}
               className="px-8 py-4 bg-forest text-white rounded-full font-bold text-lg shadow-lg hover:bg-[#254040] hover:scale-105 transition-all flex items-center gap-2"
             >
               Try the Demo <ArrowDown size={18} />
             </button>
             <button 
               onClick={() => setShowExtensionModal(true)}
               className="px-8 py-4 bg-white text-stone-700 border border-stone-200 rounded-full font-bold text-lg shadow-sm hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center gap-2"
             >
               <Chrome size={18} /> Add to Chrome
             </button>
           </div>
           
           {/* Decorative Mockup Element */}
           <div className="mt-16 relative w-full max-w-3xl opacity-90 animate-float">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-40 bg-gradient-to-r from-emerald-200 via-purple-200 to-orange-200 blur-3xl opacity-30 -z-10 rounded-full"></div>
              <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-xl flex items-start gap-4 text-left max-w-md mx-auto transform rotate-[-2deg]">
                <div className="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                   <div className="bg-stone-100 rounded-2xl rounded-tl-none p-3 text-sm text-stone-700">
                     "Fine, do whatever you want."
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">Passive Aggressive</span>
                     <span className="text-[10px] text-stone-400">Detected just now</span>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* -------------------- SECTION 2: HOW IT WORKS -------------------- */}
      <section className="py-24 bg-white border-t border-stone-100">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-stone-800 mb-4">How Neuro-Sense Works</h2>
             <p className="text-stone-500 max-w-xl mx-auto">We bridge the gap between literal words and emotional intent.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {[
               { icon: <MessageSquare size={32} />, title: "Upload Message", desc: "Paste a confusing text, upload a screenshot, or record audio." },
               { icon: <Sparkles size={32} />, title: "AI Decodes Tone", desc: "Our model analyzes syntax, punctuation, and context to find the vibe." },
               { icon: <Heart size={32} />, title: "Get Clarity", desc: "Receive a clear explanation of subtext and safe reply options." }
             ].map((step, i) => (
               <div key={i} className="flex flex-col items-center text-center group">
                 <div className="w-20 h-20 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-forest mb-6 group-hover:scale-110 group-hover:bg-green-50 group-hover:border-green-100 transition-all shadow-sm">
                   {step.icon}
                 </div>
                 <h3 className="text-xl font-bold text-stone-800 mb-2">{step.title}</h3>
                 <p className="text-stone-500 leading-relaxed">{step.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* -------------------- SECTION 3: CORE FEATURES -------------------- */}
      <section className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-500 mb-6">
                 <Zap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">Conflict Detection</h3>
              <p className="text-stone-600 leading-relaxed">Instantly identifies sarcasm, passive-aggression, or anger so you aren't caught off guard.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500 mb-6">
                 <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">Safety Filters</h3>
              <p className="text-stone-600 leading-relaxed">Checks your draft replies to ensure they aren't accidentally rude or too blunt.</p>
            </div>
             <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all md:col-span-2 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500 mb-6">
                    <Chrome size={24} />
                 </div>
                 <h3 className="text-2xl font-bold text-stone-800 mb-2">Browser Extension</h3>
                 <p className="text-stone-600 leading-relaxed mb-6">Works directly inside WhatsApp Web, Messenger, and Instagram DMs. Just click the brain icon.</p>
                 <button onClick={() => setShowExtensionModal(true)} className="text-orange-600 font-bold hover:underline">Download Beta &rarr;</button>
              </div>
              <div className="w-full md:w-1/2 bg-white rounded-xl border border-stone-200 p-4 shadow-sm opacity-80 rotate-2">
                 <div className="flex items-center gap-2 mb-2 border-b border-stone-100 pb-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 </div>
                 <div className="space-y-2">
                   <div className="h-2 w-3/4 bg-stone-100 rounded-full"></div>
                   <div className="h-2 w-1/2 bg-stone-100 rounded-full"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- SECTION 4: INTERACTIVE DEMO (THE APP) -------------------- */}
      <section id="demo-section" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
           <div className="text-center max-w-2xl mx-auto mb-12">
             <span className="text-forest font-bold tracking-wider uppercase text-xs mb-3 block">Live Preview</span>
             <h2 className="text-4xl font-bold text-stone-900 mb-4">Try it yourself</h2>
             <p className="text-stone-600 text-lg">
               Paste a confusing text below to see Neuro-Sense in action.
             </p>
           </div>

           {/* --- EMBEDDED MAGICAL NOTEBOOK --- */}
           <div className="w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden min-h-[700px] flex flex-col md:flex-row ring-1 ring-stone-900/5">
             
              {/* Left Column: Input */}
              <div className="p-8 md:p-12 flex flex-col relative w-full md:w-1/2 border-b md:border-b-0 md:border-r border-stone-200">
                 <div className="mb-6">
                   <h3 className="text-2xl font-bold text-stone-800 mb-2">{t.sourceTitle}</h3>
                   <p className="text-stone-500 text-sm">
                     {t.sourceDesc}
                   </p>
                 </div>
                 <div className="flex-grow">
                   <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} t={t} />
                 </div>
              </div>

              {/* Right Column: Decoder */}
              <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col bg-stone-50/50">
                 
                 {/* Mobile Reset */}
                 {result && (
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors mb-6 md:hidden"
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
                   <div className="flex-grow flex flex-col items-center justify-center text-stone-400 space-y-6 animate-pulse py-12">
                      <KeyIllustration className="w-32 h-32 opacity-50 grayscale animate-bounce" />
                      <p className="text-lg font-medium font-serif italic text-stone-500">{t.unlocking}</p>
                   </div>
                 ) : result ? (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full">
                     <h2 className="text-2xl font-bold text-stone-800 mb-6 hidden md:block">{t.clarityTitle}</h2>
                     <AnalysisDashboard result={result} onSave={handleSaveMemory} t={t} />
                  </div>
                 ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                     <div className="w-48 h-48 mb-6 text-stone-300 animate-float">
                         <DecodingIllustration className="w-full h-full" />
                     </div>
                     <h3 className="text-xl font-semibold text-stone-700 mb-2">{t.readyTitle}</h3>
                     <p className="text-stone-500 max-w-xs mx-auto text-sm">
                       {t.readyDesc}
                     </p>
                  </div>
                 )}
              </div>

           </div>
        </div>
      </section>

      {/* -------------------- SECTION 5: WHY IT HELPS -------------------- */}
      <section className="py-24 bg-sage-50 border-t border-stone-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <h2 className="text-3xl font-bold text-stone-800 mb-12">Why we built this</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                <span className="text-4xl mb-4 block">😰</span>
                <h3 className="text-lg font-bold text-stone-800 mb-2">Reduces Social Anxiety</h3>
                <p className="text-stone-600">Stop spiraling over "what did they mean by that period?" We give you a factual breakdown so you can relax.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                <span className="text-4xl mb-4 block">🧠</span>
                <h3 className="text-lg font-bold text-stone-800 mb-2">Built for Neurodiversity</h3>
                <p className="text-stone-600">Designed specifically for Autistic and ADHD brains that process information literally or intensely.</p>
              </div>
           </div>
        </div>
      </section>

      {/* -------------------- SECTION 6: FOOTER CTA -------------------- */}
      <footer className="bg-stone-900 text-stone-300 py-24">
         <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-4xl font-bold text-white mb-6">Let's make sense of things together.</h2>
            <p className="text-stone-400 mb-10 text-lg">Join thousands of users communicating with more clarity and less stress.</p>
            
            <button 
              onClick={() => setShowExtensionModal(true)}
              className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-forest text-white rounded-full font-bold text-xl shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all mb-16"
            >
              Join the Beta
            </button>

            <div className="border-t border-stone-800 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
               <div className="flex items-center gap-2 text-stone-100 font-semibold">
                 <BrainLogo size={24} /> Neuro-Sense
               </div>
               
               <div className="flex items-center gap-6">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Accessibility</a>
               </div>

               <div className="flex items-center gap-2">
                 <Globe size={16} />
                 <select 
                   value={language} 
                   onChange={(e) => setLanguage(e.target.value as Language)}
                   className="bg-stone-800 border border-stone-700 text-stone-200 text-xs rounded-md px-2 py-1 outline-none"
                 >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                    <option value="ja">日本語</option>
                 </select>
               </div>
            </div>
         </div>
      </footer>

      <PanicButton t={t} />

      {/* Extension Modal (Same as before) */}
      {showExtensionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
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
