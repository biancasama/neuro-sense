import React from 'react';

// A custom logo combining a star shape with brain-like lobe curves
const BrainStarLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Top Lobe */}
    <path d="M12 2C13.5 2 15 3.5 15 5C15 6 14.5 7 13.5 7.5" />
    <path d="M12 2C10.5 2 9 3.5 9 5C9 6 9.5 7 10.5 7.5" />
    
    {/* Right Lobe */}
    <path d="M22 12C22 13.5 20.5 15 19 15C18 15 17 14.5 16.5 13.5" />
    <path d="M22 12C22 10.5 20.5 9 19 9C18 9 17 9.5 16.5 10.5" />
    
    {/* Bottom Lobe */}
    <path d="M12 22C10.5 22 9 20.5 9 19C9 18 9.5 17 10.5 16.5" />
    <path d="M12 22C13.5 22 15 20.5 15 19C15 18 14.5 17 13.5 16.5" />
    
    {/* Left Lobe */}
    <path d="M2 12C2 10.5 3.5 9 5 9C6 9 7 9.5 7.5 10.5" />
    <path d="M2 12C2 13.5 3.5 15 5 15C6 15 7 14.5 7.5 13.5" />
    
    {/* Central Star */}
    <path d="M12 8L14 12L12 16L10 12L12 8Z" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 flex items-center justify-center bg-transparent relative z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/50 rounded-xl text-forest backdrop-blur-sm border border-white/20 shadow-sm">
          <BrainStarLogo size={24} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-stone-800 tracking-tight">Neuro-Interpreter</h1>
          <p className="text-xs text-stone-600 font-medium">Magical Context Decoder</p>
        </div>
      </div>
    </header>
  );
};

export default Header;