
import React, { useState } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { Copy, Check, Mic, ShieldCheck, AlertTriangle, Zap, Sparkles, Loader2, HeartHandshake, Phone } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
  onSave: () => void;
  t: any;
  theme: 'light' | 'dark';
  compact?: boolean;
}

const AnalysisDashboard: React.FC<Props> = ({ result, theme, compact, t }) => {
  if (!result) return null;

  // SAFETY OVERRIDE: CRISIS MODE
  if (result.riskLevel === RiskLevel.CRISIS) {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto w-full">
            {/* Crisis Header */}
            <div className={`p-8 rounded-3xl border-2 mb-8 shadow-2xl ${theme === 'dark' ? 'bg-red-950/30 border-red-500/50' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-6 mb-6">
                    <div className="p-4 bg-red-500 text-white rounded-full animate-pulse shadow-lg shadow-red-500/40">
                        <HeartHandshake size={32} />
                    </div>
                    <div>
                        <h2 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-red-200' : 'text-red-800'}`}>
                            {t.crisisTitle || "Crisis Support Mode"}
                        </h2>
                        <p className={`text-lg font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                            {t.crisisDesc || "We detected signs of distress. You are not alone."}
                        </p>
                    </div>
                </div>
                
                {/* Validation Message from AI */}
                <div className={`p-6 rounded-2xl mb-8 ${theme === 'dark' ? 'bg-black/20 border border-white/5' : 'bg-white border border-red-100'}`}>
                    <p className={`text-xl md:text-2xl font-medium leading-relaxed italic ${theme === 'dark' ? 'text-red-100' : 'text-red-900'}`}>
                        "{result.emotionalSubtext}"
                    </p>
                </div>

                {/* Hotlines Grid */}
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 opacity-80 ${theme === 'dark' ? 'text-red-200' : 'text-red-800'}`}>Emergency Resources</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className={`p-5 rounded-2xl flex items-center gap-4 ${theme === 'dark' ? 'bg-red-900/40' : 'bg-white'} border border-red-500/20 shadow-sm`}>
                         <Phone size={24} className="text-red-500" />
                         <div>
                             <p className={`font-bold text-xs uppercase opacity-60 ${theme === 'dark' ? 'text-red-200' : 'text-red-900'}`}>USA / Canada</p>
                             <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-red-900'}`}>988</p>
                         </div>
                    </div>
                    <div className={`p-5 rounded-2xl flex items-center gap-4 ${theme === 'dark' ? 'bg-red-900/40' : 'bg-white'} border border-red-500/20 shadow-sm`}>
                         <Phone size={24} className="text-red-500" />
                         <div>
                             <p className={`font-bold text-xs uppercase opacity-60 ${theme === 'dark' ? 'text-red-200' : 'text-red-900'}`}>UK</p>
                             <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-red-900'}`}>111</p>
                         </div>
                    </div>
                    <div className={`p-5 rounded-2xl flex items-center gap-4 ${theme === 'dark' ? 'bg-red-900/40' : 'bg-white'} border border-red-500/20 shadow-sm`}>
                         <Phone size={24} className="text-red-500" />
                         <div>
                             <p className={`font-bold text-xs uppercase opacity-60 ${theme === 'dark' ? 'text-red-200' : 'text-red-900'}`}>Europe</p>
                             <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-red-900'}`}>112</p>
                         </div>
                    </div>
                     <div className={`p-5 rounded-2xl flex items-center gap-4 ${theme === 'dark' ? 'bg-red-900/40' : 'bg-white'} border border-red-500/20 shadow-sm`}>
                         <Phone size={24} className="text-red-500" />
                         <div>
                             <p className={`font-bold text-xs uppercase opacity-60 ${theme === 'dark' ? 'text-red-200' : 'text-red-900'}`}>Crisis Text Line</p>
                             <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-red-900'}`}>Text HOME to 741741</p>
                         </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className={`text-sm opacity-70 text-center max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>
                    {t.disclaimer || "Neuro-Sense is an AI tool. If you or someone else is in immediate danger, please call emergency services."}
                </p>
            </div>

            {/* Suggested Supportive Responses */}
             <div className="max-w-3xl mx-auto">
                 <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                    Supportive Responses
                 </h3>
                 <div className="space-y-4">
                    {result.suggestedResponse.map((reply, idx) => (
                        <ReplyCard key={idx} text={reply} label="Supportive" theme={theme} />
                    ))}
                 </div>
             </div>
        </div>
    )
  }

  // --- STANDARD DASHBOARD LOGIC ---

  const [moreRepliesOpen, setMoreRepliesOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';
  const textSecondary = theme === 'dark' ? 'text-stone-400' : 'text-stone-500';
  const cardBg = theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-[#F9FAFB]';
  const borderCol = theme === 'dark' ? 'border-[#383838]' : 'border-stone-100';

  // Check if vocal tone is meaningful (not just text fallback)
  const hasVocalAnalysis = result.vocalTone && !result.vocalTone.toLowerCase().includes("text only");

  // Vibe Check Colors & Icon
  const getVibeConfig = (level: string) => {
    switch (level) {
      case 'Safe': 
        return {
          bg: theme === 'dark' ? 'bg-emerald-900/30' : 'bg-green-100',
          text: theme === 'dark' ? 'text-emerald-300' : 'text-green-800',
          border: theme === 'dark' ? 'border-emerald-500/30' : 'border-green-200',
          icon: <ShieldCheck size={28} className={theme === 'dark' ? 'text-emerald-400' : 'text-green-600'} />,
          label: "Safe"
        };
      case 'Caution': 
        return {
          bg: theme === 'dark' ? 'bg-amber-900/30' : 'bg-yellow-100',
          text: theme === 'dark' ? 'text-amber-300' : 'text-yellow-800',
          border: theme === 'dark' ? 'border-amber-500/30' : 'border-yellow-200',
          icon: <AlertTriangle size={28} className={theme === 'dark' ? 'text-amber-400' : 'text-yellow-600'} />,
          label: "Caution"
        };
      case 'Conflict': 
        return {
          bg: theme === 'dark' ? 'bg-rose-900/30' : 'bg-red-100',
          text: theme === 'dark' ? 'text-rose-300' : 'text-red-800',
          border: theme === 'dark' ? 'border-rose-500/30' : 'border-red-200',
          icon: <Zap size={28} className={theme === 'dark' ? 'text-rose-400' : 'text-red-600'} />,
          label: "Conflict"
        };
      default: 
        return {
          bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-200',
          icon: <ShieldCheck size={28} />, label: "Unknown"
        };
    }
  };

  const vibe = getVibeConfig(result.riskLevel);

  const handleToggleMore = () => {
    if (moreRepliesOpen) {
      setMoreRepliesOpen(false);
      return;
    }
    
    setIsLoadingMore(true);
    // Simulate "thinking" time
    setTimeout(() => {
      setIsLoadingMore(false);
      setMoreRepliesOpen(true);
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* SECTION 1: INTERPRETATIONS */}
      <div>
        <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${textPrimary}`}>Interpretations</h2>
        
        {/* VIBE CHECK (Risk Assessment) */}
        <div className={`mb-8 p-6 rounded-3xl border flex items-center gap-6 ${vibe.bg} ${vibe.border}`}>
            <div className={`p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-sm`}>
              {vibe.icon}
            </div>
            <div>
               <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 opacity-80 ${vibe.text}`}>
                 {t.vibeCheck || "Vibe Check"}
               </h3>
               <p className={`text-2xl font-bold ${vibe.text}`}>
                 {vibe.label} <span className="text-base font-normal opacity-75">({result.confidenceScore}% Certainty)</span>
               </p>
            </div>
        </div>
        
        {/* Vocal Tone Section (Conditional) */}
        {hasVocalAnalysis && (
          <div className={`mb-8 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className="flex items-center gap-2 mb-3">
               <Mic size={20} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} />
               <h3 className={`text-sm font-bold uppercase tracking-wide ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                 {t.vocalToneLabel || "Vocal Tone Analysis"}
               </h3>
            </div>
            <p className={`text-xl font-medium leading-relaxed ${textPrimary}`}>
              {result.vocalTone}
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mb-8 p-6 rounded-2xl border border-transparent bg-opacity-50" style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          <h3 className={`text-sm font-bold uppercase tracking-wide mb-3 ${textSecondary}`}>Executive Summary</h3>
          <p className={`text-xl md:text-2xl font-medium leading-relaxed ${textPrimary}`}>
            {result.emotionalSubtext}
          </p>
        </div>

        {/* Possible Interpretations List */}
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 md:gap-6">
           <div className="mb-2 md:mb-0">
             <h3 className={`text-sm font-bold uppercase tracking-wide mb-4 ${textSecondary}`}>Key Signals</h3>
           </div>
           
           {/* Card 1: Literal */}
           <InterpretationCard 
            title={result.literalMeaning} 
            label="Literal Meaning"
            confidence={`${result.confidenceScore}%`} 
            theme={theme}
          />
          
        </div>
      </div>

      {/* SECTION 2: SUGGESTED REPLIES */}
      <div>
        <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${textPrimary}`}>Suggested Replies</h2>
        
        <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
          {result.suggestedResponse.map((reply, idx) => (
             <ReplyCard 
               key={idx} 
               text={reply} 
               label={idx === 0 ? "Short, Clarity" : (idx === 1 ? "Neutral, Boundary" : "Direct, Call it out")}
               theme={theme} 
             />
          ))}
        </div>

        {/* "Generate replies" Toggle Section */}
        <div className="mt-10 max-w-lg">
           <h3 className={`text-sm font-semibold mb-3 ${textSecondary}`}>Actions</h3>
           <div 
             onClick={handleToggleMore}
             className={`p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-opacity-80 transition-all ${cardBg} border ${borderCol}`}
           >
              <span className={`font-medium text-lg ${textPrimary}`}>Suggest more replies</span>
              <div className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${moreRepliesOpen || isLoadingMore ? 'bg-indigo-500' : (theme === 'dark' ? 'bg-indigo-500/30' : 'bg-indigo-100')}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${moreRepliesOpen || isLoadingMore ? 'right-1' : 'left-1'}`}></div>
              </div>
           </div>
           
           {/* Loading State */}
           {isLoadingMore && (
              <div className="mt-8 flex flex-col items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                 <Loader2 size={24} className="animate-spin text-indigo-500" />
                 <p className="text-sm font-medium text-indigo-500">Drafting alternate options...</p>
              </div>
           )}

           {/* Additional Replies */}
           {moreRepliesOpen && !isLoadingMore && (
              <div className="mt-6 space-y-6 md:grid md:grid-cols-1 md:gap-6 md:space-y-0 animate-in fade-in slide-in-from-top-4 duration-500">
                 <div className="md:col-span-1 pt-4 border-t border-dashed border-stone-200">
                   <p className={`text-xs font-bold uppercase tracking-wide mb-4 ${textSecondary}`}>Additional Options</p>
                   <div className="space-y-4">
                     <ReplyCard 
                       text="I need a little time to process this properly." 
                       label="Neutral, Pause" 
                       theme={theme}
                       compact={true}
                     />
                     <ReplyCard 
                       text="Can you clarify what you mean by that?" 
                       label="Curious, Clarifying" 
                       theme={theme}
                       compact={true} 
                     />
                     <ReplyCard 
                       text="Thanks for letting me know." 
                       label="Brief, Acknowledgment" 
                       theme={theme}
                       compact={true} 
                     />
                   </div>
                 </div>
              </div>
           )}
        </div>
      </div>

    </div>
  );
};

interface InterpretationCardProps {
  title: string;
  label: string;
  confidence: string;
  theme: 'light' | 'dark';
}

const InterpretationCard: React.FC<InterpretationCardProps> = ({ title, label, confidence, theme }) => {
  const specificBg = theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-[#FFFCF6]'; 
  const border = theme === 'dark' ? 'border-[#383838]' : 'border-stone-100';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';
  const badgeBg = theme === 'dark' ? 'bg-white/5' : 'bg-stone-100/50';

  return (
    <div className={`p-6 rounded-3xl border ${border} ${specificBg} flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow h-full min-h-[160px]`}>
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 block">{label}</span>
        <p className={`text-lg font-medium leading-tight ${textPrimary} line-clamp-4`}>
          {title}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-stone-200/50 flex justify-end">
         <span className={`text-xs text-stone-400 font-medium ${badgeBg} px-2 py-1 rounded-md`}>{confidence} Confidence</span>
      </div>
    </div>
  );
};

interface ReplyCardProps {
  text: string;
  label: string;
  theme: 'light' | 'dark';
  compact?: boolean;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ text, label, theme, compact }) => {
  const [copied, setCopied] = useState(false);
  
  const cardBg = theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white';
  const border = theme === 'dark' ? 'border-[#383838]' : 'border-stone-200';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`
      rounded-3xl border ${border} ${cardBg} shadow-sm relative group hover:shadow-md transition-all flex flex-col justify-between
      ${compact ? 'p-5' : 'p-6 h-full'}
    `}>
       <p className={`
         font-medium pr-4 leading-relaxed ${textPrimary}
         ${compact ? 'text-lg mb-4' : 'text-xl mb-6'}
       `}>
         "{text}"
       </p>
       
       <div className="flex items-center justify-between mt-auto">
         <p className="text-sm font-bold text-stone-400 uppercase tracking-wide">{label}</p>
         <button 
           onClick={handleCopy}
           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : (theme === 'dark' ? 'bg-[#383838] text-stone-300 hover:bg-[#454545]' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100')}`}
         >
           {copied ? <Check size={14}/> : <Copy size={14}/>}
           {copied ? "Copied" : "Copy"}
         </button>
       </div>
    </div>
  );
};

export default AnalysisDashboard;
