import React from 'react';

export interface LogoProps {
  variant?: 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
}) => {
  const iconPixelSizes = {
    sm: 36,
    md: 48,
    lg: 72,
  };

  const px = iconPixelSizes[size];

  const symbolSvg = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="WKF Nautical Reticle Symbol"
    >
      {/* Outer compass ring */}
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeOpacity="0.45"
      />

      {/* Inner subtle radar ring */}
      <circle
        cx="24"
        cy="24"
        r="14"
        stroke="var(--accent-2)"
        strokeWidth="0.75"
        strokeOpacity="0.25"
        strokeDasharray="2 2"
      />

      {/* 4 Cardinal Reticle Ticks (N, S, E, W) */}
      <line x1="24" y1="2" x2="24" y2="7.5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="40.5" x2="24" y2="46" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="2" y1="24" x2="7.5" y2="24" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="40.5" y1="24" x2="46" y2="24" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />

      {/* 4 Diagonal Reticle Ticks (NE, SE, SW, NW) */}
      <g transform="rotate(45 24 24)">
        <line x1="24" y1="3" x2="24" y2="6.5" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
        <line x1="24" y1="41.5" x2="24" y2="45" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
        <line x1="3" y1="24" x2="6.5" y2="24" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
        <line x1="41.5" y1="24" x2="45" y2="24" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
      </g>

      {/* Central wave / W-shape (3 peaks: up, down, up, down, up, down) */}
      <path
        d="M 10 27 L 14.5 17.5 L 19 28 L 24 15.5 L 29 28 L 33.5 17.5 L 38 27"
        stroke="var(--accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {symbolSvg}
      </div>
    );
  }

  // Horizontal lockup styling:
  // Large WKF in neon lime green
  // Below: "WORLD KAYAK FISHING" in dim cyan blue, small size, wide letter spacing
  const typographySizes = {
    sm: {
      title: 'text-xl tracking-wider leading-none',
      tagline: 'text-[9px] tracking-[0.22em] mt-1',
      gap: 'gap-3',
    },
    md: {
      title: 'text-2xl sm:text-3xl tracking-wider leading-none font-bold',
      tagline: 'text-[10px] sm:text-[11px] tracking-[0.24em] mt-1.5',
      gap: 'gap-3.5',
    },
    lg: {
      title: 'text-4xl sm:text-5xl tracking-widest leading-none font-bold',
      tagline: 'text-xs sm:text-sm tracking-[0.28em] mt-2',
      gap: 'gap-4',
    },
  };

  const typo = typographySizes[size];

  return (
    <div className={`inline-flex items-center ${typo.gap} select-none ${className}`}>
      {symbolSvg}
      <div className="flex flex-col justify-center">
        <span
          className={`font-mono font-bold ${typo.title}`}
          style={{ color: 'var(--accent)' }}
        >
          WKF
        </span>
        <span
          className={`font-mono uppercase font-medium ${typo.tagline}`}
          style={{ color: 'var(--accent-2)', opacity: 0.85 }}
        >
          WORLD KAYAK FISHING
        </span>
      </div>
    </div>
  );
};
export default Logo;
