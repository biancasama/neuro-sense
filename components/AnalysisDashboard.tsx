
import React, { useState } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { Copy, Check, Mic } from 'lucide-react';

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

  return (
    <div className="space-y-12 pb-12">
      
      {/* SECTION 1: INTERPRETATIONS */}
      <div>
        <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${textPrimary}`}>Interpretations</h2>
        
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
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          <div className="md:col-span-2 mb-2 md:mb-0">
             <h3 className={`text-sm font-bold uppercase tracking-wide mb-4 ${textSecondary}`}>Key Signals</h3>
          </div>
          
           {/* Card 1: Literal */}
           <InterpretationCard 
            title={result.literalMeaning} 
            label="Literal Meaning"
            confidence="High" 
            theme={theme}
          />
          
          {/* Card 2: Risk Level */}
          <InterpretationCard 
            title={result.riskLevel === 'Safe' ? 'Safe to reply' : (result.riskLevel === 'Caution' ? 'Proceed with caution' : 'Conflict detected')} 
            label="Risk Assessment"
            confidence={result.confidenceScore > 80 ? 'High' : 'Medium'} 
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

  return (
    <div className={`p-6 rounded-3xl border ${border} ${specificBg} flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow h-full min-h-[160px]`}>
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 block">{label}</span>
        <p className={`text-lg font-medium leading-tight ${textPrimary} line-clamp-4`}>
          {title}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-stone-200/50 flex justify-end">
         <span className="text-xs text-stone-400 font-medium bg-stone-100/50 px-2 py-1 rounded-md">{confidence} Confidence</span>
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
