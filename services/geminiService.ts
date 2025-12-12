
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RiskLevel, GroundingData } from "../types";

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
      description: "The emotional safety level. Use 'Concern' for distress/hopelessness. Use 'Crisis' for immediate danger (self-harm, violence, physical threat)."
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
    },
    idiomsAndSarcasm: {
      type: Type.OBJECT,
      properties: {
        present: { type: Type.BOOLEAN },
        explanation: { type: Type.STRING, description: "Identify specific idioms, metaphors, or sarcasm (e.g., 'Break a leg', 'Sure, great'). Explain the cultural meaning vs literal meaning." }
      },
      required: ["present", "explanation"],
      description: "Detection of non-literal language, sarcasm, or cultural idioms."
    }
  },
  required: ["riskLevel", "confidenceScore", "literalMeaning", "emotionalSubtext", "vocalTone", "suggestedResponse", "idiomsAndSarcasm"]
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

  promptText += `\n\nIMPORTANT: Provide the analysis (Literal Meaning, Emotional Subtext, Vocal Tone, Idioms/Sarcasm, and Suggested Responses) in ${targetLanguage} language.`;

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

    **LEVEL 2: CRISIS MODE (Immediate Danger / Self-Harm / External Threat)**
    Triggers: 
    - Explicit suicidal ideation ("I want to end it", "I don't want to be here")
    - Self-harm intent
    - Severe threats of violence (from others or self)
    - Expressions of immediate physical danger (e.g., "I'm scared for my safety", "I'm being followed", "domestic violence", "emergency").
    
    Action:
    1. Set 'riskLevel' to "Crisis".
    2. Set 'confidenceScore' to 100.
    3. In 'emotionalSubtext', provide a validating statement acknowledging the severity of the situation.
    4. In 'suggestedResponse', provide supportive messages encouraging connection, safety, or professional help (911/Emergency).
    5. Do NOT provide standard social analysis.

    **STANDARD ANALYSIS (If Safe)**
    You are an expert assistive tool for neurodivergent individuals (Autism/ADHD).
    Decode the message into clear sections.
    1. Literal Meaning: What the words say directly.
    2. Emotional Subtext: The hidden tone, intent, or feeling.
    3. Vocal Tone: Prosody analysis.
    4. Suggested Response: Options for replying.
    5. Idioms & Sarcasm: Specifically explicitly check for idioms (e.g. "Ball is in your court", "Break a leg"), metaphors, or sarcasm (saying the opposite of what is meant). If found, set 'idiomsAndSarcasm.present' to true and explain the cultural meaning in 'explanation'.

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

// New function for Google Maps Grounding with Safety Filtering
export const getNearbySupportPlaces = async (lat: number, lng: number, riskLevel: RiskLevel): Promise<GroundingData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Triage Prompt Strategy: Strictly filter results based on risk level
  let promptText = "";

  if (riskLevel === RiskLevel.CRISIS) {
    promptText = `
      The user may be in danger. Find nearby emergency services including:
      1. Police Stations
      2. Fire Stations
      3. General Hospitals (Emergency Rooms)
      4. Psychiatric Emergency Centers

      STRICTLY EXCLUDE: Yoga studios, Pilates, Life Coaches, Spas, Gyms, Massage, and non-medical wellness centers.
      PRIORITIZE: 24/7 Medical and Safety facilities.
      List them with their address and open hours.
    `;
  } else {
    // Concern / Default
    promptText = `
      Find 3 nearby mental health counseling centers, licensed therapists, or support groups.
      EXCLUDE: Yoga, Pilates, Spas, and pure fitness centers.
      Focus on professional psychological support and counseling.
      List them with their address and open hours.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: promptText,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });
    
    // Note: When using tools like googleMaps, we cannot use responseSchema.
    // We return the raw text and the grounding metadata.
    return {
      text: response.text || "No nearby places found.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Could not fetch nearby locations.", chunks: [] };
  }
};
