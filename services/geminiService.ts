import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    vibeLabel: {
      type: Type.STRING,
      description: "A single word describing the tone (e.g., Sarcastic, Genuine, Dismissive, Warm)."
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["Safe", "Caution", "Conflict"],
      description: "The emotional safety level of the message."
    },
    confidenceScore: {
      type: Type.INTEGER,
      description: "A number from 0-100 indicating how confident you are in this interpretation based on the available context."
    },
    reasoning: {
      type: Type.STRING,
      description: "A 1-2 sentence explanation of the specific cues (punctuation, word choice, emoji) that led to this conclusion."
    },
    translation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 bullet points explaining literally what the person means, removing subtext."
    },
    replies: {
      type: Type.OBJECT,
      properties: {
        professional: { type: Type.STRING },
        friendly: { type: Type.STRING },
        firm: { type: Type.STRING }
      },
      required: ["professional", "friendly", "firm"]
    }
  },
  required: ["vibeLabel", "riskLevel", "confidenceScore", "reasoning", "translation", "replies"]
};

export const analyzeMessageContext = async (
  text: string, 
  imageBase64?: string,
  mimeType: string = "image/png"
): Promise<AnalysisResult> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: any[] = [];

  if (imageBase64) {
    parts.push({
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      }
    });
  }

  if (text) {
    parts.push({
      text: `Analyze this text message/chat: "${text}"`
    });
  }

  if (parts.length === 0) {
    throw new Error("No input provided.");
  }

  const systemInstruction = `
    You are an expert empathetic communication assistant for neurodivergent individuals (Autism/ADHD). 
    Your goal is to decode hidden meanings, tones, and intent in text messages.
    
    1. Deeply analyze the text for subtle cues (punctuation, capitalization, emoji usage, phrasing).
    2. Identify the "Vibe": Is it safe, a warning sign, or a conflict?
    3. Determine a Confidence Score: How sure are you? Ambiguous texts should have lower scores.
    4. Translate: Explain literally what the person means.
    5. Coach: Provide 3 draft replies.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        role: "user",
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 2048 } // Allow "Deep Think"
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};