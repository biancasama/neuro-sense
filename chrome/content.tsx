
import React from 'react';
import { createRoot } from 'react-dom/client';
import ExtensionOverlay from '../components/ExtensionOverlay';
import { initializeFeatureInjection } from './featureInjector';

declare var chrome: any;

// --- Configuration & State ---
let isPrivacyMode = false;
const processedNodes = new WeakSet<HTMLElement>();

// Check initial privacy setting and Initialize
chrome.storage.local.get(['isPrivacyMode'], (result: any) => {
  isPrivacyMode = result.isPrivacyMode || false;
  
  // Initialize the new Modular Features (Landing Page + Sidebar)
  initializeFeatureInjection(isPrivacyMode);

  // Initialize the existing Button Injection Logic
  if (!isPrivacyMode) startObserver();
});

// Listen for updates from Popup
chrome.storage.onChanged.addListener((changes: any) => {
  if (changes.isPrivacyMode) {
    isPrivacyMode = changes.isPrivacyMode.newValue;
    // Reload page to apply changes cleanly or implement removal logic
    if (isPrivacyMode) {
      document.querySelectorAll('.neuro-interpreter-host').forEach(el => el.remove());
      const sidebar = document.getElementById('neuro-sense-sidebar-root');
      if (sidebar) sidebar.remove();
    } else {
      startObserver();
      initializeFeatureInjection(false);
    }
  }
});

// --- Core Logic: Message Detection (Existing) ---

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
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      if ((node as HTMLElement).classList.contains('neuro-interpreter-host')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  while (walker.nextNode()) {
    const node = walker.currentNode as HTMLElement;
    if (processedNodes.has(node)) continue;

    if (isPotentialMessageBubble(node)) {
      injectBananaButton(node);
      processedNodes.add(node);
    }
  }
}

function isPotentialMessageBubble(element: HTMLElement): boolean {
  const text = element.innerText.trim();
  if (text.length < 5) return false;

  const rect = element.getBoundingClientRect();
  if (rect.height > 300 || rect.width > 600) return false;

  const isLeftSide = rect.left < (window.innerWidth / 3);
  if (!isLeftSide) return false;

  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable) return false;

  const childBlockCount = Array.from(element.children).filter(c => getComputedStyle(c).display === 'block').length;
  if (childBlockCount > 2) return false;

  return true;
}

// --- Injection Logic (Existing) ---

function injectBananaButton(targetNode: HTMLElement) {
  const host = document.createElement('div');
  host.className = 'neuro-interpreter-host';
  
  targetNode.style.position = 'relative';
  targetNode.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  
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
      background: #F0EAD6;
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
