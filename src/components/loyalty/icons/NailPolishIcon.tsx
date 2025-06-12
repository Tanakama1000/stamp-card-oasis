
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
      {/* Nail polish bottle body - more rounded and bottle-like */}
      <path d="M9 8h6v11c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2V8z" />
      {/* Bottle neck - narrower */}
      <path d="M10.5 8V6c0-.6.4-1 1-1h1c.6 0 1 .4 1 1v2" />
      {/* Cap - wider and more proportional */}
      <rect x="9.5" y="2" width="5" height="3" rx="1" />
      {/* Brush handle inside cap */}
      <line x1="12" y1="2" x2="12" y2="5" />
      {/* Polish level indicator */}
      <path d="M10 14h4" opacity="0.6" />
      {/* Brand label area */}
      <path d="M10 11h4" opacity="0.3" />
    </svg>
  )
);

NailPolishIcon.displayName = "NailPolishIcon";

export default NailPolishIcon;
