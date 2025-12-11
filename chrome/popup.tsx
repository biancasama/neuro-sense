import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css'; // Assume tailwind works here too

declare var chrome: any;

const Popup: React.FC = () => {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['isPrivacyMode'], (result: any) => {
      setIsPrivacyMode(result.isPrivacyMode || false);
    });
  }, []);

  const togglePrivacy = () => {
    const newState = !isPrivacyMode;
    setIsPrivacyMode(newState);
    chrome.storage.local.set({ isPrivacyMode: newState });
  };

  return (
    <div className="w-64 p-4 bg-stone-50 font-sans text-stone-800">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-lg">N</div>
        <h1 className="font-bold text-lg">Neuro-Interpreter</h1>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-sm">Privacy Mode</span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={isPrivacyMode} onChange={togglePrivacy} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${isPrivacyMode ? 'bg-emerald-500' : 'bg-stone-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPrivacyMode ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
        <p className="text-xs text-stone-500 mt-2 leading-relaxed">
          {isPrivacyMode 
            ? "Extension is paused. No buttons will appear." 
            : "Active. Click the brain icon on messages to decode them."}
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[10px] text-stone-400">Version 1.0.0</p>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);