import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatearCoords, type FormatoCoords } from '../lib/coords.ts';
import {
  calcularVeredictoPorFranja,
  veredictoAColor,
  miniGraficoOlaViento,
} from '../lib/verdict-ui.ts';
import type { Spot, FranjaUsuario } from '../state/store.ts';
import type { CategoriaKayak, PerfilKayakista } from '../lib/verdict.ts';
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

  return (
    <div
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        onEdit();
      }}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'border-color 0.15s ease',
      }}
    >
      {/* Fila 1: Nombre + Borrar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {spot.name || t('common.unnamed')}
        </h2>

        {confirmingDelete ? (
          <div
            style={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setConfirmingDelete(false)}
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
              {t('common.cancel')}
            </button>
            <button
              onClick={() => {
                onDelete();
                setConfirmingDelete(false);
              }}
              style={{
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid #ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('common.delete')}
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirmingDelete(true);
            }}
            title={t('common.delete')}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '4px 6px',
              fontSize: '0.85rem',
              lineHeight: 1,
              borderRadius: 4,
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
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          marginBottom: '12px',
        }}
      >
        {coordsFormateadas}
      </div>

      {/* Fila 3: Franjas — una sola línea, color sobre el nombre (DP-073) */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '12px',
          overflow: 'hidden',
        }}
      >
        {franjas.map((franja) => {
          const v = veredictos[franja.id];
          const color = v ? veredictoAColor(v) : 'var(--text-dim)';
          const sinDatos = !v;

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
                backgroundColor: sinDatos ? 'var(--bg)' : `${color}1A`,
                border: `1px solid ${color}`,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: color,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {franja.nombre}
            </div>
          );
        })}
      </div>

      {/* Fila 4: Mini-gráfico */}
      <div
        style={{
          width: '100%',
          height: '30px',
          backgroundColor: 'var(--bg)',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: '12px',
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
            style={{ width: '100%', height: '30px', display: 'block' }}
          >
            <path
              d={graficos.ola}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={graficos.viento}
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              fontStyle: 'italic',
            }}
          >
            {t('home.card.noData')}
          </div>
        )}
      </div>

      {/* Fila 5: Botones */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onEdit}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {t('common.edit')}
        </button>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: refreshing ? 'var(--text-dim)' : 'var(--text)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: refreshing ? 'not-allowed' : 'pointer',
            opacity: refreshing ? 0.6 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {refreshing ? t('home.card.loading') : t('home.card.refresh')}
        </button>
      </div>
    </div>
  );
};

export default SpotCard;