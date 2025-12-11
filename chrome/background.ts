import { analyzeMessageContext } from '../services/geminiService';

declare var chrome: any;

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  if (request.action === "ANALYZE_TEXT") {
    handleAnalysis(request.text, sendResponse);
    return true; // Will respond asynchronously
  }
});

async function handleAnalysis(text: string, sendResponse: (response: any) => void) {
  try {
    // We use the Deep Context (Gemini 3 Pro) for better nuance in extension mode
    // The API_KEY is assumed to be bundled into the build environment variable
    const result = await analyzeMessageContext(text, true); 
    sendResponse({ success: true, data: result });
  } catch (error: any) {
    console.error("Background Analysis Error:", error);
    sendResponse({ success: false, error: error.message || "Failed to analyze message." });
  }
}

// Set default privacy settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isPrivacyMode: false }); // Default to enabled
});