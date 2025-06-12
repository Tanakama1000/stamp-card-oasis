
import React from 'react';

interface NailPolishIconProps {
  size?: number;
  className?: string;
}

const NailPolishIcon: React.FC<NailPolishIconProps> = ({ 
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
      {/* Bottle cap */}
      <rect x="9" y="2" width="6" height="3" rx="1" />
      
      {/* Brush handle */}
      <line x1="12" y1="5" x2="12" y2="8" />
      
      {/* Bottle neck */}
      <rect x="10" y="8" width="4" height="2" />
      
      {/* Main bottle body */}
      <path d="M8 10h8v8c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-8z" />
      
      {/* Brush tip */}
      <circle cx="12" cy="3.5" r="0.5" fill="currentColor" />
    </svg>
  );
};

export default NailPolishIcon;
