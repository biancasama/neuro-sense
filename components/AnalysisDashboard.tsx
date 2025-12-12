
import React, { useState } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { Copy, Check, Mic, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
  onSave: () => void;
  t: any;
  theme: 'light' | 'dark';
  compact?: boolean;
}

const AnalysisDashboard: React.FC<Props> = ({ result, theme, compact, t }) => {
  if (!result) return null;

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
           <div className={`p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-opacity-80 transition-all ${cardBg} border ${borderCol}`}>
              <span className={`font-medium text-lg ${textPrimary}`}>Suggest more replies</span>
              <div className={`w-14 h-7 rounded-full relative ${theme === 'dark' ? 'bg-indigo-500/30' : 'bg-indigo-100'}`}>
                <div className="absolute right-1 top-1 w-5 h-5 bg-indigo-500 rounded-full shadow-sm"></div>
              </div>
           </div>
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
}

const ReplyCard: React.FC<ReplyCardProps> = ({ text, label, theme }) => {
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
    <div className={`p-6 rounded-3xl border ${border} ${cardBg} shadow-sm relative group hover:shadow-md transition-all flex flex-col justify-between h-full`}>
       <p className={`text-xl font-medium mb-6 pr-4 leading-relaxed ${textPrimary}`}>
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
