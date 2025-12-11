import React, { useState } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { Check, Copy, AlertTriangle, ShieldCheck, Zap, MessageSquare, BookOpen, Heart } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
}

const AnalysisDashboard: React.FC<Props> = ({ result }) => {
  if (!result) return null;

  const getRiskColors = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE:
        return {
          bg: 'bg-emerald-50/50',
          border: 'border-emerald-100',
          text: 'text-emerald-900',
          icon: <ShieldCheck className="w-5 h-5" />,
          barColor: 'bg-emerald-400'
        };
      case RiskLevel.CAUTION:
        return {
          bg: 'bg-amber-50/50',
          border: 'border-amber-100',
          text: 'text-amber-900',
          icon: <AlertTriangle className="w-5 h-5" />,
          barColor: 'bg-amber-400'
        };
      case RiskLevel.CONFLICT:
        return {
          bg: 'bg-rose-50/50',
          border: 'border-rose-100',
          text: 'text-rose-900',
          icon: <Zap className="w-5 h-5" />,
          barColor: 'bg-rose-400'
        };
    }
  };

  const theme = getRiskColors(result.riskLevel);

  return (
    <div className="w-full space-y-8 overflow-y-auto pr-2 custom-scrollbar">
      
      {/* 1. Literal Meaning Section */}
      <section className="relative">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
          <BookOpen size={16} />
          Translation
        </h3>
        <p className="text-stone-800 text-lg leading-relaxed font-medium">
          {result.literalMeaning}
        </p>
      </section>

      {/* 2. Emotional Subtext Section */}
      <section className={`rounded-2xl p-6 border ${theme.bg} ${theme.border} backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-4">
           <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.text} flex items-center gap-2`}>
            <Heart size={16} />
            Subtext
          </h3>
          <div className="flex items-center gap-2 bg-white/40 px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md">
             <span className="text-stone-600">Certainty: {result.confidenceScore}%</span>
             <div className="w-12 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div className={`h-full ${theme.barColor}`} style={{ width: `${result.confidenceScore}%` }}></div>
             </div>
          </div>
        </div>
        <p className={`${theme.text} text-base leading-relaxed`}>
          {result.emotionalSubtext}
        </p>
      </section>

      {/* 3. Suggested Response Section */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
          <MessageSquare size={16} />
          Suggested Reply
        </h3>
        <div className="space-y-4">
          {result.suggestedResponse.map((reply, index) => (
            <ReplyCard key={index} text={reply} />
          ))}
        </div>
      </section>

    </div>
  );
};

const ReplyCard: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-stone-200 hover:border-forest/30 hover:shadow-md transition-all group relative">
      <p className="text-stone-700 text-base leading-relaxed mb-8 font-medium">
        "{text}"
      </p>
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${copied ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default AnalysisDashboard;