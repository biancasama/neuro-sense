
import React, { useState, useEffect } from 'react';
import LeftAnchor from './components/LeftAnchor';
import CenterCanvas from './components/CenterCanvas';
import RightDecoder from './components/RightDecoder';
import PanicButton from './components/PanicButton';
import { AnalysisResult, Language, Memory } from './types';
import { analyzeMessageContext } from './services/geminiService';
import { translations } from './utils/translations';
import { BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  
  // Memory State
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentTextSnapshot, setCurrentTextSnapshot] = useState<string>('');

  // Helper to get current translations
  const t = translations[language];

  // Load memories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('neuroSense_memories');
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse memories", e);
      }
    }
  }, []);

  // Save memories to localStorage
  useEffect(() => {
    localStorage.setItem('neuroSense_memories', JSON.stringify(memories));
  }, [memories]);

  // Helper to map language code to full name for AI prompt
  const getLanguageName = (code: Language) => {
    switch (code) {
      case 'es': return 'Spanish';
      case 'fr': return 'French';
      case 'de': return 'German';
      case 'it': return 'Italian';
      case 'pt': return 'Portuguese';
      case 'ja': return 'Japanese';
      default: return 'English';
    }
  };

  const handleAnalyze = async (
    text: string, 
    useDeepContext: boolean, 
    imageBase64?: string, 
    imageMimeType?: string
  ) => {
    setIsAnalyzing(true);
    setResult(null);
    setCurrentTextSnapshot(text || (imageBase64 ? "[Image Analysis]" : "[Content]"));

    try {
      const targetLang = getLanguageName(language);
      const data = await analyzeMessageContext(
        text, 
        useDeepContext, 
        targetLang, 
        imageBase64, 
        imageMimeType
      );
      setResult(data);
    } catch (err: any) {
      console.error(err);
      // In a real app, pass error to Decoder to display toast
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMemory = () => {
    if (!result) return;
    const newMemory: Memory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      originalText: currentTextSnapshot,
      analysis: result
    };
    setMemories(prev => [newMemory, ...prev]);
  };

  const handleSelectMemory = (memory: Memory) => {
    setResult(memory.analysis);
    setCurrentTextSnapshot(memory.originalText);
    // In a real implementation, this might populate the RightDecoder input too
  };

  return (
    <div className="h-screen w-full bg-stone-50 flex overflow-hidden font-sans text-stone-800">
      
      {/* 1. Left Pane: The Anchor (20%) */}
      <aside className="w-1/5 min-w-[250px] hidden lg:block h-full z-20 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        <LeftAnchor 
          memories={memories} 
          onSelectMemory={handleSelectMemory} 
          t={t} 
        />
      </aside>

      {/* 2. Center Pane: The Safe Canvas (50%) */}
      <main className="flex-1 lg:w-1/2 h-full z-10 shadow-[0_0_25px_rgba(0,0,0,0.05)]">
        <CenterCanvas t={t} />
      </main>

      {/* 3. Right Pane: The Decoder (30%) */}
      <aside className="w-[30%] min-w-[320px] max-w-md h-full z-20">
        <RightDecoder 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing} 
          result={result} 
          onSaveMemory={handleSaveMemory}
          t={t}
        />
      </aside>

      {/* Overlays / Floating Elements */}
      <PanicButton t={t} />

      {/* Mobile Disclaimer (Since this is a specific desktop productivity layout) */}
      <div className="lg:hidden fixed inset-0 bg-stone-50 z-50 flex items-center justify-center p-8 text-center">
        <div className="max-w-xs">
          <BrainCircuit size={48} className="mx-auto text-forest mb-4" />
          <h2 className="text-xl font-bold mb-2">Desktop Optimized</h2>
          <p className="text-stone-500">NeuroSense's new Focused Workspace is designed for desktop screens to help manage cognitive load effectively. Please switch to a larger screen.</p>
        </div>
      </div>

    </div>
  );
};

export default App;
