// src/screens/SpotScreen.tsx — completo
// v1.010:
//   - Bug 2: al clicar una franja se filtra la tabla por esa franja
//     y por el día (si aplica). Se guarda el día elegido.
//   - Bug 4: rachas en rojo neón cuando superan umbral.
//   - Bug 12: "Ver todos los factores" desaparece. Todos visibles.
//   - Bug 13: "Sin dato" indica profundidad no obtenida.
//   - Bug 18: colores de tabla = color del número (colorNumero),
//     sin recuadros.
//   - Bug 19: barómetro marca variación brusca en rojo neón.
//   - Bug 21: estructura de la hoja reordenada. Umbral aplicado
//     con letras del color del veredicto.
//   - Bug 21b: lenguaje cercano para factores. Sin copiar
//     umbrales del ejemplo.
//   - Bug 22: mareas marcan cambios inusuales con color de zona.
//   - Bug 24a: pestaña Actividad con columna Corriente (dir +
//     velocidad + indicador).
//   - Bug 24b: coeficiente de actividad de peces 0-10 por hora.
//   - Botón "Ver todos los factores" eliminado.
//   - Los factores se muestran siempre, en tarjetas.

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
import { calcularShoaling } from '../lib/shoaling.ts';
import { calcularSol } from '../lib/sun.ts';
import { calcularLuna, nombreFase, emojiFase } from '../lib/moon.ts';
import {
  fetchSpotWeather,
  msAKn,
  msAKmh,
  weatherCodeAIcono,
  type HourlyPoint,
} from '../lib/openmeteo.ts';
import { nombreViento } from '../lib/wind.ts';
import { colorNumero, type NivelColorTabla } from '../lib/verdict-color.ts';
import { calcularActividadPorHora, type ActividadHora } from '../lib/actividad.ts';
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

// Filtra las horas según la franja activa y el día elegido.
function filtrarHoras(
  horas: HourlyPoint[],
  franja: FranjaUsuario | null,
  filtroActivo: boolean,
  diaISO: string | null
): HourlyPoint[] {
  let out = horas;
  if (diaISO) {
    const key = localDateKey(new Date(diaISO));
    out = out.filter((h) => localDateKey(new Date(h.time)) === key);
  }
  if (filtroActivo && franja) {
    out = out.filter((h) => {
      const hora = new Date(h.time).getHours();
      if (franja.inicio < franja.fin) {
        return hora >= franja.inicio && hora < franja.fin;
      }
      return hora >= franja.inicio || hora < franja.fin;
    });
  }
  return out;
}

// ─── Tabla reutilizable ──────────────────────────────────────────

interface ColumnaTabla<T> {
  key: string;
  label: string;
  render: (h: T) => React.ReactNode;
  veredicto?: (h: T) => Veredicto | null;
}

function TablaDatos<T extends { time: string }>({
  horas,
  columnas,
  colorNivel,
  lang,
}: {
  horas: T[];
  columnas: ColumnaTabla<T>[];
  colorNivel: NivelColorTabla;
  lang: string;
}) {
  if (horas.length === 0) return null;

  return (
    <div
      style={{
        borderRadius: 8,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        fontSize: '0.72rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `minmax(54px, auto) repeat(${columnas.length}, 1fr)`,
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          fontSize: '0.68rem',
          color: 'var(--text-dim)',
          fontWeight: 700,
          textTransform: 'uppercase',
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

      {horas.map((h, i) => {
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
            }}
          >
            <div
              style={{
                padding: '5px 6px',
                textAlign: 'left',
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
                color: 'var(--text-dim)',
                fontWeight: 500,
              }}
            >
              {hora}
            </div>
            {columnas.map((c) => {
              const v = c.veredicto?.(h) ?? null;
              const color = colorNumero(v, colorNivel);
              return (
                <div
                  key={c.key}
                  style={{
                    padding: '5px 4px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono, Fira Code, monospace)',
                    color: color ?? 'var(--text)',
                    fontWeight: color ? 600 : 400,
                  }}
                >
                  {c.render(h)}
                </div>
              );
            })}
          </div>
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
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const fetchTriggeredRef = useRef(false);

  const weatherEntry = spot ? getWeatherEntry(spot.id) : null;
  const weather = weatherEntry?.data ?? null;
  const stale = weatherEntry?.stale ?? false;
  const ageMin = weatherEntry?.ageMin ?? 0;

  const lang = i18n.language?.startsWith('en') ? 'en' : 'es';

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

  // Detalle del veredicto de la franja activa.
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

  // Aviso de salida.
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
      const resShoaling = calcularShoaling(mediaOla);
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

  const horasFiltradas = useMemo(() => {
    if (!weather?.hourly) return [];
    return filtrarHoras(weather.hourly, franjaActiva, ajustes.filtroFranja, null);
  }, [weather, franjaActiva, ajustes.filtroFranja]);

  // Actividad: mapa fecha → orto/ocaso para no recalcular.
  const actividad: ActividadHora[] = useMemo(() => {
    if (!weather?.hourly) return [];
    const mapa = new Map<string, { orto: Date | null; ocaso: Date | null }>();
    for (const h of weather.hourly) {
      const d = new Date(h.time);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!mapa.has(key)) {
        const sol = calcularSol(d, spot.lat, spot.lon);
        mapa.set(key, { orto: sol?.orto ?? null, ocaso: sol?.ocaso ?? null });
      }
    }
    return calcularActividadPorHora(weather.hourly, mapa);
  }, [weather, spot.lat, spot.lon]);

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

  // Fecha activa mostrada en el encabezado.
  const colorVeredictoFranja = veredictoFranjaActiva
    ? veredictoAColor(veredictoFranjaActiva)
    : 'var(--text-dim)';

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
      <header
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          zIndex: 10,
          padding: '10px 14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '5px 10px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--text)',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            ← {t('common.back')}
          </button>

          {editingName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, margin: '0 8px' }}>
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') setEditingName(false);
                }}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--accent)',
                  borderRadius: 4,
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                }}
              />
              <button
                onClick={handleSaveName}
                style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: '1px solid var(--accent)',
                  backgroundColor: 'transparent',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                ✓
              </button>
              <button
                onClick={() => setEditingName(false)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-dim)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flex: 1,
                justifyContent: 'center',
                margin: '0 8px',
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  color: 'var(--text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {spot.name || t('common.unnamed')}
              </h1>
              <button
                onClick={handleStartEditName}
                title={t('detalle.editName')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '2px 4px',
                }}
              >
                ✎
              </button>
            </div>
          )}

          <div style={{ width: 60 }} />
        </div>

        {/* Coordenadas + profundidad */}
        <div
          onClick={handleCopyCoords}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontFamily: 'var(--font-mono, Fira Code, monospace)',
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
            marginBottom: 6,
            cursor: 'pointer',
          }}
        >
          <span>{formatearCoords(spot.lat, spot.lon, ajustes.formatoCoords)}</span>
          <span
            style={{
              color: coordsCopiedFeedback ? 'var(--accent)' : 'var(--text-dim)',
              fontSize: '0.65rem',
              fontWeight: coordsCopiedFeedback ? 600 : 400,
            }}
          >
            {coordsCopiedFeedback ? `✓ ${t('detalle.coordsCopied')}` : `📋`}
          </span>
        </div>

        {/* Zona + Franjas clicables */}
        <div
          style={{
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          {t(`zones.${spot.zona ?? 'mediterraneo_espanol'}`)}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            marginBottom: 6,
          }}
        >
          {ajustes.franjas.map((franja) => {
            const v = veredictos[franja.id];
            const color = v ? veredictoAColor(v) : 'var(--text-dim)';
            const activa = ajustes.franjaActivaId === franja.id;
            return (
              <button
                key={franja.id}
                onClick={() => setFranjaActiva(activa ? null : franja.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  borderRadius: 6,
                  backgroundColor: activa ? 'var(--surface)' : 'transparent',
                  border: `1px solid ${activa ? color : 'var(--border)'}`,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  color: activa ? color : 'var(--text-dim)',
                  fontWeight: activa ? 700 : 400,
                }}
              >
                <span>{franja.nombre}</span>
                {v && <span style={{ color, fontWeight: 600, opacity: 0.9 }}>•</span>}
              </button>
            );
          })}
          {ajustes.filtroFranja && franjaActiva && (
            <button
              onClick={() => setFranjaActiva(null)}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text-dim)',
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              {t('common.all')}
            </button>
          )}
        </div>

        {/* Aviso de stale */}
        {stale && (
          <div
            style={{
              padding: '6px 10px',
              marginBottom: 6,
              borderRadius: 6,
              border: '1px solid var(--verdict-aceptable)',
              backgroundColor: 'rgba(229, 229, 0, 0.1)',
              color: 'var(--verdict-aceptable)',
              fontSize: '0.75rem',
              textAlign: 'center',
            }}
          >
            {t('home.card.staleWarning', { min: ageMin })}
          </div>
        )}

        {loading && (
          <div
            style={{
              padding: '6px 10px',
              marginBottom: 6,
              color: 'var(--accent)',
              fontSize: '0.75rem',
              textAlign: 'center',
            }}
          >
            {t('common.loading')}
          </div>
        )}

        {/* Salida: veredicto + umbral aplicado */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.72rem',
            marginBottom: 4,
          }}
        >
          {spot.tipoAcceso != null ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--text-dim)' }}>
                {t('verdict.launch.title')}:
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  backgroundColor: 'var(--surface)',
                  border: `1px solid ${colorSalida}`,
                  color: colorSalida,
                  fontWeight: 600,
                  fontSize: '0.72rem',
                }}
              >
                {textoSalida}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--text-dim)' }}>{t('access.none')}</span>
              <button
                type="button"
                onClick={() => onAddAccess && onAddAccess(spot.id)}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: '1px solid var(--accent)',
                  backgroundColor: 'transparent',
                  color: 'var(--accent)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                + {t('access.add')}
              </button>
            </div>
          )}

          {/* Umbral aplicado con letras del color del veredicto. */}
          <div
            style={{
              fontSize: '0.68rem',
              color: 'var(--text-dim)',
              textAlign: 'center',
            }}
          >
            {t('verdict.appliedThresholdPrefix')}{' '}
            <span style={{ color: colorVeredictoFranja, fontWeight: 700 }}>
              {ajustes.categoriaKayak}
            </span>
            {' / '}
            <span style={{ color: colorVeredictoFranja, fontWeight: 700 }}>
              {t(`zones.${spot.zona ?? 'mediterraneo_espanol'}`)}
            </span>
          </div>
        </div>

        {/* Factores veredicto de la franja activa: SIEMPRE VISIBLES.
            Botón "Ver todos los factores" desaparece (bug 12). */}
        {detalleFranjaActiva && (
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 6,
              border: '1px solid var(--border)',
              padding: '6px 10px',
              marginBottom: 6,
              fontSize: '0.75rem',
            }}
          >
            <div
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {t('verdict.triggeringFactor')}
              {detalleFranjaActiva.factorDisparador && (
                <span
                  style={{
                    marginLeft: 6,
                    color: veredictoAColor(detalleFranjaActiva.veredicto),
                    fontWeight: 700,
                    textTransform: 'none',
                  }}
                >
                  {t(`factors.${factorKeyMap[detalleFranjaActiva.factorDisparador]}`)}
                </span>
              )}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))',
                gap: 4,
              }}
            >
              {(['viento', 'ola', 'periodo', 'corriente', 'marea'] as const).map((f) => {
                const vf = detalleFranjaActiva?.veredictoPorFactor[f];
                const col = vf ? veredictoAColor(vf) : 'var(--text-dim)';
                const lab = vf
                  ? t(veredictoAClaveI18n(vf))
                  : t('detalle.noDepth');
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
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                      {t(`factors.${factorKeyMap[f]}`)}
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: col,
                        textTransform: 'uppercase',
                      }}
                    >
                      {lab}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Subpestañas */}
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
                padding: '8px 14px',
                border: 'none',
                borderBottom: active
                  ? '2px solid var(--accent)'
                  : '2px solid transparent',
                backgroundColor: active ? 'var(--surface)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text)',
                fontSize: '0.82rem',
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

      <main
        style={{
          flex: 1,
          padding: 14,
          maxWidth: 900,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {!weather && !loading && (
          <div
            style={{
              color: 'var(--text-dim)',
              padding: '30px 0',
              textAlign: 'center',
            }}
          >
            {t('home.card.noData')}
          </div>
        )}

        {/* ─── OLEAJE ─── */}
        {tabActiva === 'waves' && weather && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono, Fira Code, monospace)',
                  color: 'var(--accent)',
                }}
              >
                {horasFiltradas.find((h) => h.waveHeight != null)?.waveHeight?.toFixed(1) ?? '—'}
              </span>
              <span
                style={{ fontSize: '1rem', marginLeft: 6, color: 'var(--text-dim)' }}
              >
                m
              </span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                {
                  key: 'wt',
                  label: t('factors.waveHeightTotal'),
                  render: (h) =>
                    h.waveHeight != null ? `${h.waveHeight.toFixed(2)} m` : '—',
                  veredicto: subVeredictoWaves,
                },
                {
                  key: 'ww',
                  label: t('factors.waveHeightWind'),
                  render: (h) =>
                    h.windWaveHeight != null ? `${h.windWaveHeight.toFixed(2)} m` : '—',
                },
                {
                  key: 'ws',
                  label: t('factors.waveHeightSwell'),
                  render: (h) =>
                    h.swellWaveHeight != null ? `${h.swellWaveHeight.toFixed(2)} m` : '—',
                },
                {
                  key: 'wp',
                  label: t('factors.wavePeriod'),
                  render: (h) =>
                    h.wavePeriod != null ? `${h.wavePeriod.toFixed(0)} s` : '—',
                },
                {
                  key: 'wd',
                  label: t('factors.waveDirection'),
                  render: (h) => {
                    const nv = nombreViento(
                      h.waveDirection,
                      spot.zona ?? 'mediterraneo_espanol',
                      lang
                    );
                    return nv.grados != null
                      ? `${nv.cardinal} ${Math.round(nv.grados)}°`
                      : '—';
                  },
                },
              ]}
            />
          </div>
        )}

        {/* ─── VIENTO ─── */}
        {tabActiva === 'wind' && weather && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono, Fira Code, monospace)',
                  color: 'var(--accent-2)',
                }}
              >
                {msAKn(horasFiltradas.find((h) => h.windSpeed != null)?.windSpeed ?? null) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: 6, color: 'var(--text-dim)' }}>
                kt
              </span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                {
                  key: 'wd',
                  label: t('factors.windDirection'),
                  render: (h) => {
                    const nv = nombreViento(
                      h.windDirection,
                      spot.zona ?? 'mediterraneo_espanol',
                      lang
                    );
                    return nv.grados != null ? `${nv.nombre} (${nv.cardinal})` : '—';
                  },
                  veredicto: subVeredictoWind,
                },
                {
                  key: 'wk',
                  label: t('factors.windSpeedKn'),
                  render: (h) => {
                    const v = msAKn(h.windSpeed);
                    return v != null ? `${v}` : '—';
                  },
                },
                {
                  key: 'wkh',
                  label: t('factors.windSpeedKmh'),
                  render: (h) => {
                    const v = msAKmh(h.windSpeed);
                    return v != null ? `${v}` : '—';
                  },
                },
                {
                  key: 'gk',
                  label: t('factors.windGustsKn'),
                  render: (h) => {
                    const v = msAKn(h.windGusts);
                    return v != null ? `${v}` : '—';
                  },
                },
                {
                  key: 'gkh',
                  label: t('factors.windGustsKmh'),
                  render: (h) => {
                    const v = msAKmh(h.windGusts);
                    if (v == null) return '—';
                    // Bug 4: rachas ≥ 30 km/h en rojo neón.
                    const esRachaFuerte = v >= 30;
                    return (
                      <span
                        style={{
                          color: esRachaFuerte ? '#FF2D55' : undefined,
                          fontWeight: esRachaFuerte ? 700 : 500,
                          textShadow: esRachaFuerte
                            ? '0 0 6px rgba(255, 45, 85, 0.7)'
                            : 'none',
                        }}
                      >
                        {v}
                      </span>
                    );
                  },
                },
              ]}
            />
          </div>
        )}

        {/* ─── TIEMPO ─── */}
        {tabActiva === 'weather' && weather && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono, Fira Code, monospace)',
                  color: '#f59e0b',
                }}
              >
                {horasFiltradas.find((h) => h.temperature != null)?.temperature?.toFixed(1) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: 6, color: 'var(--text-dim)' }}>
                °C
              </span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                {
                  key: 'ico',
                  label: t('factors.weatherCode'),
                  render: (h) => {
                    const isNight =
                      new Date(h.time).getHours() < 7 ||
                      new Date(h.time).getHours() >= 20;
                    return (
                      <span style={{ fontSize: '1.1rem' }}>
                        {weatherCodeAIcono(h.weatherCode, isNight)}
                      </span>
                    );
                  },
                },
                {
                  key: 'cc',
                  label: t('factors.cloudCover'),
                  render: (h) =>
                    h.cloudCover != null ? `${Math.round(h.cloudCover)}%` : '—',
                },
                {
                  key: 'pr',
                  label: t('factors.precipitation'),
                  render: (h) =>
                    h.precipitation != null ? `${h.precipitation.toFixed(1)} mm` : '—',
                },
                {
                  key: 'prp',
                  label: t('factors.precipitationProbability'),
                  render: (h) =>
                    h.precipitationProbability != null
                      ? `${Math.round(h.precipitationProbability)}%`
                      : '—',
                },
                {
                  key: 'tmp',
                  label: t('factors.temperature'),
                  render: (h) =>
                    h.temperature != null ? `${h.temperature.toFixed(1)}°` : '—',
                },
                {
                  key: 'vis',
                  label: t('factors.visibility'),
                  render: (h) =>
                    h.visibility != null
                      ? `${Math.round(h.visibility / 1000)} km`
                      : '—',
                },
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
                {
                  key: 't',
                  label: t('factors.temperature'),
                  render: (h) =>
                    h.temperature != null ? `${h.temperature.toFixed(1)}°` : '—',
                },
                {
                  key: 'at',
                  label: t('factors.apparentTemperature'),
                  render: (h) =>
                    h.apparentTemperature != null
                      ? `${h.apparentTemperature.toFixed(1)}°`
                      : '—',
                },
                {
                  key: 'sst',
                  label: t('factors.seaTemperature'),
                  render: (h) =>
                    h.seaSurfaceTemperature != null
                      ? `${h.seaSurfaceTemperature.toFixed(1)}°`
                      : '—',
                },
              ]}
            />
          </div>
        )}

        {/* ─── BARÓMETRO (bug 19) ─── */}
        {tabActiva === 'barometer' && weather && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono, Fira Code, monospace)',
                  color: '#a855f7',
                }}
              >
                {horasFiltradas.find((h) => h.pressure != null)?.pressure?.toFixed(0) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: 6, color: 'var(--text-dim)' }}>
                hPa
              </span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                {
                  key: 'p',
                  label: t('factors.pressure'),
                  render: (h) => (h.pressure != null ? `${h.pressure.toFixed(0)}` : '—'),
                },
                {
                  key: 'tr',
                  label: t('factors.pressureTrend'),
                  render: (h) => {
                    const idx = horasFiltradas.indexOf(h);
                    if (idx < 3) return '—';
                    const prev = horasFiltradas[idx - 3].pressure;
                    if (prev == null || h.pressure == null) return '—';
                    const d = h.pressure - prev;
                    // Bug 19: caída brusca > 2.5 hPa en 3 h en rojo neón.
                    if (d < -2.5) {
                      return (
                        <span
                          style={{
                            color: '#FF2D55',
                            fontWeight: 700,
                            textShadow: '0 0 6px rgba(255, 45, 85, 0.7)',
                          }}
                        >
                          ⚡ Caída brusca
                        </span>
                      );
                    }
                    if (d < -0.8) return '⬇️ Bajando';
                    if (d > 2.5) return '📈 Subida rápida';
                    if (d > 0.8) return '⬆️ Subiendo';
                    return '➡️ Estable';
                  },
                },
              ]}
            />
          </div>
        )}

        {/* ─── ACTIVIDAD (bugs 24a, 24b) ─── */}
        {tabActiva === 'activity' && weather && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono, Fira Code, monospace)',
                  color: '#06b6d4',
                }}
              >
                {horasFiltradas
                  .find((h) => h.currentVelocity != null)
                  ?.currentVelocity?.toFixed(2) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: 6, color: 'var(--text-dim)' }}>
                kn
              </span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                {
                  key: 'cv',
                  label: t('factors.currentKn'),
                  render: (h) => {
                    if (h.currentVelocity == null) return '—';
                    const kn = h.currentVelocity;
                    const kmh = kn * 1.852;
                    let indicador = '▶ correcto';
                    if (kn < 0.4) indicador = '🐌 Agua parada / baja actividad';
                    else if (kn > 1.4) indicador = '⚡ Deriva rápida';
                    return (
                      <span style={{ fontSize: '0.68rem' }}>
                        {kn.toFixed(1)} kn ({kmh.toFixed(1).replace('.', ',')} km/h) {indicador}
                      </span>
                    );
                  },
                  veredicto: subVeredictoCurrent,
                },
                {
                  key: 'cd',
                  label: t('factors.currentDirection'),
                  render: (h) => {
                    const nv = nombreViento(
                      h.currentDirection,
                      spot.zona ?? 'mediterraneo_espanol',
                      lang
                    );
                    return nv.grados != null
                      ? `${nv.cardinal} ${Math.round(nv.grados)}°`
                      : '—';
                  },
                },
                {
                  key: 'act',
                  label: t('factors.fishActivity'),
                  render: (h) => {
                    const a = actividad.find((x) => x.hora === h.time);
                    if (!a) return '—';
                    return (
                      <span style={{ fontSize: '0.68rem' }}>
                        {a.coeficiente}/10 {a.emoji}
                      </span>
                    );
                  },
                },
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

        {/* ─── MAREAS (bug 22) ─── */}
        {tabActiva === 'tides' && weather && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono, Fira Code, monospace)',
                  color: '#38bdf8',
                }}
              >
                {horasFiltradas
                  .find((h) => h.seaLevelHeight != null)
                  ?.seaLevelHeight?.toFixed(2) ?? '—'}
              </span>
              <span style={{ fontSize: '1rem', marginLeft: 6, color: 'var(--text-dim)' }}>
                m
              </span>
            </div>
            <TablaDatos
              horas={horasFiltradas}
              colorNivel={colorNivel}
              lang={lang}
              columnas={[
                {
                  key: 'sl',
                  label: t('factors.seaLevel'),
                  render: (h) =>
                    h.seaLevelHeight != null
                      ? `${h.seaLevelHeight.toFixed(2)} m`
                      : '—',
                },
                {
                  key: 'tr',
                  label: t('factors.seaLevelTrend'),
                  render: (h) => {
                    const idx = horasFiltradas.indexOf(h);
                    if (idx === 0) return '—';
                    const prev = horasFiltradas[idx - 1].seaLevelHeight;
                    if (prev == null || h.seaLevelHeight == null) return '—';
                    const d = h.seaLevelHeight - prev;
                    // Bug 22: cambio inusual > 0,08 m/h en rojo neón.
                    // Criterio por zona: Mediterráneo 0,3 m de rango,
                    // Atlántico 3-6 m. Simplificamos: umbral fijo.
                    const inusual = Math.abs(d) > 0.08;
                    if (inusual) {
                      return (
                        <span
                          style={{
                            color: '#FF2D55',
                            fontWeight: 700,
                            textShadow: '0 0 6px rgba(255, 45, 85, 0.7)',
                          }}
                        >
                          {d > 0 ? '⬆️' : '⬇️'} {d > 0 ? '+' : ''}
                          {d.toFixed(3)}
                        </span>
                      );
                    }
                    if (d > 0.02) return '↑';
                    if (d < -0.02) return '↓';
                    return '→';
                  },
                },
              ]}
            />
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Tabla de Sol (30 días) ──────────────────────────────────────

const TablaSol: React.FC<{ lang: string; lat: number; lon: number }> = ({
  lang, lat, lon,
}) => {
  const { t } = useTranslation();
  const filas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const out: Array<{
      key: string;
      fecha: Date;
      sol: ReturnType<typeof calcularSol>;
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        borderRadius: 8,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        fontSize: '0.72rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(64px, auto) repeat(6, 1fr)',
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          fontSize: '0.68rem',
          color: 'var(--text-dim)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        <div style={{ padding: '6px 6px' }}>{t('factors.date')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.sunrise')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.solarNoon')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.sunset')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.twilightAstro')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.twilightNautical')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.twilightCivil')}
        </div>
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
          <div
            style={{
              padding: '5px 6px',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
              color: 'var(--text-dim)',
              fontWeight: 500,
            }}
          >
            {fechaLarga(fecha, lang)}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
            }}
          >
            {fmt(sol?.orto)}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
            }}
          >
            {fmt(sol?.mediodiaSolar)}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
            }}
          >
            {fmt(sol?.ocaso)}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
              fontSize: '0.68rem',
            }}
          >
            {sol
              ? `${fmt(sol.crepusculoAstronomicoInicio)}–${fmt(sol.crepusculoAstronomicoFin)}`
              : '—'}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
              fontSize: '0.68rem',
            }}
          >
            {sol
              ? `${fmt(sol.crepusculoNauticoInicio)}–${fmt(sol.crepusculoNauticoFin)}`
              : '—'}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
              fontSize: '0.68rem',
            }}
          >
            {sol
              ? `${fmt(sol.crepusculoCivilInicio)}–${fmt(sol.crepusculoCivilFin)}`
              : '—'}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Tabla de Luna (30 días) ─────────────────────────────────────

const TablaLuna: React.FC<{ lang: string; lat: number; lon: number }> = ({
  lang, lat, lon,
}) => {
  const { t } = useTranslation();
  const filas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const out: Array<{
      key: string;
      fecha: Date;
      luna: ReturnType<typeof calcularLuna>;
    }> = [];
    for (let i = 0; i < 30; i++) {
      const f = new Date(hoy);
      f.setDate(f.getDate() + i);
      const fMediodia = new Date(f);
      fMediodia.setHours(12, 0, 0, 0);
      out.push({
        key: localDateKey(f),
        fecha: f,
        luna: calcularLuna(fMediodia, lat, lon),
      });
    }
    return out;
  }, [lat, lon]);

  const fmt = (d: Date | null) => {
    if (!d) return '—';
    return d.toLocaleTimeString(lang === 'en' ? 'en-GB' : 'es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        borderRadius: 8,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        fontSize: '0.72rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(64px, auto) 1fr 0.7fr 0.7fr 0.9fr 0.9fr 0.9fr',
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          fontSize: '0.68rem',
          color: 'var(--text-dim)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        <div style={{ padding: '6px 6px' }}>{t('factors.date')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.moonPhase')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.moonAge')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.moonIllum')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.moonrise')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.moonTransit')}
        </div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>
          {t('factors.moonset')}
        </div>
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
          <div
            style={{
              padding: '5px 6px',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
              color: 'var(--text-dim)',
              fontWeight: 500,
            }}
          >
            {fechaLarga(fecha, lang)}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontSize: '0.7rem' }}>
            {emojiFase(luna.fase)} {nombreFase(luna.fase, lang === 'en' ? 'en' : 'es')}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
            }}
          >
            {luna.edad.toFixed(1)}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
            }}
          >
            {Math.round(luna.iluminacion * 100)}%
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
            }}
          >
            {fmt(luna.ortoLunar)}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
            }}
          >
            {fmt(luna.transitoLunar)}
          </div>
          <div
            style={{
              padding: '5px 4px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
            }}
          >
            {fmt(luna.ocasoLunar)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpotScreen;