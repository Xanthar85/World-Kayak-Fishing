import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatearCoords, type FormatoCoords } from '../lib/coords.ts';
import {
  calcularVeredictoPorFranja,
  veredictoAColor,
  miniGraficoOlaViento,
} from '../lib/verdict-ui.ts';
import type { Spot, FranjaUsuario } from '../state/store.ts';
import type { CategoriaKayak, PerfilKayakista, Veredicto } from '../lib/verdict.ts';
import type { SpotWeather } from '../lib/openmeteo.ts';

export interface SpotCardProps {
  spot: Spot;
  weather: SpotWeather | null;
  franjas: FranjaUsuario[];
  categoria: CategoriaKayak;
  perfil: PerfilKayakista;
  formatoCoords: FormatoCoords;
  onRefresh: () => void;
  onEdit: () => void;
  onDelete: () => void;
  refreshing?: boolean;
}

// Devuelve la fecha YYYY-MM-DD local de un timestamp (para agrupar
// por día).
function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  weather,
  franjas,
  categoria,
  perfil,
  formatoCoords,
  onRefresh,
  onEdit,
  onDelete,
  refreshing = false,
}) => {
  const { t } = useTranslation();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const veredictos = calcularVeredictoPorFranja(
    spot,
    weather,
    franjas,
    categoria,
    perfil
  );

  const graficos = miniGraficoOlaViento(weather);
  const coordsFormateadas = formatearCoords(spot.lat, spot.lon, formatoCoords);

  // Construye los 3 días a mostrar: hoy, +1, +2.
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dias = [0, 1, 2].map((offset) => {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() + offset);
    return {
      offset,
      fecha,
      key: localDateKey(fecha),
    };
  });

  const ahora = new Date();
  const horaActual = ahora.getHours();

  // Dada una franja y una fecha, ¿ya ha pasado esa franja?
  function franjaPasada(fechaBase: Date, inicio: number, fin: number): boolean {
    // Solo el día 0 puede tener franjas pasadas. Otros días no.
    const hoyKey = localDateKey(hoy);
    const fechaKey = localDateKey(fechaBase);
    if (fechaKey !== hoyKey) return false;
    // Si la franja va de hoy a mañana (inicio > fin), no la marcamos
    // pasada hasta que toda la franja haya terminado. Simplificación:
    // si inicio < fin, pasada si horaActual >= fin.
    // Si inicio > fin (noche), pasada solo si horaActual >= inicio.
    if (inicio < fin) return horaActual >= fin;
    return horaActual >= inicio;
  }

  // Etiqueta legible del día.
  function etiquetaDia(offset: number): string {
    if (offset === 0) return t('home.today');
    if (offset === 1) return t('home.tomorrow');
    if (offset === 2) return t('home.dayAfter');
    return t('home.dayN', { n: offset });
  }

  // Comprueba si el veredicto de una franja en un día concreto
  // tiene datos. Si el día no es hoy, no tenemos un veredicto por
  // hora calculado. Lo calculamos a partir del weather completo.
  function veredictoFranjaDia(
    franja: FranjaUsuario,
    fechaBase: Date
  ): Veredicto | null {
    if (!weather) return null;
    const key = localDateKey(fechaBase);
    const horas = weather.hourly.filter((h) => {
      const d = new Date(h.time);
      return localDateKey(d) === key;
    });
    if (horas.length === 0) return null;

    // Reutilizamos la lógica de verdict-ui.ts pero filtrando por
    // fecha. Para no duplicar, usamos calcularVeredictoPorFranja
    // sobre un weather sintético de un día.
    const weatherDia: SpotWeather = { ...weather, hourly: horas };
    const res = calcularVeredictoPorFranja(
      spot,
      weatherDia,
      [franja],
      categoria,
      perfil
    );
    return res[franja.id] ?? null;
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '14px',
        marginBottom: '12px',
        position: 'relative',
      }}
    >
      {/* Fila 1: Nombre + borrar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <h2
          onClick={onEdit}
          style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          {spot.name || t('common.unnamed')}
        </h2>

        {confirmingDelete ? (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => setConfirmingDelete(false)}
              style={{
                padding: '4px 8px', borderRadius: 4,
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text-dim)', fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={() => { onDelete(); setConfirmingDelete(false); }}
              style={{
                padding: '4px 8px', borderRadius: 4,
                border: '1px solid #ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444', fontSize: '0.75rem',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              {t('common.delete')}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            title={t('common.delete')}
            style={{
              border: 'none', background: 'transparent',
              color: 'var(--text-dim)', cursor: 'pointer',
              padding: '4px 6px', fontSize: '0.85rem',
              lineHeight: 1, borderRadius: 4,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Fila 2: Coordenadas */}
      <div
        style={{
          fontFamily: 'var(--font-mono, Fira Code, monospace)',
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          marginBottom: '10px',
        }}
      >
        {coordsFormateadas}
      </div>

      {/* Fila 3: 3 días × franjas. Borde + texto, sin relleno. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginBottom: '12px',
        }}
      >
        {dias.map(({ offset, fecha, key }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                minWidth: 62,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: offset === 0 ? 'var(--accent)' : 'var(--text-dim)',
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
              }}
            >
              {etiquetaDia(offset)}
            </div>
            <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
              {franjas.map((franja) => {
                const v = veredictoFranjaDia(franja, fecha);
                const color = v ? veredictoAColor(v) : 'var(--text-dim)';
                const pasada = franjaPasada(fecha, franja.inicio, franja.fin);

                return (
                  <div
                    key={franja.id}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px 4px',
                      borderRadius: 6,
                      backgroundColor: pasada
                        ? 'var(--bg)'
                        : 'transparent',
                      border: `1px solid ${color}`,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: color,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      opacity: pasada ? 0.35 : 1,
                    }}
                  >
                    {franja.nombre}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Fila 4: Mini-gráfico */}
      <div
        style={{
          width: '100%',
          height: '28px',
          backgroundColor: 'var(--bg)',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: '10px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {graficos.ola && graficos.viento ? (
          <svg
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '28px', display: 'block' }}
          >
            <path d={graficos.ola} fill="none" stroke="var(--accent)"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={graficos.viento} fill="none" stroke="var(--accent-2)"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <div
            style={{
              fontSize: '0.7rem', color: 'var(--text-dim)', fontStyle: 'italic',
            }}
          >
            {t('home.card.noData')}
          </div>
        )}
      </div>

      {/* Fila 5: Botones */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button
          onClick={onEdit}
          style={{
            padding: '5px 10px', borderRadius: 6,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)', color: 'var(--text)',
            fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer',
          }}
        >
          {t('common.edit')}
        </button>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          style={{
            padding: '5px 10px', borderRadius: 6,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: refreshing ? 'var(--text-dim)' : 'var(--text)',
            fontSize: '0.78rem', fontWeight: 500,
            cursor: refreshing ? 'not-allowed' : 'pointer',
            opacity: refreshing ? 0.6 : 1,
          }}
        >
          {refreshing ? t('home.card.loading') : t('home.card.refresh')}
        </button>
      </div>
    </div>
  );
};

export default SpotCard;