import React, { useState } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { Check, Copy, AlertTriangle, ShieldCheck, Zap, MessageSquare, BookOpen, Heart, Activity } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
  t: any;
}

const VibeCheckGauge: React.FC<{ level: RiskLevel, t: any }> = ({ level, t }) => {
  const levels = [RiskLevel.SAFE, RiskLevel.CAUTION, RiskLevel.CONFLICT];
  
  const getStyles = (itemLevel: RiskLevel, isActive: boolean) => {
    // Inactive state styles
    if (!isActive) return 'bg-stone-50 text-stone-300 border-stone-100 scale-95 opacity-50 saturate-0';
    
    // Active state styles
    switch (itemLevel) {
      case RiskLevel.SAFE: return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200 shadow-md scale-100 font-bold';
      case RiskLevel.CAUTION: return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-200 shadow-md scale-100 font-bold';
      case RiskLevel.CONFLICT: return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-200 shadow-md scale-100 font-bold';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
        <Activity size={16} />
        {t.vibeCheck}
      </h3>
      
      <div className="flex items-center justify-between gap-3">
        {levels.map((l) => (
          <div 
            key={l}
            className={`
              flex-1 py-4 px-2 rounded-xl border text-center transition-all duration-500 ease-out flex flex-col items-center gap-2
              ${getStyles(l, level === l)}
            `}
          >
            {l === RiskLevel.SAFE && <ShieldCheck size={24} strokeWidth={level === l ? 2.5 : 1.5} />}
            {l === RiskLevel.CAUTION && <AlertTriangle size={24} strokeWidth={level === l ? 2.5 : 1.5} />}
            {l === RiskLevel.CONFLICT && <Zap size={24} strokeWidth={level === l ? 2.5 : 1.5} />}
            <span className="text-xs font-bold uppercase tracking-widest">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalysisDashboard: React.FC<Props> = ({ result, t }) => {
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
      
      {/* 0. Vibe Check Gauge */}
      <VibeCheckGauge level={result.riskLevel} t={t} />

      {/* 1. Literal Meaning Section */}
      <section className="relative">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
          <BookOpen size={16} />
          {t.translation}
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
            {t.subtext}
          </h3>
          <div className="flex items-center gap-2 bg-white/40 px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md">
             <span className="text-stone-600">{t.certainty}: {result.confidenceScore}%</span>
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
          {t.suggestedReply}
        </h3>
        <div className="space-y-4">
          {result.suggestedResponse.map((reply, index) => (
            <ReplyCard key={index} text={reply} t={t} />
          ))}
        </div>
      </section>

    </div>
  );
};

const ReplyCard: React.FC<{ text: string, t: any }> = ({ text, t }) => {
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
          {copied ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
