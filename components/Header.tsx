
import React from 'react';
import { Language } from '../types';
import { Globe, BookHeart } from 'lucide-react';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenMemories: () => void;
  t: any;
}

// Stylized brain logo updated for Dark Mode contrast
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
    {/* Top Left / Frontal Lobe - Neon Cyan */}
    <path 
      d="M 28 55 C 18 40 25 20 50 22" 
      stroke="#8FF7F4" 
      strokeWidth="7"
    />
    <path d="M 43 17 L 50 22 L 43 27" stroke="#8FF7F4" strokeWidth="7" />

    {/* Top Right / Parietal - Neon Violet */}
    <path 
      d="M 60 22 C 75 22 88 30 82 52" 
      stroke="#C8B8FF" 
      strokeWidth="7"
    />
    <path d="M 87 46 L 82 52 L 77 46" stroke="#C8B8FF" strokeWidth="7" />

    {/* Central / Corpus Callosum - White/Grey */}
    <path 
      d="M 75 58 C 65 65 50 65 35 55" 
      stroke="#F2F2F2" 
      strokeWidth="7"
    />
    <path d="M 41 51 L 35 55 L 41 59" stroke="#F2F2F2" strokeWidth="7" />

    {/* Bottom / Temporal - Soft Blue/Cyan */}
    <path 
      d="M 30 70 C 35 85 65 85 70 75" 
      stroke="#8FF7F4" 
      strokeOpacity="0.7"
      strokeWidth="7"
    />
    <path d="M 64 71 L 70 75 L 64 79" stroke="#8FF7F4" strokeOpacity="0.7" strokeWidth="7" />
    
    {/* Stem Detail - Violet */}
    <path d="M 50 88 L 50 94" stroke="#C8B8FF" strokeWidth="7" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ language, setLanguage, onOpenMemories, t }) => {
  return (
    <header className="w-full py-6 px-4 flex items-center justify-between bg-charcoal-elevated/50 backdrop-blur-md border-b border-white/5 z-50 sticky top-0">
      
      {/* Small Logo for Header (different from Hero) */}
      <div className="flex items-center gap-3">
        <BrainLogo size={32} />
        <span className="font-bold text-lg text-white tracking-wide">Neuro-Sense</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenMemories}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white transition-all text-xs font-medium"
        >
          <BookHeart size={16} />
          <span className="hidden sm:block">Memories</span>
        </button>

        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white transition-all text-xs font-medium">
            <Globe size={16} />
            <span className="uppercase">{language}</span>
          </button>
        </div>
      </div>

    </header>
  );
};

export default Header;
