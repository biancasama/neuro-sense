
import React, { useState } from 'react';
import { ChevronLeft, Globe, Check, Eye, Type, Sun, CloudOff, LogIn, UserPlus, Bot } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  view: 'home' | 'results'; 
  onBack?: () => void;
  theme: 'light' | 'dark';
  language: Language;
  onLanguageChange: (lang: Language) => void;
  accessibility: { dyslexic: boolean; sensorySafe: boolean; coPilot: boolean };
  onToggleAccessibility: (key: 'dyslexic' | 'sensorySafe' | 'coPilot') => void;
}

// Re-introducing the BrainLogo for shared use
export const BrainLogo = ({ size = 48, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Neuro-Sense Logo"
    role="img"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Sage Green - Top Left / Frontal Lobe */}
    <path d="M 28 55 C 18 40 25 20 50 22" stroke="#94B594" strokeWidth="7" />
    <path d="M 43 17 L 50 22 L 43 27" stroke="#94B594" strokeWidth="7" />

    {/* Coral/Orange - Top Right / Parietal */}
    <path d="M 60 22 C 75 22 88 30 82 52" stroke="#E89E84" strokeWidth="7" />
    <path d="M 87 46 L 82 52 L 77 46" stroke="#E89E84" strokeWidth="7" />

    {/* Pastel Yellow - Central */}
    <path d="M 75 58 C 65 65 50 65 35 55" stroke="#EBCB7A" strokeWidth="7" />
    <path d="M 41 51 L 35 55 L 41 59" stroke="#EBCB7A" strokeWidth="7" />

    {/* Soft Blue - Bottom */}
    <path d="M 30 70 C 35 85 65 85 70 75" stroke="#93C0DE" strokeWidth="7" />
    <path d="M 64 71 L 70 75 L 64 79" stroke="#93C0DE" strokeWidth="7" />
    
    <path d="M 50 88 L 50 94" stroke="#94B594" strokeWidth="7" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ 
  view, onBack, theme, language, onLanguageChange,
  accessibility, onToggleAccessibility
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAccessMenu, setShowAccessMenu] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';
  const textSecondary = theme === 'dark' ? 'text-stone-400' : 'text-stone-600';
  const bg = theme === 'dark' ? 'bg-[#1E1E1E]' : 'bg-white';
  const border = theme === 'dark' ? 'border-[#383838]' : 'border-stone-200';

  // Comprehensive language list inspired by tools like Goblin AI
  const languages: { code: string; name: string; localName: string; flag: string }[] = [
    { code: 'en', name: 'English', localName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', localName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', localName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', localName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', localName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', localName: 'Português', flag: '🇧🇷' },
    { code: 'ja', name: 'Japanese', localName: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', localName: '中文', flag: '🇨🇳' },
    { code: 'ko', name: 'Korean', localName: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Russian', localName: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'Arabic', localName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', localName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', localName: 'বাংলা', flag: '🇧🇩' },
    { code: 'nl', name: 'Dutch', localName: 'Nederlands', flag: '🇳🇱' },
    { code: 'tr', name: 'Turkish', localName: 'Türkçe', flag: '🇹🇷' },
    { code: 'pl', name: 'Polish', localName: 'Polski', flag: '🇵🇱' },
    { code: 'id', name: 'Indonesian', localName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'th', name: 'Thai', localName: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', localName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'sv', name: 'Swedish', localName: 'Svenska', flag: '🇸🇪' },
    { code: 'da', name: 'Danish', localName: 'Dansk', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish', localName: 'Suomi', flag: '🇫🇮' },
    { code: 'no', name: 'Norwegian', localName: 'Norsk', flag: '🇳🇴' },
    { code: 'el', name: 'Greek', localName: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'he', name: 'Hebrew', localName: 'עברית', flag: '🇮🇱' },
    { code: 'uk', name: 'Ukrainian', localName: 'Українська', flag: '🇺🇦' },
    { code: 'cs', name: 'Czech', localName: 'Čeština', flag: '🇨🇿' },
    { code: 'hu', name: 'Hungarian', localName: 'Magyar', flag: '🇭🇺' },
    { code: 'ro', name: 'Romanian', localName: 'Română', flag: '🇷🇴' },
    { code: 'la', name: 'Latin', localName: 'Latin', flag: '🏛️' },
    { code: 'tlh', name: 'Klingon', localName: 'Klingon', flag: '🖖' },
  ];

  return (
    <div className="flex items-center justify-between p-6 md:p-8 mb-2 relative w-full">
      {/* Back Button (Left) - Only visible in Results view */}
      <div className="w-24">
        {view === 'results' && onBack && (
          <button 
            onClick={onBack}
            className={`p-2 -ml-2 rounded-full transition-colors flex items-center gap-1 group ${theme === 'dark' ? 'hover:bg-[#383838] text-stone-300' : 'hover:bg-stone-100 text-stone-600'}`}
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform"/>
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
      </div>
      
      {/* Center Logo */}
      <div className={`absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 ${view === 'home' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <div className="flex items-center gap-3">
           <BrainLogo size={32} />
           <span className={`font-bold text-xl ${textPrimary}`}>Neuro-Sense</span>
         </div>
      </div>

      {/* Right: Language + Accessibility */}
      <div className="flex items-center justify-end gap-3 w-auto relative">
         
         {/* Accessibility Menu */}
         <div className="relative">
            <button 
              onClick={() => setShowAccessMenu(!showAccessMenu)}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${accessibility.sensorySafe ? 'bg-indigo-100 text-indigo-700' : (theme === 'dark' ? 'text-stone-300 hover:bg-[#383838]' : 'text-stone-600 hover:bg-stone-100')}`}
              title="Accessibility Settings"
            >
              <Eye size={20} />
            </button>

            {showAccessMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAccessMenu(false)}></div>
                <div className={`absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-xl z-50 overflow-hidden p-2 ${bg} ${border}`}>
                   <div className="px-3 py-2 text-xs font-bold uppercase text-stone-400">Visual Support</div>
                   
                   <button
                     onClick={() => onToggleAccessibility('dyslexic')}
                     className={`w-full text-left px-3 py-3 rounded-lg text-sm flex items-center justify-between transition-colors mb-1 ${theme === 'dark' ? 'hover:bg-[#333] text-stone-200' : 'hover:bg-stone-50 text-stone-700'}`}
                   >
                     <span className="flex items-center gap-3">
                       <Type size={16} />
                       Dyslexia Font
                     </span>
                     <div className={`w-10 h-5 rounded-full relative transition-colors ${accessibility.dyslexic ? 'bg-indigo-500' : 'bg-stone-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${accessibility.dyslexic ? 'left-6' : 'left-1'}`}></div>
                     </div>
                   </button>

                   <button
                     onClick={() => onToggleAccessibility('sensorySafe')}
                     className={`w-full text-left px-3 py-3 rounded-lg text-sm flex items-center justify-between transition-colors mb-2 ${theme === 'dark' ? 'hover:bg-[#333] text-stone-200' : 'hover:bg-stone-50 text-stone-700'}`}
                   >
                     <span className="flex items-center gap-3">
                       <CloudOff size={16} />
                       Sensory Safe
                     </span>
                     <div className={`w-10 h-5 rounded-full relative transition-colors ${accessibility.sensorySafe ? 'bg-indigo-500' : 'bg-stone-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${accessibility.sensorySafe ? 'left-6' : 'left-1'}`}></div>
                     </div>
                   </button>

                   <div className="px-3 py-2 text-xs font-bold uppercase text-stone-400 border-t border-stone-100 mt-1">Focus Tools</div>

                   <button
                     onClick={() => onToggleAccessibility('coPilot')}
                     className={`w-full text-left px-3 py-3 rounded-lg text-sm flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-[#333] text-stone-200' : 'hover:bg-stone-50 text-stone-700'}`}
                   >
                     <span className="flex items-center gap-3">
                       <Bot size={16} />
                       Co-Pilot Avatar
                     </span>
                     <div className={`w-10 h-5 rounded-full relative transition-colors ${accessibility.coPilot ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${accessibility.coPilot ? 'left-6' : 'left-1'}`}></div>
                     </div>
                   </button>
                   
                   <p className="px-3 py-2 text-[10px] text-stone-500 leading-tight">
                     Body doubling assistant for encouragement.
                   </p>
                </div>
              </>
            )}
         </div>

         {/* Language Selector */}
         <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'text-stone-300 hover:bg-[#383838]' : 'text-stone-600 hover:bg-stone-100'}`}
              title="Change Language"
            >
              <Globe size={20} />
            </button>

            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)}></div>
                <div className={`absolute right-0 top-full mt-2 w-64 max-h-[60vh] overflow-y-auto custom-scrollbar rounded-xl border shadow-xl z-50 overflow-hidden ${bg} ${border}`}>
                   {/* Search input could be added here for a list this long, but sticking to simple list for now */}
                   {languages.map(l => (
                     <button
                       key={l.code}
                       onClick={() => { onLanguageChange(l.code as any); setShowLangMenu(false); }}
                       className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors border-b border-stone-100 last:border-0 ${theme === 'dark' ? 'hover:bg-[#333] text-stone-200 border-[#333]' : 'hover:bg-stone-50 text-stone-700'}`}
                     >
                       <div className="flex flex-col">
                         <span className="flex items-center gap-2 font-medium"><span>{l.flag}</span> {l.localName}</span>
                         <span className={`text-xs ml-6 ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>{l.name}</span>
                       </div>
                       {language === l.code && <Check size={14} className="text-indigo-500 flex-shrink-0" />}
                     </button>
                   ))}
                </div>
              </>
            )}
         </div>

         {/* Login / Sign Up Switchable Button */}
         <button 
           onClick={() => setAuthMode(prev => prev === 'login' ? 'signup' : 'login')}
           className={`hidden md:flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 select-none ${
             authMode === 'login' 
               ? `bg-stone-100 text-stone-700 hover:bg-stone-200` 
               : `bg-emerald-100 text-emerald-700 hover:bg-emerald-200`
           } ${theme === 'dark' ? (authMode === 'login' ? 'bg-[#333] text-stone-200 hover:bg-[#444]' : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60') : ''}`}
           title="Click to switch mode"
         >
           {authMode === 'login' ? <LogIn size={16}/> : <UserPlus size={16}/>}
           {authMode === 'login' ? "Log In" : "Sign Up"}
         </button>
      </div>
    </div>
  );
};

export default Header;
