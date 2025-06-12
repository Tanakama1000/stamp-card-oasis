
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
      <rect x="8" y="8" width="8" height="12" rx="2" />
      {/* Bottle neck */}
      <rect x="10" y="6" width="4" height="2" />
      {/* Cap */}
      <rect x="9" y="2" width="6" height="4" rx="1" />
      {/* Brush handle */}
      <line x1="12" y1="6" x2="12" y2="3" />
    </svg>
  )
);

NailPolishIcon.displayName = "NailPolishIcon";

export default NailPolishIcon;
