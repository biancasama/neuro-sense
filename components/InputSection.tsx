
import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, FileText, Mic, X, Loader2, Upload, StopCircle, Globe } from 'lucide-react';
import { fileToGenerativePart } from '../services/geminiService';

interface InputSectionProps {
  onAnalyze: (text: string, useDeepContext: boolean, imageBase64?: string, imageMimeType?: string, audioBase64?: string, audioMimeType?: string, voiceAccent?: string) => void;
  isAnalyzing: boolean;
  t: any;
  theme: 'light' | 'dark';
}

const ACCENTS = ["Neutral", "American", "British", "Australian", "Indian", "Irish", "Scottish", "South African", "Canadian"];

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing, t, theme }) => {
  const [mode, setMode] = useState<'selection' | 'text' | 'image' | 'audio'>('selection');
  const [text, setText] = useState('');
  
  // File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'audio' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{ blob: Blob, mimeType: string } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Plain Language Mode State
  const [plainMode, setPlainMode] = useState(true);

  // Voice Accent State
  const [voiceAccent, setVoiceAccent] = useState('Neutral');

  // Load Accent from LocalStorage
  useEffect(() => {
    const savedAccent = localStorage.getItem('ns_voice_accent');
    if (savedAccent) {
      setVoiceAccent(savedAccent);
    }
  }, []);

  const handleAccentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAccent = e.target.value;
    setVoiceAccent(newAccent);
    localStorage.setItem('ns_voice_accent', newAccent);
  };

  // Styles based on theme
  const buttonBase = `
    w-full p-6 md:p-8 rounded-3xl flex items-center gap-6 transition-all duration-300 border text-left group h-full
    ${theme === 'dark' 
      ? 'bg-[#2C2C2C] border-[#383838] hover:border-indigo-500/50 hover:bg-[#333]' 
      : 'bg-white border-stone-100 shadow-sm hover:border-indigo-100 hover:shadow-md'
    }
  `;
  const iconBox = `
    w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0
    ${theme === 'dark' ? 'bg-[#383838] text-indigo-400 group-hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}
  `;
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-800';
  const textSecondary = theme === 'dark' ? 'text-stone-400' : 'text-stone-500';

  // --- Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFilePreview(url);
        setFileType('image');
        setMode('image');
      } else if (file.type.startsWith('audio/')) {
        setFileType('audio');
        setMode('audio');
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordedAudio({ blob: audioBlob, mimeType });
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetSelection = () => {
    setMode('selection');
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setRecordedAudio(null);
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    let imgBase64 = undefined;
    let imgMimeType = undefined;
    let audioBase64 = undefined;
    let audioMimeType = undefined;

    // Handle Image File
    if (fileType === 'image' && selectedFile) {
      imgBase64 = await fileToGenerativePart(selectedFile);
      imgMimeType = selectedFile.type;
    }

    // Handle Audio File
    if (fileType === 'audio' && selectedFile) {
       audioBase64 = await fileToGenerativePart(selectedFile);
       audioMimeType = selectedFile.type;
    }

    // Handle Recorded Audio (Dictation in Text Mode)
    if (recordedAudio) {
      const reader = new FileReader();
      reader.readAsDataURL(recordedAudio.blob);
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          const base64String = reader.result as string;
          audioBase64 = base64String.split(',')[1];
          audioMimeType = recordedAudio.mimeType;
          resolve();
        };
      });
    }

    onAnalyze(text, false, imgBase64, imgMimeType, audioBase64, audioMimeType, voiceAccent);
  };

  // --- Render Modes ---

  if (mode === 'selection') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4">
        <p className={`mb-8 ${textSecondary} md:text-lg`}>{t.letMakeSense}</p>

        {/* Responsive Grid for Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={buttonBase}
          >
            <div className={iconBox}>
              <Upload size={28} />
            </div>
            <div>
              <span className={`block font-bold text-lg md:text-xl mb-1 ${textPrimary}`}>{t.uploadFile}</span>
              <span className={`text-sm md:text-base ${textSecondary}`}>{t.uploadDesc}</span>
            </div>
          </button>

          <button 
            onClick={() => setMode('text')}
            className={buttonBase}
          >
            <div className={iconBox}>
              <FileText size={28} />
            </div>
            <div>
              <span className={`block font-bold text-lg md:text-xl mb-1 ${textPrimary}`}>{t.pasteText}</span>
              <span className={`text-sm md:text-base ${textSecondary}`}>{t.pasteDesc}</span>
            </div>
          </button>
        </div>

        {/* Hidden File Input: Accepts Images AND Audio */}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,audio/*"
            className="hidden"
        />

        {/* Interactive Plain Language Mode Toggle */}
        <div 
          onClick={() => setPlainMode(!plainMode)}
          className={`mt-8 md:mt-10 flex flex-col p-5 rounded-2xl cursor-pointer transition-all ${theme === 'dark' ? 'bg-[#2C2C2C] hover:bg-[#353535]' : 'bg-stone-50 hover:bg-stone-100'} max-w-lg border border-transparent hover:border-indigo-100`}
        >
           <div className="flex items-center justify-between w-full">
               <span className={`font-medium text-base md:text-lg ${textPrimary}`}>{t.plainMode}</span>
               <div className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${plainMode ? 'bg-indigo-500/20' : (theme === 'dark' ? 'bg-stone-700' : 'bg-stone-200')}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full shadow-sm transition-all duration-300 ${plainMode ? 'bg-indigo-500 right-1' : 'bg-stone-400 left-1'}`}></div>
               </div>
           </div>
           
           {/* The "Box" suggesting answer appearing */}
           <div className={`grid transition-all duration-300 ease-in-out ${plainMode ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
              <div className="overflow-hidden">
                 <div className={`p-4 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'border-stone-700 bg-black/20' : 'border-stone-200 bg-white/50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                       <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-500'} animate-pulse`}></div>
                       <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'}`}>{t.previewLabel}</span>
                    </div>
                    <p className={`text-sm ${textSecondary} leading-relaxed`}>
                       {t.previewDesc}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Text Entry Mode (with Mic)
  if (mode === 'text') {
    return (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 min-h-[400px]">
        <div className={`relative flex-grow rounded-3xl mb-6 overflow-hidden border border-transparent focus-within:border-indigo-500/50 transition-colors ${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-stone-50'}`}>
           
           <textarea
            autoFocus
            className={`
              w-full h-full p-6 md:p-8 text-lg md:text-xl resize-none outline-none bg-transparent leading-relaxed
              ${theme === 'dark' ? 'text-white placeholder-stone-500' : 'text-stone-800 placeholder-stone-400'}
            `}
            placeholder={t.inputPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Microphone Trigger / status */}
          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3">
             {/* Accent Selector (Near Mic) */}
             <div className={`flex items-center gap-2 p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-[#383838]' : 'bg-white border border-stone-200 shadow-sm'}`}>
                <Globe size={16} className={theme === 'dark' ? 'text-stone-400' : 'text-stone-500'} />
                <select 
                  value={voiceAccent}
                  onChange={handleAccentChange}
                  className={`bg-transparent text-sm font-medium outline-none cursor-pointer ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}
                >
                  {ACCENTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
             </div>

            {recordedAudio && !isRecording && (
               <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center gap-2">
                 Audio Attached <X size={14} className="cursor-pointer hover:scale-110" onClick={() => setRecordedAudio(null)}/>
               </div>
            )}

            {isRecording ? (
              <button 
                onClick={stopRecording}
                className="p-4 rounded-full bg-red-500 text-white animate-pulse shadow-lg hover:bg-red-600 transition-colors"
                title="Stop Recording"
              >
                <StopCircle size={28} />
              </button>
            ) : (
              <button 
                onClick={startRecording}
                className={`p-4 rounded-full transition-all shadow-md ${theme === 'dark' ? 'bg-[#383838] text-indigo-400 hover:bg-[#454545]' : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-stone-200'}`}
                title="Read message (Record Audio)"
              >
                <Mic size={28} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={resetSelection}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-colors ${theme === 'dark' ? 'bg-[#2C2C2C] text-stone-300 hover:bg-[#383838]' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            {t.backBtn}
          </button>
          <button
            onClick={handleSubmit}
            disabled={(!text.trim() && !recordedAudio)}
            className="flex-grow py-4 rounded-2xl bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold text-lg shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01]"
          >
            {recordedAudio ? t.analyzeAudioText : t.analyzeText}
          </button>
        </div>
      </div>
    );
  }

  // Image Preview Mode
  if (mode === 'image' && filePreview) {
    return (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 min-h-[400px]">
        <div className={`relative flex-grow rounded-3xl overflow-hidden mb-6 border ${theme === 'dark' ? 'border-[#383838] bg-[#2C2C2C]' : 'border-stone-200 bg-stone-50'}`}>
          <img src={filePreview} alt="Preview" className="w-full h-full object-contain p-4" />
          <button 
            onClick={resetSelection}
            className="absolute top-4 right-4 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm transition-all"
          >
            <X size={24} />
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-5 rounded-2xl bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold text-xl shadow-xl transition-all"
        >
          {t.analyzeScreenshot}
        </button>
      </div>
    );
  }

  // Audio File Preview Mode
  if (mode === 'audio' && selectedFile) {
     return (
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 justify-between min-h-[400px]">
         <div className={`flex-grow flex flex-col items-center justify-center rounded-3xl mb-6 border-2 border-dashed ${theme === 'dark' ? 'bg-[#2C2C2C] border-[#383838]' : 'bg-stone-50 border-stone-200'}`}>
            <div className={`p-8 rounded-full mb-6 ${theme === 'dark' ? 'bg-[#383838] text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
              <Mic size={64} />
            </div>
            <p className={`font-bold text-xl ${textPrimary} mb-2`}>{selectedFile.name}</p>
            <p className={`text-base ${textSecondary}`}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
         
            {/* Accent Selector for Audio File */}
             <div className={`mt-4 flex items-center gap-2 p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-[#383838]' : 'bg-white border border-stone-200 shadow-sm'}`}>
                <Globe size={16} className={theme === 'dark' ? 'text-stone-400' : 'text-stone-500'} />
                <span className={`text-sm ${textSecondary} mr-2`}>Accent:</span>
                <select 
                  value={voiceAccent}
                  onChange={handleAccentChange}
                  className={`bg-transparent text-sm font-medium outline-none cursor-pointer ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}
                >
                  {ACCENTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
             </div>
         </div>

         <div className="flex gap-4">
          <button 
            onClick={resetSelection}
            className={`px-8 py-5 rounded-2xl font-bold text-lg transition-colors ${theme === 'dark' ? 'bg-[#2C2C2C] text-stone-300 hover:bg-[#383838]' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            {t.backBtn}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-grow py-5 rounded-2xl bg-[#6366F1] hover:bg-[#5558DD] text-white font-bold text-xl shadow-xl transition-all"
          >
            {t.analyzeAudio}
          </button>
        </div>
      </div>
     )
  }

  return null;
};

export default InputSection;
