import express from 'express';
import bodyParser from 'body-parser';
import twilio from 'twilio';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming webhook data (Twilio sends application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: false }));

// Initialize Gemini
// WARNING: Ensure process.env.API_KEY is set in your environment
// We use GoogleGenAI as per SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System Instruction: The "Nano Banana" Persona
const SYSTEM_INSTRUCTION = `
You are Nano Banana, a compassionate assistive AI helper for neurodivergent users (Autism/ADHD).
Your goal is to decode the hidden social cues in text messages or chat screenshots.

Analyze the input and provide the following 3 sections using this exact format:

*Literal Meaning:*
[Explain strictly what the words say, factually.]

*Emotional Subtext:*
[Explain the tone, intent, and feelings. Be validating, clear, and non-judgmental.]

*Suggested Response:*
[Provide 1-2 options for a reply. Include one safe/neutral option and one warm option.]

Formatting Guidelines:
- Use *asterisks* for bold text (e.g., *Literal Meaning:*).
- Use _underscores_ for italics.
- Do NOT use Markdown tables (WhatsApp does not support them).
- Keep the response concise but empathetic.
`;

// Helper to fetch image from Twilio URL and convert to Base64 for Gemini
async function fetchImageAsBase64(url) {
  try {
    // Twilio media URLs might require authentication depending on settings, 
    // but standard generic usage often allows direct access if public or signed.
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return {
      data: Buffer.from(response.data).toString('base64'),
      mimeType: response.headers['content-type'] || 'image/jpeg'
    };
  } catch (error) {
    console.error("Error fetching image:", error.message);
    throw new Error("Could not download the screenshot.");
  }
}

// WhatsApp Webhook Route
app.post('/whatsapp', async (req, res) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();
  
  const incomingMsg = req.body.Body;
  const numMedia = parseInt(req.body.NumMedia || '0');
  const mediaUrl = req.body.MediaUrl0;
  
  console.log(`Received message. Text: "${incomingMsg.substring(0, 20)}..." | Images: ${numMedia}`);

  try {
    let contentParts = [];

    // 1. Handle Image Input (Screenshot Analysis)
    if (numMedia > 0 && mediaUrl) {
      const imagePart = await fetchImageAsBase64(mediaUrl);
      
      contentParts.push({
        inlineData: imagePart
      });
      
      // Add text prompt. If user added a caption, use it; otherwise use default.
      const promptText = incomingMsg && incomingMsg.trim().length > 0 
        ? `Analyze this chat screenshot. Context from user: ${incomingMsg}` 
        : "Analyze the tone, context, and intent of this chat screenshot.";
        
      contentParts.push({ text: promptText });
    } 
    // 2. Handle Text Input
    else if (incomingMsg && incomingMsg.trim().length > 0) {
      contentParts.push({ text: incomingMsg });
    } else {
      // Empty message or unsupported format
      twiml.message("I didn't receive any text or image to analyze. Send me a screenshot or a confusing text message!");
      res.type('text/xml').send(twiml.toString());
      return;
    }

    // 3. Call Gemini API
    // Using 'gemini-2.5-flash' for speed and efficient multimodal processing
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: "user",
        parts: contentParts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6, // Slightly lower temperature for more consistent, helpful advice
      }
    });

    const analysis = response.text;

    // 4. Send Reply via Twilio
    twiml.message(analysis);

  } catch (error) {
    console.error("Gemini/Server Error:", error);
    
    // Friendly Error Message
    if (error.message.includes("download")) {
      twiml.message("I couldn't quite see that image. Can you try sending it again or cropping it?");
    } else {
      twiml.message("I'm having a little trouble thinking right now. Please try again in a moment.");
    }
  }

  // Return TwiML response
  res.type('text/xml').send(twiml.toString());
});

// Start Server
app.listen(port, () => {
  console.log(`Neuro-Interpreter Bot listening on port ${port}`);
});