
import React, { useState, useRef } from 'react';
import { Image as ImageIcon, FileText, Mic, X, Loader2 } from 'lucide-react';
import { fileToGenerativePart } from '../services/geminiService';

interface InputSectionProps {
  onAnalyze: (text: string, useDeepContext: boolean, imageBase64?: string, imageMimeType?: string, audioBase64?: string, audioMimeType?: string) => void;
  isAnalyzing: boolean;
  t: any;
  theme: 'light' | 'dark';
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing, t, theme }) => {
  const [mode, setMode] = useState<'selection' | 'text' | 'image' | 'audio'>('selection');
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Styles based on theme
  const buttonBase = `
    w-full p-6 rounded-2xl flex items-center gap-4 transition-all duration-200 border text-left group
    ${theme === 'dark' 
      ? 'bg-[#2C2C2C] border-[#383838] hover:border-indigo-500/50 hover:bg-[#333]' 
      : 'bg-white border-stone-100 shadow-sm hover:border-indigo-100 hover:shadow-md'
    }
  `;
  const iconBox = `
    w-12 h-12 rounded-xl flex items-center justify-center transition-colors
    ${theme === 'dark' ? 'bg-[#383838] text-indigo-400 group-hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}
  `;
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-800';
  const textSecondary = theme === 'dark' ? 'text-stone-400' : 'text-stone-500';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setMode('image');
    }
  };

  const handleSubmit = async () => {
    let imgBase64 = undefined;
    let imgMimeType = undefined;

    if (imageFile) {
      imgBase64 = await fileToGenerativePart(imageFile);
      imgMimeType = imageFile.type;
    }

    onAnalyze(text, false, imgBase64, imgMimeType);
  };

  if (mode === 'selection') {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
        <p className={`mb-6 ${textSecondary}`}>Let's make sense of this together.</p>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className={buttonBase}
        >
          <div className={iconBox}>
            <ImageIcon size={24} />
          </div>
          <div>
            <span className={`block font-bold text-lg ${textPrimary}`}>Upload screenshot</span>
            <span className={`text-sm ${textSecondary}`}>Instant analysis of visual chat</span>
          </div>
        </button>

        <button 
          onClick={() => setMode('text')}
          className={buttonBase}
        >
          <div className={iconBox}>
            <FileText size={24} />
          </div>
          <div>
            <span className={`block font-bold text-lg ${textPrimary}`}>Paste chat text</span>
            <span className={`text-sm ${textSecondary}`}>Copy & paste message content</span>
          </div>
        </button>

        {/* Hidden File Input */}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
        />

        {/* Toggle example (Visual only for now per mockup) */}
        <div className={`mt-8 flex items-center justify-between p-4 rounded-xl ${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-stone-50'}`}>
           <span className={`font-medium ${textPrimary}`}>Plain language mode</span>
           <div className={`w-12 h-6 rounded-full relative ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
              <div className="absolute right-1 top-1 w-4 h-4 bg-indigo-500 rounded-full"></div>
           </div>
        </div>
      </div>
    );
  }

  // Text Entry Mode
  if (mode === 'text') {
    return (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
        <textarea
          autoFocus
          className={`
            w-full flex-grow p-6 rounded-2xl text-lg resize-none outline-none mb-4
            ${theme === 'dark' ? 'bg-[#2C2C2C] text-white placeholder-stone-500' : 'bg-stone-50 text-stone-800 placeholder-stone-400'}
          `}
          placeholder="Paste the message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="w-full py-4 rounded-2xl bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Analyze Text
        </button>
      </div>
    );
  }

  // Image Preview Mode
  if (mode === 'image' && imagePreview) {
    return (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
        <div className="relative flex-grow bg-black/5 rounded-2xl overflow-hidden mb-4 border border-stone-200/10">
          <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
          <button 
            onClick={() => {
              setMode('selection');
              setImageFile(null);
              setImagePreview(null);
            }}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm"
          >
            <X size={20} />
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold text-lg shadow-lg transition-all"
        >
          Analyze Screenshot
        </button>
      </div>
    );
  }

  return null;
};

export default InputSection;
