import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 flex items-center justify-center bg-cream-50 sticky top-0 z-10 border-b border-cream-300">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-sage-100 rounded-xl text-sage-600">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-sage-800 tracking-tight">Neuro-Interpreter</h1>
          <p className="text-xs text-sage-500 font-medium">Tone & Intent Decoder</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
