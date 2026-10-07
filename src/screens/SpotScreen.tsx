// src/screens/SpotScreen.tsx — v1.013 limpia

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
  kmhAKn,
  kmhABf,
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

interface ColumnaTabla<T> {
  key: string;
  label: string;
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
      <div style={{
        display: 'grid', gridTemplateColumns: gridCols,
        backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)',
        fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
      }}>
        <div style={{ padding: '6px 6px', textAlign: 'left' }}>Hora</div>
        {columnas.map((c) => (
          <div key={c.key} style={{ padding: '6px 4px', textAlign: 'center' }}>{c.label}</div>
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

export const SpotScreen: React.FC<SpotScreenProps> = ({
  spotId, onClose, onEditSpot,
}) => {
  const { t, i18n } = useTranslation();
  const spots = useAppStore((s) => s.spots);
  const getWeatherEntry = useAppStore((s) => s.getWeatherEntry);
  const setWeather = useAppStore((s) => s.setWeather);
  const ajustes = useAppStore((s) => s.ajustes);
  const setFranjaActiva = useAppStore((s) => s.setFranjaActiva);

  const spot = spots.find((s) => s.id === spotId);

  const [tabActiva, setTabActiva] = useState<TabId>('waves');
  const [coordsCopiedFeedback, setCoordsCopiedFeedback] = useState(false);
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

  const handleRefresh = async () => {
    if (!spot || loading) return;
    setLoading(true);
    try {
      const data = await fetchSpotWeather(spot.lat, spot.lon);
      setWeather(spot.id, data);
    } catch (err) {
      console.error('fetch spot weather', err);
    } finally {
      setLoading(false);
    }
  };

  const franjaActiva = ajustes.franjas.find((f) => f.id === ajustes.franjaActivaId)
    ?? ajustes.franjas[0] ?? null;

  const veredictos = useMemo(() => {
    if (!spot) return {};
    return calcularVeredictoPorFranja(
      spot, weather, ajustes.franjas,
      ajustes.categoriaKayak, ajustes.perfil
    );
  }, [spot, weather, ajustes.franjas, ajustes.categoriaKayak, ajustes.perfil]);

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
        ajustes.categoriaKayak, ajustes.perfil, franjaDia,
        { viento: bf, ola: h.waveHeight, periodo: h.wavePeriod ?? 0, corriente: 0, marea: 0 }
      );
      const score = orden.indexOf(res.veredicto);
      if (score > peorScore) { peorScore = score; resultado = res; horaPeor = h; }
    }
    if (!resultado || !horaPeor) return null;
    return { resultado, horaPeor };
  }, [weather, franjaActiva, spot, ajustes.categoriaKayak, ajustes.perfil]);

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

  const subpestanasVisibles = useMemo(
    () => ALL_TABS.filter((tab) => {
      if (tab === 'waves' || tab === 'wind') return true;
      return !ajustes.subpestanasOcultas.includes(tab);
    }),
    [ajustes.subpestanasOcultas]
  );

  const horasFiltradas = useMemo(() => {
    if (!weather?.hourly) return [];
    return filtrarHoras(weather.hourly, franjaActiva, ajustes.filtroFranja, null);
  }, [weather, franjaActiva, ajustes.filtroFranja]);

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
      ajustes.categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: h.waveHeight, periodo: h.wavePeriod ?? 0, corriente: 0, marea: 0 }
    ).veredictoPorFactor.ola;
  };

  const subVeredictoWind = (h: HourlyPoint): Veredicto | null => {
    if (h.windSpeed == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      ajustes.categoriaKayak, ajustes.perfil, franjaDia,
      { viento: kmhABf(h.windSpeed) ?? 0, ola: 0, periodo: 0, corriente: 0, marea: 0 }
    ).veredictoPorFactor.viento;
  };

  const subVeredictoWindGust = (h: HourlyPoint): Veredicto | null => {
    if (h.windGusts == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      ajustes.categoriaKayak, ajustes.perfil, franjaDia,
      { viento: kmhABf(h.windGusts) ?? 0, ola: 0, periodo: 0, corriente: 0, marea: 0 }
    ).veredictoPorFactor.viento;
  };

  const subVeredictoPeriodo = (h: HourlyPoint): Veredicto | null => {
    if (h.wavePeriod == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      ajustes.categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: 0, periodo: h.wavePeriod, corriente: 0, marea: 0 }
    ).veredictoPorFactor.periodo;
  };

  const subVeredictoCurrent = (h: HourlyPoint): Veredicto | null => {
    if (h.currentVelocity == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      ajustes.categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: 0, periodo: 0, corriente: h.currentVelocity, marea: 0 }
    ).veredictoPorFactor.corriente;
  };

  const subVeredictoMarea = (h: HourlyPoint): Veredicto | null => {
    if (h.seaLevelHeight == null || !spot) return null;
    const franjaDia: FranjaDia =
      new Date(h.time).getHours() < 12 ? 'manana'
      : new Date(h.time).getHours() < 20 ? 'tarde' : 'noche';
    return calcularVeredicto(
      spot.zona ?? 'mediterraneo_espanol',
      ajustes.categoriaKayak, ajustes.perfil, franjaDia,
      { viento: 0, ola: 0, periodo: 0, corriente: 0, marea: h.seaLevelHeight }
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

  const numeroGrande = (() => {
    switch (tabActiva) {
      case 'waves': {
        const v = horasFiltradas.find((h) => h.waveHeight != null)?.waveHeight;
        return { val: v != null ? v.toFixed(1) : '—', unit: 'm', color: 'var(--accent)' };
      }
      case 'wind': {
        const v = kmhAKn(horasFiltradas.find((h) => h.windSpeed != null)?.windSpeed ?? null);
        return { val: v != null ? String(v) : '—', unit: 'kt', color: 'var(--accent-2)' };
      }
      case 'weather': {
        const v = horasFiltradas.find((h) => h.temperature != null)?.temperature;
        return { val: v != null ? v.toFixed(1) : '—', unit: '°C', color: '#f59e0b' };
      }
      case 'barometer': {
        const v = horasFiltradas.find((h) => h.pressure != null)?.pressure;
        return { val: v != null ? v.toFixed(0) : '—', unit: 'hPa', color: '#a855f7' };
      }
      case 'activity': {
        const v = horasFiltradas.find((h) => h.currentVelocity != null)?.currentVelocity;
        return { val: v != null ? v.toFixed(2) : '—', unit: 'kn', color: '#06b6d4' };
      }
      case 'tides': {
        const v = horasFiltradas.find((h) => h.seaLevelHeight != null)?.seaLevelHeight;
        return { val: v != null ? v.toFixed(2) : '—', unit: 'm', color: '#38bdf8' };
      }
      default: return null;
    }
  })();

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
          }}>
            {t('verdict.appliedThresholdPrefix')}{' '}
            <span style={{ color: colorVeredictoFranja, fontWeight: 700 }}>{ajustes.categoriaKayak}</span>
            {' / '}
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
          <TablaDatos tabId="waves" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 'wt', label: t('factors.waveHeightTotal'),
                render: (h) => h.waveHeight != null ? `${h.waveHeight.toFixed(2)} m` : '—',
                veredicto: subVeredictoWaves },
              { key: 'ww', label: t('factors.waveHeightWind'),
                render: (h) => h.windWaveHeight != null ? `${h.windWaveHeight.toFixed(2)} m` : '—',
                veredicto: subVeredictoWaves },
              { key: 'ws', label: t('factors.waveHeightSwell'),
                render: (h) => h.swellWaveHeight != null ? `${h.swellWaveHeight.toFixed(2)} m` : '—',
                veredicto: subVeredictoWaves },
              { key: 'wp', label: t('factors.wavePeriod'),
                render: (h) => h.wavePeriod != null ? `${h.wavePeriod.toFixed(0)} s` : '—',
                veredicto: subVeredictoPeriodo },
              { key: 'wd', label: t('factors.waveDirection'),
                render: (h) => {
                  const nv = nombreViento(h.waveDirection, spot.zona ?? 'mediterraneo_espanol', lang);
                  return nv.grados != null ? `${nv.cardinal} ${Math.round(nv.grados)}°` : '—';
                } },
            ]}
          />
        )}

        {tabActiva === 'wind' && weather && (
          <TablaDatos tabId="wind" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 'wd', label: t('factors.windDirection'),
                render: (h) => {
                  const nv = nombreViento(h.windDirection, spot.zona ?? 'mediterraneo_espanol', lang);
                  return nv.grados != null ? `${nv.nombre} (${nv.cardinal})` : '—';
                },
                veredicto: subVeredictoWind },
              { key: 'wk', label: t('factors.windSpeedKn'),
                render: (h) => { const v = kmhAKn(h.windSpeed); return v != null ? `${v}` : '—'; },
                veredicto: subVeredictoWind },
              { key: 'wkh', label: t('factors.windSpeedKmh'),
                render: (h) => h.windSpeed != null ? `${Math.round(h.windSpeed * 10) / 10}` : '—',
                veredicto: subVeredictoWind },
              { key: 'gk', label: t('factors.windGustsKn'),
                render: (h) => { const v = kmhAKn(h.windGusts); return v != null ? `${v}` : '—'; },
                veredicto: subVeredictoWindGust },
              { key: 'gkh', label: t('factors.windGustsKmh'),
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
                      }}>{Math.round(v * 10) / 10}</span>
                      {esRachaFuerte && <BotonAyuda tabId="wind" />}
                    </span>
                  );
                },
                veredicto: subVeredictoWindGust },
            ]}
          />
        )}

        {tabActiva === 'weather' && weather && (
          <TablaDatos tabId="weather" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
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
        )}

        {tabActiva === 'air' && weather && (
          <TablaDatos tabId="air" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 't', label: t('factors.temperature'), render: (h) => h.temperature != null ? `${h.temperature.toFixed(1)}°` : '—' },
              { key: 'at', label: t('factors.apparentTemperature'), render: (h) => h.apparentTemperature != null ? `${h.apparentTemperature.toFixed(1)}°` : '—' },
              { key: 'sst', label: t('factors.seaTemperature'), render: (h) => h.seaSurfaceTemperature != null ? `${h.seaSurfaceTemperature.toFixed(1)}°` : '—' },
            ]}
          />
        )}

        {tabActiva === 'barometer' && weather && (
          <TablaDatos tabId="barometer" horas={horasFiltradas} colorNivel={colorNivel} lang={lang}
            columnas={[
              { key: 'p', label: t('factors.pressure'), render: (h) => h.pressure != null ? `${h.pressure.toFixed(0)}` : '—' },
              { key: 'tr', label: t('factors.pressureTrend'),
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
              { key: 'cv', label: t('factors.currentKn'),
                render: (h) => {
                  if (h.currentVelocity == null) return '—';
                  const kn = h.currentVelocity;
                  const kmh = kn * 1.852;
                  let indicador = '▶ correcto';
                  if (kn < 0.4) indicador = 'Agua parada / baja actividad';
                  else if (kn > 1.4) indicador = 'Deriva rápida';
                  return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '0.68rem' }}>
                      <span>{kn.toFixed(1)} kn ({kmh.toFixed(1).replace('.', ',')} km/h) {indicador}</span>
                      {(kn < 0.4 || kn > 1.4) && <BotonAyuda tabId="activity" />}
                    </span>
                  );
                },
                veredicto: subVeredictoCurrent },
              { key: 'cd', label: t('factors.currentDirection'),
                render: (h) => {
                  const nv = nombreViento(h.currentDirection, spot.zona ?? 'mediterraneo_espanol', lang);
                  return nv.grados != null ? `${nv.cardinal} ${Math.round(nv.grados)}°` : '—';
                } },
              { key: 'act', label: t('factors.fishActivity'),
                render: (h) => {
                  const a = actividad.find((x) => x.hora === h.time);
                  if (!a) return '—';
                  return <span style={{ fontSize: '0.68rem' }}>{a.coeficiente}/10</span>;
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
              { key: 'sl', label: t('factors.seaLevel'),
                render: (h) => h.seaLevelHeight != null ? `${h.seaLevelHeight.toFixed(2)} m` : '—',
                veredicto: subVeredictoMarea },
              { key: 'tr', label: t('factors.seaLevelTrend'),
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