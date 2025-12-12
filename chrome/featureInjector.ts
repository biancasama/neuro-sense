
import React from 'react';
import { createRoot } from 'react-dom/client';
import RightDecoder from '../components/RightDecoder'; // Re-using your existing component logic

// --- Configuration ---
const SIDEBAR_ID = 'neuro-sense-sidebar-root';
const LANDING_PAGE_MARKER = 'extension-active';

// --- Main Initialization ---
export function initializeFeatureInjection(isPrivacyMode: boolean) {
  
  // 1. Landing Page Logic (Smart Button Swap)
  if (window.location.hostname.includes('neuro-sense.com') || window.location.hostname.includes('localhost')) {
    document.body.classList.add(LANDING_PAGE_MARKER);
    return; // Don't run chat logic on landing page
  }

  // 2. Chat Injection Logic
  if (!isPrivacyMode) {
    observeChatApp();
  }
}

// --- SPA Observer & Injection Logic ---
function observeChatApp() {
  let debounceTimer: any;

  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      handleUrlChangeOrDomUpdate();
    }, 500); // Debounce to prevent performance issues
  });

  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial check
  handleUrlChangeOrDomUpdate();
}

function handleUrlChangeOrDomUpdate() {
  // A. Check if Sidebar already exists
  if (document.getElementById(SIDEBAR_ID)) return;

  // B. Detect Active Chat Context using Robust Selectors
  const isWhatsAppChatOpen = 
    window.location.hostname.includes('whatsapp') && 
    document.getElementById('main'); // '#main' is the stable ID for WA chat pane

  const isInstagramChatOpen = 
    window.location.hostname.includes('instagram') && 
    window.location.pathname.includes('/direct/t/'); // URL pattern is safer than classes for IG

  const isMessengerChatOpen = 
     window.location.hostname.includes('messenger');

  if (isWhatsAppChatOpen || isInstagramChatOpen || isMessengerChatOpen) {
    injectSidebarOverlay();
  }
}

// --- DOM Injection ---
function injectSidebarOverlay() {
  // Prevent duplicate injection
  if (document.getElementById(SIDEBAR_ID)) return;

  const host = document.createElement('div');
  host.id = SIDEBAR_ID;
  
  // Basic positioning styles to ensure it floats correctly as an overlay
  Object.assign(host.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    height: '100vh',
    width: '0px', // Host has no width so it doesn't block clicks
    zIndex: '9999',
    pointerEvents: 'none'
  });

  document.body.appendChild(host);

  // Use Shadow DOM for style isolation
  const shadow = host.attachShadow({ mode: 'open' });
  
  // Inject basic styles for the sidebar container
  const style = document.createElement('style');
  style.textContent = `
    :host {
      font-family: 'Inter', sans-serif;
    }
    .sidebar-container {
      width: 320px;
      height: 100%;
      background: white;
      box-shadow: -5px 0 15px rgba(0,0,0,0.1);
      position: absolute;
      top: 0;
      /* Fix: Start off-screen to the right, but keep button visible */
      right: -320px; 
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      transform: translateX(0);
      transition: transform 0.3s ease;
    }
    .sidebar-container.open {
      transform: translateX(-320px); /* Move left to reveal */
    }
    .sidebar-toggle {
      position: absolute;
      left: -40px;
      top: 50%;
      width: 40px;
      height: 40px;
      background: #F0EAD6;
      border: 1px solid #e5e7eb;
      border-right: none;
      border-radius: 8px 0 0 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      box-shadow: -2px 0 5px rgba(0,0,0,0.05);
    }
  `;
  shadow.appendChild(style);

  // Mount React Component
  const root = createRoot(host.shadowRoot!);
  root.render(React.createElement(SidebarWrapper));
}

// --- Sidebar React Component ---
const SidebarWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Re-use RightDecoder Logic but wrap it
  // We mock the props needed for RightDecoder since we are in injection mode
  // In a real app, these would come from a context or storage
  const mockProps = {
     onAnalyze: async (text: string) => { console.log("Analyzing:", text); },
     isAnalyzing: false,
     result: null,
     onSaveMemory: () => {},
     t: { // Minimal translations needed for initial render
        memoriesTitle: "Memories",
        subtext: "Subtext",
        delete: "Delete",
        noMemories: "No memories",
        backBtn: "Back",
        analyzeText: "Analyze",
        analyzeAudioText: "Analyze Audio",
        inputPlaceholder: "Paste text..."
     }
  };

  return React.createElement('div', { className: `sidebar-container ${isOpen ? 'open' : ''}` },
    React.createElement('button', {
      className: 'sidebar-toggle',
      onClick: () => setIsOpen(!isOpen),
      title: 'Toggle Neuro-Sense'
    }, '🧠'),
    
    // Mount the Full Decoder UI inside the sidebar
    React.createElement('div', { style: { height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' } },
        React.createElement(RightDecoder, { ...mockProps })
    )
  );
};
