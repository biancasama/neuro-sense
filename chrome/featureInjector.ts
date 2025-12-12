
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

  if (isWhatsAppChatOpen || isInstagramChatOpen) {
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
    width: '0px', // Start collapsed or use a toggle
    zIndex: '9999',
    pointerEvents: 'none' // Let clicks pass through when collapsed
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
      right: 0;
      top: 0;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      transform: translateX(100%); /* Hidden by default */
      transition: transform 0.3s ease;
    }
    .sidebar-container.open {
      transform: translateX(0);
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

  return React.createElement('div', { className: `sidebar-container ${isOpen ? 'open' : ''}` },
    React.createElement('button', {
      className: 'sidebar-toggle',
      onClick: () => setIsOpen(!isOpen),
      title: 'Toggle Neuro-Sense'
    }, '🧠'),
    isOpen && React.createElement('div', { style: { height: '100%', overflow: 'hidden' } },
      React.createElement('div', { className: 'p-4 h-full flex flex-col items-center justify-center text-stone-500' },
        React.createElement('h2', { className: 'font-bold text-lg mb-2' }, 'Neuro-Sense'),
        React.createElement('p', { className: 'text-sm text-center' }, 'Drag and drop screenshots here or click specific messages to decode.')
      )
    )
  );
};
