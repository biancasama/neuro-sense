
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
      enum: ["Safe", "Caution", "Conflict", "Crisis"],
      description: "The emotional safety level of the message. Use 'Crisis' for dangerous or suicidal content."
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
    SAFETY OVERRIDE (HIGHEST PRIORITY):
    If the input text or audio indicates suicidal ideation, self-harm, severe violence, or immediate danger:
    1. Set 'riskLevel' to "Crisis".
    2. Set 'confidenceScore' to 100.
    3. In 'emotionalSubtext', provide a validating, compassionate statement acknowledging the pain (e.g., "It sounds like you are in a lot of pain right now. Your feelings are valid.").
    4. In 'literalMeaning', summarize the distress briefly without judgment.
    5. In 'suggestedResponse', provide 3 responses:
       - Response 1: A supportive message encouraging connection or professional help.
       - Response 2: A simple text reaching out for connection (e.g. "I'm going through a tough time, can we talk?").
       - Response 3: A boundary setting text if relevant, or another supportive option.
    6. Do NOT provide standard social analysis. Focus entirely on safety and support.

    You are an expert assistive tool for neurodivergent individuals (Autism/ADHD).
    Decode the message into clear sections.
    
    1. Literal Meaning: What the words say directly.
    2. Emotional Subtext: The hidden tone, intent, or feeling.
    3. Vocal Tone: If audio is provided, analyze the prosody (pitch, pace, volume, pauses) to determine the speaker's true feeling (e.g. is it sarcastic? anxious? angry?). Include accent identification if requested.
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
