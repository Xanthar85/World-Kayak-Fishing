// src/components/MiniGrafico.tsx
// WKF — Mini-gráfico de la tarjeta Home.
// v1.010 (bug 14, DP-090):
//   - Eje X: 24 horas del día (0-23).
//   - Eje Y izquierdo: Ola (m).
//   - Eje Y derecho: Viento (km/h).
//   - Icono de clima por hora (cada 3 h para no saturar).
//   - Recuadros de franja con el color del veredicto de esa franja.
// Sustituye al SVG plano que estaba en SpotCard.

import React, { useMemo } from 'react';
import type { SpotWeather, HourlyPoint } from '../lib/openmeteo.ts';
import type { FranjaUsuario } from '../state/store.ts';
import type { Veredicto } from '../lib/verdict.ts';
import { veredictoAColor } from '../lib/verdict-ui.ts';
import { weatherCodeAIconoGrafico, msAKmh } from '../lib/openmeteo.ts';

export interface MiniGraficoProps {
  weather: SpotWeather | null;
  franjas: FranjaUsuario[];
  /** Veredicto de cada franja, indexado por franja.id. */
  veredictos: Record<string, Veredicto | null>;
  /** Si es true, el gráfico ocupa todo el ancho disponible. */
  fullWidth?: boolean;
}

interface Punto {
  hora: number;         // 0-23
  olaM: number | null;  // m
  vientoKmh: number | null; // km/h
  weatherCode: number | null;
}

// Extrae solo las 24 h del día de hoy desde weather.hourly.
// Si no hay horas de hoy (p. ej. cambio de día), usa las primeras
// 24 disponibles.
function extraer24h(weather: SpotWeather | null): { puntos: Punto[]; fechaKey: string } {
  if (!weather || !weather.hourly || weather.hourly.length === 0) {
    return { puntos: [], fechaKey: '' };
  }
  const ahora = new Date();
  const hoyKey = `${ahora.getFullYear()}-${ahora.getMonth()}-${ahora.getDate()}`;

  const delDia = weather.hourly.filter((h) => {
    const d = new Date(h.time);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    return k === hoyKey;
  });

  const fuente: HourlyPoint[] = delDia.length >= 12 ? delDia : weather.hourly.slice(0, 24);

  const puntos: Punto[] = fuente.slice(0, 24).map((h) => {
    const d = new Date(h.time);
    return {
      hora: d.getHours(),
      olaM: h.waveHeight,
      vientoKmh: msAKmh(h.windSpeed),
      weatherCode: h.weatherCode,
    };
  });

  return { puntos, fechaKey: hoyKey };
}

export const MiniGrafico: React.FC<MiniGraficoProps> = ({
  weather,
  franjas,
  veredictos,
  fullWidth = false,
}) => {
  const { puntos } = useMemo(() => extraer24h(weather), [weather]);

  if (puntos.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.7rem',
          fontStyle: 'italic',
          border: '1px solid var(--border)',
          borderRadius: 4,
        }}
      >
        — 
      </div>
    );
  }

  // Ancho virtual. No lo escalamos al contenedor: usamos viewBox
  // y preserveAspectRatio=none para estirar el eje X. Los iconos
  // se pintan fuera del SVG en HTML para no deformarse.
  const W = 480;
  const H = 56;
  const paddingLeft = 20;
  const paddingRight = 20;
  const paddingTop = 4;
  const paddingBottom = 12;
  const plotW = W - paddingLeft - paddingRight;
  const plotH = H - paddingTop - paddingBottom;

  // Máximos para escalar. Se redondean hacia arriba con holgura.
  let olaMax = 0.5;
  let vientoMax = 5;
  for (const p of puntos) {
    if (p.olaM != null && p.olaM > olaMax) olaMax = p.olaM;
    if (p.vientoKmh != null && p.vientoKmh > vientoMax) vientoMax = p.vientoKmh;
  }
  olaMax = Math.ceil((olaMax * 1.1) * 10) / 10;
  vientoMax = Math.ceil((vientoMax * 1.1) / 5) * 5;

  const xHora = (h: number) => paddingLeft + (h / 23) * plotW;
  const yOla = (m: number) => paddingTop + plotH - (Math.min(m, olaMax) / olaMax) * plotH;
  const yViento = (k: number) =>
    paddingTop + plotH - (Math.min(k, vientoMax) / vientoMax) * plotH;

  // Paths de ola y viento.
  const olaPath = puntos
    .map((p, i) => {
      if (p.olaM == null) return null;
      const x = xHora(p.hora);
      const y = yOla(p.olaM);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter((s): s is string => s !== null)
    .join(' ');

  const vientoPath = puntos
    .map((p, i) => {
      if (p.vientoKmh == null) return null;
      const x = xHora(p.hora);
      const y = yViento(p.vientoKmh);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter((s): s is string => s !== null)
    .join(' ');

  // Etiquetas del eje X (cada 6 h).
  const marcasX = [0, 6, 12, 18, 23];

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 4,
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 4,
      }}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio={fullWidth ? 'none' : 'xMidYMid meet'}
          style={{
            width: '100%',
            height: '56px',
            display: 'block',
          }}
        >
          {/* Recuadros de franja. Fondo tenue con el color del
              veredicto de esa franja. */}
          {franjas.map((f) => {
            const v = veredictos[f.id] ?? null;
            if (!v) return null;
            const color = veredictoAColor(v);
            const inicio = f.inicio;
            const fin = f.fin;
            // Si cruza medianoche, pintamos dos rectángulos.
            const tramos: Array<[number, number]> = [];
            if (inicio < fin) tramos.push([inicio, fin]);
            else {
              tramos.push([inicio, 24]);
              tramos.push([0, fin]);
            }
            return tramos.map(([a, b], k) => {
              const x1 = xHora(a);
              const x2 = xHora(b - 1);
              const w = Math.max(0, x2 - x1);
              return (
                <rect
                  key={`${f.id}-${k}`}
                  x={x1}
                  y={paddingTop}
                  width={w}
                  height={plotH}
                  fill={color}
                  opacity={0.08}
                />
              );
            });
          })}

          {/* Eje horizontal */}
          <line
            x1={paddingLeft}
            y1={paddingTop + plotH}
            x2={paddingLeft + plotW}
            y2={paddingTop + plotH}
            stroke="var(--border)"
            strokeWidth={0.5}
          />

          {/* Línea de ola (color acento verde lima). */}
          {olaPath && (
            <path
              d={olaPath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Línea de viento (color acento azul cian). */}
          {vientoPath && (
            <path
              d={vientoPath}
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3 2"
            />
          )}

          {/* Marcas del eje X */}
          {marcasX.map((h) => (
            <g key={h}>
              <line
                x1={xHora(h)}
                y1={paddingTop + plotH}
                x2={xHora(h)}
                y2={paddingTop + plotH + 2}
                stroke="var(--text-dim)"
                strokeWidth={0.5}
              />
              <text
                x={xHora(h)}
                y={H - 1}
                fontSize={7}
                fill="var(--text-dim)"
                textAnchor="middle"
                fontFamily="Fira Code, monospace"
              >
                {h}
              </text>
            </g>
          ))}
        </svg>

        {/* Iconos de clima: 8 puntos (cada 3 h) sobre el SVG. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          {puntos
            .filter((_, i) => i % 3 === 0)
            .map((p) => {
              const leftPct = ((xHora(p.hora) - paddingLeft) / plotW) * 100;
              return (
                <div
                  key={`ico-${p.hora}`}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: 0,
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    color: 'var(--text-dim)',
                    lineHeight: 1,
                  }}
                >
                  {weatherCodeAIconoGrafico(p.weatherCode)}
                </div>
              );
            })}
        </div>
      </div>

      {/* Leyenda compacta: máximos y unidades. */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.6rem',
          fontFamily: 'var(--font-mono, Fira Code, monospace)',
          color: 'var(--text-dim)',
          padding: '0 4px',
        }}
      >
        <span style={{ color: 'var(--accent)' }}>— Ola (máx {olaMax.toFixed(1)} m)</span>
        <span style={{ color: 'var(--accent-2)' }}>
          ┄ Viento (máx {Math.round(vientoMax)} km/h)
        </span>
      </div>
    </div>
  );
};

export default MiniGrafico;