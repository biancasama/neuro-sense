
export type Platform = 'whatsapp' | 'instagram' | 'messenger' | 'unknown';

export class SmartReplyManager {
  private platform: Platform;

  constructor() {
    this.platform = this.detectPlatform();
  }

  /**
   * Identifies the current social media platform based on hostname.
   */
  private detectPlatform(): Platform {
    const host = window.location.hostname;
    if (host.includes('whatsapp')) return 'whatsapp';
    if (host.includes('instagram')) return 'instagram';
    if (host.includes('messenger')) return 'messenger';
    return 'unknown';
  }

  /**
   * Scrapes the last INCOMING message from the chat.
   * Uses robust selectors to avoid brittle class names.
   */
  public getLastIncomingMessage(): string | null {
    switch (this.platform) {
      case 'whatsapp':
        return this.getWhatsAppMessage();
      case 'instagram':
        return this.getInstagramMessage();
      case 'messenger':
        return this.getMessengerMessage();
      default:
        return null;
    }
  }

  /**
   * Inserts text into the chat input field in a way that triggers React state updates.
   * Simply setting .value will NOT work; we must use execCommand or InputEvents.
   */
  public insertTextIntoChat(text: string): boolean {
    const inputField = this.findInputField();
    
    if (!inputField) {
      console.warn('Neuro-Sense: Chat input field not found.');
      return false;
    }

    // 1. Focus the input field
    inputField.focus();

    // 2. Use execCommand 'insertText'. 
    // This is the most reliable way to handle contenteditable divs used by Meta apps.
    // It simulates a user typing, ensuring React's onChange listeners fire.
    // Deprecated but still the only reliable method for rich-text editors without using Selenium-level hacks.
    const success = document.execCommand('insertText', false, text);

    // Fallback for standard inputs (non-contenteditable) if execCommand fails
    if (!success && (inputField instanceof HTMLInputElement || inputField instanceof HTMLTextAreaElement)) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      nativeInputValueSetter?.call(inputField, text);
      inputField.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }

    return success;
  }

  // --- Platform Specific Scrapers ---

  private getWhatsAppMessage(): string | null {
    // WhatsApp messages container usually has role="application" or main region
    // We look for message rows. 
    // Robust attribute: 'data-pre-plain-text' exists on message containers and contains timestamp/sender.
    // If it contains "You:", it is outgoing.
    
    const messages = Array.from(document.querySelectorAll('div[data-pre-plain-text]'));
    if (messages.length === 0) return null;

    // Iterate backwards to find the first one that ISN'T from the user
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i] as HTMLElement;
      const meta = msg.getAttribute('data-pre-plain-text') || '';
      
      // If meta does NOT contain "You]" (standard WA format: "[Time] You:"), it's incoming
      // Note: This depends on language, but is more robust than classes.
      // Alternative: Check for alignment. Incoming is usually left-aligned.
      
      // Heuristic: Check for specific class indicating "message-in" if simple checks fail,
      // but strictly prefer attributes.
      // Let's assume if it doesn't strictly say "You", it's the other person.
      if (!meta.includes('You]')) {
         return (msg.innerText || msg.textContent || '').trim();
      }
    }
    return null;
  }

  private getInstagramMessage(): string | null {
    // Instagram Direct uses role="listitem" for messages.
    const rows = Array.from(document.querySelectorAll('div[role="listitem"]'));
    if (rows.length === 0) return null;

    // Iterate backwards. IG is tricky because classes are obfuscated.
    // Heuristic: Incoming messages usually have an Avatar/Profile image in the row.
    // Outgoing messages (yours) usually do not have an avatar next to them in the thread view.
    
    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i] as HTMLElement;
      // Check for an image tag (Avatar) inside the row.
      const hasAvatar = row.querySelector('img'); 
      if (hasAvatar) {
         // This is likely incoming.
         // Text is usually in a div with some text content.
         return (row.innerText || row.textContent || '').trim();
      }
    }
    
    // Fallback: Just get the very last text if we can't determine direction
    return (rows[rows.length - 1] as HTMLElement).innerText;
  }

  private getMessengerMessage(): string | null {
    // Similar to Instagram but often uses specific role="row"
    const rows = Array.from(document.querySelectorAll('div[role="row"]'));
    if (rows.length === 0) return null;

    for (let i = rows.length - 1; i >= 0; i--) {
       const row = rows[i] as HTMLElement;
       // Messenger specific: Check alignment or aria-labels if available.
       // Safe fallback: Get last message text.
       const text = (row.innerText || row.textContent || '').trim();
       if (text) return text;
    }
    return null;
  }

  // --- Input Finder ---

  private findInputField(): HTMLElement | null {
    // 1. WhatsApp Web
    if (this.platform === 'whatsapp') {
      // Look for contenteditable div with specific tab index or title
      return document.querySelector('div[contenteditable="true"][data-tab="10"]') as HTMLElement ||
             document.querySelector('div[contenteditable="true"][aria-label="Type a message"]') as HTMLElement;
    }

    // 2. Instagram & Messenger
    if (this.platform === 'instagram' || this.platform === 'messenger') {
      return document.querySelector('div[contenteditable="true"][role="textbox"]') as HTMLElement;
    }

    return null;
  }
}
