
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
      {/* Brush cap */}
      <rect x="9" y="2" width="6" height="3" rx="1" />
      
      {/* Brush stem */}
      <line x1="12" y1="5" x2="12" y2="8" />
      
      {/* Bottle neck */}
      <rect x="10" y="8" width="4" height="2" rx="1" />
      
      {/* Main bottle body */}
      <rect x="8" y="10" width="8" height="10" rx="2" />
      
      {/* Polish level indicator */}
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
};

export default NailPolishIcon;
