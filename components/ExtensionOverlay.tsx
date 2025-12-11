import React, { useEffect, useState } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { X, Loader2, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';

declare var chrome: any;

interface Props {
  text: string;
  onClose: () => void;
}

const ExtensionOverlay: React.FC<Props> = ({ text, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Send message to background script
    chrome.runtime.sendMessage({ action: "ANALYZE_TEXT", text }, (response: any) => {
      setLoading(false);
      if (response && response.success) {
        setResult(response.data);
      } else {
        setError(response?.error || "Analysis failed");
      }
    });
  }, [text]);

  // Helper for risk colors (reused logic simplified)
  const getRiskColor = (level?: RiskLevel) => {
    if (level === RiskLevel.CONFLICT) return '#fee2e2'; // Red-100
    if (level === RiskLevel.CAUTION) return '#fef3c7'; // Amber-100
    return '#d1fae5'; // Emerald-100
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: '35px',
        left: '0',
        width: '320px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.5)',
        padding: '16px',
        color: '#1c1917',
        fontFamily: 'Inter, sans-serif',
        zIndex: 10000,
        textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#57534e' }}>Neuro-Interpreter</h4>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#a8a29e' }}>
          <X size={16} />
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: '#78716c' }}>
          <Loader2 className="animate-spin" size={24} />
          <span style={{ marginLeft: '8px', fontSize: '13px' }}>Decoding context...</span>
        </div>
      )}

      {error && (
        <div style={{ color: '#be123c', fontSize: '13px', padding: '8px', background: '#ffe4e6', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Risk Badge */}
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            padding: '6px 12px', borderRadius: '20px', width: 'fit-content',
            fontSize: '12px', fontWeight: 600,
            backgroundColor: getRiskColor(result.riskLevel)
          }}>
            {result.riskLevel === RiskLevel.SAFE && <ShieldCheck size={14} />}
            {result.riskLevel === RiskLevel.CAUTION && <AlertTriangle size={14} />}
            {result.riskLevel === RiskLevel.CONFLICT && <Zap size={14} />}
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