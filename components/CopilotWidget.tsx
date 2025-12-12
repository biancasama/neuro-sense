
import React, { useState } from 'react';
import { SmartReplyManager } from '../services/smartReplyManager';
import { Eye, PenTool, ArrowDownCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  onAnalyzeContext: (text: string) => void;
  isAnalyzing: boolean;
}

const CopilotWidget: React.FC<Props> = ({ onAnalyzeContext, isAnalyzing }) => {
  const [manager] = useState(() => new SmartReplyManager());
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleScan = () => {
    const text = manager.getLastIncomingMessage();
    if (text) {
      setScannedText(text);
      setStatus('success');
      // Automatically trigger the AI analysis in the parent component
      onAnalyzeContext(text);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const handlePaste = (text: string) => {
    manager.insertTextIntoChat(text);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm mb-4">
      <div className="flex items-center gap-2 mb-3 text-forest font-bold text-xs uppercase tracking-wider">
        <PenTool size={14} />
        <span>Chat Copilot</span>
      </div>

      {/* Control Area */}
      <div className="flex gap-2">
        <button
          onClick={handleScan}
          disabled={isAnalyzing}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all
            ${status === 'error' 
              ? 'bg-red-100 text-red-600' 
              : 'bg-stone-100 text-stone-600 hover:bg-forest/10 hover:text-forest'
            }
          `}
        >
          {isAnalyzing ? (
            <span>Reading...</span>
          ) : (
            <>
              <Eye size={14} />
              {status === 'error' ? 'No msg found' : 'Read Last Msg'}
            </>
          )}
        </button>
      </div>

      {/* Scanned Content Preview */}
      {scannedText && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-1">
          <div className="bg-stone-50 p-2 rounded border border-stone-100 mb-2">
            <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Context</span>
            <p className="text-xs text-stone-600 line-clamp-2 italic">"{scannedText}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopilotWidget;
