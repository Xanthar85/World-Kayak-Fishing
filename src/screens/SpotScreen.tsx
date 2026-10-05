import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../state/store.ts';
import { formatearCoords } from '../lib/coords.ts';
import {
  calcularVeredictoPorFranja,
  veredictoAColor,
  veredictoAClaveI18n,
  veredictoAccesoAColor,
  veredictoAccesoAClaveI18n,
} from '../lib/verdict-ui.ts';
import {
  calcularVeredicto,
  calcularVeredictoAcceso,
  type FranjaDia,
  type ResultadoVeredicto,
  type Umbral,
  type Veredicto,
} from '../lib/verdict.ts';
import {
  calcularShoaling,
  PROFUNDIDAD_PROFUNDA_DEFECTO,
  PROFUNDIDAD_SOMERA_DEFECTO,
} from '../lib/shoaling.ts';
import { calcularSol } from '../lib/sun.ts';
import { calcularLuna, nombreFase, emojiFase } from '../lib/moon.ts';
import {
  fetchSpotWeather,
  msAKn,
  msAKmh,
  gradosACardinal16,
  weatherCodeAIcono,
  type HourlyPoint,
} from '../lib/openmeteo.ts';
import { nombreViento } from '../lib/wind.ts';
import { colorCelda, type NivelColorTabla } from '../lib/verdict-color.ts';
import type { FranjaUsuario } from '../state/store.ts';

export interface SpotScreenProps {
  spotId: string;
  onClose: () => void;
  onAddAccess?: (spotId: string) => void;
}

type TabId =
  | 'waves' | 'wind' | 'weather' | 'air' | 'barometer'
  | 'activity' | 'sun' | 'moon' | 'tides';

const ALL_TABS: TabId[] = [
  'waves', 'wind', 'weather', 'air', 'barometer',
  'activity', 'sun', 'moon', 'tides',
];

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function fechaLarga(d: Date, lang: string): string {
  return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
    weekday: 'short', day: '2-digit', month: '2-digit',
  });
}

// Filtra las horas según la franja activa. Si filtroFranja es false
// o franjaActiva es null, devuelve todas.
function filtrarPorFranja(
  horas: HourlyPoint[],
  franja: FranjaUsuario | null,
  filtroActivo: boolean
): HourlyPoint[] {
  if (!filtroActivo || !franja) return horas;
  return horas.filter((h) => {
    const hora = new Date(h.time).getHours();
    if (franja.inicio < franja.fin) {
      return hora >= franja.inicio && hora < franja.fin;
    }
    return hora >= franja.inicio || hora < franja.fin;
  });
}

// ─── Componentes de tabla ─────────────────────────────────────────

interface ColumnaTabla<T> {
  key: string;
  label: string;
  render: (h: T) => React.ReactNode;
  veredicto?: (h: T) => Veredicto | null;
}

// Tabla de 7 días con colores por celda, agrupación por día, y
// opción de filtrar por franja.
function TablaDatos<T extends { time: string }>({
  horas,
  columnas,
  colorNivel,
  lang,
  mostrarSeparadorDia = true,
}: {
  horas: T[];
  columnas: ColumnaTabla<T>[];
  colorNivel: NivelColorTabla;
  lang: string;
  mostrarSeparadorDia?: boolean;
}) {
  if (horas.length === 0) {
    return null;
  }

  const porDia = new Map<string, T[]>();
  for (const h of horas) {
    const key = localDateKey(new Date(h.time));
    if (!porDia.has(key)) porDia.set(key, []);
    porDia.get(key)!.push(h);
  }

  return (
    <div
      style={{
        borderRadius: 8, border: '1px solid var(--border)',
        overflow: 'hidden', fontSize: '0.72rem',
      }}
    >
      {/* Cabecera */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `minmax(54px, auto) repeat(${columnas.length}, 1fr)`,
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          fontSize: '0.68rem', color: 'var(--text-dim)',
          fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        <div style={{ padding: '6px 6px', textAlign: 'left' }}>Hora</div>
        {columnas.map((c) => (
          <div key={c.key} style={{ padding: '6px 4px', textAlign: 'center' }}>
            {c.label}
          </div>
        ))}
      </div>

      {/* Filas agrupadas por día */}
      {[...porDia.entries()].map(([key, filasDia], idxDia) => {
        const fechaDia = new Date(filasDia[0].time);
        return (
          <React.Fragment key={key}>
            {mostrarSeparadorDia && (
              <div
                style={{
                  gridColumn: `1 / -1`,
                  padding: '4px 8px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono, Fira Code, monospace)',
                  fontSize: '0.68rem', fontWeight: 700,
                  textTransform: 'uppercase',
                  borderTop: idxDia > 0 ? '1px solid var(--border)' : 'none',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {fechaLarga(fechaDia, lang)}
              </div>
            )}
            {filasDia.map((h, i) => {
              const hora = new Date(h.time).toLocaleTimeString(
                lang === 'en' ? 'en-GB' : 'es-ES',
                { hour: '2-digit', minute: '2-digit' }
              );
              return (
                <div
                  key={h.time}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `minmax(54px, auto) repeat(${columnas.length}, 1fr)`,
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    fontSize: '0.72rem',
                  }}
                >
                  <div
                    style={{
                      padding: '5px 6px', textAlign: 'left',
                      fontFamily: 'var(--font-mono, Fira Code, monospace)',
                      color: 'var(--text-dim)', fontWeight: 500,
                    }}
                  >
                    {hora}
                  </div>
                  {columnas.map((c) => {
                    const v = c.veredicto?.(h) ?? null;
                    const bg = colorCelda(v, colorNivel);
                    return (
                      <div
                        key={c.key}
                        style={{
                          padding: '5px 4px', textAlign: 'center',
                          fontFamily: 'var(--font-mono, Fira Code, monospace)',
                          color: 'var(--text)',
                          backgroundColor: bg ?? 'transparent',
                        }}
                      >
                        {c.render(h)}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── SpotScreen ───────────────────────────────────────────────────

export const SpotScreen: React.FC<SpotScreenProps> = ({
  spotId, onClose, onAddAccess,
}) => {
  const { t, i18n } = useTranslation();

  const spots = useAppStore((s) => s.spots);
  const getWeatherEntry = useAppStore((s) => s.getWeatherEntry);
  const setWeather = useAppStore((s) => s.setWeather);
  const updateSpot = useAppStore((s) => s.updateSpot);
  const ajustes = useAppStore((s) => s.ajustes);
  const setFranjaActiva = useAppStore((s) => s.setFranjaActiva);

  const spot = spots.find((s) => s.id === spotId);

  const [tabActiva, setTabActiva] = useState<TabId>('waves');
  const [coordsCopiedFeedback, setCoordsCopiedFeedback] = useState(false);
  const [expandFactors, setExpandFactors] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const fetchTriggeredRef = useRef(false);

  const weatherEntry = spot ? getWeatherEntry(spot.id) : null;
  const weather = weatherEntry?.data ?? null;
  const stale = weatherEntry?.stale ?? false;
  const ageMin = weatherEntry?.ageMin ?? 0;

  const lang = i18n.language?.startsWith('en') ? 'en' : 'es';

  // Auto-fetch al abrir si no hay datos.
  useEffect(() => {
    if (!spot) return;
    if (fetchTriggeredRef.current) return;
    if (weatherEntry) return;
    fetchTriggeredRef.current = true;
    setLoading(true);
    fetchSpotWeather(spot.lat, spot.lon)
      .then((data) => setWeather(spot.id, data))
      .catch((err) => console.error('fetch spot weather', err))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot?.id]);

  const franjaActiva = ajustes.franjas.find((f) => f.id === ajustes.franjaActivaId)
    ?? ajustes.franjas[0]
    ?? null;

  if (!spot) {
    onClose();
    return null;
  }

  const veredictos = calcularVeredictoPorFranja(
    spot, weather, ajustes.franjas,
    ajustes.categoriaKayak, ajustes.perfil
  );

  const veredictoFranjaActiva = franjaActiva ? veredictos[franjaActiva.id] : null;

  // Detalle del veredicto para la franja activa (para factor disparador).
  let detalleFranjaActiva: ResultadoVeredicto | null = null;
  if (weather && weather.hourly.length > 0 && franjaActiva) {
    const inicio = franjaActiva.inicio;
    const franjaDia: FranjaDia =
      inicio >= 0 && inicio < 12 ? 'manana'
      : inicio >= 12 && inicio < 20 ? 'tarde'
      : 'noche';
    let peorScore = -1;
    const orden = ['FAVORABLE', 'ACEPTABLE', 'EXIGENTE', 'DESACONSEJADO'];
    for (const h of weather.hourly) {
      const localHour = new Date(h.time).getHours();
      let dentro = false;
      if (franjaActiva.inicio < franjaActiva.fin) {
        dentro = localHour >= franjaActiva.inicio && localHour < franjaActiva.fin;
      } else if (franjaActiva.inicio > franjaActiva.fin) {
        dentro = localHour >= franjaActiva.inicio || localHour < franjaActiva.fin;
      } else {
        dentro = true;
      }
      if (!dentro || h.waveHeight == null || h.windSpeed == null) continue;
      const bf = Math.round(Math.pow(h.windSpeed / 0.836, 2 / 3));
      const res = calcularVeredicto(
        spot.zona ?? 'mediterraneo_espanol',
        ajustes.categoriaKayak, ajustes.perfil, franjaDia,
        { viento: bf, ola: h.waveHeight, periodo: h.wavePeriod ?? 0, corriente: 0, marea: 0 }
      );
      const score = orden.indexOf(res.veredicto);
      if (score > peorScore) { peorScore = score; detalleFranjaActiva = res; }
    }
  }

  // Aviso de salida
  let colorSalida = 'var(--text-dim)';
  let textoSalida = '';
  if (spot.tipoAcceso != null) {
    let olaCorregida = 0;
    if (weather && weather.hourly.length > 0 && franjaActiva) {
      const horasFranja = weather.hourly.filter((h) => {
        const lh = new Date(h.time).getHours();
        if (franjaActiva.inicio < franjaActiva.fin) {
          return lh >= franjaActiva.inicio && lh < franjaActiva.fin;
        }
        return lh >= franjaActiva.inicio || lh < franjaActiva.fin;
      });
      const olas = horasFranja.map((h) => h.waveHeight).filter((o): o is number => o != null);
      const mediaOla = olas.length > 0 ? olas.reduce((a, c) => a + c, 0) / olas.length : 0;
      const resShoaling = calcularShoaling(
        mediaOla, PROFUNDIDAD_PROFUNDA_DEFECTO,
        spot.profundidad ?? PROFUNDIDAD_SOMERA_DEFECTO
      );
      olaCorregida = resShoaling.alturaCorregida;
    }
    const resAcceso = calcularVeredictoAcceso(spot.tipoAcceso, olaCorregida);
    colorSalida = veredictoAccesoAColor(resAcceso);
    textoSalida = t(veredictoAccesoAClaveI18n(resAcceso));
  }

  const subpestanasVisibles = ALL_TABS.filter((tab) => {
    if (tab === 'waves' || tab === 'wind') return true;
    return !ajustes.subpestanasOcultas.includes(tab);
  });

  // Filtro de horas según franja activa.
  const horasFiltradas = useMemo(() => {
    if (!weather?.hourly) return [];
    return filtrarPorFranja(weather.hourly, franjaActiva, ajustes.filtroFranja);
  }, [weather, franjaActiva, ajustes.filtroFranja]);

  const handleCopyCoords = async () => {
    try {
      await navigator.clipboard.writeText(
        `${spot.lat.toFixed(6)}, ${spot.lon.toFixed(6)}`
      );
      setCoordsCopiedFeedback(true);
      setTimeout(() => setCoordsCopiedFeedback(false), 1500);
    } catch { /* ignore */ }
  };

  const handleStartEditName = () => {
    setNameDraft(spot.name);
    setEditingName(true);
  };

  const handleSaveName = () => {
    const trimmed = nameDraft.trim() || t('common.unnamed');
    updateSpot(spot.id, { name: trimmed });
    setEditingName(false);
  };

  const factorKeyMap: Record<keyof Umbral, string> = {
    viento: 'windSpeed', ola: 'waveHeight', periodo: 'wavePeriod',
    corriente: 'current', marea: 'seaLevel',
  };

  const subVeredictoWaves = (h: HourlyPoint): Veredicto | null => {
    if (h.waveHeight == null) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      ajustes.categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: h.waveHeight, periodo: h.wavePeriod ?? 0, corriente: 0, marea: 0 }
    ).veredictoPorFactor.ola;
  };

  const subVeredictoWind = (h: HourlyPoint): Veredicto | null => {
    if (h.windSpeed == null) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      ajustes.categoriaKayak, ajustes.perfil, franjaDia,
      { viento: Math.round(Math.pow(h.windSpeed / 0.836, 2 / 3)), ola: 0, periodo: 0, corriente: 0, marea: 0 }
    ).veredictoPorFactor.viento;
  };

  const subVeredictoCurrent = (h: HourlyPoint): Veredicto | null => {
    if (h.currentVelocity == null) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      ajustes.categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: 0, periodo: 0, corriente: h.currentVelocity, marea: 0 }
    ).veredictoPorFactor.corriente;
  };

  const colorNivel = ajustes.colorTabla;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'var(--bg)',
        color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif',
        zIndex: 100, display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}
    >
      <header
        style={{
          position: 'sticky', top: 0, backgroundColor: 'var(--bg)',
          borderBottom: '1px solid var(--border)', zIndex: 10,
          padding: '10px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '5px 10px', backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 6,
              color: 'var(--text)', fontSize: '0.8rem',
              fontWeight: 500, cursor: 'pointer',
            }}
          >
            ← {t('common.back')}
          </button>

          {editingName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, margin: '0 8px' }}>
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                style={{
                  flex: 1, padding: '4px 8px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--accent)', borderRadius: 4,
                  color: 'var(--text)', fontSize: '0.9rem',
                }}
              />
              <button
                onClick={handleSaveName}
                style={{
                  padding: '4px 8px', borderRadius: 4,
                  border: '1px solid var(--accent)', backgroundColor: 'transparent',
                  color: 'var(--accent)', fontSize: '0.75rem', cursor: 'pointer',
                }}
              >
                ✓
              </button>
              <button
                onClick={() => setEditingName(false)}
                style={{
                  padding: '4px 8px', borderRadius: 4,
                  border: '1px solid var(--border)', backgroundColor: 'transparent',
                  color: 'var(--text-dim)', fontSize: '0.75rem', cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center', margin: '0 8px' }}>
              <h1
                style={{
                  margin: 0, fontSize: '1rem', fontWeight: 600,
                  textAlign: 'center', color: 'var(--text)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {spot.name || t('common.unnamed')}
              </h1>
              <button
                onClick={handleStartEditName}
                title={t('detalle.editName')}
                style={{
                  border: 'none', background: 'transparent',
                  color: 'var(--text-dim)', cursor: 'pointer',
                  fontSize: '0.85rem', padding: '2px 4px',
                }}
              >
                ✎
              </button>
            </div>
          )}

          <div style={{ width: '60px' }} />
        </div>

        {/* Coordenadas + profundidad */}
        <div
          onClick={handleCopyCoords}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px',
            fontFamily: 'var(--font-mono, Fira Code, monospace)',
            fontSize: '0.7rem', color: 'var(--text-dim)',
            marginBottom: '6px', cursor: 'pointer',
          }}
        >
          <span>{formatearCoords(spot.lat, spot.lon, ajustes.formatoCoords)}</span>
          <span>•</span>
          <span>{spot.profundidad != null ? `${spot.profundidad} m` : t('detalle.noDepth')}</span>
          <span style={{
            color: coordsCopiedFeedback ? 'var(--accent)' : 'var(--text-dim)',
            fontSize: '0.65rem',
            fontWeight: coordsCopiedFeedback ? 600 : 400,
          }}>
            {coordsCopiedFeedback ? `✓ ${t('detalle.coordsCopied')}` : `📋`}
          </span>
        </div>

        {/* Franjas clicables (activan filtro) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
          {ajustes.franjas.map((franja) => {
            const v = veredictos[franja.id];
            const color = v ? veredictoAColor(v) : 'var(--text-dim)';
            const activa = ajustes.franjaActivaId === franja.id;
            return (
              <button
                key={franja.id}
                onClick={() => setFranjaActiva(activa ? null : franja.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 10px', borderRadius: 6,
                  backgroundColor: activa ? 'var(--surface)' : 'transparent',
                  border: `1px solid ${activa ? color : 'var(--border)'}`,
                  fontSize: '0.72rem', cursor: 'pointer',
                  color: activa ? color : 'var(--text-dim)',
                  fontWeight: activa ? 700 : 400,
                }}
              >
                <span>{franja.nombre}</span>
                {v && <span style={{ color, fontWeight: 600, opacity: 0.9 }}>•</span>}
              </button>
            );
          })}
          {ajustes.filtroFranja && (
            <button
              onClick={() => setFranjaActiva(null)}
              style={{
                padding: '4px 10px', borderRadius: 6,
                border: '1px solid var(--border)', backgroundColor: 'transparent',
                color: 'var(--text-dim)', fontSize: '0.72rem', cursor: 'pointer',
              }}
            >
              {t('common.all')}
            </button>
          )}
        </div>

        {/* Factor disparador */}
        {(veredictoFranjaActiva === 'EXIGENTE' || veredictoFranjaActiva === 'DESACONSEJADO')
          && detalleFranjaActiva?.factorDisparador && (
            <div
              style={{
                backgroundColor: 'var(--surface)', borderRadius: 6,
                border: '1px solid var(--border)',
                padding: '6px 10px', marginBottom: '6px',
                fontSize: '0.78rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <strong style={{ color: 'var(--verdict-exigente)' }}>
                    {t('verdict.triggeringFactor')}:{' '}
                  </strong>
                  {t(`factors.${factorKeyMap[detalleFranjaActiva.factorDisparador]}`)}
                </span>
                <button
                  onClick={() => setExpandFactors(!expandFactors)}
                  style={{
                    border: 'none', background: 'transparent',
                    color: 'var(--accent)', fontSize: '0.72rem',
                    cursor: 'pointer', textDecoration: 'underline',
                  }}
                >
                  {t('verdict.seeAllFactors')} {expandFactors ? '▲' : '▼'}
                </button>
              </div>
              {expandFactors && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '6px', marginTop: '8px', paddingTop: '8px',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  {(['viento', 'ola', 'periodo', 'corriente', 'marea'] as const).map((f) => {
                    const vf = detalleFranjaActiva?.veredictoPorFactor[f];
                    const col = vf ? veredictoAColor(vf) : 'var(--text-dim)';
                    const lab = vf ? t(veredictoAClaveI18n(vf)) : t('home.card.noData');
                    return (
                      <div
                        key={f}
                        style={{
                          backgroundColor: 'var(--bg)', borderRadius: 4,
                          padding: '4px 6px', border: `1px solid ${col}`,
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                          {t(`factors.${factorKeyMap[f]}`)}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: col }}>
                          {lab}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        {/* Aviso de stale */}
        {stale && (
          <div
            style={{
              padding: '6px 10px', marginBottom: '6px',
              borderRadius: 6,
              border: '1px solid var(--verdict-aceptable)',
              backgroundColor: 'rgba(229, 229, 0, 0.1)',
              color: 'var(--verdict-aceptable)',
              fontSize: '0.75rem', textAlign: 'center',
            }}
          >
            {t('home.card.staleWarning', { min: ageMin })}
          </div>
        )}

        {loading && (
          <div style={{
            padding: '6px 10px', marginBottom: '6px',
            color: 'var(--accent)', fontSize: '0.75rem', textAlign: 'center',
          }}>
            {t('common.loading')}
          </div>
        )}

        {/* Umbral aplicado */}
        <div
          style={{
            fontSize: '0.68rem', color: 'var(--text-dim)',
            textAlign: 'center', marginBottom: '4px',
          }}
        >
          {t('verdict.appliedThreshold', {
            category: ajustes.categoriaKayak,
            zone: t(`zones.${spot.zona ?? 'mediterraneo_espanol'}`),
          })}
        </div>

        {/* Salida */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', fontSize: '0.75rem',
        }}>
          {spot.tipoAcceso != null ? (
            <>
              <span style={{ color: 'var(--text-dim)' }}>{t('verdict.launch.title')}:</span>
              <span
                style={{
                  padding: '2px 8px', borderRadius: 4,
                  backgroundColor: 'var(--surface)',
                  border: `1px solid ${colorSalida}`,
                  color: colorSalida, fontWeight: 600, fontSize: '0.72rem',
                }}
              >
                {textoSalida}
              </span>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--text-dim)' }}>{t('access.none')}</span>
              <button
                type="button"
                onClick={() => onAddAccess && onAddAccess(spot.id)}
                style={{
                  padding: '2px 8px', borderRadius: 4,
                  border: '1px solid var(--accent)', backgroundColor: 'transparent',
                  color: 'var(--accent)', fontSize: '0.72rem',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                + {t('access.add')}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Subpestañas */}
      <nav
        style={{
          display: 'flex', overflowX: 'auto',
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          scrollbarWidth: 'none', flexShrink: 0,
        }}
      >
        {subpestanasVisibles.map((tab) => {
          const active = tabActiva === tab;
          return (
            <button
              key={tab}
              onClick={() => setTabActiva(tab)}
              style={{
                flex: '0 0 auto', padding: '8px 14px', border: 'none',
                borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                backgroundColor: active ? 'var(--surface)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text)',
                fontSize: '0.82rem', fontWeight: active ? 600 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {t(`tabs.${tab}`)}
            </button>
          );
        })}
      </nav>

      <main
        style={{
          flex: 1, padding: '14px', maxWidth: '900px',
          width: '100%', margin: '0 auto', boxSizing: 'border-box',
        }}
      >
        {!weather && !loading && (
          <div style={{ color: 'var(--text-dim)', padding: '30px 0', textAlign: 'center' }}>
            {t('home.card.noData')}
          </div>
        )}

        {/* ─── OLEAJE ─── */}
        {tabActiva === 'waves' && weather && (
          <div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                fontSize: '2rem', fontWeight: 700,
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
                color: 'var(--accent)',
              }}>
                {horasFiltradas.find((h) => h.waveHeight != null)?.waveHeight?.toFixed(1) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: '6px', color: 'var(--text-dim)' }}>m</span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                { key: 'wt', label: t('factors.waveHeightTotal'),
                  render: (h) => h.waveHeight != null ? `${h.waveHeight.toFixed(2)} m` : '—',
                  veredicto: subVeredictoWaves },
                { key: 'ww', label: t('factors.waveHeightWind'),
                  render: (h) => h.windWaveHeight != null ? `${h.windWaveHeight.toFixed(2)} m` : '—' },
                { key: 'ws', label: t('factors.waveHeightSwell'),
                  render: (h) => h.swellWaveHeight != null ? `${h.swellWaveHeight.toFixed(2)} m` : '—' },
                { key: 'wp', label: t('factors.wavePeriod'),
                  render: (h) => h.wavePeriod != null ? `${h.wavePeriod.toFixed(0)} s` : '—' },
                { key: 'wd', label: t('factors.waveDirection'),
                  render: (h) => {
                    const nv = nombreViento(h.waveDirection, spot.zona ?? 'mediterraneo_espanol', lang);
                    return nv.grados != null ? `${nv.cardinal} ${Math.round(nv.grados)}°` : '—';
                  } },
                { key: 'wwd', label: t('factors.windDirection'),
                  render: (h) => {
                    const nv = nombreViento(h.windWaveDirection, spot.zona ?? 'mediterraneo_espanol', lang);
                    return nv.grados != null ? `${nv.cardinal} ${Math.round(nv.grados)}°` : '—';
                  } },
              ]}
            />
          </div>
        )}

        {/* ─── VIENTO ─── */}
        {tabActiva === 'wind' && weather && (
          <div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                fontSize: '2rem', fontWeight: 700,
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
                color: 'var(--accent-2)',
              }}>
                {msAKn(horasFiltradas.find((h) => h.windSpeed != null)?.windSpeed ?? null) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: '6px', color: 'var(--text-dim)' }}>kt</span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                { key: 'wd', label: t('factors.windDirection'),
                  render: (h) => {
                    const nv = nombreViento(h.windDirection, spot.zona ?? 'mediterraneo_espanol', lang);
                    return nv.grados != null ? `${nv.nombre} (${nv.cardinal})` : '—';
                  },
                  veredicto: subVeredictoWind },
                { key: 'wk', label: t('factors.windSpeedKn'),
                  render: (h) => { const v = msAKn(h.windSpeed); return v != null ? `${v}` : '—'; } },
                { key: 'wkh', label: t('factors.windSpeedKmh'),
                  render: (h) => { const v = msAKmh(h.windSpeed); return v != null ? `${v}` : '—'; } },
                { key: 'gk', label: t('factors.windGustsKn'),
                  render: (h) => { const v = msAKn(h.windGusts); return v != null ? `${v}` : '—'; } },
                { key: 'gkh', label: t('factors.windGustsKmh'),
                  render: (h) => { const v = msAKmh(h.windGusts); return v != null ? `${v}` : '—'; } },
              ]}
            />
          </div>
        )}

        {/* ─── TIEMPO ─── */}
        {tabActiva === 'weather' && weather && (
          <div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                fontSize: '2rem', fontWeight: 700,
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
                color: '#f59e0b',
              }}>
                {horasFiltradas.find((h) => h.temperature != null)?.temperature?.toFixed(1) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: '6px', color: 'var(--text-dim)' }}>°C</span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                { key: 'ico', label: t('factors.weatherCode'),
                  render: (h) => {
                    const isNight = new Date(h.time).getHours() < 7 || new Date(h.time).getHours() >= 20;
                    return <span style={{ fontSize: '1.1rem' }}>{weatherCodeAIcono(h.weatherCode, isNight)}</span>;
                  } },
                { key: 'cc', label: t('factors.cloudCover'),
                  render: (h) => h.cloudCover != null ? `${Math.round(h.cloudCover)}%` : '—' },
                { key: 'pr', label: t('factors.precipitation'),
                  render: (h) => h.precipitation != null ? `${h.precipitation.toFixed(1)} mm` : '—' },
                { key: 'prp', label: t('factors.precipitationProbability'),
                  render: (h) => h.precipitationProbability != null ? `${Math.round(h.precipitationProbability)}%` : '—' },
                { key: 'tmp', label: t('factors.temperature'),
                  render: (h) => h.temperature != null ? `${h.temperature.toFixed(1)}°` : '—' },
                { key: 'vis', label: t('factors.visibility'),
                  render: (h) => h.visibility != null ? `${Math.round(h.visibility / 1000)} km` : '—' },
              ]}
            />
          </div>
        )}

        {/* ─── TEMPERATURAS ─── */}
        {tabActiva === 'air' && weather && (
          <div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                { key: 't', label: t('factors.temperature'),
                  render: (h) => h.temperature != null ? `${h.temperature.toFixed(1)}°` : '—' },
                { key: 'at', label: t('factors.apparentTemperature'),
                  render: (h) => h.apparentTemperature != null ? `${h.apparentTemperature.toFixed(1)}°` : '—' },
                { key: 'sst', label: t('factors.seaTemperature'),
                  render: (h) => h.seaSurfaceTemperature != null ? `${h.seaSurfaceTemperature.toFixed(1)}°` : '—' },
                { key: 't10', label: t('factors.seaTemperature10m'),
                  render: () => '—' },
                { key: 'tb', label: t('factors.seaTemperatureBottom'),
                  render: () => '—' },
              ]}
            />
          </div>
        )}

        {/* ─── BARÓMETRO ─── */}
        {tabActiva === 'barometer' && weather && (
          <div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                fontSize: '2rem', fontWeight: 700,
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
                color: '#a855f7',
              }}>
                {horasFiltradas.find((h) => h.pressure != null)?.pressure?.toFixed(0) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: '6px', color: 'var(--text-dim)' }}>hPa</span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                { key: 'p', label: t('factors.pressure'),
                  render: (h) => h.pressure != null ? `${h.pressure.toFixed(0)}` : '—' },
                { key: 'tr', label: t('factors.pressureTrend'),
                  render: (h) => {
                    const idx = horasFiltradas.indexOf(h);
                    if (idx < 3) return '—';
                    const prev = horasFiltradas[idx - 3].pressure;
                    if (prev == null || h.pressure == null) return '—';
                    const d = h.pressure - prev;
                    if (d > 1) return '↑';
                    if (d < -1) return '↓';
                    return '→';
                  } },
              ]}
            />
          </div>
        )}

        {/* ─── CORRIENTE ─── */}
        {tabActiva === 'activity' && weather && (
          <div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                fontSize: '2rem', fontWeight: 700,
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
                color: '#06b6d4',
              }}>
                {horasFiltradas.find((h) => h.currentVelocity != null)?.currentVelocity?.toFixed(2) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: '6px', color: 'var(--text-dim)' }}>kn</span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                { key: 'cv', label: t('factors.currentKn'),
                  render: (h) => h.currentVelocity != null ? `${h.currentVelocity.toFixed(2)}` : '—',
                  veredicto: subVeredictoCurrent },
                { key: 'ckh', label: t('factors.currentKmh'),
                  render: (h) => h.currentVelocity != null ? `${(h.currentVelocity * 1.852).toFixed(1)}` : '—' },
                { key: 'cd', label: t('factors.currentDirection'),
                  render: (h) => {
                    const nv = nombreViento(h.currentDirection, spot.zona ?? 'mediterraneo_espanol', lang);
                    return nv.grados != null ? `${nv.cardinal} ${Math.round(nv.grados)}°` : '—';
                  } },
              ]}
            />
          </div>
        )}

        {/* ─── SOL (30 días) ─── */}
        {tabActiva === 'sun' && (
          <div>
            <TablaSol lang={lang} lat={spot.lat} lon={spot.lon} />
          </div>
        )}

        {/* ─── LUNA (30 días) ─── */}
        {tabActiva === 'moon' && (
          <div>
            <TablaLuna lang={lang} lat={spot.lat} lon={spot.lon} />
          </div>
        )}

        {/* ─── MAREAS (7 días) ─── */}
        {tabActiva === 'tides' && weather && (
          <div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                fontSize: '2rem', fontWeight: 700,
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
                color: '#38bdf8',
              }}>
                {horasFiltradas.find((h) => h.seaLevelHeight != null)?.seaLevelHeight?.toFixed(2) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: '6px', color: 'var(--text-dim)' }}>m</span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                { key: 'sl', label: t('factors.seaLevel'),
                  render: (h) => h.seaLevelHeight != null ? `${h.seaLevelHeight.toFixed(2)} m` : '—' },
                { key: 'tr', label: t('factors.seaLevelTrend'),
                  render: (h) => {
                    const idx = horasFiltradas.indexOf(h);
                    if (idx === 0) return '—';
                    const prev = horasFiltradas[idx - 1].seaLevelHeight;
                    if (prev == null || h.seaLevelHeight == null) return '—';
                    const d = h.seaLevelHeight - prev;
                    if (d > 0.02) return '↑';
                    if (d < -0.02) return '↓';
                    return '→';
                  } },
              ]}
            />
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Tabla de Sol (30 días) ──────────────────────────────────────

const TablaSol: React.FC<{ lang: string; lat: number; lon: number }> = ({ lang, lat, lon }) => {
  const { t } = useTranslation();
  const filas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const out: Array<{
      key: string; fecha: Date; sol: ReturnType<typeof calcularSol>;
    }> = [];
    for (let i = 0; i < 30; i++) {
      const f = new Date(hoy);
      f.setDate(f.getDate() + i);
      out.push({ key: localDateKey(f), fecha: f, sol: calcularSol(f, lat, lon) });
    }
    return out;
  }, [lat, lon]);

  const fmt = (d: Date | null | undefined) => {
    if (!d) return '—';
    return d.toLocaleTimeString(lang === 'en' ? 'en-GB' : 'es-ES', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', fontSize: '0.72rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(64px, auto) repeat(6, 1fr)',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        <div style={{ padding: '6px 6px' }}>Fecha</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Orto</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Mediodía</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Ocaso</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Crep. astr.</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Crep. naut.</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Crep. civil</div>
      </div>
      {filas.map(({ key, fecha, sol }, i) => (
        <div
          key={key}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(64px, auto) repeat(6, 1fr)',
            borderTop: i > 0 ? '1px solid var(--border)' : 'none',
          }}
        >
          <div style={{
            padding: '5px 6px', fontFamily: 'var(--font-mono, Fira Code, monospace)',
            color: 'var(--text-dim)', fontWeight: 500,
          }}>
            {fechaLarga(fecha, lang)}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>
            {fmt(sol?.orto)}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>
            {fmt(sol?.mediodiaSolar)}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>
            {fmt(sol?.ocaso)}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)', fontSize: '0.68rem' }}>
            {sol ? `${fmt(sol.crepusculoAstronomicoInicio)}–${fmt(sol.crepusculoAstronomicoFin)}` : '—'}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)', fontSize: '0.68rem' }}>
            {sol ? `${fmt(sol.crepusculoNauticoInicio)}–${fmt(sol.crepusculoNauticoFin)}` : '—'}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)', fontSize: '0.68rem' }}>
            {sol ? `${fmt(sol.crepusculoCivilInicio)}–${fmt(sol.crepusculoCivilFin)}` : '—'}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Tabla de Luna (30 días) ─────────────────────────────────────

const TablaLuna: React.FC<{ lang: string; lat: number; lon: number }> = ({ lang, lat, lon }) => {
  const filas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const out: Array<{
      key: string; fecha: Date; luna: ReturnType<typeof calcularLuna>;
    }> = [];
    for (let i = 0; i < 30; i++) {
      const f = new Date(hoy);
      f.setDate(f.getDate() + i);
      // Nos interesa el cálculo a las 12:00 del día para tener un
      // valor representativo del día.
      const fMediodia = new Date(f);
      fMediodia.setHours(12, 0, 0, 0);
      out.push({ key: localDateKey(f), fecha: f, luna: calcularLuna(fMediodia, lat, lon) });
    }
    return out;
  }, [lat, lon]);

  const fmt = (d: Date | null) => {
    if (!d) return '—';
    return d.toLocaleTimeString(lang === 'en' ? 'en-GB' : 'es-ES', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', fontSize: '0.72rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(64px, auto) 1fr 0.7fr 0.7fr 0.9fr 0.9fr 0.9fr',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        <div style={{ padding: '6px 6px' }}>Fecha</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Fase</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Edad</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Ilum.</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Orto</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Tránsito</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>Ocaso</div>
      </div>
      {filas.map(({ key, fecha, luna }, i) => (
        <div
          key={key}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(64px, auto) 1fr 0.7fr 0.7fr 0.9fr 0.9fr 0.9fr',
            borderTop: i > 0 ? '1px solid var(--border)' : 'none',
          }}
        >
          <div style={{
            padding: '5px 6px', fontFamily: 'var(--font-mono, Fira Code, monospace)',
            color: 'var(--text-dim)', fontWeight: 500,
          }}>
            {fechaLarga(fecha, lang)}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontSize: '0.7rem' }}>
            {emojiFase(luna.fase)} {nombreFase(luna.fase, lang === 'en' ? 'en' : 'es')}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>
            {luna.edad.toFixed(1)}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>
            {Math.round(luna.iluminacion * 100)}%
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>
            {fmt(luna.ortoLunar)}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>
            {fmt(luna.transitoLunar)}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>
            {fmt(luna.ocasoLunar)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpotScreen;