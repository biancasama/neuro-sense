
import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Paperclip, Mic, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AnalysisResult } from '../types';
import AnalysisDashboard from './AnalysisDashboard';
import { fileToGenerativePart } from '../services/geminiService';

interface RightDecoderProps {
  onAnalyze: (text: string, useDeepContext: boolean, imageBase64?: string, imageMimeType?: string) => Promise<void>;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  onSaveMemory: () => void;
  t: any;
}

const RightDecoder: React.FC<RightDecoderProps> = ({ onAnalyze, isAnalyzing, result, onSaveMemory, t }) => {
  const [inputText, setInputText] = useState('');
  
  // Quick Actions
  const handleQuickAction = (action: string) => {
    let prompt = inputText;
    if (action === "sarcasm") prompt += " (Please specifically check for sarcasm or irony)";
    if (action === "action_items") prompt += " (Please list only the concrete action items)";
    if (action === "explain") prompt += " (Explain the subtext like I'm 5)";
    
    onAnalyze(prompt, true);
  };

  const handleKeySubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) onAnalyze(inputText, false);
    }
  };

  return (
    <div className="h-full bg-stone-50 border-l border-stone-200 flex flex-col w-full">
      
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-white/50 backdrop-blur-md">
        <h2 className="text-sm font-bold text-stone-700 flex items-center gap-2">
          <Sparkles size={16} className="text-forest" />
          The Decoder
        </h2>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-4">
        
        {/* Results Stream */}
        {isAnalyzing ? (
           <div className="flex flex-col items-center justify-center py-12 space-y-4 text-stone-400 animate-pulse">
             <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center">
               <Loader2 size={24} className="animate-spin text-stone-500" />
             </div>
             <p className="text-sm font-medium">Decoding social cues...</p>
           </div>
        ) : result ? (
           <div className="animate-in fade-in slide-in-from-bottom-4">
             <AnalysisDashboard result={result} onSave={onSaveMemory} t={t} compact={true} />
             <button 
               onClick={() => { /* Reset logic handled by parent or just overwrite */ setInputText('') }} 
               className="w-full mt-4 py-2 text-xs text-stone-400 hover:text-stone-600 underline"
             >
               Analyze another message
             </button>
           </div>
        ) : (
           /* Empty State / Onboarding */
           <div className="py-8 text-center">
             <p className="text-sm text-stone-500 mb-6 px-4">
               Paste a confusing message below to decode its hidden meaning.
             </p>
             
             {/* Quick Prompts Chips */}
             <div className="flex flex-wrap justify-center gap-2 px-2">
               <button 
                onClick={() => handleQuickAction("sarcasm")}
                className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all"
               >
                 Detect Sarcasm
               </button>
               <button 
                onClick={() => handleQuickAction("action_items")}
                className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
               >
                 Identify Action Items
               </button>
               <button 
                onClick={() => handleQuickAction("explain")}
                className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
               >
                 Explain Subtext
               </button>
             </div>
           </div>
        )}

      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="p-4 bg-white border-t border-stone-200 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
        <div className="relative">
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeySubmit}
            placeholder="Paste text here..."
            className="w-full h-24 bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30 resize-none custom-scrollbar"
          />
          
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-200 rounded-lg transition-colors">
              <ImageIcon size={16} />
            </button>
            <button 
              onClick={() => { if(inputText.trim()) onAnalyze(inputText, false) }}
              disabled={!inputText.trim() || isAnalyzing}
              className="bg-forest hover:bg-forest/90 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RightDecoder;
