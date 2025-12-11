import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, BrainCircuit, Sparkles, Mic, Square, Globe, Music } from 'lucide-react';
import { fileToGenerativePart, transcribeAudio } from '../services/geminiService';

interface InputSectionProps {
  onAnalyze: (text: string, useDeepContext: boolean, imageBase64?: string, imageMimeType?: string, audioBase64?: string, audioMimeType?: string) => void;
  isAnalyzing: boolean;
  t: any;
}

const ACCENTS = [
  { label: "Neutral (US/UK)", value: "Neutral" },
  { label: "English (French Accent)", value: "French" },
  { label: "English (Italian Accent)", value: "Italian" },
  { label: "English (Spanish Accent)", value: "Spanish" },
  { label: "English (German Accent)", value: "German" },
  { label: "English (Indian Accent)", value: "Indian" },
  { label: "English (East Asian Accent)", value: "East Asian" },
  { label: "English (Middle Eastern Accent)", value: "Middle Eastern" },
  { label: "English (Russian Accent)", value: "Russian" },
  { label: "English (Australian)", value: "Australian" }
];

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing, t }) => {
  const [text, setText] = useState('');
  const [useDeepContext, setUseDeepContext] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Initialize from localStorage or default to Neutral
  const [selectedAccent, setSelectedAccent] = useState(() => {
    return localStorage.getItem('neuroSense_voiceAccent') || "Neutral";
  });

  // Persist selection to localStorage
  useEffect(() => {
    localStorage.setItem('neuroSense_voiceAccent', selectedAccent);
  }, [selectedAccent]);

  const [audioData, setAudioData] = useState<{ base64: string, mimeType: string } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Audio = await fileToGenerativePart(file);
        setAudioData({
          base64: base64Audio,
          mimeType: file.type
        });
      } catch (err) {
        console.error("Failed to read audio file", err);
      }
    }
    // Allow re-selection
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAudio = () => {
    setAudioData(null);
  };

  // --- Voice Logic (Microphone) ---
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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await handleAudioInput(audioBlob, mimeType);
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      // Clear previous audio when starting new recording
      setAudioData(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  const handleAudioInput = async (audioBlob: Blob, mimeType: string) => {
    try {
      const base64Audio = await fileToGenerativePart(audioBlob);
      
      // Save for analysis
      setAudioData({
        base64: base64Audio,
        mimeType: mimeType
      });

      // Also Transcribe so user sees text
      const transcribedText = await transcribeAudio(base64Audio, mimeType, selectedAccent);
      
      setText(prev => {
        const spacer = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
        return prev + spacer + transcribedText;
      });
    } catch (error) {
      console.error("Transcription failed", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSubmit = async () => {
    if (!text && !imageFile && !audioData) return;

    let imgBase64 = undefined;
    let imgMimeType = undefined;

    if (imageFile) {
      imgBase64 = await fileToGenerativePart(imageFile);
      imgMimeType = imageFile.type;
    }

    onAnalyze(
      text, 
      useDeepContext, 
      imgBase64, 
      imgMimeType, 
      audioData?.base64, 
      audioData?.mimeType
    );
  };

  return (
    <div className="h-full flex flex-col">
        
        <div className="flex-grow space-y-6">
          
          {/* Input Controls Container */}
          <div className="relative group">
            <label htmlFor="message-input" className="sr-only">
              Paste Message Text
            </label>
            
            {/* Toolbar overlay for Voice Settings */}
            <div className="absolute top-2 right-2 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-lg border border-stone-200 shadow-sm">
               {/* Accent Selector */}
               <div className="relative flex items-center group/accent">
                 <Globe size={14} className="text-stone-400 ml-1.5" />
                 <select 
                    value={selectedAccent}
                    onChange={(e) => setSelectedAccent(e.target.value)}
                    disabled={isRecording || isTranscribing}
                    className="bg-transparent text-xs font-medium text-stone-600 p-1.5 pr-6 outline-none cursor-pointer appearance-none w-32"
                    title={t.voiceAccent}
                 >
                   {ACCENTS.map(acc => <option key={acc.value} value={acc.value}>{acc.label}</option>)}
                 </select>
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                 </div>
               </div>

               {/* Divider */}
               <div className="w-px h-4 bg-stone-300 mx-1"></div>

               {/* Mic Button */}
               {isRecording ? (
                 <button
                   onClick={stopRecording}
                   className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md border border-red-200 hover:bg-red-100 transition-all animate-pulse"
                 >
                   <Square size={14} fill="currentColor" />
                   <span className="text-xs font-bold">{t.stop}</span>
                 </button>
               ) : (
                 <button
                   onClick={startRecording}
                   disabled={isTranscribing}
                   className="p-1.5 text-stone-500 hover:text-forest hover:bg-stone-100 rounded-md transition-colors relative"
                   title={t.voiceDictation}
                 >
                   {isTranscribing ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />}
                 </button>
               )}
            </div>

            {/* Gradient Top Shadow for depth */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10 rounded-t-xl"></div>
            
            <textarea
              id="message-input"
              className={`
                w-full h-64 p-6 rounded-xl bg-lined-paper text-stone-800 placeholder-stone-400 
                border transition-all resize-none text-lg outline-none
                ${isRecording ? 'border-red-300 ring-2 ring-red-100' : 'border-stone-200 shadow-inner focus:border-forest/50 focus:ring-1 focus:ring-forest/20'}
              `}
              placeholder={isRecording ? t.voicePlaceholder : t.inputPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>

          {/* Attachments Area */}
          <div className="space-y-3">
            
            {/* Active Attachments Display */}
            {(audioData || imagePreview) && (
              <div className="space-y-3">
                {audioData && (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Music size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">Audio Recorded</p>
                        <p className="text-xs text-emerald-600">Attached for vocal tone analysis</p>
                      </div>
                    </div>
                    <button 
                      onClick={removeAudio}
                      className="p-1.5 text-emerald-400 hover:text-red-500 hover:bg-white rounded-full transition-all"
                      aria-label={t.removeAudio}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {imagePreview && (
                  <div className="relative w-full h-40 bg-stone-100 rounded-xl overflow-hidden border border-stone-300 shadow-sm group animate-in fade-in slide-in-from-bottom-2">
                    <img src={imagePreview} alt="Uploaded chat screenshot" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 border border-stone-200 rounded-full text-stone-600 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                      disabled={isAnalyzing}
                      aria-label={t.removeImage}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Attachment Buttons - Show if slot available */}
            {(!audioData || !imagePreview) && (
              <div className="flex gap-3">
                {!imagePreview && (
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="flex-1 py-3 px-4 rounded-xl border border-dashed border-stone-300 text-stone-500 hover:text-stone-700 hover:border-stone-400 hover:bg-stone-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <ImageIcon size={18} />
                    <span>{t.attach}</span>
                  </button>
                )}
                {!audioData && (
                  <button 
                    onClick={() => audioInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="flex-1 py-3 px-4 rounded-xl border border-dashed border-stone-300 text-stone-500 hover:text-stone-700 hover:border-stone-400 hover:bg-stone-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Music size={18} />
                    <span>{t.attachAudio}</span>
                  </button>
                )}
              </div>
            )}
            
          </div>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            aria-hidden="true"
          />
           <input
            type="file"
            ref={audioInputRef}
            onChange={handleAudioFileChange}
            accept="audio/*"
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
                {t.deepContext}
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
            disabled={(!text && !imageFile && !audioData) || isAnalyzing}
            className={`
              w-full py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3
              shadow-lg transition-all duration-300 transform group
              ${(!text && !imageFile && !audioData) || isAnalyzing 
                ? 'bg-stone-300 cursor-not-allowed' 
                : 'bg-forest hover:bg-[#254040] hover:-translate-y-1 hover:shadow-xl'
              }
            `}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={24} aria-hidden="true" />
                <span>{t.consulting}</span>
              </>
            ) : (
              <>
                <Sparkles size={22} className="group-hover:rotate-12 transition-transform" aria-hidden="true" />
                <span>{t.analyze}</span>
              </>
            )}
          </button>
        </div>

    </div>
  );
};

export default InputSection;