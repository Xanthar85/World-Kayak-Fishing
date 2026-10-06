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
          height: '90px',
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
  const H = 90;
  const paddingLeft = 20;
  const paddingRight = 20;
  const paddingTop = 14;
  const paddingBottom = 16;
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

  // Paths de ola (línea y área).
  const puntosOla = puntos.filter((p): p is Punto & { olaM: number } => p.olaM != null);
  const olaPath = puntosOla
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xHora(p.hora).toFixed(1)},${yOla(p.olaM).toFixed(1)}`)
    .join(' ');
  const olaAreaPath =
    puntosOla.length > 0
      ? [
          olaPath,
          `L ${xHora(puntosOla[puntosOla.length - 1].hora).toFixed(1)},${(paddingTop + plotH).toFixed(1)}`,
          `L ${xHora(puntosOla[0].hora).toFixed(1)},${(paddingTop + plotH).toFixed(1)}`,
          'Z',
        ].join(' ')
      : '';

  // Paths de viento (línea y área).
  const puntosViento = puntos.filter(
    (p): p is Punto & { vientoKmh: number } => p.vientoKmh != null
  );
  const vientoPath = puntosViento
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xHora(p.hora).toFixed(1)},${yViento(p.vientoKmh).toFixed(1)}`)
    .join(' ');
  const vientoAreaPath =
    puntosViento.length > 0
      ? [
          vientoPath,
          `L ${xHora(puntosViento[puntosViento.length - 1].hora).toFixed(1)},${(paddingTop + plotH).toFixed(1)}`,
          `L ${xHora(puntosViento[0].hora).toFixed(1)},${(paddingTop + plotH).toFixed(1)}`,
          'Z',
        ].join(' ')
      : '';

  // Línea y marca de ahora
  const ahora = new Date().getHours() + new Date().getMinutes() / 60;
  const xAhora = xHora(ahora);
  const mostrarTextoAhora = xAhora >= paddingLeft + 12 && xAhora <= paddingLeft + plotW - 12;

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
            height: '90px',
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

          {/* Eje Y izquierdo: Ola (máx, mitad, 0) */}
          {[
            { y: paddingTop, label: olaMax.toFixed(1) },
            { y: paddingTop + plotH / 2, label: (olaMax / 2).toFixed(1) },
            { y: paddingTop + plotH, label: '0' },
          ].map((m, idx) => (
            <g key={`y-ola-${idx}`}>
              <line
                x1={paddingLeft - 4}
                y1={m.y}
                x2={paddingLeft}
                y2={m.y}
                stroke="var(--border)"
                strokeWidth={0.5}
              />
              <text
                x={paddingLeft - 5}
                y={m.y + 2}
                fontSize={6}
                fill="var(--text-dim)"
                textAnchor="end"
                fontFamily="Fira Code, monospace"
              >
                {m.label}
              </text>
            </g>
          ))}

          {/* Eje Y derecho: Viento (máx, mitad, 0) */}
          {[
            { y: paddingTop, label: `${Math.round(vientoMax)}` },
            { y: paddingTop + plotH / 2, label: `${Math.round(vientoMax / 2)}` },
            { y: paddingTop + plotH, label: '0' },
          ].map((m, idx) => (
            <g key={`y-viento-${idx}`}>
              <line
                x1={paddingLeft + plotW}
                y1={m.y}
                x2={paddingLeft + plotW + 4}
                y2={m.y}
                stroke="var(--border)"
                strokeWidth={0.5}
              />
              <text
                x={paddingLeft + plotW + 5}
                y={m.y + 2}
                fontSize={6}
                fill="var(--text-dim)"
                textAnchor="start"
                fontFamily="Fira Code, monospace"
              >
                {m.label}
              </text>
            </g>
          ))}

          {/* Área y línea de ola (verde neón) */}
          {olaAreaPath && (
            <path
              d={olaAreaPath}
              fill="var(--accent)"
              opacity={0.15}
            />
          )}
          {olaPath && (
            <path
              d={olaPath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Área y línea de viento (azul cian) */}
          {vientoAreaPath && (
            <path
              d={vientoAreaPath}
              fill="var(--accent-2)"
              opacity={0.12}
            />
          )}
          {vientoPath && (
            <path
              d={vientoPath}
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3 2"
            />
          )}

          {/* Línea vertical de ahora */}
          {ahora >= 0 && ahora <= 23 && (
            <g>
              <line
                x1={xAhora}
                y1={paddingTop}
                x2={xAhora}
                y2={paddingTop + plotH}
                stroke="var(--accent)"
                strokeWidth={1}
                strokeDasharray="2 2"
                opacity={0.4}
              />
              {mostrarTextoAhora && (
                <text
                  x={xAhora}
                  y={paddingTop - 2}
                  fontSize={5}
                  fill="var(--accent)"
                  textAnchor="middle"
                  fontFamily="Fira Code, monospace"
                >
                  Ahora
                </text>
              )}
            </g>
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
                    top: '2px',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
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

      {/* Leyenda compacta: máximos y unidades */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.6rem',
          fontFamily: 'var(--font-mono, Fira Code, monospace)',
          color: 'var(--text-dim)',
          padding: '0 4px',
        }}
      >
        <span style={{ color: 'var(--accent)' }}>— Ola (máx {olaMax.toFixed(1)} m)</span>
        <span style={{ color: 'var(--accent)' }}>— Ahora</span>
        <span style={{ color: 'var(--accent-2)' }}>
          ┄ Viento (máx {Math.round(vientoMax)} km/h)
        </span>
      </div>
    </div>
  );
};

export default MiniGrafico;