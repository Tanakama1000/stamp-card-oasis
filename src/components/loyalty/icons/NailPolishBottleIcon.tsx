
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
      {/* Sparkle/star decoration */}
      <path d="M8 6l2-2 2 2-2 2-2-2z" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="10" y1="8" x2="10" y2="10" />
      <line x1="6" y1="6" x2="8" y2="6" />
      <line x1="12" y1="6" x2="14" y2="6" />
      
      {/* Nail polish brush/cap */}
      <rect x="15" y="10" width="4" height="3" rx="0.5" />
      
      {/* Brush handle */}
      <line x1="17" y1="13" x2="17" y2="15" />
      
      {/* Bottle body */}
      <path d="M15 15h4v6c0 1-0.5 1.5-1.5 1.5h-1c-1 0-1.5-0.5-1.5-1.5v-6z" />
      
      {/* Bottle neck */}
      <rect x="16" y="13" width="2" height="2" />
    </svg>
  );
};

export default NailPolishBottleIcon;
