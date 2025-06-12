
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
      {/* Main bottle body (rounded rectangular) */}
      <path d="M8 10 L8 18 Q8 20 10 20 L14 20 Q16 20 16 18 L16 10 Z" />
      {/* Bottle neck */}
      <rect x="10" y="8" width="4" height="2" />
      {/* Cap/brush holder base */}
      <rect x="9.5" y="6" width="5" height="2" rx="0.5" />
      {/* Brush handle (vertical line) */}
      <line x1="12" y1="6" x2="12" y2="3" />
      {/* Brush top (tapered shape like in image) */}
      <path d="M10.5 3 L12 1 L13.5 3 Z" />
      {/* Label on bottle (small rectangle) */}
      <rect x="10" y="13" width="4" height="3" rx="0.5" />
    </svg>
  )
);

NailPolishIcon.displayName = "NailPolishIcon";

export default NailPolishIcon;
