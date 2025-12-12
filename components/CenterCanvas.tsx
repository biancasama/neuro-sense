
import React, { useState, useEffect } from 'react';
import { PenTool, MoveHorizontal, Wand2, AlertTriangle, RefreshCw, Check, Globe, Book } from 'lucide-react';
import { refineMessage } from '../services/geminiService';
import ScriptLibrary from './ScriptLibrary';

interface CenterCanvasProps {
  t: any;
}

const CULTURES = [
  "General / Neutral",
  "American (Direct/Friendly)",
  "British (Polite/Indirect)",
  "Japanese (High Context/Formal)",
  "German (Direct/Professional)",
  "French (Formal/Structured)",
  "Brazilian (Warm/Expressive)"
];

const CenterCanvas: React.FC<CenterCanvasProps> = ({ t }) => {
  const [draft, setDraft] = useState('');
  const [toneValue, setToneValue] = useState(50); // 0-100
  const [culturalContext, setCulturalContext] = useState(CULTURES[0]);
  
  const [isRefining, setIsRefining] = useState(false);
  const [refinementResult, setRefinementResult] = useState<{ rewrittenText: string; bluntnessAlert: string | null; explanation: string } | null>(null);

  // Script Library State
  const [showScriptLibrary, setShowScriptLibrary] = useState(false);

  // Tone labels based on slider logic
  const getToneLabel = () => {
    if (toneValue < 33) return "Direct & Neutral";
    if (toneValue < 67) return "Warm & Friendly";
    return "Formal & Professional";
  };
  
  // Dynamic Emoji based on tone
  const getToneEmoji = () => {
      if (toneValue < 33) return "⚡";
      if (toneValue < 67) return "☕";
      return "💼";
  }

  const handleRefine = async () => {
    if (!draft.trim()) return;
    setIsRefining(true);
    setRefinementResult(null);
    try {
      const result = await refineMessage(draft, toneValue, culturalContext);
      setRefinementResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefining(false);
    }
  };

  const applyRefinement = () => {
    if (refinementResult) {
      setDraft(refinementResult.rewrittenText);
      setRefinementResult(null);
    }
  };

  const handleInsertScript = (script: string) => {
    setDraft(prev => (prev ? prev + "\n" + script : script));
    setShowScriptLibrary(false);
  };

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* 1. Tone Toolbar */}
      <div className="h-20 border-b border-stone-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm z-10 sticky top-0 gap-6">
        
        {/* Left: Label */}
        <div className="flex items-center gap-2 text-forest/80 font-semibold text-sm w-24 flex-shrink-0">
          <PenTool size={16} />
          <span>Drafting</span>
        </div>

        {/* Center: Slider & Context */}
        <div className="flex flex-col flex-grow max-w-lg mx-auto gap-2 py-2">
           
           {/* Top Row: Context & Value */}
           <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                 <Globe size={12} className="text-stone-400"/>
                 <select 
                   value={culturalContext}
                   onChange={(e) => setCulturalContext(e.target.value)}
                   className="text-[10px] uppercase font-bold text-stone-500 bg-transparent outline-none cursor-pointer hover:text-forest transition-colors"
                 >
                    {CULTURES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
              <span className="text-xs font-bold text-forest tabular-nums flex items-center gap-1">
                 {getToneLabel()} {getToneEmoji()}
              </span>
           </div>

           {/* Slider */}
           <div className="relative h-6 flex items-center group">
             {/* Gradient Track */}
             <div className="absolute inset-x-0 h-1.5 rounded-full bg-gradient-to-r from-stone-300 via-amber-200 to-indigo-200"></div>
             
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={toneValue}
               onChange={(e) => setToneValue(parseInt(e.target.value))}
               className="relative w-full h-1.5 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
             />
           </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
            <button
                onClick={() => setShowScriptLibrary(true)}
                className="bg-stone-100 text-stone-600 p-2 rounded-lg hover:bg-stone-200 transition-colors"
                title="Open Script Library"
            >
                <Book size={16} />
            </button>
            <button 
            onClick={handleRefine}
            disabled={!draft.trim() || isRefining}
            className="bg-forest text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:shadow-md hover:bg-forest/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
            {isRefining ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
            Check Tone
            </button>
        </div>
      </div>

      {/* 2. Drafting Area */}
      <div className="flex-grow p-8 relative overflow-hidden flex flex-col">
        
        {/* The Editor */}
        <textarea 
          className="w-full flex-grow resize-none outline-none text-xl md:text-2xl font-light text-stone-800 placeholder-stone-300 bg-transparent leading-relaxed custom-scrollbar"
          placeholder="Brain dump your thoughts here. We'll help with the tone..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
        />

        {/* --- REFINEMENT OVERLAY (If Results Exist) --- */}
        {refinementResult && (
           <div className="absolute bottom-6 left-6 right-6 animate-in slide-in-from-bottom-4 duration-300 z-20">
              
              {/* Bluntness Alert (Conditional) */}
              {refinementResult.bluntnessAlert && (
                <div className="mb-3 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                   <div className="p-2 bg-red-100 rounded-full text-red-600">
                     <AlertTriangle size={18} />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-1">Bluntness Alert</h4>
                      <p className="text-sm text-red-800 leading-relaxed">
                        {refinementResult.bluntnessAlert}
                      </p>
                   </div>
                </div>
              )}

              {/* Suggestion Card */}
              <div className="bg-white border border-forest/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                 <div className="flex-grow p-6">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">Suggested Rewrite</span>
                       <span className="px-2 py-0.5 rounded-full bg-forest/10 text-forest text-[10px] font-bold">
                          {culturalContext.split(' ')[0]}
                       </span>
                    </div>
                    <p className="text-lg text-stone-800 font-medium leading-relaxed">
                       "{refinementResult.rewrittenText}"
                    </p>
                    <p className="mt-3 text-xs text-stone-500 italic border-l-2 border-stone-200 pl-2">
                       Why: {refinementResult.explanation}
                    </p>
                 </div>

                 {/* Actions */}
                 <div className="bg-stone-50 border-t md:border-t-0 md:border-l border-stone-100 p-4 flex md:flex-col items-center justify-center gap-3 min-w-[120px]">
                    <button 
                      onClick={applyRefinement}
                      className="w-full bg-forest text-white py-2 px-4 rounded-xl text-sm font-bold shadow-sm hover:bg-forest/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={16} /> Apply
                    </button>
                    <button 
                      onClick={() => setRefinementResult(null)}
                      className="w-full bg-white border border-stone-200 text-stone-500 py-2 px-4 rounded-xl text-sm font-bold hover:bg-stone-100 transition-all"
                    >
                      Dismiss
                    </button>
                 </div>
              </div>
           </div>
        )}
        
        {/* --- SCRIPT LIBRARY MODAL --- */}
        {showScriptLibrary && (
            <ScriptLibrary 
                onSelectScript={handleInsertScript} 
                onClose={() => setShowScriptLibrary(false)}
                culture={culturalContext}
            />
        )}

      </div>

      {/* 3. Bottom Status Bar */}
      <div className="h-12 border-t border-stone-100 flex items-center justify-between px-8 bg-stone-50/50 text-xs text-stone-400">
        <span>AI-Assisted Tone Check</span>
        <div className="flex items-center gap-4">
          <span>{draft.length} chars</span>
          <span>{draft.split(' ').filter(x => x).length} words</span>
        </div>
      </div>

    </div>
  );
};

export default CenterCanvas;
