// src/screens/PrevisionScreen.tsx
// WKF — Pantalla de Previsión meteorológica (tipo Windy).
// v1.011: pestaña Previsión de la barra inferior.
// Muestra gráfico de ola + viento del punto activo, día a día,
// con 7 días seleccionables, franjas de veredicto encuadradas y
// resumen numérico bajo el gráfico.

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../state/store.ts';
import {
  calcularVeredictoFranjaDia,
  veredictoAColor,
} from '../lib/verdict-ui.ts';
import {
  msAKmh,
  kmhABf,
  weatherCodeAIcono,
  weatherCodeAIconoGrafico,
} from '../lib/openmeteo.ts';
import type { SpotWeather, HourlyPoint } from '../lib/openmeteo.ts';
import type { Spot, FranjaUsuario } from '../state/store.ts';
import { calcularVeredicto, type FranjaDia, type Veredicto } from '../lib/verdict.ts';
import { colorNumero } from '../lib/verdict-color.ts';
import { calcularSol } from '../lib/sun.ts';
import { calcularActividadPorHora, type ActividadHora } from '../lib/actividad.ts';

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

interface GraficoGrandeProps {
  weather: SpotWeather | null;
  dia: Date;
  franjas: FranjaUsuario[];
  veredictosPorFranja: Record<string, Veredicto | null>;
}

const GraficoGrande: React.FC<GraficoGrandeProps> = ({
  weather,
  dia,
  franjas,
  veredictosPorFranja,
}) => {
  if (!weather || !weather.hourly || weather.hourly.length === 0) {
    return (
      <div
        style={{
          height: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.85rem',
          fontStyle: 'italic',
          border: '1px solid var(--border)',
          borderRadius: 8,
        }}
      >
        —
      </div>
    );
  }

  const keyDia = localDateKey(dia);
  const puntos = weather.hourly
    .filter((h) => localDateKey(new Date(h.time)) === keyDia)
    .slice(0, 24);

  if (puntos.length === 0) {
    return (
      <div
        style={{
          height: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.85rem',
          fontStyle: 'italic',
          border: '1px solid var(--border)',
          borderRadius: 8,
        }}
      >
        —
      </div>
    );
  }

  const W = 720;
  const H = 320;
  const paddingLeft = 32;
  const paddingRight = 32;
  const paddingTop = 20;
  const paddingBottom = 34;
  const plotW = W - paddingLeft - paddingRight;
  const plotH = H - paddingTop - paddingBottom;

  let olaMax = 0.5;
  let vientoMax = 5;
  for (const p of puntos) {
    const o = p.waveHeight ?? 0;
    const v = msAKmh(p.windSpeed) ?? 0;
    if (o > olaMax) olaMax = o;
    if (v > vientoMax) vientoMax = v;
  }
  olaMax = Math.ceil((olaMax * 1.15) * 10) / 10;
  vientoMax = Math.ceil((vientoMax * 1.15) / 5) * 5;

  const xHora = (h: number) => paddingLeft + (h / 23) * plotW;
  const yOla = (m: number) => paddingTop + plotH - (Math.min(m, olaMax) / olaMax) * plotH;
  const yViento = (k: number) => paddingTop + plotH - (Math.min(k, vientoMax) / vientoMax) * plotH;

  const olaPath = puntos
    .map((p, i) => {
      if (p.waveHeight == null) return null;
      const x = xHora(new Date(p.time).getHours());
      const y = yOla(p.waveHeight);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter((s): s is string => s !== null)
    .join(' ');

  const olaArea = (() => {
    const validos = puntos
      .map((p) => {
        if (p.waveHeight == null) return null;
        return { x: xHora(new Date(p.time).getHours()), y: yOla(p.waveHeight) };
      })
      .filter((v): v is { x: number; y: number } => v !== null);
    if (validos.length < 2) return '';
    const first = validos[0];
    const last = validos[validos.length - 1];
    const lines = validos.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x.toFixed(1)},${v.y.toFixed(1)}`);
    return `${lines.join(' ')} L ${last.x.toFixed(1)},${(paddingTop + plotH).toFixed(1)} L ${first.x.toFixed(1)},${(paddingTop + plotH).toFixed(1)} Z`;
  })();

  const vientoPath = puntos
    .map((p, i) => {
      const v = msAKmh(p.windSpeed);
      if (v == null) return null;
      const x = xHora(new Date(p.time).getHours());
      const y = yViento(v);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter((s): s is string => s !== null)
    .join(' ');

  const vientoArea = (() => {
    const validos = puntos
      .map((p) => {
        const v = msAKmh(p.windSpeed);
        if (v == null) return null;
        return { x: xHora(new Date(p.time).getHours()), y: yViento(v) };
      })
      .filter((v): v is { x: number; y: number } => v !== null);
    if (validos.length < 2) return '';
    const first = validos[0];
    const last = validos[validos.length - 1];
    const lines = validos.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x.toFixed(1)},${v.y.toFixed(1)}`);
    return `${lines.join(' ')} L ${last.x.toFixed(1)},${(paddingTop + plotH).toFixed(1)} L ${first.x.toFixed(1)},${(paddingTop + plotH).toFixed(1)} Z`;
  })();

  const marcasY = [0, 0.5, 1];
  const ahora = new Date();
  const esHoy = localDateKey(ahora) === keyDia;
  const horaAhora = ahora.getHours() + ahora.getMinutes() / 60;

  return (
    <div
      style={{
        width: '100%',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 8,
        backgroundColor: 'var(--bg)',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {franjas.map((f) => {
          const v = veredictosPorFranja[f.id] ?? null;
          if (!v) return null;
          const color = veredictoAColor(v);
          const tramos: Array<[number, number]> = [];
          if (f.inicio < f.fin) tramos.push([f.inicio, f.fin]);
          else {
            tramos.push([f.inicio, 24]);
            tramos.push([0, f.fin]);
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
                fillOpacity={0.06}
                stroke={color}
                strokeWidth={1.5}
                strokeOpacity={0.85}
              />
            );
          });
        })}

        {marcasY.map((frac) => {
          const y = paddingTop + plotH - frac * plotH;
          return (
            <line
              key={`grid-${frac}`}
              x1={paddingLeft}
              y1={y}
              x2={paddingLeft + plotW}
              y2={y}
              stroke="var(--border)"
              strokeWidth={0.5}
              strokeDasharray="2 3"
            />
          );
        })}

        {marcasY.map((frac) => {
          const val = frac * olaMax;
          const y = paddingTop + plotH - frac * plotH;
          return (
            <g key={`yola-${frac}`}>
              <line x1={paddingLeft - 4} y1={y} x2={paddingLeft} y2={y} stroke="var(--text-dim)" strokeWidth={0.6} />
              <text x={paddingLeft - 6} y={y + 2} fontSize={9} fill="var(--text-dim)" textAnchor="end" fontFamily="Fira Code, monospace">
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {marcasY.map((frac) => {
          const val = frac * vientoMax;
          const y = paddingTop + plotH - frac * plotH;
          return (
            <g key={`yvie-${frac}`}>
              <line x1={paddingLeft + plotW} y1={y} x2={paddingLeft + plotW + 4} y2={y} stroke="var(--text-dim)" strokeWidth={0.6} />
              <text x={paddingLeft + plotW + 6} y={y + 2} fontSize={9} fill="var(--text-dim)" textAnchor="start" fontFamily="Fira Code, monospace">
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        <line x1={paddingLeft} y1={paddingTop + plotH} x2={paddingLeft + plotW} y2={paddingTop + plotH} stroke="var(--border)" strokeWidth={0.6} />

        {olaArea && <path d={olaArea} fill="var(--accent)" opacity={0.15} />}
        {olaPath && (
          <path d={olaPath} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        )}

        {vientoArea && <path d={vientoArea} fill="var(--accent-2)" opacity={0.12} />}
        {vientoPath && (
          <path d={vientoPath} fill="none" stroke="var(--accent-2)" strokeWidth={1.6} strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {[0, 6, 12, 18, 23].map((h) => (
          <g key={`xh-${h}`}>
            <line x1={xHora(h)} y1={paddingTop + plotH} x2={xHora(h)} y2={paddingTop + plotH + 3} stroke="var(--text-dim)" strokeWidth={0.6} />
            <text x={xHora(h)} y={H - 6} fontSize={10} fill="var(--text-dim)" textAnchor="middle" fontFamily="Fira Code, monospace">
              {h}
            </text>
          </g>
        ))}

        {esHoy && (
          <g>
            <line x1={xHora(horaAhora)} y1={paddingTop} x2={xHora(horaAhora)} y2={paddingTop + plotH} stroke="var(--accent)" strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
            <text x={xHora(horaAhora)} y={paddingTop - 6} fontSize={9} fill="var(--accent)" textAnchor="middle" fontFamily="Fira Code, monospace" fontWeight={600}>
              Ahora
            </text>
          </g>
        )}
      </svg>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '4px 32px 0',
          fontSize: '0.9rem',
          color: 'var(--text-dim)',
        }}
      >
        {puntos
          .filter((_, i) => i % 2 === 0)
          .map((p) => (
            <span key={p.time}>{weatherCodeAIconoGrafico(p.weatherCode)}</span>
          ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          padding: '6px 0 2px',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono, Fira Code, monospace)',
          color: 'var(--text-dim)',
        }}
      >
        <span style={{ color: 'var(--accent)' }}>— Ola (m)</span>
        <span style={{ color: 'var(--accent-2)' }}>┄ Viento (km/h)</span>
      </div>
    </div>
  );
};

interface ResumenDiaProps {
  puntos: HourlyPoint[];
}

const ResumenDia: React.FC<ResumenDiaProps> = ({ puntos }) => {
  const { t } = useTranslation();
  let olaMax = 0;
  let vientoMax = 0;
  const dirVientoCount: Record<string, number> = {};
  for (const p of puntos) {
    if (p.waveHeight != null && p.waveHeight > olaMax) olaMax = p.waveHeight;
    const v = msAKmh(p.windSpeed);
    if (v != null && v > vientoMax) vientoMax = v;
    if (p.windDirection != null) {
      const card = Math.round(p.windDirection / 22.5) % 16;
      const nombres = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
      const c = nombres[card];
      dirVientoCount[c] = (dirVientoCount[c] ?? 0) + 1;
    }
  }
  const dirDominante =
    Object.entries(dirVientoCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const cardStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 12px',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    textAlign: 'center',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: 4,
  };
  const valueStyle: React.CSSProperties = {
    fontSize: '1.4rem',
    fontWeight: 700,
    fontFamily: 'var(--font-mono, Fira Code, monospace)',
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
      <div style={cardStyle}>
        <div style={labelStyle}>{t('prevision.maxWave')}</div>
        <div style={{ ...valueStyle, color: 'var(--accent)' }}>
          {olaMax.toFixed(2)} m
        </div>
      </div>
      <div style={cardStyle}>
        <div style={labelStyle}>{t('prevision.maxWind')}</div>
        <div style={{ ...valueStyle, color: 'var(--accent-2)' }}>
          {Math.round(vientoMax)} km/h
        </div>
      </div>
      <div style={cardStyle}>
        <div style={labelStyle}>{t('prevision.windDir')}</div>
        <div style={valueStyle}>{dirDominante}</div>
      </div>
    </div>
  );
};

function formatearCabeceraDia(fecha: Date, lang: string): string {
  const locale = lang.startsWith('en') ? 'en-GB' : 'es-ES';
  const diaSemana = fecha
    .toLocaleDateString(locale, { weekday: 'short' })
    .replace('.', '')
    .toUpperCase();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${diaSemana}, ${dia}/${mes}`;
}

function obtenerFranjaDia(fecha: Date): FranjaDia {
  const h = fecha.getHours();
  if (h < 12) return 'manana';
  if (h < 20) return 'tarde';
  return 'noche';
}

interface Tabla72HorasProps {
  weather: SpotWeather | null;
  spot: Spot | null;
  lang: string;
}

const Tabla72Horas: React.FC<Tabla72HorasProps> = ({ weather, spot, lang }) => {
  const ajustes = useAppStore((s) => s.ajustes);

  const actividadMap = useMemo(() => {
    if (!weather?.hourly || !spot) return new Map<string, ActividadHora>();
    const mapaSol = new Map<string, { orto: Date | null; ocaso: Date | null }>();
    for (const h of weather.hourly) {
      const d = new Date(h.time);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!mapaSol.has(key)) {
        const sol = calcularSol(d, spot.lat, spot.lon);
        mapaSol.set(key, { orto: sol?.orto ?? null, ocaso: sol?.ocaso ?? null });
      }
    }
    const lista = calcularActividadPorHora(weather.hourly, mapaSol);
    const m = new Map<string, ActividadHora>();
    for (const item of lista) {
      m.set(item.hora, item);
    }
    return m;
  }, [weather, spot]);

  const filas72 = useMemo(() => {
    const ahora = new Date();
    const baseYear = ahora.getFullYear();
    const baseMonth = ahora.getMonth();
    const baseDay = ahora.getDate();
    const ahoraHora = ahora.getHours();

    const result: Array<{
      fecha: Date;
      esCambioDia: boolean;
      point: HourlyPoint | null;
    }> = [];

    let prevDia: number | null = null;

    for (let i = 0; i < 72; i++) {
      const fecha = new Date(baseYear, baseMonth, baseDay, ahoraHora + i, 0, 0, 0);
      const diaNum = fecha.getDate();
      const esCambioDia = prevDia !== null && diaNum !== prevDia;
      prevDia = diaNum;

      let point: HourlyPoint | null = null;
      if (weather?.hourly) {
        point =
          weather.hourly.find((h) => {
            const d = new Date(h.time);
            return (
              d.getFullYear() === fecha.getFullYear() &&
              d.getMonth() === fecha.getMonth() &&
              d.getDate() === fecha.getDate() &&
              d.getHours() === fecha.getHours()
            );
          }) ?? null;
      }

      result.push({ fecha, esCambioDia, point });
    }

    return result;
  }, [weather]);

  const columnas = [
    'Hora',
    'Clima',
    'mm',
    'ºC',
    'OlaT',
    'Per',
    'V.Med',
    'V.Max',
    'KN',
    'Act',
  ];

  const celdaBase: React.CSSProperties = {
    padding: '5px 2px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        marginTop: 12,
        border: '1px solid var(--border)',
        borderRadius: 8,
        backgroundColor: 'var(--surface)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxHeight: '55vh',
          overflowY: 'auto',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono, Fira Code, monospace)',
          }}
        >
          <thead
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: 'var(--surface)',
              zIndex: 2,
              boxShadow: '0 1px 0 var(--border)',
            }}
          >
            <tr>
              {columnas.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '6px 2px',
                    fontWeight: 600,
                    color: 'var(--text-dim)',
                    fontSize: '0.68rem',
                    borderBottom: '1px solid var(--border)',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas72.map((item) => {
              const { fecha, esCambioDia, point } = item;
              const franjaDia = obtenerFranjaDia(fecha);
              const horaTexto = `${String(fecha.getHours()).padStart(2, '0')}:00`;

              // Clima
              const climaIcono = weatherCodeAIcono(
                point?.weatherCode ?? null,
                fecha.getHours() < 7 || fecha.getHours() >= 21
              );

              // mm (precipitación)
              const mmTexto =
                point?.precipitation != null
                  ? `${point.precipitation.toFixed(1)}mm`
                  : '—';

              // ºC (temperatura)
              const tempTexto =
                point?.temperature != null
                  ? `${point.temperature.toFixed(1)}ºC`
                  : '—';

              // OlaT
              const olaTexto =
                point?.waveHeight != null
                  ? `${point.waveHeight.toFixed(2)}m`
                  : '—';
              const vOla =
                point?.waveHeight != null && spot
                  ? calcularVeredicto(
                      spot.zona ?? 'mediterraneo_espanol',
                      ajustes.categoriaKayak,
                      ajustes.perfil,
                      franjaDia,
                      {
                        viento: 0,
                        ola: point.waveHeight,
                        periodo: point.wavePeriod ?? 0,
                        corriente: 0,
                        marea: 0,
                      }
                    ).veredictoPorFactor.ola
                  : null;
              const colorOla = colorNumero(vOla, ajustes.colorTabla);

              // Per
              const perTexto =
                point?.wavePeriod != null
                  ? `${Math.round(point.wavePeriod)}s`
                  : '—';
              const vPer =
                point?.wavePeriod != null && spot
                  ? calcularVeredicto(
                      spot.zona ?? 'mediterraneo_espanol',
                      ajustes.categoriaKayak,
                      ajustes.perfil,
                      franjaDia,
                      {
                        viento: 0,
                        ola: 0,
                        periodo: point.wavePeriod,
                        corriente: 0,
                        marea: 0,
                      }
                    ).veredictoPorFactor.periodo
                  : null;
              const colorPer = colorNumero(vPer, ajustes.colorTabla);

              // V.Med
              const vmedTexto =
                point?.windSpeed != null
                  ? `${Math.round(point.windSpeed)}`
                  : '—';
              const vVmed =
                point?.windSpeed != null && spot
                  ? calcularVeredicto(
                      spot.zona ?? 'mediterraneo_espanol',
                      ajustes.categoriaKayak,
                      ajustes.perfil,
                      franjaDia,
                      {
                        viento: kmhABf(point.windSpeed) ?? 0,
                        ola: 0,
                        periodo: 0,
                        corriente: 0,
                        marea: 0,
                      }
                    ).veredictoPorFactor.viento
                  : null;
              const colorVmed = colorNumero(vVmed, ajustes.colorTabla);

              // V.Max
              const vmaxTexto =
                point?.windGusts != null
                  ? `${Math.round(point.windGusts)}`
                  : '—';
              const vVmax =
                point?.windGusts != null && spot
                  ? calcularVeredicto(
                      spot.zona ?? 'mediterraneo_espanol',
                      ajustes.categoriaKayak,
                      ajustes.perfil,
                      franjaDia,
                      {
                        viento: kmhABf(point.windGusts) ?? 0,
                        ola: 0,
                        periodo: 0,
                        corriente: 0,
                        marea: 0,
                      }
                    ).veredictoPorFactor.viento
                  : null;
              const colorVmax = colorNumero(vVmax, ajustes.colorTabla);

              // KN (corriente en km/h)
              const knVal = point?.currentVelocity;
              const kmhVal = knVal != null ? knVal * 1.852 : null;
              const knTexto = kmhVal != null ? kmhVal.toFixed(1) : '—';
              const vKN =
                point?.currentVelocity != null && spot
                  ? calcularVeredicto(
                      spot.zona ?? 'mediterraneo_espanol',
                      ajustes.categoriaKayak,
                      ajustes.perfil,
                      franjaDia,
                      {
                        viento: 0,
                        ola: 0,
                        periodo: 0,
                        corriente: point.currentVelocity,
                        marea: 0,
                      }
                    ).veredictoPorFactor.corriente
                  : null;
              const colorKN = colorNumero(vKN, ajustes.colorTabla);

              // Act (actividad peces 0-10)
              const actItem = point ? actividadMap.get(point.time) : null;
              const actTexto =
                actItem != null ? String(actItem.coeficiente) : '—';

              return (
                <React.Fragment key={fecha.toISOString()}>
                  {esCambioDia && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          padding: '6px 8px',
                          backgroundColor: 'rgba(0, 230, 118, 0.08)',
                          color: 'var(--accent)',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          textAlign: 'left',
                          borderTop: '1px solid var(--border)',
                          borderBottom: '1px solid var(--border)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {formatearCabeceraDia(fecha, lang)}
                      </td>
                    </tr>
                  )}
                  <tr
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <td
                      style={{
                        ...celdaBase,
                        color: 'var(--text-dim)',
                        fontWeight: 500,
                      }}
                    >
                      {horaTexto}
                    </td>
                    <td style={{ ...celdaBase, fontSize: '0.82rem' }}>
                      {climaIcono}
                    </td>
                    <td style={{ ...celdaBase, color: 'var(--text)' }}>
                      {mmTexto}
                    </td>
                    <td style={{ ...celdaBase, color: 'var(--text)' }}>
                      {tempTexto}
                    </td>
                    <td
                      style={{
                        ...celdaBase,
                        color: colorOla ?? 'var(--text)',
                        fontWeight: colorOla ? 600 : 400,
                      }}
                    >
                      {olaTexto}
                    </td>
                    <td
                      style={{
                        ...celdaBase,
                        color: colorPer ?? 'var(--text)',
                        fontWeight: colorPer ? 600 : 400,
                      }}
                    >
                      {perTexto}
                    </td>
                    <td
                      style={{
                        ...celdaBase,
                        color: colorVmed ?? 'var(--text)',
                        fontWeight: colorVmed ? 600 : 400,
                      }}
                    >
                      {vmedTexto}
                    </td>
                    <td
                      style={{
                        ...celdaBase,
                        color: colorVmax ?? 'var(--text)',
                        fontWeight: colorVmax ? 600 : 400,
                      }}
                    >
                      {vmaxTexto}
                    </td>
                    <td
                      style={{
                        ...celdaBase,
                        color: colorKN ?? 'var(--text)',
                        fontWeight: colorKN ? 600 : 400,
                      }}
                    >
                      {knTexto}
                    </td>
                    <td style={{ ...celdaBase, color: 'var(--text)' }}>
                      {actTexto}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const PrevisionScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const spots = useAppStore((s) => s.spots);
  const ajustes = useAppStore((s) => s.ajustes);
  const getFreshWeather = useAppStore((s) => s.getFreshWeather);

  const [spotActivoId, setSpotActivoId] = useState<string | null>(
    spots[0]?.id ?? null
  );
  const [diaOffset, setDiaOffset] = useState(0);

  const spotActivo = spots.find((s) => s.id === spotActivoId) ?? spots[0] ?? null;
  const weather = spotActivo ? getFreshWeather(spotActivo.id) : null;

  const lang = i18n.language?.startsWith('en') ? 'en' : 'es';

  const dias = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoy);
      d.setDate(d.getDate() + i);
      return { offset: i, fecha: d, key: localDateKey(d) };
    });
  }, []);

  const diaSeleccionado = dias[diaOffset];

  const veredictosPorFranja = useMemo(() => {
    const out: Record<string, Veredicto | null> = {};
    if (!spotActivo || !diaSeleccionado) return out;
    for (const f of ajustes.franjas) {
      out[f.id] = calcularVeredictoFranjaDia(
        spotActivo,
        weather,
        f,
        diaSeleccionado.fecha,
        ajustes.categoriaKayak,
        ajustes.perfil
      );
    }
    return out;
  }, [spotActivo, weather, ajustes.franjas, ajustes.categoriaKayak, ajustes.perfil, diaSeleccionado]);

  const puntosDia = useMemo(() => {
    if (!weather || !diaSeleccionado) return [];
    const key = diaSeleccionado.key;
    return weather.hourly
      .filter((h) => localDateKey(new Date(h.time)) === key)
      .slice(0, 24);
  }, [weather, diaSeleccionado]);

  const etiquetaDia = (offset: number, fecha: Date): string => {
    if (offset === 0) return t('home.today');
    if (offset === 1) return t('home.tomorrow');
    if (offset === 2) return t('home.dayAfter');
    return fecha.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  if (spots.length === 0) {
    return (
      <div
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.9rem',
        }}
      >
        {t('prevision.noSpots')}
      </div>
    );
  }

  return (
    <div style={{ padding: '12px 4px 80px' }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 4 }}>
        {spots.map((s) => {
          const activo = s.id === spotActivo?.id;
          return (
            <button
              key={s.id}
              onClick={() => setSpotActivoId(s.id)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: 6,
                border: `1px solid ${activo ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: activo ? 'var(--accent-subtle)' : 'transparent',
                color: activo ? 'var(--accent)' : 'var(--text)',
                fontSize: '0.8rem',
                fontWeight: activo ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {s.name || t('common.unnamed')}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 8, marginBottom: 10 }}>
        {dias.map(({ offset, fecha }) => {
          const activo = offset === diaOffset;
          return (
            <button
              key={offset}
              onClick={() => setDiaOffset(offset)}
              style={{
                flexShrink: 0,
                padding: '5px 10px',
                borderRadius: 6,
                border: `1px solid ${activo ? 'var(--accent-2)' : 'var(--border)'}`,
                backgroundColor: activo ? 'rgba(0, 184, 255, 0.12)' : 'transparent',
                color: activo ? 'var(--accent-2)' : 'var(--text-dim)',
                fontSize: '0.75rem',
                fontWeight: activo ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {etiquetaDia(offset, fecha)}
            </button>
          );
        })}
      </div>

      <GraficoGrande
        weather={weather}
        dia={diaSeleccionado.fecha}
        franjas={ajustes.franjas}
        veredictosPorFranja={veredictosPorFranja}
      />

      {puntosDia.length > 0 && <ResumenDia puntos={puntosDia} />}

      <Tabla72Horas spot={spotActivo} weather={weather} lang={lang} />
    </div>
  );
};

export default PrevisionScreen;
