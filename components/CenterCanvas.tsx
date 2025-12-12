
import React, { useState, useEffect } from 'react';
import { PenTool, MoveHorizontal, Wand2 } from 'lucide-react';

interface CenterCanvasProps {
  t: any;
}

const CenterCanvas: React.FC<CenterCanvasProps> = ({ t }) => {
  const [draft, setDraft] = useState('');
  const [toneValue, setToneValue] = useState(50);
  const [ghostText, setGhostText] = useState('');
  
  // Tone labels based on slider
  const getToneLabel = () => {
    if (toneValue < 20) return "Casual & Friendly 🌞";
    if (toneValue < 40) return "Warm & Polite ☕";
    if (toneValue < 60) return "Neutral & Clear ⚖️";
    if (toneValue < 80) return "Professional 💼";
    return "Formal & Firm 🏛️";
  };

  // Simple ghost text simulation
  useEffect(() => {
    if (draft.toLowerCase().endsWith('i think')) {
      setGhostText(' we should consider the timeline.');
    } else if (draft.toLowerCase().endsWith('thank you')) {
      setGhostText(' for your patience.');
    } else if (draft.toLowerCase().endsWith('can we')) {
      setGhostText(' schedule a quick sync?');
    } else {
      setGhostText('');
    }
  }, [draft]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && ghostText) {
      e.preventDefault();
      setDraft(prev => prev + ghostText);
      setGhostText('');
    }
  };

  return (
    <div className="h-full bg-white flex flex-col relative">
      {/* 1. Tone Toolbar */}
      <div className="h-16 border-b border-stone-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
        <div className="flex items-center gap-2 text-forest/80 font-semibold text-sm">
          <PenTool size={16} />
          <span>Drafting</span>
        </div>

        <div className="flex items-center gap-4 flex-grow max-w-md mx-8">
           <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wide">Tone</span>
           <div className="relative flex-grow h-8 flex items-center group">
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={toneValue}
               onChange={(e) => setToneValue(parseInt(e.target.value))}
               className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
             />
             {/* Tooltip for tone */}
             <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs py-1 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
               {getToneLabel()}
             </div>
           </div>
           <span className="text-xs font-medium text-stone-600 w-32 text-right tabular-nums">{getToneLabel()}</span>
        </div>
      </div>

      {/* 2. Drafting Area */}
      <div className="flex-grow p-8 relative overflow-hidden">
        
        {/* The Editor */}
        <div className="relative w-full h-full max-w-3xl mx-auto">
          
          {/* Ghost Text Overlay (Visual only, positioned absolutely behind user text logic would be complex, 
              so here we append it visually if input was a div, but for textarea we use a simple placeholder trick 
              or just append logic. For this wireframe, we rely on the Tab interaction) */}
          
          <textarea 
            className="w-full h-full resize-none outline-none text-xl md:text-2xl font-light text-stone-800 placeholder-stone-300 bg-transparent leading-relaxed"
            placeholder="Brain dump your thoughts here - don't worry about tone yet..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />

          {/* Ghost Text Helper - Floating near cursor is hard in simple textarea, so we float it bottom right */}
          {ghostText && (
            <div className="absolute bottom-8 right-8 animate-in fade-in slide-in-from-bottom-2">
               <div className="bg-white border border-forest/20 shadow-lg rounded-full px-4 py-2 flex items-center gap-3">
                 <span className="text-stone-400 text-sm">Press <kbd className="font-sans bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 text-xs font-bold text-stone-600">Tab</kbd> to add:</span>
                 <span className="text-forest font-medium italic">"{ghostText}"</span>
                 <Wand2 size={14} className="text-purple-400" />
               </div>
            </div>
          )}

          {/* Tone Highlights Simulation */}
          {draft.toLowerCase().includes('sorry') && (
            <div className="absolute top-2 right-2 group">
              <span className="w-3 h-3 bg-purple-400 rounded-full block cursor-pointer animate-pulse"></span>
              <div className="absolute right-0 top-5 w-64 bg-white border border-purple-100 p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all z-20">
                <p className="text-xs text-stone-600 mb-1">You're apologizing unnecessarily.</p>
                <p className="text-xs font-bold text-purple-600">Try: "Thanks for catching that."</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 3. Bottom Status Bar */}
      <div className="h-12 border-t border-stone-100 flex items-center justify-between px-8 bg-stone-50/50 text-xs text-stone-400">
        <span>Draft saved just now</span>
        <div className="flex items-center gap-4">
          <span>{draft.length} chars</span>
          <span>{draft.split(' ').filter(x => x).length} words</span>
        </div>
      </div>

    </div>
  );
};

export default CenterCanvas;
