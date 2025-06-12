
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
      <rect x="8" y="10" width="8" height="10" rx="2" />
      {/* Bottle neck */}
      <rect x="10" y="8" width="4" height="2" />
      {/* Cap base (wider part) */}
      <rect x="9" y="6" width="6" height="2" rx="0.5" />
      {/* Cap top (narrower brush holder) */}
      <rect x="10.5" y="3" width="3" height="3" rx="0.5" />
      {/* Brush handle/stem */}
      <line x1="12" y1="6" x2="12" y2="8" />
      {/* Brush bristles (wider at top) */}
      <path d="M11 2 L11 4 L13 4 L13 2" />
    </svg>
  )
);

NailPolishIcon.displayName = "NailPolishIcon";

export default NailPolishIcon;
