
import React, { useState, useEffect } from 'react';
import { AnalysisResult, Language } from './types';
import { analyzeMessageContext } from './services/geminiService';
import { Sparkles, MessageSquare, Zap, ShieldCheck, Copy, ArrowRight, Upload, Type, Mic, BrainCircuit } from 'lucide-react';
import { BrainLogo } from './components/Header';
import { translations } from './utils/translations';

// --- Dark Mode Specific Sub-Components ---

const NeonBadge: React.FC<{ children: React.ReactNode, color?: 'cyan' | 'violet' }> = ({ children, color = 'cyan' }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${color === 'cyan' ? 'border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5' : 'border-neon-violet/30 text-neon-violet bg-neon-violet/5'}`}>
    {children}
  </span>
);

const FeatureIcon: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-3 group cursor-pointer">
    <div className="w-14 h-14 rounded-2xl bg-charcoal-elevated border border-white/5 flex items-center justify-center text-text-secondary group-hover:text-neon-cyan group-hover:border-neon-cyan/50 group-hover:shadow-neon-cyan transition-all duration-300">
      {icon}
    </div>
    <span className="text-xs font-medium text-text-secondary group-hover:text-white transition-colors">{label}</span>
  </div>
);

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  
  // Minimal state for this mockup version
  const [language] = useState<Language>('en');
  const t = translations[language];

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      // Hardcoded dummy response if API fails or for instant preview if needed, 
      // but we will try to use the real service.
      const data = await analyzeMessageContext(text, true, 'English');
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback mockup data for demo purposes if API key isn't set
      setResult({
        riskLevel: 'Caution' as any,
        confidenceScore: 88,
        literalMeaning: "They are saying they are 'fine', but the punctuation suggests otherwise.",
        emotionalSubtext: "The use of the single word 'Fine' followed by a period often indicates passive aggression or suppressed frustration. They likely want you to ask what is wrong.",
        vocalTone: "Text only - clipped and abrupt.",
        suggestedResponse: [
          "I sense something might be wrong. Want to talk?",
          "Okay, let me know if you change your mind.",
          "I'm here when you're ready."
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal font-sans text-text-primary selection:bg-neon-cyan/30 selection:text-neon-cyan flex flex-col">
      
      {/* ---------------- SECTION 1: HERO ---------------- */}
      <section className="relative w-full pt-16 pb-24 px-4 flex flex-col items-center z-10">
        
        {/* Background Gradient Mesh */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#1a1a2e] to-charcoal -z-10 opacity-50 pointer-events-none"></div>
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Logo Area */}
        <div className="mb-8 flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <BrainLogo size={64} className="text-neon-cyan drop-shadow-[0_0_15px_rgba(143,247,244,0.4)] mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
            Neuro<span className="text-neon-cyan">-</span>Sense
          </h1>
          <p className="text-text-secondary text-lg tracking-wide font-light">
            Context Decoder & Assistant
          </p>
        </div>

        {/* Glassy Input Panel */}
        <div className="w-full max-w-3xl glass-panel rounded-3xl p-1 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 mb-1">
             <button 
                onClick={() => setActiveTab('text')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-charcoal-elevated text-white shadow-lg' : 'text-text-secondary hover:bg-white/5'}`}
             >
               <Type size={16} /> Paste Text
             </button>
             <button 
                onClick={() => setActiveTab('image')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'image' ? 'bg-charcoal-elevated text-white shadow-lg' : 'text-text-secondary hover:bg-white/5'}`}
             >
               <Upload size={16} /> Upload Screenshot
             </button>
          </div>

          {/* Input Area */}
          <div className="bg-charcoal-surface rounded-2xl p-6 min-h-[200px] flex flex-col relative border border-white/5">
             <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={activeTab === 'text' ? "Paste the confusing message here..." : "Click to upload image..."}
                className="w-full h-full bg-transparent resize-none outline-none text-lg text-text-primary placeholder-text-secondary/30 font-light leading-relaxed flex-grow"
                disabled={isAnalyzing}
             />
             
             {/* Action Bar inside Input */}
             <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex gap-2">
                   <button className="p-2 rounded-full hover:bg-white/5 text-text-secondary transition-colors" title="Add Voice Context">
                     <Mic size={18} />
                   </button>
                   <button className="p-2 rounded-full hover:bg-white/5 text-text-secondary transition-colors" title="Deep Context">
                     <BrainCircuit size={18} />
                   </button>
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={!text || isAnalyzing}
                  className={`px-8 py-2.5 rounded-full font-semibold text-charcoal transition-all shadow-neon-cyan flex items-center gap-2 ${isAnalyzing ? 'bg-gray-600 cursor-wait' : 'bg-neon-cyan hover:bg-[#A5FBF8] hover:scale-105'}`}
                >
                  {isAnalyzing ? 'Decoding...' : <>Analyze <ArrowRight size={16} /></>}
                </button>
             </div>
          </div>
        </div>

      </section>

      {/* ---------------- SECTION 2: ANALYSIS ZONE (Horizontal Cards) ---------------- */}
      {result && (
        <section className="w-full max-w-6xl mx-auto px-4 mb-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
           
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <Sparkles className="text-neon-violet" size={24} /> 
               Analysis Results
             </h2>
             <NeonBadge color="violet">{result.riskLevel} Risk</NeonBadge>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             
             {/* Card 1: Tone (Vocal Tone or inferred) */}
             <div className="bg-charcoal-surface rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-neon-cyan/50 transition-colors">
               <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan"></div>
               <div className="mb-4 text-neon-cyan">
                 <Zap size={28} />
               </div>
               <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-2">Inferred Tone</h3>
               <p className="text-text-primary text-lg font-light leading-relaxed">
                 {result.vocalTone || "Neutral / Ambiguous"}
               </p>
             </div>

             {/* Card 2: Intention (Literal) */}
             <div className="bg-charcoal-surface rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-white/20 transition-colors">
               <div className="absolute top-0 left-0 w-1 h-full bg-white/20"></div>
               <div className="mb-4 text-white">
                 <MessageSquare size={28} />
               </div>
               <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-2">Literal Meaning</h3>
               <p className="text-text-primary text-lg font-light leading-relaxed">
                 {result.literalMeaning}
               </p>
             </div>

             {/* Card 3: Subtext */}
             <div className="bg-charcoal-surface rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-neon-violet/50 transition-colors shadow-neon-violet">
               <div className="absolute top-0 left-0 w-1 h-full bg-neon-violet"></div>
               <div className="mb-4 text-neon-violet">
                 <BrainCircuit size={28} />
               </div>
               <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-2">Hidden Subtext</h3>
               <p className="text-text-primary text-lg font-light leading-relaxed">
                 {result.emotionalSubtext}
               </p>
             </div>

           </div>
        </section>
      )}

      {/* ---------------- SECTION 3: REPLY SUGGESTIONS (Carousel Row) ---------------- */}
      {result && (
        <section className="w-full border-t border-white/5 bg-charcoal-surface/30 py-16 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-8 pl-2">Suggested Replies</h3>
            
            {/* Carousel Container */}
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
              
              {/* Reply 1: Warm */}
              <div className="snap-center shrink-0 w-[300px] md:w-[350px] bg-charcoal-surface p-6 rounded-2xl border border-white/5 hover:border-neon-cyan/30 transition-all group flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                   <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#8FF7F4]"></div>
                   <span className="text-[10px] font-bold uppercase text-neon-cyan tracking-widest">Warm</span>
                </div>
                <p className="text-text-primary font-medium mb-6 flex-grow">"{result.suggestedResponse[0]}"</p>
                <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-neon-cyan/10 hover:text-neon-cyan text-text-secondary text-xs font-bold transition-colors flex items-center justify-center gap-2">
                  <Copy size={12} /> Copy to Clipboard
                </button>
              </div>

              {/* Reply 2: Neutral */}
              <div className="snap-center shrink-0 w-[300px] md:w-[350px] bg-charcoal-surface p-6 rounded-2xl border border-white/5 hover:border-white/30 transition-all group flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                   <div className="w-2 h-2 rounded-full bg-text-secondary/50"></div>
                   <span className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Neutral</span>
                </div>
                <p className="text-text-primary font-medium mb-6 flex-grow">"{result.suggestedResponse[1] || result.suggestedResponse[0]}"</p>
                <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white text-text-secondary text-xs font-bold transition-colors flex items-center justify-center gap-2">
                  <Copy size={12} /> Copy to Clipboard
                </button>
              </div>

               {/* Reply 3: Direct/Boundaries */}
               <div className="snap-center shrink-0 w-[300px] md:w-[350px] bg-charcoal-surface p-6 rounded-2xl border border-white/5 hover:border-neon-violet/30 transition-all group flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                   <div className="w-2 h-2 rounded-full bg-neon-violet shadow-[0_0_8px_#C8B8FF]"></div>
                   <span className="text-[10px] font-bold uppercase text-neon-violet tracking-widest">Direct</span>
                </div>
                <p className="text-text-primary font-medium mb-6 flex-grow">"{result.suggestedResponse[2] || result.suggestedResponse[0]}"</p>
                <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-neon-violet/10 hover:text-neon-violet text-text-secondary text-xs font-bold transition-colors flex items-center justify-center gap-2">
                  <Copy size={12} /> Copy to Clipboard
                </button>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ---------------- SECTION 4: FEATURES STRIP ---------------- */}
      <section className="py-20 w-full bg-charcoal flex justify-center border-t border-white/5">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          <FeatureIcon icon={<ShieldCheck size={28} />} label="Conflict Safety" />
          <FeatureIcon icon={<Zap size={28} />} label="Tone Analysis" />
          <FeatureIcon icon={<BrainCircuit size={28} />} label="Deep Context" />
          <FeatureIcon icon={<MessageSquare size={28} />} label="Smart Replies" />
        </div>
      </section>

      {/* ---------------- SECTION 5: FOOTER ---------------- */}
      <footer className="w-full py-16 bg-charcoal-elevated border-t border-white/5 flex flex-col items-center">
         <h2 className="text-2xl font-bold text-white mb-8">Ready to decode?</h2>
         <button className="px-10 py-3 rounded-lg border border-neon-cyan text-neon-cyan font-bold hover:bg-neon-cyan hover:text-charcoal transition-all shadow-neon-cyan tracking-wide">
           Start Free Trial
         </button>
         <div className="mt-12 text-text-secondary text-sm flex gap-6 opacity-50">
           <a href="#" className="hover:text-white transition-colors">Privacy</a>
           <a href="#" className="hover:text-white transition-colors">Terms</a>
           <a href="#" className="hover:text-white transition-colors">Contact</a>
         </div>
         <p className="mt-6 text-xs text-text-secondary/30">© 2024 Neuro-Sense. Designed for Dark Mode.</p>
      </footer>

    </div>
  );
};

export default App;
