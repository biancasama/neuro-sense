import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, BrainCircuit, Sparkles } from 'lucide-react';
import { fileToGenerativePart } from '../services/geminiService';

interface InputSectionProps {
  onAnalyze: (text: string, useDeepContext: boolean, imageBase64?: string, mimeType?: string) => void;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [useDeepContext, setUseDeepContext] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!text && !imageFile) return;

    let base64 = undefined;
    let mimeType = undefined;

    if (imageFile) {
      base64 = await fileToGenerativePart(imageFile);
      mimeType = imageFile.type;
    }

    onAnalyze(text, useDeepContext, base64, mimeType);
  };

  return (
    <div className="h-full flex flex-col">
        
        <div className="flex-grow space-y-6">
          {/* Lined Paper Text Input */}
          <div className="relative group">
            <label htmlFor="message-input" className="sr-only">
              Paste Message Text
            </label>
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10 rounded-t-xl"></div>
            <textarea
              id="message-input"
              className="w-full h-64 p-6 rounded-xl bg-lined-paper text-stone-800 placeholder-stone-400 border border-stone-200 shadow-inner focus:border-forest/50 focus:ring-1 focus:ring-forest/20 resize-none text-lg transition-all outline-none"
              placeholder="Dear Journal, today they said..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>

          {/* Image Upload Area */}
          <div>
            {imagePreview ? (
              <div className="relative w-full h-40 bg-stone-100 rounded-xl overflow-hidden border border-stone-300 shadow-sm group">
                <img src={imagePreview} alt="Uploaded chat screenshot" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 border border-stone-200 rounded-full text-stone-600 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                  disabled={isAnalyzing}
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-stone-300 text-stone-500 hover:text-stone-700 hover:border-stone-400 hover:bg-stone-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <ImageIcon size={18} />
                <span>Attach Screenshot (Optional)</span>
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            aria-hidden="true"
          />

          {/* Magical Pill Toggle */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={() => setUseDeepContext(!useDeepContext)}
              className={`
                relative flex items-center gap-3 px-6 py-2 rounded-full transition-all duration-300 border
                ${useDeepContext 
                  ? 'bg-white border-green-200 shadow-[0_0_15px_rgba(74,222,128,0.4)]' 
                  : 'bg-stone-100 border-stone-200 text-stone-400 hover:bg-stone-200'
                }
              `}
              aria-pressed={useDeepContext}
            >
              <div className={`p-1 rounded-full ${useDeepContext ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-400'}`}>
                <BrainCircuit size={16} />
              </div>
              <span className={`text-sm font-semibold ${useDeepContext ? 'text-green-800' : 'text-stone-500'}`}>
                Activate Deep Context
              </span>
              {useDeepContext && (
                <span className="absolute -top-1 -right-1">
                  <Sparkles size={12} className="text-yellow-500 animate-pulse" />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Floating Action Button (Bottom) */}
        <div className="mt-8 pt-4">
          <button
            onClick={handleSubmit}
            disabled={(!text && !imageFile) || isAnalyzing}
            className={`
              w-full py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3
              shadow-lg transition-all duration-300 transform group
              ${(!text && !imageFile) || isAnalyzing 
                ? 'bg-stone-300 cursor-not-allowed' 
                : 'bg-forest hover:bg-[#254040] hover:-translate-y-1 hover:shadow-xl'
              }
            `}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={24} aria-hidden="true" />
                <span>Consulting...</span>
              </>
            ) : (
              <>
                <Sparkles size={22} className="group-hover:rotate-12 transition-transform" aria-hidden="true" />
                <span>Analyze Message</span>
              </>
            )}
          </button>
        </div>

    </div>
  );
};

export default InputSection;