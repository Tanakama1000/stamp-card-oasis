
import React from 'react';

interface NailPolishBottleIconProps {
  size?: number;
  className?: string;
}

const NailPolishBottleIcon: React.FC<NailPolishBottleIconProps> = ({ 
  size = 24, 
  className = "" 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Finger outline */}
      <path d="M8 4c0-1 1-2 2-2h4c1 0 2 1 2 2v16c0 1-1 2-2 2h-4c-1 0-2-1-2-2V4z" />
      
      {/* Fingernail area */}
      <path d="M8 4c0-1 1-2 2-2h4c1 0 2 1 2 2v3H8V4z" fill="currentColor" />
      
      {/* Nail polish shine effect */}
      <ellipse cx="11" cy="5" rx="1.5" ry="0.8" fill="white" opacity="0.6" />
      
      {/* Finger joint lines */}
      <line x1="8" y1="12" x2="16" y2="12" opacity="0.3" />
      <line x1="8" y1="16" x2="16" y2="16" opacity="0.3" />
    </svg>
  );
};

export default NailPolishBottleIcon;
