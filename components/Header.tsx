
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  view: 'hero' | 'input' | 'results';
  onBack?: () => void;
  theme: 'light' | 'dark';
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

const Header: React.FC<HeaderProps> = ({ view, onBack, theme }) => {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';

  return (
    <div className="flex items-center justify-between p-6 mb-2 relative">
      {/* Back Button (Left) */}
      <div className="w-12">
        {view !== 'hero' && onBack && (
          <button 
            onClick={onBack}
            className={`p-2 -ml-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-[#383838] text-stone-300' : 'hover:bg-stone-100 text-stone-600'}`}
          >
            <ChevronLeft size={28} />
          </button>
        )}
      </div>
      
      {/* Center Logo (Always Visible slightly smaller in header) */}
      <div className={`absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 ${view === 'hero' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <div className="flex items-center gap-2">
           <BrainLogo size={32} />
           <span className={`font-bold text-lg ${textPrimary}`}>Neuro-Sense</span>
         </div>
      </div>

      {/* Right Spacer */}
      <div className="w-12"></div>
    </div>
  );
};

export default Header;
