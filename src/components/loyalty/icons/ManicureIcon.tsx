
import React from 'react';

interface ManicureIconProps {
  size?: number;
  className?: string;
}

const ManicureIcon: React.FC<ManicureIconProps> = ({ 
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
      {/* Nail file */}
      <path d="M3 8l16-4 1 3-16 4-1-3z" />
      
      {/* Cuticle pusher */}
      <path d="M6 14l8-2v6l-8 2v-6z" />
      <circle cx="14" cy="16" r="1" />
      
      {/* Nail scissors handles */}
      <path d="M16 6c1 0 2 1 2 2s-1 2-2 2" />
      <path d="M18 8c1 0 2-1 2-2s-1-2-2-2" />
      
      {/* Scissors blades */}
      <path d="M16 8l2-2" />
      <path d="M18 6l2 2" />
      
      {/* Small decorative elements */}
      <circle cx="4" cy="9" r="0.5" fill="currentColor" />
      <circle cx="7" cy="15" r="0.5" fill="currentColor" />
    </svg>
  );
};

export default ManicureIcon;
