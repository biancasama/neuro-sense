
import React from 'react';
import { Language } from '../types';
import { Globe, BookHeart } from 'lucide-react';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenMemories: () => void;
  t: any;
}

// Stylized brain logo with interconnected arrows matching the reference image
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
    {/* Sage Green - Top Left / Frontal Lobe - Flowing Up and Right */}
    <path 
      d="M 28 55 C 18 40 25 20 50 22" 
      stroke="#94B594" 
      strokeWidth="7"
    />
    <path d="M 43 17 L 50 22 L 43 27" stroke="#94B594" strokeWidth="7" />

    {/* Coral/Orange - Top Right / Parietal - Flowing Down and In */}
    <path 
      d="M 60 22 C 75 22 88 30 82 52" 
      stroke="#E89E84" 
      strokeWidth="7"
    />
    <path d="M 87 46 L 82 52 L 77 46" stroke="#E89E84" strokeWidth="7" />

    {/* Pastel Yellow - Central / Corpus Callosum - Flowing Left */}
    <path 
      d="M 75 58 C 65 65 50 65 35 55" 
      stroke="#EBCB7A" 
      strokeWidth="7"
    />
    <path d="M 41 51 L 35 55 L 41 59" stroke="#EBCB7A" strokeWidth="7" />

    {/* Soft Blue - Bottom / Temporal - Flowing Right */}
    <path 
      d="M 30 70 C 35 85 65 85 70 75" 
      stroke="#93C0DE" 
      strokeWidth="7"
    />
    <path d="M 64 71 L 70 75 L 64 79" stroke="#93C0DE" strokeWidth="7" />
    
    {/* Stem Detail - Sage Green */}
    <path d="M 50 88 L 50 94" stroke="#94B594" strokeWidth="7" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ language, setLanguage, onOpenMemories, t }) => {
  return (
    <header className="w-full py-8 px-4 flex items-center justify-between md:justify-center bg-transparent relative z-10">
      
      {/* Centered Logo & Title */}
      <div className="flex items-center gap-5 md:ml-20">
        <BrainLogo size={84} className="drop-shadow-sm flex-shrink-0" />
        
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Neuro-Sense
          </h1>
          <p className="text-sm md:text-base text-stone-600 font-semibold tracking-wide mt-1">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Action Buttons (Absolute on Desktop, Flex on Mobile) */}
      <div className="md:absolute md:right-8 md:top-8 flex items-center gap-3">
        
        {/* Memories Button */}
        <button 
          onClick={onOpenMemories}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 hover:bg-white border border-stone-200 shadow-sm transition-all text-stone-600 hover:text-stone-800"
          title={t.viewMemories}
        >
          <BookHeart size={18} />
          <span className="font-bold text-xs hidden sm:block">{t.viewMemories}</span>
        </button>

        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 hover:bg-white border border-stone-200 shadow-sm transition-all text-stone-600 hover:text-stone-800">
            <Globe size={18} />
            <span className="uppercase font-bold text-xs">{language}</span>
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-200">
            {[
              { code: 'en', label: 'English' },
              { code: 'es', label: 'Español' },
              { code: 'fr', label: 'Français' },
              { code: 'de', label: 'Deutsch' },
              { code: 'it', label: 'Italiano' },
              { code: 'pt', label: 'Português' },
              { code: 'ja', label: '日本語' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as Language)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors ${language === lang.code ? 'font-bold text-forest bg-stone-50' : 'text-stone-600'}`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
