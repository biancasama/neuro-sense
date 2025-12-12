
import React, { useEffect, useState, useRef } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { X, Loader2, ShieldCheck, AlertTriangle, Zap, Mic, Square, Music, HeartHandshake } from 'lucide-react';

declare var chrome: any;

interface Props {
  text: string;
  onClose: () => void;
}

const ExtensionOverlay: React.FC<Props> = ({ text, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [audioAttached, setAudioAttached] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const runAnalysis = (txt: string, audioBase64?: string, audioMimeType?: string) => {
    setLoading(true);
    setResult(null);
    setError(null);

    chrome.runtime.sendMessage({ 
      action: "ANALYZE_TEXT", 
      text: txt,
      audioBase64,
      audioMimeType
    }, (response: any) => {
      setLoading(false);
      if (response && response.success) {
        setResult(response.data);
      } else {
        setError(response?.error || "Analysis failed");
      }
    });
  };

  useEffect(() => {
    // Initial analysis (text only)
    runAnalysis(text);
  }, [text]);

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
        
        // Convert to Base64 manually to avoid importing heavy service dependencies in content script
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          setAudioAttached(true);
          runAnalysis(text, base64Data, mimeType);
        };
        reader.readAsDataURL(audioBlob);

        // Stop tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Helper for risk colors
  const getRiskColor = (level?: RiskLevel) => {
    if (level === RiskLevel.CRISIS) return '#7f1d1d'; // Red-900
    if (level === RiskLevel.CONCERN) return '#f97316'; // Orange-500
    if (level === RiskLevel.CONFLICT) return '#ef4444'; // Red-500
    if (level === RiskLevel.CAUTION) return '#f59e0b'; // Amber-500
    return '#10b981'; // Emerald-500
  };

  const getRiskBg = (level?: RiskLevel) => {
    if (level === RiskLevel.CRISIS) return '#fca5a5'; 
    if (level === RiskLevel.CONCERN) return '#ffedd5'; 
    if (level === RiskLevel.CONFLICT) return '#fee2e2'; 
    if (level === RiskLevel.CAUTION) return '#fef3c7'; 
    return '#d1fae5'; 
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: '35px',
        left: '0',
        width: '320px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.6)',
        padding: '16px',
        color: '#1c1917',
        fontFamily: 'Inter, sans-serif',
        zIndex: 10000,
        textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#57534e', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Neuro-Sense
          {audioAttached && <Music size={12} color="#10b981" />}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           {/* Recording Control */}
           {!loading && (
             isRecording ? (
                <button 
                  onClick={stopRecording}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '4px', 
                    background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca',
                    borderRadius: '12px', padding: '4px 8px', fontSize: '11px', fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Square size={10} fill="currentColor" /> Stop
                </button>
             ) : (
                <button 
                  onClick={startRecording}
                  title="Add vocal context"
                  style={{ 
                    background: audioAttached ? '#d1fae5' : '#f5f5f4', 
                    color: audioAttached ? '#059669' : '#78716c', 
                    border: '1px solid',
                    borderColor: audioAttached ? '#a7f3d0' : '#e7e5e4',
                    borderRadius: '50%', width: '24px', height: '24px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Mic size={14} />
                </button>
             )
           )}
           <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#a8a29e' }}>
            <X size={16} />
           </button>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: '#78716c', flexDirection: 'column', gap: '8px' }}>
          <Loader2 className="animate-spin" size={24} />
          <span style={{ fontSize: '13px' }}>
             {isRecording ? "Analyzing audio..." : "Decoding context..."}
          </span>
        </div>
      )}

      {error && (
        <div style={{ color: '#be123c', fontSize: '13px', padding: '8px', background: '#ffe4e6', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {!loading && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Risk Badge */}
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            padding: '6px 12px', borderRadius: '20px', width: 'fit-content',
            fontSize: '12px', fontWeight: 600,
            backgroundColor: getRiskBg(result.riskLevel),
            color: getRiskColor(result.riskLevel)
          }}>
            {result.riskLevel === RiskLevel.SAFE && <ShieldCheck size={14} />}
            {result.riskLevel === RiskLevel.CAUTION && <AlertTriangle size={14} />}
            {result.riskLevel === RiskLevel.CONFLICT && <Zap size={14} />}
            {result.riskLevel === RiskLevel.CONCERN && <HeartHandshake size={14} />}
            <span>{result.riskLevel} ({result.confidenceScore}%)</span>
          </div>

          {/* Meaning */}
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a8a29e', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Literal</span>
            <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0 }}>{result.literalMeaning}</p>
          </div>

          {/* Subtext */}
          <div style={{ padding: '10px', backgroundColor: '#fafaf9', borderRadius: '8px', border: '1px solid #e7e5e4' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#78716c', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Hidden Subtext</span>
            <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0, color: '#44403c' }}>{result.emotionalSubtext}</p>
          </div>
          
          {/* Vocal Tone (If Available) */}
          {result.vocalTone && !result.vocalTone.toLowerCase().includes("text only") && (
             <div style={{ padding: '10px', backgroundColor: '#f3e8ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9333ea', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Vocal Tone</span>
              <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0, color: '#6b21a8' }}>{result.vocalTone}</p>
            </div>
          )}

          {/* Response */}
          <div>
             <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#a8a29e', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Try Replying</span>
             <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#57534e', padding: '8px', background: '#f5f5f4', borderRadius: '8px' }}>
               "{result.suggestedResponse[0]}"
             </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ExtensionOverlay;
