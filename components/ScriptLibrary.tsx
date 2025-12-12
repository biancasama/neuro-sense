
import React, { useState } from 'react';
import { Book, X, Search, Sparkles, ChevronRight, Copy, Plus } from 'lucide-react';
import { generateSocialScript } from '../services/geminiService';

interface ScriptLibraryProps {
  onSelectScript: (script: string) => void;
  onClose: () => void;
  culture: string;
}

const CATEGORIES = [
  { id: 'social', label: 'Social', icon: '👋' },
  { id: 'work', label: 'Work', icon: '💼' },
  { id: 'boundaries', label: 'Boundaries', icon: '🛡️' },
  { id: 'travel', label: 'Travel/Culture', icon: '✈️' },
];

const PRESET_SCRIPTS = [
  {
    id: 'decline_invite',
    category: 'social',
    title: 'Declining an Invitation',
    script: "Thank you so much for the invite! I won't be able to make it this time, but I hope you have a great time."
  },
  {
    id: 'small_talk',
    category: 'social',
    title: 'Ending Small Talk',
    script: "It was great catching up with you! I have to head out now, but let's talk again soon."
  },
  {
    id: 'clarify_work',
    category: 'work',
    title: 'Asking for Clarification',
    script: "I want to make sure I'm aligned with the expectations. Could you please clarify what you mean by [Specific Term]?"
  },
  {
    id: 'deadline_ext',
    category: 'work',
    title: 'Requesting Deadline Extension',
    script: "I'm working on [Project] and want to ensure it meets our quality standards. Would it be possible to extend the deadline to [Date]?"
  },
  {
    id: 'no_capacity',
    category: 'boundaries',
    title: 'Saying "No" to a Request',
    script: "I appreciate you thinking of me for this. I don't have the capacity to take this on right now without impacting my other commitments."
  },
  {
    id: 'overwhelmed',
    category: 'boundaries',
    title: 'Feeling Overwhelmed',
    script: "I'm feeling a bit overwhelmed at the moment and need to step away from my phone/computer. I'll get back to you when I can."
  }
];

const ScriptLibrary: React.FC<ScriptLibraryProps> = ({ onSelectScript, onClose, culture }) => {
  const [selectedCategory, setSelectedCategory] = useState('social');
  const [customScenario, setCustomScenario] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const filteredScripts = PRESET_SCRIPTS.filter(s => s.category === selectedCategory);

  const handleGenerate = async () => {
    if (!customScenario.trim()) return;
    setIsGenerating(true);
    setGeneratedScript(null);
    try {
      const script = await generateSocialScript(customScenario, culture);
      setGeneratedScript(script);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom-10 duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center gap-2">
          <Book size={20} className="text-forest" />
          <h2 className="font-bold text-stone-700">Script Library</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full text-stone-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Sidebar Categories */}
        <div className="w-1/4 bg-stone-50 border-r border-stone-100 p-2 space-y-1">
           {CATEGORIES.map(cat => (
             <button
               key={cat.id}
               onClick={() => { setSelectedCategory(cat.id); setGeneratedScript(null); setCustomScenario(''); }}
               className={`w-full text-left px-3 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-white shadow-sm text-forest border border-stone-100' : 'text-stone-500 hover:bg-stone-100'}`}
             >
               <span>{cat.icon}</span>
               <span className="hidden md:inline">{cat.label}</span>
             </button>
           ))}
        </div>

        {/* Scripts List */}
        <div className="w-3/4 p-6 overflow-y-auto custom-scrollbar bg-white">
           
           {/* Section Title */}
           <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">
             {CATEGORIES.find(c => c.id === selectedCategory)?.label} Templates
           </h3>

           {/* Static Scripts */}
           <div className="grid gap-4 mb-8">
             {filteredScripts.map(item => (
               <div key={item.id} className="p-4 border border-stone-200 rounded-2xl hover:border-forest/30 hover:shadow-md transition-all group">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-stone-700 text-sm">{item.title}</h4>
                   <button 
                     onClick={() => onSelectScript(item.script)}
                     className="text-forest opacity-0 group-hover:opacity-100 font-bold text-xs flex items-center gap-1 transition-opacity"
                   >
                     Use <Plus size={14} />
                   </button>
                 </div>
                 <p className="text-sm text-stone-600 leading-relaxed">
                   "{item.script}"
                 </p>
               </div>
             ))}
           </div>

           {/* AI Generator Section */}
           <div className="mt-8 pt-8 border-t border-dashed border-stone-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
                <Sparkles size={14} /> Custom Scenario Generator
              </h3>
              
              <div className="bg-gradient-to-br from-stone-50 to-white border border-stone-200 p-5 rounded-2xl">
                 <p className="text-xs text-stone-500 mb-3">
                   Going blank? Describe the situation, and we'll write a safe script for you.
                   <br/>
                   <span className="text-forest font-semibold mt-1 inline-block">Context: {culture}</span>
                 </p>
                 
                 <div className="flex gap-2 mb-4">
                   <input 
                     type="text" 
                     placeholder='e.g., "How do I greet a strict boss in Japan?"'
                     value={customScenario}
                     onChange={(e) => setCustomScenario(e.target.value)}
                     className="flex-grow bg-white border border-stone-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                   />
                   <button 
                     onClick={handleGenerate}
                     disabled={!customScenario.trim() || isGenerating}
                     className="bg-forest text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-forest/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                   >
                     {isGenerating ? "Writing..." : "Generate"}
                   </button>
                 </div>

                 {generatedScript && (
                   <div className="bg-forest/5 border border-forest/10 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                      <p className="text-sm text-stone-800 font-medium leading-relaxed mb-3">
                        "{generatedScript}"
                      </p>
                      <button 
                         onClick={() => onSelectScript(generatedScript)}
                         className="w-full py-2 bg-white border border-forest/20 text-forest text-xs font-bold rounded-lg hover:bg-forest/10 transition-colors"
                      >
                        Insert into Draft
                      </button>
                   </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default ScriptLibrary;
