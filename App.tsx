import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import PanicButton from './components/PanicButton';
import { AnalysisResult } from './types';
import { analyzeMessageContext } from './services/geminiService';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { DecodingIllustration } from './components/Illustrations';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string, imageBase64?: string, mimeType?: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeMessageContext(text, imageBase64, mimeType);
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
    <div className="min-h-screen bg-cream-50 font-sans pb-24 relative flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 pt-6 md:pt-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
          
          {/* Left Column: Input / Tools */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
             <div className="lg:sticky lg:top-24 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-cream-300">
                  <h2 className="text-xl font-semibold text-sage-800 mb-2">Input Context</h2>
                  <p className="text-sm text-sage-500 mb-6">Upload a screenshot or paste text to begin decoding.</p>
                  <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                </div>
                
                {/* Mobile-only Panic Button location or other tools could go here */}
             </div>
          </div>

          {/* Right Column: Output / Decoder */}
          <div className="lg:col-span-7 xl:col-span-8 min-h-[600px] flex flex-col">
             
             {error && (
              <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in" role="alert">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

             {isAnalyzing ? (
                <div className="flex-grow flex flex-col items-center justify-center text-sage-400 space-y-4 animate-pulse">
                   <DecodingIllustration className="w-48 h-48 opacity-50 grayscale" />
                   <p className="text-lg font-medium">Analyzing tone and intent...</p>
                </div>
             ) : result ? (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 text-sm text-sage-500 hover:text-sage-800 transition-colors mb-2 lg:hidden"
                  >
                    <ArrowLeft size={16} /> Back to Input
                  </button>
                  <AnalysisDashboard result={result} />
               </div>
             ) : (
               /* Empty State / Intro */
               <div className="flex-grow flex flex-col items-center justify-center text-center p-8 md:p-12 border-2 border-dashed border-sage-200 rounded-3xl bg-sage-50/50">
                  <div className="max-w-md space-y-6">
                    <div className="text-sage-700 mx-auto w-fit">
                        <DecodingIllustration className="w-64 h-64" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-semibold text-sage-800 tracking-tight">
                        Decoder Ready
                      </h2>
                      <p className="text-sage-600 text-lg leading-relaxed">
                        Use the tools on the left to analyze a conversation. We'll break down the subtext, translate the meaning, and help you craft a response.
                      </p>
                    </div>
                  </div>
               </div>
             )}
          </div>

        </div>
      </main>

      <PanicButton />
    </div>
  );
};

export default App;