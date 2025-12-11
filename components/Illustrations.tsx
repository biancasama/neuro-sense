import React from 'react';

// Common props for consistency
interface IllustrationProps {
  className?: string;
}

export const DecodingIllustration: React.FC<IllustrationProps> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Abstract Character Body */}
    <path d="M40 190C40 130 50 110 80 110C110 110 120 130 120 190" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Speech Bubble (Target of analysis) */}
    <path d="M100 50H170C175.523 50 180 54.4772 180 60V100C180 105.523 175.523 110 170 110H140L130 125V110H100C94.4772 110 90 105.523 90 100V60C90 54.4772 94.4772 50 100 50Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Abstract Text Lines in Bubble */}
    <path d="M110 70H160" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M110 85H140" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>

    {/* Arm holding Magnifying Glass */}
    <path d="M110 150L130 130" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>

    {/* Magnifying Glass Handle */}
    <path d="M130 130L145 115" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>

    {/* Magnifying Glass Rim (Overlapping the bubble slightly to show inspection) */}
    <circle cx="155" cy="105" r="20" stroke="currentColor" strokeWidth="4"/>
    
    {/* Glint on Glass */}
    <path d="M160 95C163 98 163 102 160 105" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const IntroIllustration: React.FC<IllustrationProps> = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M40 60C40 48.9543 48.9543 40 60 40H140C151.046 40 160 48.9543 160 60V120C160 131.046 151.046 140 140 140H80L40 170V140C40 140 40 140 40 140C34.4772 140 30 135.523 30 130V60C30 54.4772 34.4772 50 40 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="80" cy="90" r="10" stroke="currentColor" strokeWidth="4"/>
    <circle cx="120" cy="90" r="10" stroke="currentColor" strokeWidth="4"/>
    <path d="M150 30L170 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M160 20L180 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
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