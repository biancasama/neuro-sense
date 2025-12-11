export enum RiskLevel {
  SAFE = "Safe",
  CAUTION = "Caution",
  CONFLICT = "Conflict"
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  confidenceScore: number;
  literalMeaning: string;
  emotionalSubtext: string;
  suggestedResponse: string[];
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja';
