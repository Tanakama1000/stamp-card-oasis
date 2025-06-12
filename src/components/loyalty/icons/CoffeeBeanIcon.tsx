
import React from 'react';

interface CoffeeBeanIconProps {
  size?: number;
  className?: string;
}

const CoffeeBeanIcon: React.FC<CoffeeBeanIconProps> = ({ 
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
      {/* Coffee bean main shape */}
      <ellipse cx="12" cy="12" rx="6" ry="9" fill="currentColor" stroke="currentColor" />
      
      {/* Center crack line */}
      <path d="M12 4c-2 3-2 6 0 8s2 5 0 8" stroke="white" strokeWidth="1.5" fill="none" />
      
      {/* Additional detail lines for texture */}
      <path d="M8.5 8c1-0.5 2-0.5 3 0" stroke="white" strokeWidth="0.8" opacity="0.6" fill="none" />
      <path d="M8.5 16c1 0.5 2 0.5 3 0" stroke="white" strokeWidth="0.8" opacity="0.6" fill="none" />
    </svg>
  );
};

export default CoffeeBeanIcon;
