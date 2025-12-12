
import React from 'react';
import { Memory } from '../types';
import { User, Mail, Calendar, Hash, Plus } from 'lucide-react';

interface LeftAnchorProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  t: any;
}

const LeftAnchor: React.FC<LeftAnchorProps> = ({ memories, onSelectMemory, t }) => {
  return (
    <div className="h-full bg-stone-50 border-r border-stone-200 flex flex-col">
      {/* 1. Active Profile Header */}
      <div className="p-6 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest to-sage-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
             AB
           </div>
           <div>
             <h2 className="text-lg font-bold text-stone-800 leading-none">Alex (Boss)</h2>
             <span className="text-xs text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-full mt-1 inline-block">
               Work / Professional
             </span>
           </div>
        </div>
        
        <button className="w-full py-2 px-3 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-forest flex items-center justify-center gap-2 transition-colors">
          <Mail size={14} /> Connect Email/Slack
        </button>
      </div>

      {/* 2. Communication Preferences (Sticky Note) */}
      <div className="p-6 border-b border-stone-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Communication Manual</h3>
        <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl shadow-sm rotate-1 hover:rotate-0 transition-transform duration-300">
           <ul className="space-y-2.5">
             <li className="flex items-start gap-2 text-xs text-stone-700 font-medium">
               <span className="text-amber-500 mt-0.5">⚠️</span> Prefers bullet points over paragraphs
             </li>
             <li className="flex items-start gap-2 text-xs text-stone-700 font-medium">
               <span className="text-red-400 mt-0.5">❌</span> Dislikes vague subject lines
             </li>
             <li className="flex items-start gap-2 text-xs text-stone-700 font-medium">
               <span className="text-blue-400 mt-0.5">ℹ️</span> Usually replies late at night
             </li>
           </ul>
        </div>
      </div>

      {/* 3. Interaction History */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Recent Context</h3>
        </div>

        <div className="space-y-3">
          {memories.length === 0 ? (
             <div className="text-center py-8 opacity-50">
               <Hash size={24} className="mx-auto mb-2 text-stone-300" />
               <p className="text-xs text-stone-400">No recent history</p>
             </div>
          ) : (
            memories.map(m => (
              <button 
                key={m.id}
                onClick={() => onSelectMemory(m)}
                className="w-full text-left p-3 rounded-xl bg-white border border-stone-200 hover:border-forest/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                   <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                     <Calendar size={10} />
                     {new Date(m.timestamp).toLocaleDateString()}
                   </span>
                   <div className={`w-2 h-2 rounded-full ${
                      m.analysis.riskLevel === 'Safe' ? 'bg-emerald-400' :
                      m.analysis.riskLevel === 'Caution' ? 'bg-amber-400' : 'bg-rose-400'
                   }`} />
                </div>
                <p className="text-xs font-medium text-stone-700 line-clamp-2 leading-relaxed group-hover:text-forest">
                  "{m.originalText}"
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftAnchor;
