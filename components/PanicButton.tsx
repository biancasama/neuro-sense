import React, { useState } from 'react';
import { LifeBuoy, X, Check, Copy } from 'lucide-react';
import { PlantIllustration } from './Illustrations';

interface PanicProps {
  t: any;
}

const PanicButton: React.FC<PanicProps> = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const panicScript = t.panicScript;

  const handleCopy = () => {
    navigator.clipboard.writeText(panicScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Sticky Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-cream-100 hover:bg-cream-200 text-sage-600 border border-sage-200 shadow-md hover:shadow-lg rounded-full px-6 py-3 flex items-center gap-2 transition-all font-medium text-sm group focus:ring-2 focus:ring-sage-400 focus:outline-none"
        >
          <LifeBuoy size={20} className="group-hover:scale-110 transition-transform text-sage-500" />
          <span>{t.panicBtn}</span>
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-sage-900/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200 border border-cream-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-sage-400 hover:text-sage-700 rounded-full hover:bg-cream-100 transition-colors focus:ring-2 focus:ring-sage-300 focus:outline-none"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4 text-sage-600">
                <PlantIllustration className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-bold text-sage-900 mb-2">{t.panicTitle}</h3>
              <p className="text-sage-600 text-sm">
                {t.panicDesc}
              </p>
            </div>

            <div className="bg-cream-50 rounded-2xl p-5 border border-cream-200 relative">
              <p className="text-sage-800 leading-relaxed font-medium">"{panicScript}"</p>
              
              <button
                onClick={handleCopy}
                className="mt-4 w-full bg-white border border-sage-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sage-700 font-medium hover:bg-sage-50 hover:border-sage-300 transition-all shadow-sm focus:ring-2 focus:ring-sage-300 focus:outline-none"
              >
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                {copied ? t.copied : t.copy}
              </button>
            </div>
            
            <div className="mt-6 text-center">
               <button 
                onClick={() => setIsOpen(false)}
                className="text-sage-400 hover:text-sage-600 text-sm font-medium transition-colors focus:ring-2 focus:ring-sage-200 focus:outline-none rounded-lg px-2"
               >
                 {t.close}
               </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default PanicButton;
