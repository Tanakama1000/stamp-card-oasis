
import React from 'react';

interface CarWashIconProps {
  size?: number;
  className?: string;
}

const CarWashIcon: React.FC<CarWashIconProps> = ({ 
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
      {/* Car body */}
      <path d="M5 15h14l1-4H4l1 4z" />
      <path d="M6 11h12l-1-3H7l-1 3z" />
      
      {/* Wheels */}
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      
      {/* Car windows */}
      <path d="M8 11h8l-1-2H9l-1 2z" />
      
      {/* Water/soap bubbles */}
      <circle cx="10" cy="6" r="1" opacity="0.7" />
      <circle cx="14" cy="4" r="0.8" opacity="0.7" />
      <circle cx="16" cy="7" r="0.6" opacity="0.7" />
      <circle cx="8" cy="4" r="0.7" opacity="0.7" />
      <circle cx="12" cy="3" r="0.5" opacity="0.7" />
      
      {/* Water streams */}
      <path d="M9 2v4" strokeWidth="1.5" opacity="0.6" />
      <path d="M12 1v5" strokeWidth="1.5" opacity="0.6" />
      <path d="M15 2v4" strokeWidth="1.5" opacity="0.6" />
      
      {/* Brush/cleaning element */}
      <ellipse cx="19" cy="12" rx="1.5" ry="3" opacity="0.8" />
    </svg>
  );
};

export default CarWashIcon;
