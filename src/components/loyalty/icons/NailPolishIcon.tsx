
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
      {/* Brush/Cap */}
      <path d="M9 2h6v4l-1 1h-4l-1-1V2z" />
      
      {/* Brush handle/stem */}
      <line x1="12" y1="6" x2="12" y2="9" />
      
      {/* Bottle neck */}
      <rect x="10" y="9" width="4" height="2" rx="1" />
      
      {/* Main bottle body */}
      <path d="M8 11h8v8c0 1.5-1 3-3 3h-2c-2 0-3-1.5-3-3v-8z" />
      
      {/* Label/Window on bottle */}
      <rect x="10" y="14" width="4" height="4" rx="0.5" />
    </svg>
  );
};

export default NailPolishIcon;
