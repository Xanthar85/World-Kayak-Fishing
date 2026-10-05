import React, { useState } from 'react';
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
  type Condiciones,
  type ResultadoVeredicto,
  type Umbral,
} from '../lib/verdict.ts';
import {
  calcularShoaling,
  PROFUNDIDAD_PROFUNDA_DEFECTO,
  PROFUNDIDAD_SOMERA_DEFECTO,
} from '../lib/shoaling.ts';
import { calcularSol } from '../lib/sun.ts';
import { calcularLuna, type FaseLunar } from '../lib/moon.ts';

export interface SpotScreenProps {
  spotId: string;
  onClose: () => void;
  onAddAccess?: (spotId: string) => void;
}

type TabId =
  | 'waves'
  | 'wind'
  | 'weather'
  | 'air'
  | 'barometer'
  | 'activity'
  | 'sun'
  | 'moon'
  | 'tides';

const ALL_TABS: TabId[] = [
  'waves',
  'wind',
  'weather',
  'air',
  'barometer',
  'activity',
  'sun',
  'moon',
  'tides',
];

// Helper para nombres de fase lunar en español
// TODO i18n: agregar claves traducidas para fase lunar cuando se definan
const NOMBRES_FASE_LUNAR: Record<FaseLunar, string> = {
  nueva: 'Luna nueva',
  creciente: 'Creciente',
  cuarto_creciente: 'Cuarto creciente',
  gibosa_creciente: 'Gibosa creciente',
  llena: 'Luna llena',
  gibosa_menguante: 'Gibosa menguante',
  cuarto_menguante: 'Cuarto menguante',
  menguante: 'Menguante',
};

// Helper MiniChart: genera polyline SVG viewBox="0 0 100 30"
const MiniChart: React.FC<{ valores: (number | null)[]; color: string }> = ({
  valores,
  color,
}) => {
  const validos = valores.filter((v): v is number => v !== null && !isNaN(v));
  if (validos.length < 2) return null;

  const min = Math.min(...validos);
  const max = Math.max(...validos);
  const diff = max - min === 0 ? 1 : max - min;
  const N = valores.length;

  const points: string[] = [];
  for (let i = 0; i < N; i++) {
    const val = valores[i];
    if (val === null || isNaN(val)) continue;
    const x = (i / (N - 1)) * 100;
    // Invertir Y (0 arriba, 30 abajo): rango útil 2 a 28
    const y = 28 - ((val - min) / diff) * 26;
    const prefix = points.length === 0 ? 'M' : 'L';
    points.push(`${prefix} ${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <div
      style={{
        width: '100%',
        height: '34px',
        backgroundColor: 'var(--surface)',
        borderRadius: 6,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        marginTop: '12px',
        marginBottom: '16px',
      }}
    >
      <svg
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path
          d={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const SpotScreen: React.FC<SpotScreenProps> = ({
  spotId,
  onClose,
  onAddAccess,
}) => {
  const { t, i18n } = useTranslation();

  // Store
  const spots = useAppStore((s) => s.spots);
  const getFreshWeather = useAppStore((s) => s.getFreshWeather);
  const ajustes = useAppStore((s) => s.ajustes);

  const spot = spots.find((s) => s.id === spotId);

  // Estados locales
  const [tabActiva, setTabActiva] = useState<TabId>('waves');
  const [coordsCopiedFeedback, setCoordsCopiedFeedback] = useState(false);
  const [expandFactors, setExpandFactors] = useState(false);

  if (!spot) {
    onClose();
    return null;
  }

  const weather = getFreshWeather(spot.id);

  // Veredictos por franja para fila 3
  const veredictos = calcularVeredictoPorFranja(
    spot,
    weather,
    ajustes.franjas,
    ajustes.categoriaKayak,
    ajustes.perfil
  );

  // Franja activa
  const franjaActiva =
    ajustes.franjas.find((f) => f.id === ajustes.franjaActivaId) ??
    ajustes.franjas[0];

  const veredictoFranjaActiva = franjaActiva
    ? veredictos[franjaActiva.id]
    : null;

  // Cálculo detallado para la franja activa (obtener peor factor disparador)
  let detalleFranjaActiva: ResultadoVeredicto | null = null;
  if (weather && weather.hourly.length > 0 && franjaActiva) {
    const inicio = franjaActiva.inicio;
    const franjaDia: FranjaDia =
      inicio >= 0 && inicio < 12
        ? 'manana'
        : inicio >= 12 && inicio < 20
        ? 'tarde'
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
        ajustes.categoriaKayak,
        ajustes.perfil,
        franjaDia,
        {
          viento: bf,
          ola: h.waveHeight,
          periodo: h.wavePeriod ?? 0,
          corriente: 0,
          marea: 0,
        }
      );

      const score = orden.indexOf(res.veredicto);
      if (score > peorScore) {
        peorScore = score;
        detalleFranjaActiva = res;
      }
    }
  }

  // Aviso de salida / entrada (Fila 6)
  let veredictoSalida: string | null = null;
  let colorSalida = 'var(--text-dim)';
  let textoSalida = '';

  if (spot.tipoAcceso != null) {
    let olaCorregida = 0;
    if (weather && weather.hourly.length > 0 && franjaActiva) {
      const horasFranja = weather.hourly.filter((h) => {
        const localHour = new Date(h.time).getHours();
        if (franjaActiva.inicio < franjaActiva.fin) {
          return localHour >= franjaActiva.inicio && localHour < franjaActiva.fin;
        }
        return localHour >= franjaActiva.inicio || localHour < franjaActiva.fin;
      });

      const olas = horasFranja
        .map((h) => h.waveHeight)
        .filter((o): o is number => o != null);

      const mediaOla =
        olas.length > 0
          ? olas.reduce((acc, curr) => acc + curr, 0) / olas.length
          : 0;

      const resShoaling = calcularShoaling(
        mediaOla,
        PROFUNDIDAD_PROFUNDA_DEFECTO,
        spot.profundidad ?? PROFUNDIDAD_SOMERA_DEFECTO
      );
      olaCorregida = resShoaling.alturaCorregida;
    }

    const resAcceso = calcularVeredictoAcceso(spot.tipoAcceso, olaCorregida);
    veredictoSalida = resAcceso;
    colorSalida = veredictoAccesoAColor(resAcceso);
    textoSalida = t(veredictoAccesoAClaveI18n(resAcceso));
  }

  // Filtrar subpestañas visibles
  const subpestanasVisibles = ALL_TABS.filter((tab) => {
    if (tab === 'waves' || tab === 'wind') return true;
    return !ajustes.subpestanasOcultas.includes(tab);
  });

  // Próximas 24 horas a partir de ahora
  const nowTs = Date.now();
  let proximas24 = weather?.hourly
    ? weather.hourly.filter((h) => new Date(h.time).getTime() >= nowTs - 3600000)
    : [];
  if (proximas24.length === 0 && weather?.hourly) {
    proximas24 = weather.hourly.slice(0, 24);
  } else {
    proximas24 = proximas24.slice(0, 24);
  }

  // Copia de coordenadas al portapapeles
  const handleCopyCoords = async () => {
    try {
      const texto = `${spot.lat.toFixed(6)}, ${spot.lon.toFixed(6)}`;
      await navigator.clipboard.writeText(texto);
      setCoordsCopiedFeedback(true);
      setTimeout(() => setCoordsCopiedFeedback(false), 1500);
    } catch {
      // Ignorar fallo de portapapeles
    }
  };

  // Formato de hora de tabla
  const formatearHora = (iso: string) => {
    return new Date(iso).toLocaleTimeString(i18n.language || 'es', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Mapeo factor disparador -> factor string key
  const factorKeyMap: Record<keyof Umbral, string> = {
    viento: 'windSpeed',
    ola: 'waveHeight',
    periodo: 'wavePeriod',
    corriente: 'current',
    marea: 'seaLevel',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'Inter, system-ui, sans-serif',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* ─── CABECERA FIJA ─────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          zIndex: 10,
          padding: '12px 16px',
        }}
      >
        {/* Fila 1: Botón Volver + Nombre + Balance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            ← {t('common.back')}
          </button>

          <h1
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: 600,
              textAlign: 'center',
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '60%',
            }}
          >
            {spot.name || t('common.unnamed')}
          </h1>

          <div style={{ width: '60px' }} />
        </div>

        {/* Fila 2: Coords + Profundidad + Copiar */}
        <div
          onClick={handleCopyCoords}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontFamily: 'var(--font-mono, Fira Code, monospace)',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            marginBottom: '8px',
            cursor: 'pointer',
          }}
        >
          <span>
            {formatearCoords(spot.lat, spot.lon, ajustes.formatoCoords)}
          </span>
          <span>•</span>
          <span>
            {spot.profundidad != null
              ? `${spot.profundidad} m`
              : t('detalle.noDepth')}
          </span>
          <span
            style={{
              color: coordsCopiedFeedback ? 'var(--accent)' : 'var(--text-dim)',
              fontSize: '0.7rem',
              fontWeight: coordsCopiedFeedback ? 600 : 400,
              transition: 'color 0.2s',
            }}
          >
            {coordsCopiedFeedback
              ? `✓ ${t('detalle.coordsCopied')}`
              : `📋 ${t('detalle.copyCoords')}`}
          </span>
        </div>

        {/* Fila 3: Chips de veredicto por franja */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}
        >
          {ajustes.franjas.map((franja) => {
            const v = veredictos[franja.id];
            const color = v ? veredictoAColor(v) : 'var(--text-dim)';
            const texto = v ? t(veredictoAClaveI18n(v)) : t('home.card.noData');

            return (
              <div
                key={franja.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: 6,
                  backgroundColor: 'var(--surface)',
                  border: `1px solid ${color}`,
                  fontSize: '0.75rem',
                }}
              >
                <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>
                  {franja.nombre}:
                </span>
                <span style={{ color, fontWeight: 600 }}>{texto}</span>
              </div>
            );
          })}
        </div>

        {/* Fila 4: Factor disparador (si Exigente o Desaconsejado) */}
        {(veredictoFranjaActiva === 'EXIGENTE' ||
          veredictoFranjaActiva === 'DESACONSEJADO') &&
          detalleFranjaActiva?.factorDisparador && (
            <div
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 6,
                border: '1px solid var(--border)',
                padding: '6px 10px',
                marginBottom: '8px',
                fontSize: '0.8rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  <strong style={{ color: 'var(--verdict-exigente)' }}>
                    {t('verdict.triggeringFactor')}:{' '}
                  </strong>
                  {t(
                    `factors.${factorKeyMap[detalleFranjaActiva.factorDisparador]}`
                  )}
                </span>
                <button
                  onClick={() => setExpandFactors(!expandFactors)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--accent)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {t('verdict.seeAllFactors')} {expandFactors ? '▲' : '▼'}
                </button>
              </div>

              {/* Panel expandible de factores */}
              {expandFactors && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                    gap: '6px',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  {(
                    ['viento', 'ola', 'periodo', 'corriente', 'marea'] as const
                  ).map((f) => {
                    const vf = detalleFranjaActiva?.veredictoPorFactor[f];
                    const col = vf ? veredictoAColor(vf) : 'var(--text-dim)';
                    const lab = vf
                      ? t(veredictoAClaveI18n(vf))
                      : t('home.card.noData');

                    return (
                      <div
                        key={f}
                        style={{
                          backgroundColor: 'var(--bg)',
                          borderRadius: 4,
                          padding: '4px 6px',
                          border: `1px solid ${col}`,
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-dim)',
                          }}
                        >
                          {t(`factors.${factorKeyMap[f]}`)}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: col,
                          }}
                        >
                          {lab}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        {/* Fila 5: Umbral aplicado */}
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            textAlign: 'center',
            marginBottom: '6px',
          }}
        >
          {t('verdict.appliedThreshold', {
            category: ajustes.categoriaKayak,
            zone: t(`zones.${spot.zona ?? 'mediterraneo_espanol'}`),
          })}
        </div>

        {/* Fila 6: Bloque de aviso de salida */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.8rem',
          }}
        >
          {spot.tipoAcceso != null ? (
            <>
              <span style={{ color: 'var(--text-dim)' }}>
                {t('verdict.launch.title')}:
              </span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 4,
                  backgroundColor: 'var(--surface)',
                  border: `1px solid ${colorSalida}`,
                  color: colorSalida,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                {textoSalida}
              </span>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--text-dim)' }}>
                {t('access.none')}
              </span>
              <button
                type="button"
                onClick={() => onAddAccess && onAddAccess(spot.id)}
                title={t('access.add')}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: '1px solid var(--accent)',
                  backgroundColor: 'transparent',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                + {t('access.add')}
              </button>
            </>
          )}
        </div>
      </header>

      {/* ─── FILA DE SUBPESTAÑAS HORIZONTALES ──────────────────────── */}
      <nav
        style={{
          display: 'flex',
          overflowX: 'auto',
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}
      >
        {subpestanasVisibles.map((tab) => {
          const active = tabActiva === tab;
          return (
            <button
              key={tab}
              onClick={() => setTabActiva(tab)}
              style={{
                flex: '0 0 auto',
                padding: '10px 16px',
                border: 'none',
                borderBottom: active
                  ? '2px solid var(--accent)'
                  : '2px solid transparent',
                backgroundColor: active ? 'var(--surface)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text)',
                fontSize: '0.85rem',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t(`tabs.${tab}`)}
            </button>
          );
        })}
      </nav>

      {/* ─── CUERPO DE LA SUBPESTAÑA ACTIVA ─────────────────────────── */}
      <main
        style={{
          flex: 1,
          padding: '20px',
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Caso especial: Sol */}
        {tabActiva === 'sun' && (
          <div>
            {(() => {
              const sol = calcularSol(new Date(), spot.lat, spot.lon);
              if (!sol) {
                return (
                  <div style={{ color: 'var(--text-dim)' }}>
                    {t('home.card.noData')}
                  </div>
                );
              }
              const fmtH = (d: Date) =>
                d.toLocaleTimeString(i18n.language || 'es', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

              const items = [
                { label: 'Orto', val: fmtH(sol.orto) },
                { label: 'Ocaso', val: fmtH(sol.ocaso) },
                { label: 'Mediodía solar', val: fmtH(sol.mediodiaSolar) },
                {
                  label: 'Crepúsculo civil',
                  val: `${fmtH(sol.crepusculoCivilInicio)} - ${fmtH(sol.crepusculoCivilFin)}`,
                },
                {
                  label: 'Crepúsculo náutico',
                  val: `${fmtH(sol.crepusculoNauticoInicio)} - ${fmtH(sol.crepusculoNauticoFin)}`,
                },
                {
                  label: 'Crepúsculo astronómico',
                  val: `${fmtH(sol.crepusculoAstronomicoInicio)} - ${fmtH(sol.crepusculoAstronomicoFin)}`,
                },
              ];

              return (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {items.map(({ label, val }) => (
                    <div
                      key={label}
                      style={{
                        padding: '12px',
                        backgroundColor: 'var(--surface)',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-dim)',
                          marginBottom: '4px',
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono, Fira Code, monospace)',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--text)',
                        }}
                      >
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Caso especial: Luna */}
        {tabActiva === 'moon' && (
          <div>
            {(() => {
              const luna = calcularLuna(new Date());
              return (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--surface)',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-dim)',
                        marginBottom: '4px',
                      }}
                    >
                      Fase lunar
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                      {NOMBRES_FASE_LUNAR[luna.fase] || luna.fase}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--surface)',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-dim)',
                        marginBottom: '4px',
                      }}
                    >
                      Edad lunar
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono, Fira Code, monospace)',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      {luna.edad.toFixed(1)} días
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'var(--surface)',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-dim)',
                        marginBottom: '4px',
                      }}
                    >
                      Iluminación
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono, Fira Code, monospace)',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'var(--accent)',
                      }}
                    >
                      {Math.round(luna.iluminacion * 100)} %
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Pestañas dependientes de Weather (waves, wind, weather, air, barometer, activity, tides) */}
        {tabActiva !== 'sun' && tabActiva !== 'moon' && (
          <div>
            {!weather || proximas24.length === 0 ? (
              <div
                style={{
                  color: 'var(--text-dim)',
                  padding: '30px 0',
                  textAlign: 'center',
                }}
              >
                {t('home.card.noData')}
              </div>
            ) : (
              <div>
                {/* 1. Waves */}
                {tabActiva === 'waves' && (
                  <div>
                    {/* Número grande */}
                    <div style={{ marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono, Fira Code, monospace)',
                          color: 'var(--accent)',
                        }}
                      >
                        {proximas24.find((h) => h.waveHeight != null)
                          ?.waveHeight?.toFixed(1) ?? '—'}
                      </span>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          marginLeft: '6px',
                          color: 'var(--text-dim)',
                        }}
                      >
                        m
                      </span>
                    </div>

                    {/* Gráfico */}
                    <MiniChart
                      valores={proximas24.map((h) => h.waveHeight)}
                      color="var(--accent)"
                    />

                    {/* Tabla por horas */}
                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Hora</th>
                            {proximas24.map((h) => (
                              <th key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {formatearHora(h.time)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.waveHeight')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.waveHeight != null ? `${h.waveHeight.toFixed(1)} m` : '—'}
                              </td>
                            ))}
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.wavePeriod')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.wavePeriod != null ? `${h.wavePeriod.toFixed(0)} s` : '—'}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.waveDirection')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.waveDirection != null ? `${h.waveDirection.toFixed(0)}°` : '—'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. Wind */}
                {tabActiva === 'wind' && (
                  <div>
                    {/* Número grande */}
                    <div style={{ marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono, Fira Code, monospace)',
                          color: 'var(--accent-2)',
                        }}
                      >
                        {proximas24.find((h) => h.windSpeed != null)
                          ?.windSpeed?.toFixed(1) ?? '—'}
                      </span>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          marginLeft: '6px',
                          color: 'var(--text-dim)',
                        }}
                      >
                        m/s
                      </span>
                    </div>

                    {/* Gráfico */}
                    <MiniChart
                      valores={proximas24.map((h) => h.windSpeed)}
                      color="var(--accent-2)"
                    />

                    {/* Tabla por horas */}
                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Hora</th>
                            {proximas24.map((h) => (
                              <th key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {formatearHora(h.time)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.windSpeed')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.windSpeed != null ? `${h.windSpeed.toFixed(1)}` : '—'}
                              </td>
                            ))}
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.windGusts')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.windGusts != null ? `${h.windGusts.toFixed(1)}` : '—'}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.windDirection')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.windDirection != null ? `${h.windDirection.toFixed(0)}°` : '—'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. Weather */}
                {tabActiva === 'weather' && (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono, Fira Code, monospace)',
                          color: '#f59e0b',
                        }}
                      >
                        {proximas24.find((h) => h.temperature != null)
                          ?.temperature?.toFixed(1) ?? '—'}
                      </span>
                      <span style={{ fontSize: '1.2rem', marginLeft: '6px', color: 'var(--text-dim)' }}>°C</span>
                    </div>

                    <MiniChart
                      valores={proximas24.map((h) => h.temperature)}
                      color="#f59e0b"
                    />

                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Hora</th>
                            {proximas24.map((h) => (
                              <th key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {formatearHora(h.time)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.temperature')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.temperature != null ? `${h.temperature.toFixed(1)}°` : '—'}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.precipitation')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.precipitation != null ? `${h.precipitation.toFixed(1)} mm` : '—'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Air */}
                {tabActiva === 'air' && (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono, Fira Code, monospace)',
                          color: '#38bdf8',
                        }}
                      >
                        {proximas24.find((h) => h.temperature != null)
                          ?.temperature?.toFixed(1) ?? '—'}
                      </span>
                      <span style={{ fontSize: '1.2rem', marginLeft: '6px', color: 'var(--text-dim)' }}>°C</span>
                    </div>

                    <MiniChart
                      valores={proximas24.map((h) => h.temperature)}
                      color="#38bdf8"
                    />

                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Hora</th>
                            {proximas24.map((h) => (
                              <th key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {formatearHora(h.time)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.temperature')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.temperature != null ? `${h.temperature.toFixed(1)}°` : '—'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. Barometer */}
                {tabActiva === 'barometer' && (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono, Fira Code, monospace)',
                          color: '#a855f7',
                        }}
                      >
                        {proximas24.find((h) => h.pressure != null)
                          ?.pressure?.toFixed(0) ?? '—'}
                      </span>
                      <span style={{ fontSize: '1.2rem', marginLeft: '6px', color: 'var(--text-dim)' }}>hPa</span>
                    </div>

                    <MiniChart
                      valores={proximas24.map((h) => h.pressure)}
                      color="#a855f7"
                    />

                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Hora</th>
                            {proximas24.map((h) => (
                              <th key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {formatearHora(h.time)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.pressure')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.pressure != null ? `${h.pressure.toFixed(0)}` : '—'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 6. Activity (Current) */}
                {tabActiva === 'activity' && (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono, Fira Code, monospace)',
                          color: '#06b6d4',
                        }}
                      >
                        {proximas24.find((h) => h.currentVelocity != null)
                          ?.currentVelocity?.toFixed(2) ?? '—'}
                      </span>
                      <span style={{ fontSize: '1.2rem', marginLeft: '6px', color: 'var(--text-dim)' }}>kn</span>
                    </div>

                    <MiniChart
                      valores={proximas24.map((h) => h.currentVelocity)}
                      color="#06b6d4"
                    />

                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Hora</th>
                            {proximas24.map((h) => (
                              <th key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {formatearHora(h.time)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.current')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.currentVelocity != null ? `${h.currentVelocity.toFixed(2)} kn` : '—'}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>Dirección</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.currentDirection != null ? `${h.currentDirection.toFixed(0)}°` : '—'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 7. Tides (Mareas) */}
                {tabActiva === 'tides' && (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono, Fira Code, monospace)',
                          color: '#38bdf8',
                        }}
                      >
                        {proximas24.find((h) => h.seaLevelHeight != null)
                          ?.seaLevelHeight?.toFixed(2) ?? '—'}
                      </span>
                      <span style={{ fontSize: '1.2rem', marginLeft: '6px', color: 'var(--text-dim)' }}>m</span>
                    </div>

                    <MiniChart
                      valores={proximas24.map((h) => h.seaLevelHeight)}
                      color="#38bdf8"
                    />

                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-dim)' }}>Hora</th>
                            {proximas24.map((h) => (
                              <th key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {formatearHora(h.time)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{t('factors.seaLevel')}</td>
                            {proximas24.map((h) => (
                              <td key={h.time} style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>
                                {h.seaLevelHeight != null ? `${h.seaLevelHeight.toFixed(2)} m` : '—'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SpotScreen;
