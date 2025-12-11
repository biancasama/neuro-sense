import React, { useState } from 'react';
import { LifeBuoy, X, Check, Copy } from 'lucide-react';

const PanicButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const panicScript = "I've received your message and I want to give it the attention it deserves. I need a little time to process it properly, but I will get back to you as soon as I can. Thank you for your patience.";

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
          className="bg-cream-100 hover:bg-cream-200 text-sage-600 border border-sage-200 shadow-md hover:shadow-lg rounded-full px-6 py-3 flex items-center gap-2 transition-all font-medium text-sm group"
        >
          <LifeBuoy size={20} className="group-hover:scale-110 transition-transform text-sage-500" />
          <span>Help, I'm overwhelmed</span>
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
              className="absolute top-4 right-4 p-2 text-sage-400 hover:text-sage-700 rounded-full hover:bg-cream-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <LifeBuoy size={32} />
              </div>
              <h3 className="text-xl font-bold text-sage-900 mb-2">Deep Breath. You're okay.</h3>
              <p className="text-sage-600 text-sm">
                If you feel overwhelmed, it is perfectly okay to pause the conversation. Use this script to buy yourself time.
              </p>
            </div>

            <div className="bg-cream-50 rounded-2xl p-5 border border-cream-200 relative">
              <p className="text-sage-800 leading-relaxed font-medium">"{panicScript}"</p>
              
              <button
                onClick={handleCopy}
                className="mt-4 w-full bg-white border border-sage-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sage-700 font-medium hover:bg-sage-50 hover:border-sage-300 transition-all shadow-sm"
              >
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                {copied ? "Copied to Clipboard" : "Copy Script"}
              </button>
            </div>
            
            <div className="mt-6 text-center">
               <button 
                onClick={() => setIsOpen(false)}
                className="text-sage-400 hover:text-sage-600 text-sm font-medium transition-colors"
               >
                 Close
               </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default PanicButton;
