import React from 'react';

// Common props for consistency
interface IllustrationProps {
  className?: string;
}

export const KeyIllustration: React.FC<IllustrationProps> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Stack of Books */}
    <rect x="40" y="160" width="120" height="20" rx="2" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M40 170H160" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
    <rect x="50" y="140" width="100" height="20" rx="2" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M50 150H150" stroke="currentColor" strokeWidth="2"/>

    {/* Character Sitting */}
    <path d="M80 140V110C80 100 85 90 100 90C115 90 120 100 120 110V140" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="100" cy="75" r="15" stroke="currentColor" strokeWidth="4"/>
    
    {/* Legs hanging */}
    <path d="M80 140L70 155" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M120 140L130 155" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>

    {/* Arm holding Key */}
    <path d="M120 110L140 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>

    {/* The Key */}
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