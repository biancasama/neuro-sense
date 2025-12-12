import React, { useState } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { Copy, Check } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
  onSave: () => void;
  t: any;
  theme: 'light' | 'dark';
  compact?: boolean;
}

const AnalysisDashboard: React.FC<Props> = ({ result, theme, compact }) => {
  if (!result) return null;

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';
  const textSecondary = theme === 'dark' ? 'text-stone-400' : 'text-stone-500';
  const cardBg = theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-[#F9FAFB]';
  const borderCol = theme === 'dark' ? 'border-[#383838]' : 'border-stone-100';

  return (
    <div className="space-y-8 pb-8">
      
      {/* SECTION 1: INTERPRETATIONS */}
      <div>
        <h2 className={`text-3xl font-bold mb-6 ${textPrimary}`}>Interpretations</h2>
        
        {/* Summary */}
        <div className="mb-6">
          <h3 className={`text-sm font-semibold mb-2 ${textSecondary}`}>Summary</h3>
          <p className={`text-xl font-medium leading-relaxed ${textPrimary}`}>
            {result.emotionalSubtext}
          </p>
        </div>

        {/* Possible Interpretations List */}
        <div className="space-y-4">
          <h3 className={`text-sm font-semibold mb-2 ${textSecondary}`}>Possible interpretations</h3>
          
          {/* Card 1: Tone/Vibe */}
          <InterpretationCard 
            title={result.vocalTone && !result.vocalTone.includes("Text only") ? result.vocalTone : "Neutral / Ambiguous tone"} 
            confidence="Medium" 
            theme={theme}
          />

           {/* Card 2: Literal */}
           <InterpretationCard 
            title={result.literalMeaning} 
            confidence="High" 
            theme={theme}
          />
          
          {/* Card 3: Risk Level */}
          <InterpretationCard 
            title={result.riskLevel === 'Safe' ? 'Safe to reply' : (result.riskLevel === 'Caution' ? 'Proceed with caution' : 'Conflict detected')} 
            confidence={result.confidenceScore > 80 ? 'High' : 'Medium'} 
            theme={theme}
          />
        </div>
      </div>

      {/* SECTION 2: SUGGESTED REPLIES */}
      <div>
        <h2 className={`text-3xl font-bold mb-6 ${textPrimary}`}>Suggested Replies</h2>
        
        <div className="space-y-4">
          {result.suggestedResponse.map((reply, idx) => (
             <ReplyCard 
               key={idx} 
               text={reply} 
               label={idx === 0 ? "Short, Clarity" : (idx === 1 ? "Neutral, Boundary" : "Direct, Call it out")}
               theme={theme} 
             />
          ))}
        </div>

        {/* "Generate replies" Toggle Section from Mockup */}
        <div className="mt-8">
           <h3 className={`text-sm font-semibold mb-3 ${textSecondary}`}>Generate replies</h3>
           <div className={`p-4 rounded-2xl flex items-center justify-between ${cardBg} border ${borderCol}`}>
              <span className={`font-medium ${textPrimary}`}>Suggest highlighted replies</span>
              <div className={`w-12 h-6 rounded-full relative ${theme === 'dark' ? 'bg-indigo-500/30' : 'bg-indigo-100'}`}>
                <div className="absolute right-1 top-1 w-4 h-4 bg-indigo-500 rounded-full"></div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

interface InterpretationCardProps {
  title: string;
  confidence: string;
  theme: 'light' | 'dark';
}

const InterpretationCard: React.FC<InterpretationCardProps> = ({ title, confidence, theme }) => {
  const cardBg = theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-[#FFFBF5]'; // Slight warmth for light mode card per mockup
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';
  
  // Mockup has specific creamy/yellowish bg for interpretation cards
  const specificBg = theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-[#FFFCF6]'; 
  const border = theme === 'dark' ? 'border-[#383838]' : 'border-stone-100';

  return (
    <div className={`p-5 rounded-2xl border ${border} ${specificBg} flex items-end justify-between shadow-sm`}>
      <div className="pr-4">
        <p className={`text-lg font-medium leading-tight ${textPrimary}`}>
          {title}
        </p>
        <span className="text-xs text-stone-400 mt-2 block">{confidence} confidence</span>
      </div>
      <span className="text-xs text-stone-400 font-medium">{confidence}</span>
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
    <div className={`p-5 rounded-2xl border ${border} ${cardBg} shadow-sm relative group`}>
       <p className={`text-lg font-medium mb-4 pr-12 ${textPrimary}`}>
         {text}
       </p>
       <p className="text-xs text-stone-400">{label}</p>

       <button 
         onClick={handleCopy}
         className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-green-500 text-white' : (theme === 'dark' ? 'bg-[#383838] text-stone-300 hover:bg-[#454545]' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100')}`}
       >
         {copied ? "Copied" : "Copy"}
       </button>
    </div>
  );
};

export default AnalysisDashboard;