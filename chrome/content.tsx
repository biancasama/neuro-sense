import React from 'react';
import { createRoot } from 'react-dom/client';
import ExtensionOverlay from '../components/ExtensionOverlay';

declare var chrome: any;

// --- Configuration & State ---
let isPrivacyMode = false;
const processedNodes = new WeakSet<HTMLElement>();

// Check initial privacy setting
chrome.storage.local.get(['isPrivacyMode'], (result: any) => {
  isPrivacyMode = result.isPrivacyMode || false;
  if (!isPrivacyMode) startObserver();
});

// Listen for updates from Popup
chrome.storage.onChanged.addListener((changes: any) => {
  if (changes.isPrivacyMode) {
    isPrivacyMode = changes.isPrivacyMode.newValue;
    if (isPrivacyMode) {
      // Logic to remove existing buttons could go here
      document.querySelectorAll('.neuro-interpreter-host').forEach(el => el.remove());
    } else {
      startObserver();
    }
  }
});

// --- Core Logic: Message Detection ---

function startObserver() {
  const observer = new MutationObserver((mutations) => {
    if (isPrivacyMode) return;
    
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          scanForMessages(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  // Initial scan
  scanForMessages(document.body);
}

function scanForMessages(root: HTMLElement) {
  // Heuristic: We are looking for message bubbles.
  // Instead of brittle class names, we look for structural patterns.
  // 1. WhatsApp/Messenger/Insta bubbles usually contain text.
  // 2. Incoming messages are typically aligned to the LEFT.
  
  // Strategy: Find leaf block elements with text content > 10 chars.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      // Skip our own injections
      if ((node as HTMLElement).classList.contains('neuro-interpreter-host')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  while (walker.nextNode()) {
    const node = walker.currentNode as HTMLElement;
    
    // Check if node has already been processed
    if (processedNodes.has(node)) continue;

    if (isPotentialMessageBubble(node)) {
      injectBananaButton(node);
      processedNodes.add(node);
    }
  }
}

function isPotentialMessageBubble(element: HTMLElement): boolean {
  // 1. Must have text content
  const text = element.innerText.trim();
  if (text.length < 5) return false;

  // 2. Ignore huge containers
  const rect = element.getBoundingClientRect();
  if (rect.height > 300 || rect.width > 600) return false;

  // 3. Heuristic: Is it incoming? (Left side of screen)
  // Most incoming messages start near the left edge (e.g. < 100px or < 30% width)
  const isLeftSide = rect.left < (window.innerWidth / 3);
  if (!isLeftSide) return false;

  // 4. Platform specific tweaks (Optional, makes it more robust)
  // WhatsApp incoming often has class `message-in` (but classes are obfuscated often)
  // We rely mostly on geometry and lack of form inputs.
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable) return false;

  // 5. Ensure it's a "leaf" or close to it (doesn't have many block children)
  const childBlockCount = Array.from(element.children).filter(c => getComputedStyle(c).display === 'block').length;
  if (childBlockCount > 2) return false;

  return true;
}

// --- Injection Logic ---

function injectBananaButton(targetNode: HTMLElement) {
  // Create a host for our Shadow DOM
  const host = document.createElement('div');
  host.className = 'neuro-interpreter-host';
  
  // Position it relative to the target
  // We'll append it to the target's parent to avoid messing up the target's layout flow usually
  // Or append to target and use absolute positioning.
  
  // Safer approach for messaging apps: Append to target, position absolute top-right or next to it.
  targetNode.style.position = 'relative'; // Ensure relative positioning context
  targetNode.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  
  // Inject basic styles into Shadow DOM
  const style = document.createElement('style');
  style.textContent = `
    :host {
      position: absolute;
      top: -10px;
      right: -10px;
      z-index: 9999;
      font-family: sans-serif;
    }
    .banana-btn {
      background: #F0EAD6; /* Cream */
      border: 1px solid #A3BFa3;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .banana-btn:hover {
      transform: scale(1.1);
      background: #fff;
    }
    .banana-icon {
      width: 18px;
      height: 18px;
      fill: #608060;
    }
  `;
  shadow.appendChild(style);

  const root = createRoot(host.shadowRoot!);
  root.render(<InjectedComponent targetNode={targetNode} />);
}

// --- React Component inside Shadow DOM ---

const InjectedComponent: React.FC<{ targetNode: HTMLElement }> = ({ targetNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleAnalyze = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button className="banana-btn" onClick={handleAnalyze} title="Decode Tone">
           {/* Simple Brain Icon SVG */}
           <svg className="banana-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 75 C 40 88 45 92 50 92 C 55 92 60 88 60 75" fill="#A1C9F2"/>
              <path d="M 48 30 C 38 12 12 28 15 50 C 18 72 32 82 48 72 Z" fill="#A3BFa3"/>
              <path d="M 52 30 C 62 12 88 28 85 50 C 82 72 68 82 52 72 Z" fill="#FFAD99"/>
           </svg>
        </button>
      )}
      
      {isOpen && (
        <ExtensionOverlay 
          text={targetNode.innerText} 
          onClose={handleClose} 
        />
      )}
    </>
  );
};