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
  const px = size === 'sm' ? 36 : size === 'lg' ? 72 : 48;

  const symbolSvg = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="WKF"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeOpacity="0.45"
      />
      <circle
        cx="24"
        cy="24"
        r="14"
        stroke="var(--accent-2)"
        strokeWidth="0.75"
        strokeOpacity="0.25"
        strokeDasharray="2 2"
      />
      <line x1="24" y1="2" x2="24" y2="7.5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="40.5" x2="24" y2="46" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="2" y1="24" x2="7.5" y2="24" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="40.5" y1="24" x2="46" y2="24" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      <g transform="rotate(45 24 24)">
        <line x1="24" y1="3" x2="24" y2="6.5" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
        <line x1="24" y1="41.5" x2="24" y2="45" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
        <line x1="3" y1="24" x2="6.5" y2="24" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
        <line x1="41.5" y1="24" x2="45" y2="24" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
      </g>
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
      <div
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {symbolSvg}
      </div>
    );
  }

  const titleSize = size === 'sm' ? 20 : size === 'lg' ? 44 : 28;
  const taglineSize = size === 'sm' ? 9 : size === 'lg' ? 12 : 10;
  const taglineSpacing = size === 'sm' ? '0.22em' : size === 'lg' ? '0.28em' : '0.24em';
  const gap = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        userSelect: 'none',
      }}
    >
      {symbolSvg}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: titleSize,
            letterSpacing: '0.08em',
            lineHeight: 1,
            color: 'var(--accent)',
          }}
        >
          WKF
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            fontSize: taglineSize,
            letterSpacing: taglineSpacing,
            marginTop: size === 'sm' ? 4 : 6,
            textTransform: 'uppercase',
            color: 'var(--accent-2)',
            opacity: 0.85,
          }}
        >
          WORLD KAYAK FISHING
        </span>
      </div>
    </div>
  );
};

export default Logo;