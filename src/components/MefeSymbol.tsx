import React from 'react';

interface Props {
  className?: string;
  size?: number;
}

export const MefeSymbol: React.FC<Props> = ({ className = 'w-5 h-5', size }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="MEFE Haute Couture Monogram"
    >
      <defs>
        <linearGradient id="mefeGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#E2725B" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      
      {/* Outer elegant diamond shield */}
      <rect
        x="16"
        y="2"
        width="19.8"
        height="19.8"
        rx="4"
        transform="rotate(45 16 2)"
        stroke="url(#mefeGrad)"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />
      
      {/* Central intertwined haute-couture 'M' & 'E' woven thread */}
      <path
        d="M8 22V10L12 16L16 10L20 16L24 10V22"
        stroke="url(#mefeGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Horizontal precision couture bar */}
      <path
        d="M10 18H22"
        stroke="#FDE047"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Central brilliance sparkle node */}
      <circle cx="16" cy="13.5" r="1.5" fill="#FFFBEB" />
    </svg>
  );
};
