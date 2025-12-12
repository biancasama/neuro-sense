
import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, FileText, Mic, X, Loader2, Upload, StopCircle, Globe, BrainCircuit, Wand2, Sparkles, ChevronDown, Keyboard } from 'lucide-react';
import { fileToGenerativePart } from '../services/geminiService';

interface InputSectionProps {
  onAnalyze: (text: string, useDeepContext: boolean, imageBase64?: string, imageMimeType?: string, audioBase64?: string, audioMimeType?: string, voiceAccent?: string) => void;
  isAnalyzing: boolean;
  t: any;
  theme: 'light' | 'dark';
}

// Add support for Web Speech API types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const ACCENTS = [
  "Auto-Detect Accent",
  "Neutral", 
  "American", 
  "British", 
  "Australian", 
  "Canadian", 
  "Indian", 
  "Irish", 
  "Scottish", 
  "South African",
  "English (Italian)", 
  "English (French)", 
  "English (German)", 
  "English (Spanish)", 
  "English (Portuguese)", 
  "English (Russian)",
  "English (Japanese)", 
  "English (Chinese)", 
  "English (Arabic)"
];

const ACCENT_LANG_MAP: Record<string, string> = {
  "American": "en-US",
  "British": "en-GB",
  "Australian": "en-AU",
  "Canadian": "en-CA",
  "Indian": "en-IN",
  "Irish": "en-IE",
  "Scottish": "en-GB", 
  "South African": "en-ZA",
  "English (Italian)": "it-IT", 
  "English (French)": "fr-FR",
  "English (German)": "de-DE",
  "English (Spanish)": "es-ES",
  "Neutral": "en-US",
  "Auto-Detect Accent": "navigator" 
};

const getBrowserAccentSuggestion = (): string => {
  const lang = navigator.language;
  if (lang.startsWith('en-US')) return 'American';
  if (lang.startsWith('en-GB')) return 'British';
  if (lang.startsWith('en-AU')) return 'Australian';
  if (lang.startsWith('en-CA')) return 'Canadian';
  if (lang.startsWith('en-IN')) return 'Indian';
  if (lang.startsWith('en-IE')) return 'Irish';
  if (lang.startsWith('en-ZA')) return 'South African';
  return 'Neutral';
};

// Extracted Component for Stability
const DeepContextToggle: React.FC<{
  isEnabled: boolean;
  onToggle: () => void;
  theme: 'light' | 'dark';
}> = ({ isEnabled, onToggle, theme }) => {
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-stone-800';
  const textSecondary = theme === 'dark' ? 'text-stone-400' : 'text-stone-500';

  return (
    <div 
      onClick={onToggle}
      className={`
        relative overflow-hidden group
        flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-500 border-2
        ${isEnabled 
          ? 'border-indigo-500 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 shadow-xl shadow-indigo-500/30 scale-[1.01]' 
          : (theme === 'dark' ? 'bg-[#2C2C2C] border-indigo-500/30 hover:border-indigo-400' : 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10')
        } 
        mb-6 select-none
      `}
    >
       {/* Background decoration for active state */}
       {isEnabled && (
          <div className="absolute inset-0 bg-white opacity-10 mix-blend-overlay"></div>
       )}

       {/* Icon Box */}
       <div className={`
         w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 flex-shrink-0 shadow-sm
         ${isEnabled 
           ? 'bg-white/20 text-white backdrop-blur-md rotate-12 scale-110' 
           : (theme === 'dark' ? 'bg-[#383838] text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100')
         }
       `}>
         {isEnabled ? <Sparkles size={24} className="animate-pulse" /> : <BrainCircuit size={24} />}
       </div>
       
       {/* Text Content */}
       <div className="flex flex-col relative z-10">
         <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-lg font-bold ${isEnabled ? 'text-white' : textPrimary}`}>
              Deep Context
            </span>
            {!isEnabled && (
               <span className="flex h-2 w-2 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
               </span>
            )}
         </div>
         <span className={`text-sm ${isEnabled ? 'text-indigo-100 font-medium' : textSecondary}`}>
           Gemini 3 Pro reasoning
         </span>
       </div>

       {/* Toggle Switch UI */}
       <div className={`
          ml-auto w-14 h-8 rounded-full relative transition-all duration-500 flex-shrink-0 border
          ${isEnabled 
             ? 'bg-indigo-400/30 border-indigo-300/50' 
             : (theme === 'dark' ? 'bg-stone-800 border-stone-600' : 'bg-stone-100 border-stone-200')
          }
       `}>
         <div className={`
           absolute top-1 w-6 h-6 rounded-full shadow-md transition-all duration-500 flex items-center justify-center
           ${isEnabled ? 'bg-white right-1 translate-x-0' : 'bg-white left-1 translate-x-0 border border-stone-100'}
         `}>
            {isEnabled && <Sparkles size={12} className="text-indigo-600" />}
         </div>
       </div>
    </div>
  );
};

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing, t, theme }) => {
  const [mode, setMode] = useState<'selection' | 'text' | 'image' | 'audio'>('selection');
  const [text, setText] = useState('');
  
  // Deep Context Mode (Gemini 3 Pro)
  const [useDeepContext, setUseDeepContext] = useState(false);
  
  // File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'audio' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{ blob: Blob, mimeType: string } | null>(null);
  
  // Refs for Recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>(''); // Stores text present before recording started
  
  // Plain Language Mode State
  const [plainMode, setPlainMode] = useState(true);

  // Voice Accent State
  const [voiceAccent, setVoiceAccent] = useState('Auto-Detect Accent');
  const [suggestedAccent, setSuggestedAccent] = useState<string>('');

  // Load Accent from LocalStorage or Suggest based on Browser
  useEffect(() => {
    const savedAccent = localStorage.getItem('ns_voice_accent');
    const suggestion = getBrowserAccentSuggestion();
    setSuggestedAccent(suggestion);

    if (savedAccent) {
      setVoiceAccent(savedAccent);
    } 
  }, []);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
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
      // 1. Start Audio Recording (MediaRecorder) - For Tone Analysis
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
        stream.getTracks().forEach(track => track.stop());
        setIsProcessingAudio(false);
      };

      mediaRecorder.start();

      // 2. Start Speech Recognition (Web Speech API) - For Live Text
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        
        let langCode = 'en-US';
        if (voiceAccent === 'Auto-Detect Accent') {
           langCode = navigator.language || 'en-US';
        } else {
           langCode = ACCENT_LANG_MAP[voiceAccent] || 'en-US';
        }
        
        recognition.lang = langCode;

        baseTextRef.current = text; 

        recognition.onresult = (event: any) => {
          let fullSessionTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
             fullSessionTranscript += event.results[i][0].transcript;
          }
          const spacing = baseTextRef.current && !baseTextRef.current.endsWith(' ') && fullSessionTranscript ? ' ' : '';
          setText(baseTextRef.current + spacing + fullSessionTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    setIsProcessingAudio(true);
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    // Processing state will be cleared in mediaRecorder.onstop
  };

  const resetSelection = () => {
    setMode('selection');
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setRecordedAudio(null);
    setIsRecording(false);
    setText('');
  };

  const handleSubmit = async () => {
    let imgBase64 = undefined;
    let imgMimeType = undefined;
    let audioBase64 = undefined;
    let audioMimeType = undefined;

    if (fileType === 'image' && selectedFile) {
      imgBase64 = await fileToGenerativePart(selectedFile);
      imgMimeType = selectedFile.type;
    }

    if (fileType === 'audio' && selectedFile) {
       audioBase64 = await fileToGenerativePart(selectedFile);
       audioMimeType = selectedFile.type;
    }

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

    onAnalyze(text, useDeepContext, imgBase64, imgMimeType, audioBase64, audioMimeType, voiceAccent);
  };

  // --- Render Modes ---

  if (mode === 'selection') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4">
        <p className={`mb-8 ${textSecondary} md:text-lg`}>{t.letMakeSense}</p>
        
        <DeepContextToggle 
          isEnabled={useDeepContext} 
          onToggle={() => setUseDeepContext(!useDeepContext)} 
          theme={theme} 
        />

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

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,audio/*"
            className="hidden"
        />

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
      <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 min-h-[500px]">
        
        {/* Main Text Input Area */}
        <div className={`
          relative flex-grow rounded-3xl mb-6 overflow-hidden border transition-all duration-300
          ${isRecording 
            ? 'border-red-400 bg-red-50/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]' 
            : (theme === 'dark' ? 'bg-[#2C2C2C] border-transparent focus-within:border-indigo-500/50' : 'bg-stone-50 border-transparent focus-within:border-indigo-200')
          }
        `}>
           
           <textarea
            autoFocus
            className={`
              w-full h-full p-6 pb-32 md:p-8 md:pb-32 text-lg md:text-xl resize-none outline-none bg-transparent leading-relaxed z-10 relative custom-scrollbar
              ${theme === 'dark' ? 'text-white placeholder-stone-500' : 'text-stone-800 placeholder-stone-400'}
              ${isRecording ? 'blur-sm opacity-50' : 'opacity-100'}
              transition-all duration-300
            `}
            placeholder={isRecording ? "" : t.inputPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => {
              // Seamless switch: if user taps to type while recording, stop recording automatically
              if (isRecording) stopRecording();
            }}
          />

          {/* Recording Visualizer Overlay */}
          {(isRecording || isProcessingAudio) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
               {isProcessingAudio ? (
                 <div className="flex flex-col items-center gap-2">
                   <Loader2 size={32} className={`animate-spin ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'}`} />
                   <p className={`text-lg font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>Processing Audio...</p>
                 </div>
               ) : (
                 <>
                  <div className="flex items-center gap-1.5 h-16 mb-4 opacity-75">
                      {[1, 2, 3, 2, 4, 2, 1, 3, 2].map((h, i) => (
                        <div 
                          key={i} 
                          className={`w-2.5 rounded-full animate-bounce ${theme === 'dark' ? 'bg-red-400' : 'bg-red-500'}`}
                          style={{ 
                            height: `${h * 10}px`, 
                            animationDuration: '0.8s',
                            animationDelay: `${i * 0.1}s` 
                          }}
                        ></div>
                      ))}
                  </div>
                  <p className={`text-2xl font-bold animate-pulse ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
                    {t.voicePlaceholder || "Listening..."}
                  </p>
                  <p className={`mt-2 text-sm font-medium opacity-70 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                    Tap anywhere to type
                  </p>
                 </>
               )}
            </div>
          )}

          {/* Controls Container */}
          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4 z-20">
             
             {/* Accent Selector - Enhanced Visibility */}
             <div className="flex flex-col items-end gap-1">
               <span className={`text-[10px] uppercase font-bold tracking-wider ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'} mr-2`}>
                 Voice Accent
               </span>
               <div className={`
                  flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border transition-all duration-300 shadow-lg backdrop-blur-md cursor-pointer hover:scale-105
                  ${theme === 'dark' ? 'bg-[#1a1a1a]/95 border-[#444] hover:border-indigo-500/50' : 'bg-white/95 border-stone-200 hover:border-indigo-200'}
               `}>
                  <Globe size={16} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} />
                  <div className="relative">
                    <select 
                      value={voiceAccent}
                      onChange={handleAccentChange}
                      className={`
                        bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none py-1 pr-6 pl-1 min-w-[140px]
                        ${theme === 'dark' ? 'text-stone-200' : 'text-stone-700'}
                      `}
                    >
                      {ACCENTS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <ChevronDown size={14} className={`absolute right-0 top-1.5 pointer-events-none ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`} />
                  </div>
               </div>
             </div>

             {/* Mic / Stop Button */}
             {isRecording ? (
                <button 
                  onClick={stopRecording}
                  className="group flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-xl shadow-red-500/30 animate-pulse"
                >
                  <span className="font-bold text-sm tracking-wide">STOP</span>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <StopCircle size={24} fill="currentColor" />
                  </div>
                </button>
             ) : (
                <button 
                  onClick={startRecording}
                  className={`
                    group flex items-center gap-3 pl-4 pr-2 py-2 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105
                    ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-indigo-600 border border-indigo-100 hover:border-indigo-300'}
                  `}
                >
                  <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-400'} opacity-0 group-hover:opacity-100 transition-opacity -mr-2`}>
                    Dictate
                  </span>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-white/10' : 'bg-indigo-50'}`}>
                    <Mic size={24} />
                  </div>
                </button>
             )}
          </div>

           {/* Audio Attached Indicator */}
           {recordedAudio && !isRecording && !isProcessingAudio && (
              <div className="absolute bottom-6 left-6 animate-in slide-in-from-bottom-2 fade-in z-20">
                 <div className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 text-sm font-bold flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                   Voice Note Attached 
                   <button 
                     onClick={() => setRecordedAudio(null)} 
                     className="ml-1 p-1 hover:bg-white/20 rounded-full transition-colors"
                   >
                     <X size={14} />
                   </button>
                 </div>
              </div>
           )}
        </div>

        <DeepContextToggle 
          isEnabled={useDeepContext} 
          onToggle={() => setUseDeepContext(!useDeepContext)} 
          theme={theme} 
        />

        <div className="flex gap-4 mt-auto">
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
        
        <DeepContextToggle 
          isEnabled={useDeepContext} 
          onToggle={() => setUseDeepContext(!useDeepContext)} 
          theme={theme} 
        />

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

         <DeepContextToggle 
          isEnabled={useDeepContext} 
          onToggle={() => setUseDeepContext(!useDeepContext)} 
          theme={theme} 
        />

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
