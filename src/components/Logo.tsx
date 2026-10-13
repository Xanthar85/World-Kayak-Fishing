// src/components/Logo.tsx
// WKF — Logo de la app.
// v1.018: el símbolo (dial) del logo horizontal en esquema
// "neon" cicla en bucle entre los cuatro colores de veredicto
// (verde → amarillo → naranja → rojo → verde), con transición
// suave y glow que acompaña al color. Arranca en un color
// aleatorio del ciclo para no verse repetitivo.
// Los esquemas white-on-black y black-on-white no se animan.
// El modo "icon" (barra inferior) tampoco se anima.
// La palabra "WKF" y el tagline no cambian: siguen verde y
// cian fijos.

import React, { useEffect, useRef, useState } from 'react';

export interface LogoProps {
  variant?: 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  scheme?: 'neon' | 'white-on-black' | 'black-on-white';
  className?: string;
}

// Paleta de veredicto. Se usa para el ciclo de color del símbolo.
const COLORES_VEREDICTO = ['#00E56A', '#E5E500', '#FF8A00', '#FF2D55'];

// Duración de un ciclo completo (los 4 colores y vuelta al primero).
const DURACION_CICLO_MS = 40000;

function hexARgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function interpolarHex(a: string, b: string, t: number): string {
  const ca = hexARgb(a);
  const cb = hexARgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

// Devuelve el color interpolado del ciclo en un instante dado.
// t va de 0 a 1 dentro del ciclo completo (4 tramos).
function colorDelCiclo(t: number): string {
  const n = COLORES_VEREDICTO.length;
  const tramo = t * n; // 0..4
  const i = Math.floor(tramo) % n;
  const j = (i + 1) % n;
  const frac = tramo - Math.floor(tramo);
  return interpolarHex(COLORES_VEREDICTO[i], COLORES_VEREDICTO[j], frac);
}

// Hook interno: devuelve el color actual del ciclo.
function useColorCiclico(activo: boolean): string {
  const [color, setColor] = useState<string>(() => {
    if (!activo) return COLORES_VEREDICTO[0];
    // Arranque aleatorio dentro del ciclo.
    const t0 = Math.random();
    return colorDelCiclo(t0);
  });

  const rafRef = useRef<number | null>(null);
  const inicioRef = useRef<number>(performance.now());
  const offsetRef = useRef<number>(Math.random() * DURACION_CICLO_MS);

  useEffect(() => {
    if (!activo) {
      setColor(COLORES_VEREDICTO[0]);
      return;
    }

    // Reinicia el inicio para que el offset aleatorio sea el punto
    // de partida de este montaje concreto.
    inicioRef.current = performance.now();

    const tick = (ahora: number) => {
      const transcurrido = ahora - inicioRef.current + offsetRef.current;
      const t = (transcurrido % DURACION_CICLO_MS) / DURACION_CICLO_MS;
      setColor(colorDelCiclo(t));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [activo]);

  return color;
}

// Símbolo WKF — retícula de dial marino con W/pulso central.
// Geometría fija. No tocar proporciones.
const WKFSymbol: React.FC<{
  size: number;
  color: string;
  glow: boolean;
  strokeBg?: string;
}> = ({ size, color, glow, strokeBg }) => {
  const filterId = `wkf-glow-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="WKF"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {strokeBg && <rect width="500" height="500" fill={strokeBg} />}
      {glow && (
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <g
        stroke={color}
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
        filter={glow ? `url(#${filterId})` : undefined}
      >
        {/* Marcas perimetrales del dial. Arco superior e inferior.
            Más gruesas cada 30 grados, más finas entre medias. */}
        {Array.from({ length: 21 }, (_, i) => {
          const angleDeg = -100 + i * 10;
          const rad = (angleDeg - 90) * Math.PI / 180;
          const rInner = 168;
          const rOuter = 184;
          const cx = 250;
          const cy = 250;
          const x1 = cx + rInner * Math.cos(rad);
          const y1 = cy + rInner * Math.sin(rad);
          const x2 = cx + rOuter * Math.cos(rad);
          const y2 = cy + rOuter * Math.sin(rad);
          const sw = angleDeg % 30 === 0 ? 3 : 2;
          return (
            <line
              key={`top-${i}`}
              x1={x1.toFixed(1)}
              y1={y1.toFixed(1)}
              x2={x2.toFixed(1)}
              y2={y2.toFixed(1)}
              strokeWidth={sw}
            />
          );
        })}
        {Array.from({ length: 21 }, (_, i) => {
          const angleDeg = 80 + i * 10;
          const rad = (angleDeg - 90) * Math.PI / 180;
          const rInner = 168;
          const rOuter = 184;
          const cx = 250;
          const cy = 250;
          const x1 = cx + rInner * Math.cos(rad);
          const y1 = cy + rInner * Math.sin(rad);
          const x2 = cx + rOuter * Math.cos(rad);
          const y2 = cy + rOuter * Math.sin(rad);
          const sw = angleDeg % 30 === 0 ? 3 : 2;
          return (
            <line
              key={`bottom-${i}`}
              x1={x1.toFixed(1)}
              y1={y1.toFixed(1)}
              x2={x2.toFixed(1)}
              y2={y2.toFixed(1)}
              strokeWidth={sw}
            />
          );
        })}

        {/* Círculo principal dividido en 4 arcos con huecos en los
            cuatro puntos cardinales. Radio 140. */}
        <path d="M 232 112 A 140 140 0 0 0 112 232" strokeWidth="8" />
        <path d="M 112 268 A 140 140 0 0 0 232 388" strokeWidth="8" />
        <path d="M 268 388 A 140 140 0 0 0 388 268" strokeWidth="8" />
        <path d="M 388 232 A 140 140 0 0 0 268 112" strokeWidth="8" />

        {/* Cruz vertical. Dos segmentos que cortan arriba y abajo. */}
        <line x1="250" y1="45" x2="250" y2="175" strokeWidth="12" />
        <line x1="250" y1="325" x2="250" y2="455" strokeWidth="12" />

        {/* Línea horizontal completa con W/pulso central. */}
        <path
          d="M 45 250 L 180 250 L 215 190 L 255 310 L 285 250 L 455 250"
          strokeWidth="12"
        />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  scheme = 'neon',
  className = '',
}) => {
  const px = size === 'sm' ? 36 : size === 'lg' ? 72 : 48;

  // Solo animamos el símbolo del logo horizontal en esquema neon.
  const animarSimbolo = variant === 'horizontal' && scheme === 'neon';
  const colorSimboloAnimado = useColorCiclico(animarSimbolo);

  const palettes = {
    neon: {
      symbol: 'var(--accent)',
      wkf: 'var(--accent)',
      tagline: 'var(--accent-2)',
      glow: true,
      strokeBg: undefined,
    },
    'white-on-black': {
      symbol: '#FFFFFF',
      wkf: '#FFFFFF',
      tagline: '#FFFFFF',
      glow: false,
      strokeBg: undefined,
    },
    'black-on-white': {
      symbol: '#0A0A0A',
      wkf: '#0A0A0A',
      tagline: '#0A0A0A',
      glow: false,
      strokeBg: undefined,
    },
  } as const;

  const palette = palettes[scheme];

  // Si toca animar, el símbolo usa el color del ciclo. Si no,
  // usa el color fijo del esquema.
  const symbolColor = animarSimbolo ? colorSimboloAnimado : palette.symbol;

  if (variant === 'icon') {
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WKFSymbol
          size={px}
          color={symbolColor}
          glow={palette.glow}
          strokeBg={palette.strokeBg}
        />
      </div>
    );
  }

  const titleSize = size === 'sm' ? 20 : size === 'lg' ? 44 : 28;
  const taglineSize = size === 'sm' ? 9 : size === 'lg' ? 12 : 10;
  const taglineSpacing =
    size === 'sm' ? '0.22em' : size === 'lg' ? '0.28em' : '0.24em';
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
      <WKFSymbol
        size={px}
        color={symbolColor}
        glow={palette.glow}
        strokeBg={palette.strokeBg}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: titleSize,
            letterSpacing: '0.08em',
            lineHeight: 1,
            color: palette.wkf,
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
            color: palette.tagline,
            opacity: 0.9,
          }}
        >
          WORLD KAYAK FISHING
        </span>
      </div>
    </div>
  );
};

export default Logo;