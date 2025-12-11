import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import PanicButton from './components/PanicButton';
import { AnalysisResult } from './types';
import { analyzeMessageContext } from './services/geminiService';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { KeyIllustration } from './components/Illustrations';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string, useDeepContext: boolean, imageBase64?: string, mimeType?: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeMessageContext(text, useDeepContext, imageBase64, mimeType);
      setResult(data);
    } catch (err: any) {
      setError("We couldn't decode that message right now. Please try again or check your API key.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-green-50 to-stone-100 font-sans pb-12 relative text-left flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-8 py-4 flex flex-col items-center justify-start md:justify-center">
        
        {/* The Magical Notebook Container */}
        <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden min-h-[700px] flex flex-col">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full flex-grow relative">
            
            {/* Left Column: The "Messy Mind" Input */}
            <div className="p-8 md:p-12 flex flex-col relative">
               <div className="mb-8">
                 <h2 className="text-3xl font-bold text-stone-800 mb-2">The Source</h2>
                 <p className="text-stone-600 leading-relaxed">
                   Paste the confusing text or upload a screenshot. Let's make sense of this together.
                 </p>
               </div>
               
               <div className="flex-grow">
                 <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
               </div>
            </div>

            {/* Vertical Divider (The "Binding") */}
            <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-stone-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)]"></div>

            {/* Right Column: The "Clarity" Decoder */}
            <div className="p-8 md:p-12 bg-stone-50/30 lg:bg-transparent flex flex-col">
              
              {/* Mobile Back Button */}
              {result && (
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors mb-6 lg:hidden"
                >
                  <ArrowLeft size={16} /> Back to Input
                </button>
              )}

              {error && (
                <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 text-rose-800 p-4 rounded-r-lg flex items-start gap-3 animate-in fade-in" role="alert">
                  <AlertCircle size={24} className="mt-0.5 flex-shrink-0" />
                  <p className="leading-relaxed">{error}</p>
                </div>
              )}

              {isAnalyzing ? (
                 <div className="flex-grow flex flex-col items-center justify-center text-stone-400 space-y-6 animate-pulse">
                    <KeyIllustration className="w-40 h-40 opacity-50 grayscale animate-bounce" />
                    <p className="text-xl font-medium font-serif italic text-stone-500">Unlocking meaning...</p>
                 </div>
              ) : result ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full">
                   <h2 className="text-3xl font-bold text-stone-800 mb-6 hidden lg:block">The Clarity</h2>
                   <AnalysisDashboard result={result} />
                </div>
              ) : (
                /* Empty State / Magical Anchor */
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                   <div className="w-64 h-64 mb-8 text-stone-300 animate-float">
                       <KeyIllustration className="w-full h-full" />
                   </div>
                   <h3 className="text-2xl font-semibold text-stone-700 mb-2">Ready to Unlock?</h3>
                   <p className="text-stone-500 max-w-xs mx-auto">
                     The interpretation will appear here, clearly written and easy to process.
                   </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>

      <PanicButton />
    </div>
  );
};

export default App;