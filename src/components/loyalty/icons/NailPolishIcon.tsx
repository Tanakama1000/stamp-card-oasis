
import React from 'react';
import { LucideProps } from 'lucide-react';

const NailPolishIcon = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ color = "currentColor", size = 24, strokeWidth = 2, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Nail polish bottle body */}
      <path d="M8 7h8v10c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V7z" />
      {/* Bottle neck */}
      <path d="M9 7V5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v2" />
      {/* Cap */}
      <rect x="8.5" y="2" width="7" height="3" rx="1" />
      {/* Brush handle */}
      <line x1="12" y1="2" x2="12" y2="5" />
      {/* Polish level indicator */}
      <path d="M9 12h6" opacity="0.5" />
    </svg>
  )
);

NailPolishIcon.displayName = "NailPolishIcon";

export default NailPolishIcon;
