
export enum RiskLevel {
  SAFE = "Safe",
  CAUTION = "Caution",
  CONFLICT = "Conflict",
  CONCERN = "Concern",
  CRISIS = "Crisis"
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  confidenceScore: number;
  literalMeaning: string;
  emotionalSubtext: string;
  vocalTone: string;
  suggestedResponse: string[];
}

export interface Memory {
  id: string;
  timestamp: number;
  originalText: string;
  analysis: AnalysisResult;
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja';
