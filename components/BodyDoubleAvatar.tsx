
import React, { useState, useEffect } from 'react';
import { BrainLogo } from './Header'; 
import { ThumbsUp, Heart, Coffee, Sparkles, Smile } from 'lucide-react';

const REACTIONS = [
  { icon: ThumbsUp, color: 'text-blue-500', animation: 'animate-bounce', bg: 'bg-blue-50' },
  { icon: Heart, color: 'text-rose-500', animation: 'animate-pulse', bg: 'bg-rose-50' },
  { icon: Coffee, color: 'text-amber-600', animation: 'animate-pulse', bg: 'bg-amber-50' },
  { icon: Sparkles, color: 'text-yellow-500', animation: 'animate-spin', bg: 'bg-yellow-50' },
  { icon: Smile, color: 'text-emerald-500', animation: 'animate-bounce', bg: 'bg-emerald-50' },
];

interface BodyDoubleProps {
  theme: 'light' | 'dark';
  enabled: boolean;
}

const BodyDoubleAvatar: React.FC<BodyDoubleProps> = ({ theme, enabled }) => {
  const [reaction, setReaction] = useState<any>(null);

  // Random reactions loop
  useEffect(() => {
    if (!enabled) return;

    // Initial hello
    setTimeout(() => {
        triggerReaction(REACTIONS[4]); // Smile
    }, 2000);

    const loop = () => {
       // Random interval between 30s and 90s
       const delay = Math.random() * (90000 - 30000) + 30000;
       const timer = setTimeout(() => {
          triggerRandomReaction();
          loop();
       }, delay);
       return timer;
    };

    const timerId = loop();
    return () => clearTimeout(timerId);
  }, [enabled]);

  const triggerRandomReaction = () => {
    const random = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    triggerReaction(random);
  };

  const triggerReaction = (r: any) => {
    setReaction(r);
    setTimeout(() => setReaction(null), 3000); // Hide after 3s
  };

  if (!enabled) return null;

  return (
    <div 
      className="fixed bottom-6 left-6 z-40 group cursor-pointer" 
      onClick={triggerRandomReaction}
      title="Your Body Double is here with you."
    >
       {/* Reaction Bubble */}
       {reaction && (
         <div className={`
           absolute -top-12 left-1/2 -translate-x-1/2 p-2.5 rounded-full shadow-lg border animate-in zoom-in slide-in-from-bottom-2 duration-300
           ${theme === 'dark' ? 'bg-[#333] border-stone-600' : 'bg-white border-stone-100'}
         `}>
            <reaction.icon size={20} className={reaction.color} />
            {/* Tiny Triangle Pointer */}
            <div className={`
                absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b
                ${theme === 'dark' ? 'bg-[#333] border-stone-600' : 'bg-white border-stone-100'}
            `}></div>
         </div>
       )}
       
       {/* Avatar Container */}
       <div className={`
         relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1
         ${theme === 'dark' 
            ? 'bg-[#2C2C2C] border-2 border-[#383838] shadow-black/30' 
            : 'bg-white border-2 border-stone-100 shadow-stone-200'}
       `}>
          {/* Breathing Animation Wrapper */}
          <div className={`${reaction ? reaction.animation : 'animate-pulse-slow'}`}>
             <BrainLogo size={28} />
          </div>
          
          {/* Status Indicator (Presence) */}
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm" title="Online & Present"></div>
       </div>
    </div>
  );
};

export default BodyDoubleAvatar;
