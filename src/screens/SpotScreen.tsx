// src/screens/SpotScreen.tsx — v1.019 limpia
// Cambios v1.019:
//   - Cabecera de dos líneas (nombre + unidad) en TODAS las tablas.
//   - Pestaña Oleaje reestructurada:
//       Hora | O.Total | O.Fondo | Periodo | O.Viento | Corriente
//       Dirección dentro de cada celda de ola.
//       Corriente: velocidad + dirección + indicador textual.
//   - Botón MAR CRUZADA en pestaña Oleaje (si aplica).
//   - Modal explicativo de mar cruzada.

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, getEmbarcacionParaSpot } from '../state/store.ts';
import { SelectorEmbarcacionModal } from '../components/SelectorEmbarcacionModal.tsx';
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
  kmhAKn,
  kmhABf,
  weatherCodeAIcono,
  gradosACardinal16,
  type HourlyPoint,
} from '../lib/openmeteo.ts';
import { nombreViento } from '../lib/wind.ts';
import { colorNumero, type NivelColorTabla } from '../lib/verdict-color.ts';
import { calcularActividadPorHora, type ActividadHora } from '../lib/actividad.ts';
import type { FranjaUsuario } from '../state/store.ts';
import {
  formatearViento,
  formatearOla,
  formatearTemperatura,
  formatearPresion,
  formatearCorriente,
  formatearDistancia,
  formatearPrecipitacion,
  SUFIJO_VIENTO,
  SUFIJO_OLA,
  SUFIJO_TEMPERATURA,
  SUFIJO_PRESION,
  SUFIJO_CORRIENTE,
  valorViento,
  valorOla,
  valorTemperatura,
  valorPresion,
  valorCorriente,
} from '../lib/unidades.ts';

export interface SpotScreenProps {
  spotId: string;
  onClose: () => void;
  onEditSpot: (spotId: string, focusSection?: 'general' | 'acceso') => void;
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

function formatearValorFactor(factor: keyof Umbral, h: HourlyPoint): string {
  switch (factor) {
    case 'viento': {
      const v = h.windSpeed;
      return v != null ? `${Math.round(v * 10) / 10} km/h` : '—';
    }
    case 'ola':
      return h.waveHeight != null ? `${h.waveHeight.toFixed(2)} m` : '—';
    case 'periodo':
      return h.wavePeriod != null ? `${h.wavePeriod.toFixed(0)} s` : '—';
    case 'corriente':
      return h.currentVelocity != null ? `${h.currentVelocity.toFixed(1)} kn` : '—';
    case 'marea':
      return h.seaLevelHeight != null ? `${h.seaLevelHeight.toFixed(2)} m` : '—';
  }
}

// ============================================================
// DETECCIÓN DE MAR CRUZADA
// ============================================================
// Criterio: windWaveHeight > 0.3 m Y swellWaveHeight > 0.3 m
// Y diferencia angular entre windWaveDirection y swellWaveDirection > 60°.
function diferenciaAngular(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360 + 360) % 360);
  return d > 180 ? 360 - d : d;
}

function hayMarCruzadaEnHora(h: HourlyPoint): boolean {
  const wh = h.windWaveHeight ?? 0;
  const sh = h.swellWaveHeight ?? 0;
  const wd = h.windWaveDirection;
  const sd = h.swellWaveDirection;
  if (wh <= 0.3 || sh <= 0.3) return false;
  if (wd == null || sd == null) return false;
  return diferenciaAngular(wd, sd) > 60;
}

function hayMarCruzadaEnHoras(horas: HourlyPoint[]): boolean {
  return horas.some(hayMarCruzadaEnHora);
}

// ============================================================
// MODAL DE MAR CRUZADA
// ============================================================
const ModalMarCruzada: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--verdict-desaconsejado)',
          borderRadius: 12,
          padding: 20,
          maxWidth: 480,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--verdict-desaconsejado)',
              letterSpacing: '0.04em',
            }}
          >
            {t('marcruzada.titulo', { defaultValue: 'MAR CRUZADA' })}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        <p
          style={{
            fontSize: '0.9rem',
            lineHeight: 1.55,
            color: 'var(--text)',
            margin: '0 0 12px 0',
          }}
        >
          {t('marcruzada.intro', {
            defaultValue:
              'Hay dos sistemas de ola viniendo de direcciones distintas. Eso se llama mar cruzada.',
          })}
        </p>

        <p
          style={{
            fontSize: '0.9rem',
            lineHeight: 1.55,
            color: 'var(--text)',
            margin: '0 0 12px 0',
          }}
        >
          {t('marcruzada.cuerpo1', {
            defaultValue:
              'En mar cruzada, el kayak recibe golpes desde dos ángulos. Los picos de una ola y de la otra se suman de vez en cuando, y el kayak cabecea y balancea a la vez. Es incómodo, agota, y en un descuido puede volcar.',
          })}
        </p>

        <p
          style={{
            fontSize: '0.9rem',
            lineHeight: 1.55,
            color: 'var(--text)',
            margin: '0 0 12px 0',
          }}
        >
          {t('marcruzada.cuerpo2', {
            defaultValue:
              'Si sales con mar cruzada, extrema la precaución. No te alejes de la costa. Mantén el kayak siempre con la proa a una de las dos olas. Y si el mar se pone peor, vuelve antes de que la situación se complique.',
          })}
        </p>

        <p
          style={{
            fontSize: '0.8rem',
            lineHeight: 1.5,
            color: 'var(--text-dim)',
            margin: '14px 0 0 0',
            fontStyle: 'italic',
          }}
        >
          {t('marcruzada.criterio', {
            defaultValue:
              'Se avisa de mar cruzada cuando la ola de viento y la ola de fondo superan los 0,3 m cada una y vienen de direcciones separadas por más de 60°.',
          })}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// TABLA GENÉRICA — cabecera de dos líneas
// ============================================================
interface ColumnaTabla<T> {
  key: string;
  label: string;
  unit?: string;
  render: (h: T) => React.ReactNode;
  veredicto?: (h: T) => Veredicto | null;
}

function TablaDatos<T extends { time: string }>({
  horas, columnas, colorNivel, lang, tabId,
}: {
  horas: T[];
  columnas: ColumnaTabla<T>[];
  colorNivel: NivelColorTabla;
  lang: string;
  tabId: string;
}) {
  const gruposPorDia = useMemo(() => {
    const mapa = new Map<string, { fecha: Date; horas: T[] }>();
    for (const h of horas) {
      const d = new Date(h.time);
      const key = localDateKey(d);
      if (!mapa.has(key)) mapa.set(key, { fecha: d, horas: [] });
      mapa.get(key)!.horas.push(h);
    }
    return Array.from(mapa.entries());
  }, [horas]);

  if (horas.length === 0) return null;

  const gridCols = `minmax(54px, auto) repeat(${columnas.length}, 1fr)`;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,
      borderRadius: 8, border: '1px solid var(--border)',
      overflow: 'hidden', fontSize: '0.72rem',
    }}>
      {/* Cabecera de dos líneas */}
      <div style={{
        display: 'grid', gridTemplateColumns: gridCols,
        backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)',
        fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
      }}>
        <div style={{
          padding: '6px 6px', textAlign: 'left',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <div style={{ lineHeight: 1.2 }}>Hora</div>
          <div style={{ lineHeight: 1.2, fontSize: '0.6rem', minHeight: '0.72rem', opacity: 0 }}>
            {'\u00A0'}
          </div>
        </div>
        {columnas.map((c) => (
          <div
            key={c.key}
            style={{
              padding: '6px 4px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            }}
          >
            <div style={{ lineHeight: 1.2 }}>{c.label}</div>
            <div
              style={{
                lineHeight: 1.2,
                fontSize: '0.6rem',
                minHeight: '0.72rem',
                opacity: c.unit ? 0.75 : 0,
                marginTop: 1,
              }}
            >
              {c.unit || '\u00A0'}
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {gruposPorDia.map(([key, { fecha, horas: horasDelDia }], diaIndex) => (
          <React.Fragment key={key}>
            <div style={{
              gridColumn: '1 / -1', backgroundColor: 'var(--bg)',
              color: 'var(--accent)', fontFamily: 'var(--font-mono, Fira Code, monospace)',
              fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
              padding: '4px 8px',
              borderTop: diaIndex > 0 ? '1px solid var(--border)' : 'none',
              borderBottom: '1px solid var(--border)',
            }}>
              {fecha.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
                weekday: 'short', day: '2-digit', month: '2-digit',
              })}
            </div>
            {horasDelDia.map((h, i) => {
              const hora = new Date(h.time).toLocaleTimeString(
                lang === 'en' ? 'en-GB' : 'es-ES',
                { hour: '2-digit', minute: '2-digit' }
              );
              return (
                <div key={h.time} style={{
                  display: 'grid', gridTemplateColumns: gridCols,
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    padding: '5px 6px', textAlign: 'left',
                    fontFamily: 'var(--font-mono, Fira Code, monospace)',
                    color: 'var(--text-dim)', fontWeight: 500,
                  }}>{hora}</div>
                  {columnas.map((c) => {
                    const v = c.veredicto?.(h) ?? null;
                    const color = colorNumero(v, colorNivel);
                    return (
                      <div key={c.key} style={{
                        padding: '5px 4px', textAlign: 'center',
                        fontFamily: 'var(--font-mono, Fira Code, monospace)',
                        color: color ?? 'var(--text)',
                        fontWeight: color ? 600 : 400,
                      }}>{c.render(h)}</div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
        <div style={{ padding: 14 }}><TablaAyuda tabId={tabId} /></div>
      </div>
    </div>
  );
}

const TablaAyuda: React.FC<{ tabId: string }> = ({ tabId }) => {
  const { t } = useTranslation();
  const [abierto, setAbierto] = useState(false);
  return (
    <div id={`tabla-ayuda-${tabId}`} style={{
      border: '1px solid var(--border)', borderRadius: 8,
      backgroundColor: 'var(--surface)', overflow: 'hidden',
    }}>
      <button type="button" onClick={() => setAbierto(!abierto)} style={{
        width: '100%', padding: '10px 14px', border: 'none',
        backgroundColor: 'transparent', color: 'var(--text-dim)',
        fontSize: '0.8rem', fontWeight: 600, textAlign: 'left',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>ℹ️ {t('tabsHelp.show')}</span>
        <span style={{ fontSize: '0.9rem' }}>{abierto ? '▾' : '▸'}</span>
      </button>
      {abierto && (
        <div style={{
          padding: '0 14px 14px', fontSize: '0.85rem',
          lineHeight: 1.55, color: 'var(--text)',
        }}>{t(`tabsHelp.${tabId}`)}</div>
      )}
    </div>
  );
};

const BotonAyuda: React.FC<{ tabId: string }> = ({ tabId }) => (
  <button type="button" onClick={() => {
    const el = document.getElementById(`tabla-ayuda-${tabId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const btn = el.querySelector('button');
      if (btn) (btn as HTMLButtonElement).click();
    }
  }} title="Cómo leer esta tabla" style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 14, height: 14, borderRadius: '50%',
    border: '1px solid var(--text-dim)', backgroundColor: 'transparent',
    color: 'var(--text-dim)', fontSize: '0.6rem', fontWeight: 700,
    cursor: 'pointer', padding: 0, marginLeft: 4, lineHeight: 1,
  }}>?</button>
);

// ============================================================
// SPOTSCREEN
// ============================================================
export const SpotScreen: React.FC<SpotScreenProps> = ({
  spotId, onClose, onEditSpot,
}) => {
  const { t, i18n } = useTranslation();
  const spots = useAppStore((s) => s.spots);
  const getWeatherEntry = useAppStore((s) => s.getWeatherEntry);
  const setWeather = useAppStore((s) => s.setWeather);
  const updateSpot = useAppStore((s) => s.updateSpot);
  const ajustes = useAppStore((s) => s.ajustes);
  const setFranjaActiva = useAppStore((s) => s.setFranjaActiva);

  const spot = spots.find((s) => s.id === spotId);
  const kayakActivo = getEmbarcacionParaSpot(spot, ajustes);
  const categoriaKayak = kayakActivo.categoriaWKF;
  const nombreKayak = `${kayakActivo.marca} ${kayakActivo.modelo}`;

  const [tabActiva, setTabActiva] = useState<TabId>('waves');
  const [modalEmbarcacionAbierto, setModalEmbarcacionAbierto] = useState(false);
  const [modalMarCruzadaAbierto, setModalMarCruzadaAbierto] = useState(false);
  const [coordsCopiedFeedback, setCoordsCopiedFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [errorAviso, setErrorAviso] = useState<string | null>(null);
  const errorTimeoutRef = useRef<number | null>(null);
  const fetchTriggeredRef = useRef(false);

  const weatherEntry = spot ? getWeatherEntry(spot.id) : null;
  const weather = weatherEntry?.data ?? null;
  const stale = weatherEntry?.stale ?? false;
  const ageMin = weatherEntry?.ageMin ?? 0;
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es';

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!spot) return;
    if (fetchTriggeredRef.current) return;
    if (weatherEntry) return;
    fetchTriggeredRef.current = true;
    setLoading(true);
    loadingRef.current = true;
    fetchSpotWeather(spot.lat, spot.lon)
      .then((data) => setWeather(spot.id, data))
      .catch((err) => {
        console.error('fetch spot weather', err);
        setErrorAviso(
          t('errores.refreshFailed', {
            defaultValue:
              'No se han podido actualizar los datos. Vuelve a intentarlo en unos minutos.',
          })
        );
        errorTimeoutRef.current = window.setTimeout(() => {
          setErrorAviso(null);
        }, 6000);
      })
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot?.id]);

  const handleRefresh = async () => {
    if (!spot || loading || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setErrorAviso(null);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    try {
      const data = await fetchSpotWeather(spot.lat, spot.lon);
      setWeather(spot.id, data);
    } catch (err) {
      console.error('fetch spot weather', err);
      setErrorAviso(
        t('errores.refreshFailed', {
          defaultValue:
            'No se han podido actualizar los datos. Vuelve a intentarlo en unos minutos.',
        })
      );
      errorTimeoutRef.current = window.setTimeout(() => {
        setErrorAviso(null);
      }, 6000);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const franjaActiva = ajustes.franjas.find((f) => f.id === ajustes.franjaActivaId)
    ?? ajustes.franjas[0] ?? null;

  const veredictos = useMemo(() => {
    if (!spot) return {};
    return calcularVeredictoPorFranja(
      spot, weather, ajustes.franjas,
      categoriaKayak, ajustes.perfil,
      kayakActivo
    );
  }, [spot, weather, ajustes.franjas, categoriaKayak, ajustes.perfil, kayakActivo]);

  const veredictoFranjaActiva = franjaActiva ? veredictos[franjaActiva.id] : null;

  const detalleFranjaActiva = useMemo<{
    resultado: ResultadoVeredicto;
    horaPeor: HourlyPoint;
  } | null>(() => {
    if (!weather || weather.hourly.length === 0 || !franjaActiva || !spot) return null;
    const inicio = franjaActiva.inicio;
    const franjaDia: FranjaDia =
      inicio >= 0 && inicio < 12 ? 'manana'
      : inicio >= 12 && inicio < 20 ? 'tarde' : 'noche';
    let peorScore = -1;
    let resultado: ResultadoVeredicto | null = null;
    let horaPeor: HourlyPoint | null = null;
    const orden = ['FAVORABLE', 'ACEPTABLE', 'EXIGENTE', 'DESACONSEJADO'];
    for (const h of weather.hourly) {
      const localHour = new Date(h.time).getHours();
      let dentro = false;
      if (franjaActiva.inicio < franjaActiva.fin) {
        dentro = localHour >= franjaActiva.inicio && localHour < franjaActiva.fin;
      } else if (franjaActiva.inicio > franjaActiva.fin) {
        dentro = localHour >= franjaActiva.inicio || localHour < franjaActiva.fin;
      } else dentro = true;
      if (!dentro || h.waveHeight == null || h.windSpeed == null) continue;
      const bf = kmhABf(h.windSpeed) ?? 0;
      const res = calcularVeredicto(
        spot.zona ?? 'mediterraneo_espanol',
        categoriaKayak, ajustes.perfil, franjaDia,
        { viento: bf, ola: h.waveHeight, periodo: h.wavePeriod ?? 0, corriente: 0, marea: 0 },
        kayakActivo
      );
      const score = orden.indexOf(res.veredicto);
      if (score > peorScore) { peorScore = score; resultado = res; horaPeor = h; }
    }
    if (!resultado || !horaPeor) return null;
    return { resultado, horaPeor };
  }, [weather, franjaActiva, spot, categoriaKayak, ajustes.perfil, kayakActivo]);

  const { colorSalida, textoSalida } = useMemo(() => {
    if (!spot || spot.tipoAcceso == null) {
      return { colorSalida: 'var(--text-dim)', textoSalida: '' };
    }
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
      olaCorregida = calcularShoaling(mediaOla).alturaCorregida;
    }
    const resAcceso = calcularVeredictoAcceso(spot.tipoAcceso, olaCorregida);
    return {
      colorSalida: veredictoAccesoAColor(resAcceso),
      textoSalida: t(veredictoAccesoAClaveI18n(resAcceso)),
    };
  }, [spot, weather, franjaActiva, t]);

  const subpestanasVisibles = useMemo(() => {
    const baseTabs = ALL_TABS.filter((tab) => {
      if (tab === 'waves' || tab === 'wind') return true;
      return !ajustes.subpestanasOcultas.includes(tab);
    });

    const orden = ajustes.ordenSubpestanas || [];
    if (orden.length === 0) return baseTabs;

    return [...baseTabs].sort((a, b) => {
      const idxA = orden.indexOf(a);
      const idxB = orden.indexOf(b);
      const posA = idxA === -1 ? ALL_TABS.indexOf(a) + 100 : idxA;
      const posB = idxB === -1 ? ALL_TABS.indexOf(b) + 100 : idxB;
      return posA - posB;
    });
  }, [ajustes.subpestanasOcultas, ajustes.ordenSubpestanas]);

  const horasFiltradas = useMemo(() => {
    if (!weather?.hourly) return [];
    return filtrarHoras(weather.hourly, franjaActiva, ajustes.filtroFranja, null);
  }, [weather, franjaActiva, ajustes.filtroFranja]);

  // ¿Hay mar cruzada en el día actual (primer día del weather)?
  const hayMarCruzadaHoy = useMemo(() => {
    if (!weather?.hourly) return false;
    const keyHoy = localDateKey(new Date());
    const horasHoy = weather.hourly.filter(
      (h) => localDateKey(new Date(h.time)) === keyHoy
    );
    return hayMarCruzadaEnHoras(horasHoy);
  }, [weather]);

  const actividad: ActividadHora[] = useMemo(() => {
    if (!weather?.hourly || !spot) return [];
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
  }, [weather, spot?.lat, spot?.lon]);

  const handleCopyCoords = async () => {
    if (!spot) return;
    try {
      await navigator.clipboard.writeText(
        `${spot.lat.toFixed(6)}, ${spot.lon.toFixed(6)}`
      );
      setCoordsCopiedFeedback(true);
      setTimeout(() => setCoordsCopiedFeedback(false), 1500);
    } catch { /* ignore */ }
  };

  const factorKeyMap: Record<keyof Umbral, string> = {
    viento: 'windSpeed', ola: 'waveHeight', periodo: 'wavePeriod',
    corriente: 'current', marea: 'seaLevel',
  };

  const subVeredictoWaves = (h: HourlyPoint): Veredicto | null => {
    if (h.waveHeight == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: h.waveHeight, periodo: h.wavePeriod ?? 0, corriente: 0, marea: 0 },
      kayakActivo
    ).veredictoPorFactor.ola;
  };

  const subVeredictoWind = (h: HourlyPoint): Veredicto | null => {
    if (h.windSpeed == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      categoriaKayak, ajustes.perfil, franjaDia,
      { viento: kmhABf(h.windSpeed) ?? 0, ola: 0, periodo: 0, corriente: 0, marea: 0 },
      kayakActivo
    ).veredictoPorFactor.viento;
  };

  const subVeredictoWindGust = (h: HourlyPoint): Veredicto | null => {
    if (h.windGusts == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      categoriaKayak, ajustes.perfil, franjaDia,
      { viento: kmhABf(h.windGusts) ?? 0, ola: 0, periodo: 0, corriente: 0, marea: 0 },
      kayakActivo
    ).veredictoPorFactor.viento;
  };

  const subVeredictoPeriodo = (h: HourlyPoint): Veredicto | null => {
    if (h.wavePeriod == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: 0, periodo: h.wavePeriod, corriente: 0, marea: 0 },
      kayakActivo
    ).veredictoPorFactor.periodo;
  };

  const subVeredictoCurrent = (h: HourlyPoint): Veredicto | null => {
    if (h.currentVelocity == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: 0, periodo: 0, corriente: h.currentVelocity, marea: 0 },
      kayakActivo
    ).veredictoPorFactor.corriente;
  };

  const subVeredictoMarea = (h: HourlyPoint): Veredicto | null => {
    if (h.seaLevelHeight == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: 0, periodo: 0, corriente: 0, marea: h.seaLevelHeight },
      kayakActivo
    ).veredictoPorFactor.marea;
  };

  const colorNivel = ajustes.colorTabla;
  const colorVeredictoFranja = veredictoFranjaActiva
    ? veredictoAColor(veredictoFranjaActiva)
    : 'var(--text-dim)';

  if (!spot) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)' }}>
        <button onClick={onClose} style={{
          padding: '8px 16px', borderRadius: 8,
          border: '1px solid var(--border)', backgroundColor: 'var(--surface)',
          color: 'var(--text)', cursor: 'pointer',
        }}>← {t('common.back')}</button>
      </div>
    );
  }

  const factorDisparadorTexto = (() => {
    if (!detalleFranjaActiva) return null;
    const fd = detalleFranjaActiva.resultado.factorDisparador;
    if (!fd) return null;
    return `${t(`factors.${factorKeyMap[fd]}`)} ${formatearValorFactor(fd, detalleFranjaActiva.horaPeor)}`;
  })();

  const u = ajustes.unidades;

  const numeroGrande = (() => {
    switch (tabActiva) {
      case 'waves': {
        const v = horasFiltradas.find((h) => h.waveHeight != null)?.waveHeight;
        const valNum = valorOla(v ?? null, u.ola);
        return { val: valNum != null ? valNum.toFixed(1) : '—', unit: SUFIJO_OLA[u.ola], color: 'var(--accent)' };
      }
      case 'wind': {
        const v = horasFiltradas.find((h) => h.windSpeed != null)?.windSpeed;
        const valNum = valorViento(v ?? null, u.viento);
        return { val: valNum != null ? valNum.toFixed(1) : '—', unit: SUFIJO_VIENTO[u.viento], color: 'var(--accent-2)' };
      }
      case 'weather': {
        const v = horasFiltradas.find((h) => h.temperature != null)?.temperature;
        const valNum = valorTemperatura(v ?? null, u.temperatura);
        return { val: valNum != null ? valNum.toFixed(1) : '—', unit: SUFIJO_TEMPERATURA[u.temperatura], color: '#f59e0b' };
      }
      case 'barometer': {
        const v = horasFiltradas.find((h) => h.pressure != null)?.pressure;
        const valNum = valorPresion(v ?? null, u.presion);
        return { val: valNum != null ? (u.presion === 'inhg' ? valNum.toFixed(2) : valNum.toFixed(0)) : '—', unit: SUFIJO_PRESION[u.presion], color: '#a855f7' };
      }
      case 'activity': {
        const v = horasFiltradas.find((h) => h.currentVelocity != null)?.currentVelocity;
        const valNum = valorCorriente(v ?? null, u.corriente);
        return { val: valNum != null ? valNum.toFixed(2) : '—', unit: SUFIJO_CORRIENTE[u.corriente], color: '#06b6d4' };
      }
      case 'tides': {
        const v = horasFiltradas.find((h) => h.seaLevelHeight != null)?.seaLevelHeight;
        const valNum = valorOla(v ?? null, u.ola);
        return { val: valNum != null ? valNum.toFixed(2) : '—', unit: SUFIJO_OLA[u.ola], color: '#38bdf8' };
      }
      default: return null;
    }
  })();

  // Indicador textual de corriente (universal, no depende de zona ni kayak)
  const indicadorCorriente = (kn: number | null): string | null => {
    if (kn == null) return null;
    if (kn < 0.05) return 'agua parada';
    if (kn < 0.4) return 'corriente floja';
    if (kn <= 1.4) return null;
    if (kn <= 2.0) return 'deriva rápida';
    return 'deriva fuerte';
  };

  // Render de celda de ola con dirección al lado
  const renderOlaConDireccion = (altura: number | null, dirGrados: number | null) => {
    if (altura == null) return '—';
    const alturaTxt = formatearOla(altura, u.ola);
    if (dirGrados == null) return alturaTxt;
    const card = gradosACardinal16(dirGrados);
    return (
      <span>
        {alturaTxt} <span style={{ opacity: 0.75, fontSize: '0.85em' }}>{card}</span>
      </span>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'var(--bg)',
      color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif',
      zIndex: 100, display: 'flex', flexDirection: 'column',
    }}>
      <header style={{
        flexShrink: 0, backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)', padding: '10px 14px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 6,
        }}>
          <button onClick={onClose} style={{
            padding: '5px 10px', backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 6,
            color: 'var(--text)', fontSize: '0.8rem',
            fontWeight: 500, cursor: 'pointer',
          }}>← {t('common.back')}</button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            flex: 1, justifyContent: 'center', margin: '0 8px',
          }}>
            <h1 style={{
              margin: 0, fontSize: '1rem', fontWeight: 600,
              textAlign: 'center', color: 'var(--text)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{spot.name || t('common.unnamed')}</h1>
            <button
              type="button"
              onClick={() => onEditSpot(spot.id, 'general')}
              title={t('detalle.editSpot')}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '2px 4px',
              }}
            >✎</button>
          </div>

          <div style={{ width: 60 }} />
        </div>

        <div onClick={handleCopyCoords} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, fontFamily: 'var(--font-mono, Fira Code, monospace)',
          fontSize: '0.7rem', color: 'var(--text-dim)',
          marginBottom: 6, cursor: 'pointer',
        }}>
          <span>{formatearCoords(spot.lat, spot.lon, ajustes.formatoCoords)}</span>
          <span style={{
            color: coordsCopiedFeedback ? 'var(--accent)' : 'var(--text-dim)',
            fontSize: '0.65rem',
            fontWeight: coordsCopiedFeedback ? 600 : 400,
          }}>{coordsCopiedFeedback ? `✓ ${t('detalle.coordsCopied')}` : `📋`}</span>
        </div>

        <div style={{
          fontSize: '0.7rem', color: 'var(--text-dim)',
          textAlign: 'center', marginBottom: 4,
        }}>{t(`zones.${spot.zona ?? 'mediterraneo_espanol'}`)}</div>

        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: 4, marginBottom: 6,
        }}>
          {ajustes.franjas.map((franja) => {
            const v = veredictos[franja.id];
            const color = v ? veredictoAColor(v) : 'var(--text-dim)';
            const activa = ajustes.franjaActivaId === franja.id;
            return (
              <button key={franja.id} onClick={() => setFranjaActiva(activa ? null : franja.id)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 6,
                backgroundColor: activa ? 'var(--surface)' : 'transparent',
                border: `1px solid ${activa ? color : 'var(--border)'}`,
                fontSize: '0.72rem', cursor: 'pointer',
                color: activa ? color : 'var(--text-dim)',
                fontWeight: activa ? 700 : 400,
              }}>
                <span>{franja.nombre}</span>
                {v && <span style={{ color, fontWeight: 600, opacity: 0.9 }}>•</span>}
              </button>
            );
          })}
          {ajustes.filtroFranja && franjaActiva && (
            <button onClick={() => setFranjaActiva(null)} style={{
              padding: '4px 10px', borderRadius: 6,
              border: '1px solid var(--border)', backgroundColor: 'transparent',
              color: 'var(--text-dim)', fontSize: '0.72rem', cursor: 'pointer',
            }}>{t('common.all')}</button>
          )}
        </div>

        {errorAviso && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              width: '100%',
              padding: '7px 10px',
              marginBottom: 6,
              borderRadius: 6,
              border: '1px solid var(--verdict-desaconsejado)',
              backgroundColor: 'rgba(255, 45, 85, 0.12)',
              color: 'var(--verdict-desaconsejado)',
              fontSize: '0.75rem',
              lineHeight: 1.4,
              boxSizing: 'border-box',
            }}
          >
            <span>⚠️ {errorAviso}</span>
            <button
              type="button"
              onClick={() => setErrorAviso(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--verdict-desaconsejado)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '0 4px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {stale && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            title={t('home.card.refresh')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              width: '100%',
              padding: '7px 10px',
              marginBottom: 6,
              borderRadius: 6,
              border: '1px solid var(--verdict-aceptable)',
              backgroundColor: 'rgba(229, 229, 0, 0.12)',
              color: 'var(--verdict-aceptable)',
              fontSize: '0.75rem',
              textAlign: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              boxSizing: 'border-box',
            }}
          >
            {loading ? (
              <span>⏳ {t('common.loading')}...</span>
            ) : (
              <>
                <span>{t('home.card.staleWarning', { min: ageMin })}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>↻</span>
              </>
            )}
          </button>
        )}

        {loading && !stale && (
          <div style={{
            padding: '6px 10px', marginBottom: 6,
            color: 'var(--accent)', fontSize: '0.75rem', textAlign: 'center',
          }}>{t('common.loading')}</div>
        )}

        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 4,
          fontSize: '0.72rem', marginBottom: 4,
        }}>
          {spot.tipoAcceso != null ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--text-dim)' }}>{t('verdict.launch.title')}:</span>
              <span style={{
                padding: '2px 8px', borderRadius: 4,
                backgroundColor: 'var(--surface)',
                border: `1px solid ${colorSalida}`,
                color: colorSalida, fontWeight: 600, fontSize: '0.72rem',
              }}>{textoSalida}</span>
              <button
                type="button"
                onClick={() => onEditSpot(spot.id, 'acceso')}
                title={t('detalle.editSpot')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '2px 4px',
                }}
              >✎</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--text-dim)' }}>{t('access.none')}</span>
              <button
                type="button"
                onClick={() => onEditSpot(spot.id, 'acceso')}
                style={{
                  padding: '2px 8px', borderRadius: 4,
                  border: '1px solid var(--accent)', backgroundColor: 'transparent',
                  color: 'var(--accent)', fontSize: '0.72rem',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >+ {t('access.add')}</button>
            </div>
          )}

          <div style={{
            fontSize: '0.68rem', color: 'var(--text-dim)', textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap',
          }}>
            <span>{t('verdict.appliedThresholdPrefix')}</span>
            <button
              type="button"
              onClick={() => setModalEmbarcacionAbierto(true)}
              title={t('embarcacion.asignar', { defaultValue: 'Cambiar embarcación' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'transparent',
                border: 'none',
                color: colorVeredictoFranja,
                fontWeight: 700,
                fontSize: '0.68rem',
                cursor: 'pointer',
                padding: '0 2px',
                fontFamily: 'inherit',
              }}
            >
              <span>{nombreKayak}</span>
              <span style={{ fontSize: '0.75rem', lineHeight: 1, opacity: 0.85 }}>✎</span>
            </button>
            <span>·</span>
            <span style={{ color: colorVeredictoFranja, fontWeight: 700 }}>
              {t(`zones.${spot.zona ?? 'mediterraneo_espanol'}`)}
            </span>
          </div>
        </div>

        {detalleFranjaActiva && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 6, border: '1px solid var(--border)',
            padding: '6px 10px', fontSize: '0.75rem',
          }}>
            {factorDisparadorTexto && (
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 6,
                marginBottom: 4, fontSize: '0.72rem',
                textTransform: 'uppercase', letterSpacing: '0.04em',
                color: veredictoAColor(detalleFranjaActiva.resultado.veredicto),
                fontWeight: 700,
              }}>
                <span>{t('verdict.triggeringFactor')}</span>
                <span style={{ textTransform: 'none', fontWeight: 600 }}>{factorDisparadorTexto}</span>
              </div>
            )}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))',
              gap: 4,
            }}>
              {(['viento', 'ola', 'periodo', 'corriente', 'marea'] as const).map((f) => {
                const vf = detalleFranjaActiva.resultado.veredictoPorFactor[f];
                const col = vf ? veredictoAColor(vf) : 'var(--text-dim)';
                const lab = vf ? t(veredictoAClaveI18n(vf)) : t('detalle.noDepth');
                return (
                  <div key={f} style={{
                    backgroundColor: 'var(--bg)', borderRadius: 4,
                    padding: '4px 6px', border: `1px solid ${col}`,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                      {t(`factors.${factorKeyMap[f]}`)}
                    </div>
                    <div style={{
                      fontSize: '0.68rem', fontWeight: 600,
                      color: col, textTransform: 'uppercase',
                    }}>{lab}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main style={{
        flex: 1, minHeight: 0, padding: '10px 14px 0',
        boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
        maxWidth: 900, width: '100%', margin: '0 auto',
      }}>
        {!weather && !loading && (
          <div style={{
            color: 'var(--text-dim)', padding: '30px 0', textAlign: 'center',
          }}>{t('home.card.noData')}</div>
        )}

        {numeroGrande && weather && (
          <div style={{
            flexShrink: 0, marginBottom: 8,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 12,
          }}>
            <div>
              <span style={{
                fontSize: '2rem', fontWeight: 700,
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
                color: numeroGrande.color,
              }}>{numeroGrande.val}</span>
              <span style={{ fontSize: '1rem', marginLeft: 6, color: 'var(--text-dim)' }}>
                {numeroGrande.unit}
              </span>
            </div>

            {/* Botón MAR CRUZADA (solo pestaña Oleaje, si aplica) */}
            {tabActiva === 'waves' && hayMarCruzadaHoy && (
              <button
                type="button"
                onClick={() => setModalMarCruzadaAbierto(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  backgroundColor: 'rgba(255, 45, 85, 0.15)',
                  border: '2px solid var(--verdict-desaconsejado)',
                  borderRadius: 8,
                  color: 'var(--verdict-desaconsejado)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(255, 45, 85, 0.45)',
                  whiteSpace: 'nowrap',
                }}
              >
                ⚠ MAR CRUZADA
              </button>
            )}

            <a href="https://ko-fi.com/xanthar" target="_blank" rel="noopener noreferrer"
              title={t('settings.donate')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '12px 20px', backgroundColor: 'var(--surface)',
                border: '2px solid var(--accent)', borderRadius: 10,
                color: 'var(--accent)', fontSize: '0.95rem',
                fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 0 12px rgba(0, 229, 106, 0.35)',
                whiteSpace: 'nowrap',
              }}>
              <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>☕</span>
              <span>{t('settings.donate')}</span>
            </a>
          </div>
        )}

        {tabActiva === 'waves' && weather && (
          <TablaDatos
            tabId="waves"
            horas={horasFiltradas}
            colorNivel={colorNivel}
            lang={lang}
            columnas={[
              {
                key: 'ot',
                label: t('factors.waveHeightTotal', { defaultValue: 'O.Total' }),
                unit: `(${SUFIJO_OLA[u.ola]})`,
                render: (h) => renderOlaConDireccion(h.waveHeight, h.waveDirection),
                veredicto: subVeredictoWaves,
              },
              {
                key: 'of',
                label: t('factors.olaFondo', { defaultValue: 'O.Fondo' }),
                unit: `(${SUFIJO_OLA[u.ola]})`,
                render: (h) => renderOlaConDireccion(h.swellWaveHeight, h.swellWaveDirection),
                veredicto: subVeredictoWaves,
              },
              {
                key: 'per',
                label: t('factors.wavePeriod', { defaultValue: 'Periodo' }),
                unit: '(s)',
                render: (h) => h.wavePeriod != null ? `${h.wavePeriod.toFixed(0)}` : '—',
                veredicto: subVeredictoPeriodo,
              },
              {
                key: 'ov',
                label: t('factors.olaViento', { defaultValue: 'O.Viento' }),
                unit: `(${SUFIJO_OLA[u.ola]})`,
                render: (h) => renderOlaConDireccion(h.windWaveHeight, h.windWaveDirection),
                veredicto: subVeredictoWaves,
              },
              {
                key: 'corr',
                label: t('factors.current', { defaultValue: 'Corriente' }),
                unit: `(${SUFIJO_CORRIENTE[u.corriente]})`,
                render: (h) => {
                  if (h.currentVelocity == null) return '—';
                  const vel = formatearCorriente(h.currentVelocity, u.corriente);
                  const dir = h.currentDirection != null
                    ? gradosACardinal16(h.currentDirection)
                    : null;
                  const ind = indicadorCorriente(h.currentVelocity);
                  return (
                    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span>
                        {vel}
                        {dir != null && (
                          <span style={{ opacity: 0.75, fontSize: '0.85em', marginLeft: 3 }}>
                            {dir}
                          </span>
                        )}
                      </span>
                      {ind != null && (
                        <span style={{
                          fontSize: '0.6rem',
                          opacity: 0.8,
                          fontStyle: 'italic',
                          lineHeight: 1.1,
                          marginTop: 1,
                        }}>{ind}</span>
                      )}
                    </span>
                  );
                },
                veredicto: subVeredictoCurrent,
              },
            ]}
          />
        )}

        {tabActiva === 'wind' && weather && (
          <TablaDatos tabId="wind" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 'wd', label: 'Dir', unit: '',
                render: (h) => {
                  const nv = nombreViento(h.windDirection, spot.zona ?? 'mediterraneo_espanol', lang);
                  return nv.grados != null ? `${nv.nombre} (${nv.cardinal})` : '—';
                },
                veredicto: subVeredictoWind },
              { key: 'bf', label: 'Bf', unit: '',
                render: (h) => { const b = kmhABf(h.windSpeed); return b != null ? `${b}` : '—'; },
                veredicto: subVeredictoWind },
              { key: 'w1', label: 'V.', unit: `(${SUFIJO_VIENTO[u.viento]})`,
                render: (h) => formatearViento(h.windSpeed, u.viento),
                veredicto: subVeredictoWind },
              { key: 'g1', label: 'R.', unit: `(${SUFIJO_VIENTO[u.viento]})`,
                render: (h) => {
                  const v = h.windGusts;
                  if (v == null) return '—';
                  const esRachaFuerte = v >= 30;
                  return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      <span style={{
                        color: esRachaFuerte ? '#FF2D55' : undefined,
                        fontWeight: esRachaFuerte ? 700 : 500,
                        textShadow: esRachaFuerte ? '0 0 6px rgba(255, 45, 85, 0.7)' : 'none',
                      }}>{formatearViento(v, u.viento)}</span>
                      {esRachaFuerte && <BotonAyuda tabId="wind" />}
                    </span>
                  );
                },
                veredicto: subVeredictoWindGust },
              { key: 'w2', label: 'V.', unit: `(${SUFIJO_VIENTO[u.viento2]})`,
                render: (h) => formatearViento(h.windSpeed, u.viento2),
                veredicto: subVeredictoWind },
              { key: 'g2', label: 'R.', unit: `(${SUFIJO_VIENTO[u.viento2]})`,
                render: (h) => formatearViento(h.windGusts, u.viento2),
                veredicto: subVeredictoWindGust },
            ]}
          />
        )}

        {tabActiva === 'weather' && weather && (
          <TablaDatos tabId="weather" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 'ico', label: t('factors.weatherCode'), unit: '',
                render: (h) => {
                  const isNight = new Date(h.time).getHours() < 7 || new Date(h.time).getHours() >= 20;
                  return <span style={{ fontSize: '1.1rem' }}>{weatherCodeAIcono(h.weatherCode, isNight)}</span>;
                } },
              { key: 'cc', label: t('factors.cloudCover'), unit: '(%)',
                render: (h) => h.cloudCover != null ? `${Math.round(h.cloudCover)}` : '—' },
              { key: 'pr', label: t('factors.precipitation'), unit: `(${SUFIJO_PRECIPITACION[u.precipitacion]})`,
                render: (h) => formatearPrecipitacion(h.precipitation, u.precipitacion) },
              { key: 'prp', label: t('factors.precipitationProbability'), unit: '(%)',
                render: (h) => h.precipitationProbability != null ? `${Math.round(h.precipitationProbability)}` : '—' },
              { key: 'tmp', label: t('factors.temperature'), unit: `(${SUFIJO_TEMPERATURA[u.temperatura]})`,
                render: (h) => formatearTemperatura(h.temperature, u.temperatura) },
              { key: 'vis', label: t('factors.visibility'), unit: '(km)',
                render: (h) => formatearDistancia(h.visibility != null ? h.visibility / 1000 : null, u.visibilidad) },
            ]}
          />
        )}

        {tabActiva === 'air' && weather && (
          <TablaDatos tabId="air" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 't', label: t('factors.temperature'), unit: `(${SUFIJO_TEMPERATURA[u.temperatura]})`, render: (h) => formatearTemperatura(h.temperature, u.temperatura) },
              { key: 'at', label: t('factors.apparentTemperature'), unit: `(${SUFIJO_TEMPERATURA[u.temperatura]})`, render: (h) => formatearTemperatura(h.apparentTemperature, u.temperatura) },
              { key: 'sst', label: t('factors.seaTemperature'), unit: `(${SUFIJO_TEMPERATURA[u.temperatura]})`, render: (h) => formatearTemperatura(h.seaSurfaceTemperature, u.temperatura) },
            ]}
          />
        )}

        {tabActiva === 'barometer' && weather && (
          <TablaDatos tabId="barometer" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 'p', label: t('factors.pressure'), unit: `(${SUFIJO_PRESION[u.presion]})`, render: (h) => formatearPresion(h.pressure, u.presion) },
              { key: 'tr', label: t('factors.pressureTrend'), unit: '',
                render: (h) => {
                  const idx = horasFiltradas.indexOf(h);
                  if (idx < 3) return '—';
                  const prev = horasFiltradas[idx - 3].pressure;
                  if (prev == null || h.pressure == null) return '—';
                  const d = h.pressure - prev;
                  if (d < -2.5 || d > 2.5) {
                    return (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        <span style={{
                          color: 'var(--verdict-desaconsejado)',
                          fontWeight: 700,
                          textShadow: '0 0 6px rgba(255, 45, 85, 0.7)',
                        }}>{d < 0 ? '⬇ ‼' : '⬆ ‼'}</span>
                        <BotonAyuda tabId="barometer" />
                      </span>
                    );
                  }
                  if (d < -0.8) return <span style={{ color: 'var(--verdict-exigente)', fontWeight: 600 }}>⬇</span>;
                  if (d > 0.8) return <span style={{ color: 'var(--verdict-favorable)', fontWeight: 600 }}>⬆</span>;
                  return <span style={{ color: 'var(--text-dim)' }}>➡</span>;
                } },
            ]}
          />
        )}

        {tabActiva === 'activity' && weather && (
          <TablaDatos tabId="activity" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 'cv', label: t('factors.currentKn', { defaultValue: 'Corriente' }), unit: `(${SUFIJO_CORRIENTE[u.corriente]})`,
                render: (h) => {
                  if (h.currentVelocity == null) return '—';
                  const kn = h.currentVelocity;
                  let indicador = '▶ correcto';
                  if (kn < 0.4) indicador = 'Agua parada / baja actividad';
                  else if (kn > 1.4) indicador = 'Deriva rápida';
                  return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '0.68rem' }}>
                      <span>{formatearCorriente(kn, u.corriente)} {indicador}</span>
                      {(kn < 0.4 || kn > 1.4) && <BotonAyuda tabId="activity" />}
                    </span>
                  );
                },
                veredicto: subVeredictoCurrent },
              { key: 'cd', label: t('factors.currentDirection'), unit: '',
                render: (h) => {
                  const nv = nombreViento(h.currentDirection, spot.zona ?? 'mediterraneo_espanol', lang);
                  return nv.grados != null ? `${nv.cardinal} ${Math.round(nv.grados)}°` : '—';
                } },
              { key: 'act', label: t('factors.fishActivity'), unit: '(x/10)',
                render: (h) => {
                  const a = actividad.find((x) => x.hora === h.time);
                  if (!a) return '—';
                  return <span style={{ fontSize: '0.68rem' }}>{a.coeficiente}</span>;
                } },
            ]}
          />
        )}

        {tabActiva === 'sun' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <TablaSol lang={lang} lat={spot.lat} lon={spot.lon} />
            <div style={{ padding: 14 }}><TablaAyuda tabId="sun" /></div>
          </div>
        )}

        {tabActiva === 'moon' && (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <TablaLuna lang={lang} lat={spot.lat} lon={spot.lon} />
            <div style={{ padding: 14 }}><TablaAyuda tabId="moon" /></div>
          </div>
        )}

        {tabActiva === 'tides' && weather && (
          <TablaDatos tabId="tides" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 'sl', label: t('factors.seaLevel'), unit: `(${SUFIJO_OLA[u.ola]})`,
                render: (h) => formatearOla(h.seaLevelHeight, u.ola),
                veredicto: subVeredictoMarea },
              { key: 'tr', label: t('factors.seaLevelTrend'), unit: '',
                render: (h) => {
                  const idx = horasFiltradas.indexOf(h);
                  if (idx === 0) return '—';
                  const prev = horasFiltradas[idx - 1].seaLevelHeight;
                  if (prev == null || h.seaLevelHeight == null) return '—';
                  const d = h.seaLevelHeight - prev;
                  const inusual = Math.abs(d) > 0.08;
                  if (inusual) {
                    return (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        <span style={{
                          color: 'var(--verdict-desaconsejado)',
                          fontWeight: 700,
                          textShadow: '0 0 6px rgba(255, 45, 85, 0.7)',
                        }}>{d > 0 ? '⬆️' : '⬇️'} {d > 0 ? '+' : ''}{d.toFixed(3)}</span>
                        <BotonAyuda tabId="tides" />
                      </span>
                    );
                  }
                  if (d > 0.02) return '↑';
                  if (d < -0.02) return '↓';
                  return '→';
                } },
            ]}
          />
        )}
      </main>

      <nav style={{
        flexShrink: 0, display: 'flex', overflowX: 'auto',
        backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)',
        scrollbarWidth: 'none',
      }}>
        {subpestanasVisibles.map((tab) => {
          const active = tabActiva === tab;
          return (
            <button key={tab} onClick={() => setTabActiva(tab)} style={{
              flex: '0 0 auto', padding: '10px 14px', border: 'none',
              borderTop: active ? '2px solid var(--accent)' : '2px solid transparent',
              backgroundColor: active ? 'var(--bg)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text)',
              fontSize: '0.8rem', fontWeight: active ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{t(`tabs.${tab}`)}</button>
          );
        })}
      </nav>

      {modalEmbarcacionAbierto && (
        <SelectorEmbarcacionModal
          embarcacionIdActual={spot.embarcacionId ?? null}
          onSelect={(id) => {
            updateSpot(spot.id, { embarcacionId: id ?? undefined });
          }}
          onClose={() => setModalEmbarcacionAbierto(false)}
          onIrAAjustes={() => {
            setModalEmbarcacionAbierto(false);
            onClose();
            window.dispatchEvent(new CustomEvent('wkf:ir-a-ajustes'));
          }}
        />
      )}

      {modalMarCruzadaAbierto && (
        <ModalMarCruzada onClose={() => setModalMarCruzadaAbierto(false)} />
      )}
    </div>
  );
};

const TablaSol: React.FC<{ lang: string; lat: number; lon: number }> = ({ lang, lat, lon }) => {
  const { t } = useTranslation();
  const filas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const out: Array<{ key: string; fecha: Date; sol: ReturnType<typeof calcularSol> }> = [];
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
    <div style={{
      borderRadius: 8, border: '1px solid var(--border)',
      overflow: 'hidden', fontSize: '0.72rem',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(64px, auto) repeat(6, 1fr)',
        backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)',
        fontSize: '0.68rem', color: 'var(--text-dim)',
        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        <div style={{ padding: '6px 6px' }}>{t('factors.date')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.sunrise')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.solarNoon')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.sunset')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.twilightAstro')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.twilightNautical')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.twilightCivil')}</div>
      </div>
      {filas.map(({ key, fecha, sol }, i) => (
        <div key={key} style={{
          display: 'grid', gridTemplateColumns: 'minmax(64px, auto) repeat(6, 1fr)',
          borderTop: i > 0 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{
            padding: '5px 6px',
            fontFamily: 'var(--font-mono, Fira Code, monospace)',
            color: 'var(--text-dim)', fontWeight: 500,
          }}>{fechaLarga(fecha, lang)}</div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>{fmt(sol?.orto)}</div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>{fmt(sol?.mediodiaSolar)}</div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>{fmt(sol?.ocaso)}</div>
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

const TablaLuna: React.FC<{ lang: string; lat: number; lon: number }> = ({ lang, lat, lon }) => {
  const { t } = useTranslation();
  const filas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const out: Array<{ key: string; fecha: Date; luna: ReturnType<typeof calcularLuna> }> = [];
    for (let i = 0; i < 30; i++) {
      const f = new Date(hoy);
      f.setDate(f.getDate() + i);
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
    <div style={{
      borderRadius: 8, border: '1px solid var(--border)',
      overflow: 'hidden', fontSize: '0.72rem',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(64px, auto) 1fr 0.7fr 0.7fr 0.9fr 0.9fr 0.9fr',
        backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)',
        fontSize: '0.68rem', color: 'var(--text-dim)',
        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        <div style={{ padding: '6px 6px' }}>{t('factors.date')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.moonPhase')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.moonAge')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.moonIllum')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.moonrise')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.moonTransit')}</div>
        <div style={{ padding: '6px 4px', textAlign: 'center' }}>{t('factors.moonset')}</div>
      </div>
      {filas.map(({ key, fecha, luna }, i) => (
        <div key={key} style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(64px, auto) 1fr 0.7fr 0.7fr 0.9fr 0.9fr 0.9fr',
          borderTop: i > 0 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{
            padding: '5px 6px',
            fontFamily: 'var(--font-mono, Fira Code, monospace)',
            color: 'var(--text-dim)', fontWeight: 500,
          }}>{fechaLarga(fecha, lang)}</div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontSize: '0.7rem' }}>
            {emojiFase(luna.fase)} {nombreFase(luna.fase, lang === 'en' ? 'en' : 'es')}
          </div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>{luna.edad.toFixed(1)}</div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>{Math.round(luna.iluminacion * 100)}%</div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>{fmt(luna.ortoLunar)}</div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>{fmt(luna.transitoLunar)}</div>
          <div style={{ padding: '5px 4px', textAlign: 'center', fontFamily: 'var(--font-mono, Fira Code, monospace)' }}>{fmt(luna.ocasoLunar)}</div>
        </div>
      ))}
    </div>
  );
};

export default SpotScreen;