
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
      <rect x="9" y="2" width="6" height="3" rx="1" fill="currentColor" />
      
      {/* Brush handle */}
      <line x1="12" y1="5" x2="12" y2="7" />
      
      {/* Bottle neck */}
      <rect x="10" y="7" width="4" height="2" />
      
      {/* Main bottle body */}
      <path d="M8 9 L8 18 Q8 20 10 20 L14 20 Q16 20 16 18 L16 9 Z" fill="none" />
      
      {/* Nail polish liquid level */}
      <path d="M8.5 12 L8.5 17.5 Q8.5 19 10 19 L14 19 Q15.5 19 15.5 17.5 L15.5 12 Z" fill="currentColor" opacity="0.3" />
      
      {/* Bottle label area */}
      <rect x="9" y="11" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
};

export default NailPolishIcon;
