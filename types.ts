export enum RiskLevel {
  SAFE = "Safe",
  CAUTION = "Caution",
  CONFLICT = "Conflict"
}

export interface AnalysisResult {
  vibeLabel: string;
  riskLevel: RiskLevel;
  translation: string[];
  replies: {
    professional: string;
    friendly: string;
    firm: string;
  };
}
