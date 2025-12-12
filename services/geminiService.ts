
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
      enum: ["Safe", "Caution", "Conflict", "Concern", "Crisis"],
      description: "The emotional safety level. Use 'Concern' for distress/hopelessness. Use 'Crisis' ONLY for self-harm/suicide intent."
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
      description: "A detailed explanation of the hidden emotions, tone, and intent. In Crisis mode, provide validation."
    },
    vocalTone: {
      type: Type.STRING,
      description: "If audio is provided, describe the pitch, volume, speed, and implied emotion. Also identify the accent or origin if 'Auto-Detect Accent' was requested or if it's distinct."
    },
    suggestedResponse: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 distinct draft replies. In Crisis mode, these must be supportive and encourage professional help."
    }
  },
  required: ["riskLevel", "confidenceScore", "literalMeaning", "emotionalSubtext", "vocalTone", "suggestedResponse"]
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
  imageMimeType: string = "image/png",
  audioBase64?: string,
  audioMimeType: string = "audio/webm",
  voiceAccent?: string
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
        mimeType: imageMimeType
      }
    });
  }

  if (audioBase64) {
    parts.push({
      inlineData: {
        data: audioBase64,
        mimeType: audioMimeType
      }
    });
  }

  let promptText = `Analyze this communication. Text content: "${text}".`;
  
  if (audioBase64) {
      if (voiceAccent === 'Auto-Detect Accent') {
         promptText += `\n\nContext: The audio contains speech. Please analyze the speaker's accent/origin as part of the vocal tone analysis.`;
      } else if (voiceAccent && voiceAccent !== 'Neutral') {
         promptText += `\n\nContext: The speaker in the audio has a ${voiceAccent} accent.`;
      }
  }

  promptText += `\n\nIMPORTANT: Provide the analysis (Literal Meaning, Emotional Subtext, Vocal Tone, and Suggested Responses) in ${targetLanguage} language.`;

  // Always push text part
  parts.push({ text: promptText });

  if (parts.length === 0) {
    throw new Error("No input provided.");
  }

  const systemInstruction = `
    SAFETY PROTOCOLS (HIGHEST PRIORITY):

    **LEVEL 1: CONCERN MODE (High Emotional Distress, No Immediate Danger)**
    Triggers: Expressions of hopelessness ("I'm not okay", "It's too heavy", "I don't know what to do"), extreme exhaustion, or feeling overwhelmed/disappearing.
    Action:
    1. Set 'riskLevel' to "Concern".
    2. Set 'confidenceScore' to 90+.
    3. In 'emotionalSubtext', describe the distress gently and clearly (e.g., "They sound overwhelmed and are likely struggling quietly").
    4. In 'suggestedResponse', provide 3 gentle options:
       - Response 1: A "Checking In" message (e.g., "You've been on my mind. How are you holding up?").
       - Response 2: A "Validation" message (e.g., "That sounds incredibly heavy. I'm here for you.").
       - Response 3: A low-pressure offer of support.

    **LEVEL 2: CRISIS MODE (Immediate Danger / Self-Harm)**
    Triggers: Explicit suicidal ideation ("I want to end it", "I don't want to be here"), self-harm intent, or severe threats of violence.
    Action:
    1. Set 'riskLevel' to "Crisis".
    2. Set 'confidenceScore' to 100.
    3. In 'emotionalSubtext', provide a validating statement acknowledging the pain.
    4. In 'suggestedResponse', provide supportive messages encouraging connection or professional help.
    5. Do NOT provide standard social analysis.

    **STANDARD ANALYSIS (If Safe)**
    You are an expert assistive tool for neurodivergent individuals (Autism/ADHD).
    Decode the message into clear sections.
    1. Literal Meaning: What the words say directly.
    2. Emotional Subtext: The hidden tone, intent, or feeling.
    3. Vocal Tone: Prosody analysis.
    4. Suggested Response: Options for replying.

    OUTPUT LANGUAGE: ${targetLanguage}
    Ensure all string fields in the JSON response are written in ${targetLanguage}.

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
      config.thinkingConfig = { thinkingBudget: 32768 };
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
