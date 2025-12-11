import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File | Blob): Promise<string> => {
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
    riskLevel: {
      type: Type.STRING,
      enum: ["Safe", "Caution", "Conflict"],
      description: "The emotional safety level of the message."
    },
    confidenceScore: {
      type: Type.INTEGER,
      description: "A number from 0-100 indicating confidence in the interpretation."
    },
    literalMeaning: {
      type: Type.STRING,
      description: "The direct, factual meaning of the words without any subtext."
    },
    emotionalSubtext: {
      type: Type.STRING,
      description: "A detailed explanation of the hidden emotions, tone, and intent."
    },
    suggestedResponse: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 distinct draft replies varying in tone (e.g., Professional, Friendly, Firm)."
    }
  },
  required: ["riskLevel", "confidenceScore", "literalMeaning", "emotionalSubtext", "suggestedResponse"]
};

export const transcribeAudio = async (
  audioBase64: string, 
  mimeType: string, 
  accent: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Flash is excellent for fast audio tasks
      contents: {
        role: "user",
        parts: [
          {
            inlineData: {
              data: audioBase64,
              mimeType: mimeType
            }
          },
          {
            text: `Transcribe the speech in this audio to text. The speaker is speaking English with a ${accent} accent/origin. Return ONLY the transcribed text, with no additional commentary.`
          }
        ]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Transcription Error:", error);
    throw new Error("Failed to transcribe audio.");
  }
};

export const analyzeMessageContext = async (
  text: string, 
  useDeepContext: boolean,
  targetLanguage: string = 'English',
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
      text: `Analyze this text message/chat: "${text}". \n\nIMPORTANT: Provide the analysis (Literal Meaning, Emotional Subtext, and Suggested Responses) in ${targetLanguage} language.`
    });
  }

  if (parts.length === 0) {
    throw new Error("No input provided.");
  }

  const systemInstruction = `
    You are an expert assistive tool for neurodivergent individuals.
    Decode the message into three clear sections:
    1. Literal Meaning: What the words say directly.
    2. Emotional Subtext: The hidden tone, intent, or feeling.
    3. Suggested Response: Options for replying.

    OUTPUT LANGUAGE: ${targetLanguage}
    Ensure all string fields in the JSON response are written in ${targetLanguage}, regardless of the input message language.

    CRITICAL INTERPRETATION RULE:
    - If emojis appear "on" a message bubble or are described as reactions (especially in screenshots), interpret them as the RECEIVER'S reaction to the Sender, NOT as part of the Sender's message.
    - Only interpret emojis as the Sender's intent if they are clearly typed inside the message text bubble.
  `;

  try {
    // Model Selection based on Toggle
    // Deep Context = Gemini 3 Pro + Thinking
    // Standard = Gemini 2.5 Flash
    const modelName = useDeepContext ? "gemini-3-pro-preview" : "gemini-2.5-flash";
    
    const config: any = {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    };

    // Only add thinking config if using Gemini 3 Pro
    if (useDeepContext) {
      config.thinkingConfig = { thinkingBudget: 2048 };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        role: "user",
        parts: parts
      },
      config: config
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
