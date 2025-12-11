import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { fileToGenerativePart } from '../services/geminiService';

interface InputSectionProps {
  onAnalyze: (text: string, imageBase64?: string, mimeType?: string) => void;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
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

    onAnalyze(text, base64, mimeType);
  };

  return (
    <div className="w-full space-y-4">
        
        {/* Text Area */}
        <label htmlFor="message-input" className="sr-only">Paste your text message</label>
        <textarea
          id="message-input"
          className="w-full h-48 p-4 rounded-xl bg-sage-50 text-sage-900 placeholder-sage-400 border border-transparent focus:border-sage-300 focus:ring-2 focus:ring-sage-200 resize-none text-base transition-all outline-none"
          placeholder="Paste the confusing text message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing}
        />

        {/* Image Preview / Drop Zone */}
        {imagePreview ? (
          <div className="relative w-full h-48 bg-cream-100 rounded-xl overflow-hidden border border-cream-200 group">
            <img src={imagePreview} alt="Uploaded chat screenshot" className="w-full h-full object-cover opacity-90" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm text-sage-800 hover:text-red-500 hover:bg-white transition-colors focus:ring-2 focus:ring-red-300 focus:outline-none"
              disabled={isAnalyzing}
              aria-label="Remove image"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Upload a screenshot of the chat"
            className="w-full h-24 border-2 border-dashed border-sage-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-sage-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400"
          >
            <div className="flex flex-col items-center gap-1 text-sage-400 group-hover:text-sage-600 transition-colors">
              <ImageIcon size={24} aria-hidden="true" />
              <span className="text-sm font-medium">Add Screenshot (Optional)</span>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-hidden="true"
        />

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={(!text && !imageFile) || isAnalyzing}
          className={`
            w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2
            transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-sage-200
            ${(!text && !imageFile) || isAnalyzing 
              ? 'bg-sage-300 cursor-not-allowed' 
              : 'bg-sage-600 hover:bg-sage-700 shadow-lg shadow-sage-200 hover:shadow-sage-300 translate-y-0 hover:-translate-y-0.5'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" size={20} aria-hidden="true" />
              <span>Decoding...</span>
            </>
          ) : (
            <>
              <Upload size={20} aria-hidden="true" />
              <span>Analyze Tone & Intent</span>
            </>
          )}
        </button>

    </div>
  );
};

export default InputSection;