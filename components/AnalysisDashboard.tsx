
import React, { useState } from 'react';
import { AnalysisResult, RiskLevel, GroundingData } from '../types';
import { Copy, Check, Mic, ShieldCheck, AlertTriangle, Zap, Sparkles, Loader2, HeartHandshake, Phone, Info, LifeBuoy, MapPin, ExternalLink } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
  nearbyPlaces?: GroundingData | null;
  onSave: () => void;
  t: any;
  theme: 'light' | 'dark';
  compact?: boolean;
}

const AnalysisDashboard: React.FC<Props> = ({ result, nearbyPlaces, theme, compact, t }) => {
  if (!result) return null;

  // SAFETY LEVEL 2: CRISIS MODE (Immediate Danger)
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
                            {t.crisisDesc || "We detected signs of severe distress. You are not alone."}
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
                </div>

                {/* Nearby Places Section (Grounding from Maps) */}
                {nearbyPlaces && (
                    <div className="mb-8 animate-in slide-in-from-bottom-2 fade-in">
                       <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 opacity-80 ${theme === 'dark' ? 'text-red-200' : 'text-red-800'}`}>Nearby Safe Places</h3>
                       <div className={`p-5 rounded-2xl ${theme === 'dark' ? 'bg-red-900/20' : 'bg-white'} border border-red-500/20 shadow-sm`}>
                           <div className="flex items-start gap-4">
                              <MapPin size={24} className="text-red-500 flex-shrink-0 mt-1" />
                              <div className="w-full">
                                  <p className={`text-sm mb-4 leading-relaxed whitespace-pre-line ${theme === 'dark' ? 'text-red-100' : 'text-red-900'}`}>
                                      {nearbyPlaces.text}
                                  </p>
                                  
                                  {/* Map Links */}
                                  {nearbyPlaces.chunks && nearbyPlaces.chunks.length > 0 && (
                                     <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-red-500/10">
                                        {nearbyPlaces.chunks.map((chunk, idx) => (
                                          chunk.web?.uri || chunk.maps?.uri ? (
                                             <a 
                                               key={idx}
                                               href={chunk.maps?.uri || chunk.web?.uri}
                                               target="_blank"
                                               rel="noopener noreferrer"
                                               className={`
                                                 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors
                                                 ${theme === 'dark' ? 'bg-red-800/50 hover:bg-red-700 text-white' : 'bg-red-100 hover:bg-red-200 text-red-800'}
                                               `}
                                             >
                                                <ExternalLink size={12} />
                                                {chunk.maps?.title || chunk.web?.title || "View on Map"}
                                             </a>
                                          ) : null
                                        ))}
                                     </div>
                                  )}
                              </div>
                           </div>
                       </div>
                    </div>
                )}

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

  // SAFETY LEVEL 1: CONCERN MODE (Distress / Hopelessness)
  if (result.riskLevel === RiskLevel.CONCERN) {
     return (
        <ConcernModeDashboard result={result} nearbyPlaces={nearbyPlaces} theme={theme} t={t} />
     )
  }

  // --- STANDARD DASHBOARD LOGIC (Safe / Caution / Conflict) ---

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

// --- Sub-Components ---

const ConcernModeDashboard: React.FC<{ result: AnalysisResult, nearbyPlaces?: GroundingData | null, theme: 'light' | 'dark', t: any }> = ({ result, nearbyPlaces, theme, t }) => {
    const [showResources, setShowResources] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* CONCERN BANNER */}
            <div className={`rounded-3xl p-8 border-2 shadow-xl ${theme === 'dark' ? 'bg-amber-950/40 border-amber-500/40' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex flex-col md:flex-row gap-6 md:items-start">
                    <div className="p-4 bg-amber-500 text-white rounded-full shadow-lg shadow-amber-500/30 flex-shrink-0 w-16 h-16 flex items-center justify-center">
                        <HeartHandshake size={32} />
                    </div>
                    <div className="flex-grow">
                        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-amber-200' : 'text-amber-900'}`}>
                           {t.concernTitle || "Gentle Concern Needed"}
                        </h2>
                        <p className={`text-lg font-medium leading-relaxed ${theme === 'dark' ? 'text-amber-100/90' : 'text-amber-900/80'}`}>
                            {result.emotionalSubtext}
                        </p>
                        
                        <div className={`mt-6 p-4 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-amber-500/20' : 'bg-white/60 border-amber-100'}`}>
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-800'}`}>
                                {t.careAdviceTitle || "Recommended Approach"}
                            </h3>
                             <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-amber-100' : 'text-amber-900'}`}>
                                <li className="flex gap-2 items-start"><Info size={16} className="mt-0.5 flex-shrink-0 opacity-70"/> Let them know you are there.</li>
                                <li className="flex gap-2 items-start"><Info size={16} className="mt-0.5 flex-shrink-0 opacity-70"/> Avoid giving advice or fixing it. Just listen.</li>
                                <li className="flex gap-2 items-start"><Info size={16} className="mt-0.5 flex-shrink-0 opacity-70"/> Ask how they are feeling right now.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Optional Resources Toggle */}
                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={() => setShowResources(!showResources)}
                        className={`text-sm font-semibold underline decoration-2 underline-offset-4 hover:opacity-80 transition-opacity ${theme === 'dark' ? 'text-amber-300 decoration-amber-500/50' : 'text-amber-700 decoration-amber-300'}`}
                    >
                        {showResources ? "Hide Safety Resources" : "View Optional Safety Resources"}
                    </button>
                </div>

                {/* Expandable Resources */}
                {showResources && (
                     <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 fade-in">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${theme === 'dark' ? 'bg-amber-900/40' : 'bg-white'} border border-amber-500/20`}>
                                <LifeBuoy size={20} className="text-amber-500" />
                                <div>
                                    <p className={`font-bold text-xs uppercase opacity-70 ${theme === 'dark' ? 'text-amber-200' : 'text-amber-900'}`}>Support Line (USA)</p>
                                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-amber-900'}`}>988</p>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${theme === 'dark' ? 'bg-amber-900/40' : 'bg-white'} border border-amber-500/20`}>
                                <LifeBuoy size={20} className="text-amber-500" />
                                <div>
                                    <p className={`font-bold text-xs uppercase opacity-70 ${theme === 'dark' ? 'text-amber-200' : 'text-amber-900'}`}>Crisis Text Line</p>
                                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-amber-900'}`}>Text HOME to 741741</p>
                                </div>
                            </div>
                        </div>

                        {/* Local Resources via Maps */}
                        {nearbyPlaces && (
                            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-amber-900/40' : 'bg-white'} border border-amber-500/20`}>
                                <div className="flex items-start gap-3">
                                   <MapPin size={20} className="text-amber-500 flex-shrink-0 mt-1" />
                                   <div className="w-full">
                                       <p className={`font-bold text-xs uppercase opacity-70 mb-2 ${theme === 'dark' ? 'text-amber-200' : 'text-amber-900'}`}>Local Support</p>
                                       <p className={`text-sm mb-3 whitespace-pre-line ${theme === 'dark' ? 'text-amber-100' : 'text-amber-900'}`}>
                                           {nearbyPlaces.text}
                                       </p>
                                       
                                        {nearbyPlaces.chunks && nearbyPlaces.chunks.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-500/10">
                                            {nearbyPlaces.chunks.map((chunk, idx) => (
                                                chunk.web?.uri || chunk.maps?.uri ? (
                                                <a 
                                                    key={idx}
                                                    href={chunk.maps?.uri || chunk.web?.uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`
                                                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors
                                                    ${theme === 'dark' ? 'bg-amber-800/50 hover:bg-amber-700 text-white' : 'bg-amber-100 hover:bg-amber-200 text-amber-800'}
                                                    `}
                                                >
                                                    <ExternalLink size={10} />
                                                    {chunk.maps?.title || chunk.web?.title || "View Map"}
                                                </a>
                                                ) : null
                                            ))}
                                            </div>
                                        )}
                                   </div>
                                </div>
                            </div>
                        )}
                     </div>
                )}
            </div>

            {/* Suggested Replies (Visible in Concern Mode) */}
            <div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                    Drafted Responses
                </h2>
                <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                    {result.suggestedResponse.map((reply, idx) => (
                        <ReplyCard 
                        key={idx} 
                        text={reply} 
                        label={idx === 0 ? "Checking In" : (idx === 1 ? "Validation" : "Supportive")} 
                        theme={theme} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

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
