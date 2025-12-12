
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  view: 'hero' | 'input' | 'results';
  onBack?: () => void;
  theme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ view, onBack, theme }) => {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-900';

  return (
    <div className="flex items-center p-6 mb-2">
      {view !== 'hero' && onBack ? (
        <button 
          onClick={onBack}
          className={`p-2 -ml-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-[#383838] text-stone-300' : 'hover:bg-stone-100 text-stone-600'}`}
        >
          <ChevronLeft size={28} />
        </button>
      ) : (
        <div className="w-10"></div> /* Spacer */
      )}
      
      {/* Title only shows on Hero or if needed, mockup mostly clean */}
      {view === 'hero' && (
        <div className="flex items-center gap-2">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
             NS
           </div>
           <span className={`font-bold text-lg ${textPrimary}`}>Neuro-Sense</span>
        </div>
      )}
    </div>
  );
};

export default Header;
