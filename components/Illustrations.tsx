
import React from 'react';

// Common props for consistency
interface IllustrationProps {
  className?: string;
}

export const PhoneMockupIllustration: React.FC<IllustrationProps> = ({ className = "w-64 h-64" }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    
    {/* Phone Body */}
    <rect x="70" y="40" width="140" height="240" rx="20" fill="#E2E8F0" /> {/* Slate-200 */}
    <rect x="75" y="45" width="130" height="230" rx="16" fill="#F1F5F9" /> {/* Slate-100 screen */}
    
    {/* Notch */}
    <path d="M110 45 H170 V50 C170 55 165 55 165 55 H115 C115 55 110 55 110 50 Z" fill="#CBD5E1" />

    {/* Chat Bubble 1 (Left - Blueish) */}
    <rect x="90" y="80" width="80" height="24" rx="8" fill="#DBEAFE" />
    <line x1="100" y1="88" x2="160" y2="88" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
    <line x1="100" y1="96" x2="140" y2="96" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>

    {/* Chat Bubble 2 (Left - Orangeish/Peach) */}
    <rect x="90" y="115" width="60" height="24" rx="8" fill="#FFEDD5" />
    <line x1="100" y1="123" x2="140" y2="123" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round"/>
    <line x1="100" y1="131" x2="120" y2="131" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round"/>

    {/* Tooltip Card (Pop-out) */}
    <g filter="url(#shadow)">
      <rect x="150" y="100" width="130" height="80" rx="8" fill="white" />
      {/* Connector triangle */}
      <path d="M150 115 L142 120 L150 125 Z" fill="white" />
    </g>

    {/* Tooltip Text */}
    <text x="165" y="125" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="#1E293B">Friendly but</text>
    <text x="165" y="140" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="#1E293B">distracted.</text>
    
    <text x="165" y="160" fontFamily="sans-serif" fontSize="9" fill="#64748B">Possibility they</text>
    <text x="165" y="172" fontFamily="sans-serif" fontSize="9" fill="#64748B">are tired.</text>

    {/* SVG Shadow Filter */}
    <defs>
      <filter id="shadow" x="130" y="90" width="160" height="110" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="6"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
    </defs>
  </svg>
);

export const KeyIllustration: React.FC<IllustrationProps> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <rect x="40" y="160" width="120" height="20" rx="2" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M40 170H160" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
    <rect x="50" y="140" width="100" height="20" rx="2" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M50 150H150" stroke="currentColor" strokeWidth="2"/>
    <path d="M80 140V110C80 100 85 90 100 90C115 90 120 100 120 110V140" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="100" cy="75" r="15" stroke="currentColor" strokeWidth="4"/>
    <path d="M80 140L70 155" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M120 140L130 155" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M120 110L140 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="150" cy="95" r="5" stroke="currentColor" strokeWidth="3"/>
    <path d="M155 95L170 95" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M165 95V100" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const DecodingIllustration: React.FC<IllustrationProps> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M40 190C40 130 50 110 80 110C110 110 120 130 120 190" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M100 50H170C175.523 50 180 54.4772 180 60V100C180 105.523 175.523 110 170 110H140L130 125V110H100C94.4772 110 90 105.523 90 100V60C90 54.4772 94.4772 50 100 50Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M110 70H160" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M110 85H140" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M110 150L130 130" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M130 130L145 115" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="155" cy="105" r="20" stroke="currentColor" strokeWidth="4"/>
    <path d="M160 95C163 98 163 102 160 105" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const VibeIllustration: React.FC<IllustrationProps> = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M10 50H90" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 20V80" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="3"/>
    <path d="M75 25L85 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M25 75L15 85" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const TranslationIllustration: React.FC<IllustrationProps> = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <rect x="20" y="20" width="30" height="30" rx="5" stroke="currentColor" strokeWidth="3"/>
    <path d="M30 35H40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M30 40H35" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <rect x="50" y="50" width="30" height="30" rx="5" stroke="currentColor" strokeWidth="3"/>
    <path d="M60 65H70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M60 70H65" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M40 40C45 45 50 50 55 55" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
  </svg>
);

export const CoachIllustration: React.FC<IllustrationProps> = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M60 20L80 40L40 80H20V60L60 20Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 80H40" stroke="currentColor" strokeWidth="3"/>
    <path d="M15 90H85" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const PlantIllustration: React.FC<IllustrationProps> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M50 80V40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 60C50 60 70 50 70 30C70 20 60 20 50 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M50 60C50 60 30 50 30 30C30 20 40 20 50 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M35 80H65L60 90H40L35 80Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M40 90H60" stroke="currentColor" strokeWidth="3"/>
  </svg>
);
