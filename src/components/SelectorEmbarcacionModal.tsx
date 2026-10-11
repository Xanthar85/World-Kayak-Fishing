// src/components/SelectorEmbarcacionModal.tsx
// WKF — Ventana modal para asignar una embarcación (kayak o pato) a un
// punto de pesca. Se abre desde el lápiz de la tarjeta Home y desde el
// lápiz de la ficha del punto. Permite elegir entre los slots 1 y 2 de
// Ajustes, o volver a "usar el kayak activo" (comportamiento por
// defecto).

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, buscarEmbarcacionPorId } from '../state/store.ts';

interface SelectorEmbarcacionModalProps {
  /** Si es null, el punto NO tiene embarcación asignada (usa la activa). */
  embarcacionIdActual: string | null;
  /** Callback con el id elegido (string) o null para "usar la activa". */
  onSelect: (embarcacionId: string | null) => void;
  /** Callback para cerrar la ventana sin cambiar nada. */
  onClose: () => void;
  /** Callback para ir a Ajustes (opcional). */
  onIrAAjustes?: () => void;
}

export const SelectorEmbarcacionModal: React.FC<
  SelectorEmbarcacionModalProps
> = ({ embarcacionIdActual, onSelect, onClose, onIrAAjustes }) => {
  const { t } = useTranslation();
  const kayakIds = useAppStore((s) => s.ajustes.kayakIds);

  const slot1 = kayakIds[0] ? buscarEmbarcacionPorId(kayakIds[0]) : null;
  const slot2 = kayakIds[1] ? buscarEmbarcacionPorId(kayakIds[1]) : null;

  const slot1Activo = embarcacionIdActual === slot1?.id;
  const slot2Activo = embarcacionIdActual === slot2?.id;
  const usarActivoActivo = embarcacionIdActual == null;

  const botonBase: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg)',
    color: 'var(--text)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'all 0.15s ease',
  };

  const badgeSlot: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: 'var(--text-dim)',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(3px)',
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: 'var(--surface)',
          borderRadius: 12,
          border: '1px solid var(--border)',
          padding: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Cabecera */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text)',
              }}
            >
              {t('embarcacion.selector.titulo', {
                defaultValue: 'Embarcación para este punto',
              })}
            </h3>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
              }}
            >
              {t('embarcacion.selector.subtitulo', {
                defaultValue:
                  'Elige con qué kayak o pato evaluar las condiciones de este punto.',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close', { defaultValue: 'Cerrar' })}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '1.1rem',
              cursor: 'pointer',
              padding: '4px 6px',
              lineHeight: 1,
              borderRadius: 6,
            }}
          >
            ✕
          </button>
        </div>

        {/* Lista de opciones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Opción por defecto: Usar la activa de Ajustes */}
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            style={{
              ...botonBase,
              border: usarActivoActivo
                ? '2px solid var(--accent)'
                : '1px solid var(--border)',
              backgroundColor: usarActivoActivo
                ? 'rgba(0, 229, 106, 0.08)'
                : 'var(--bg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: usarActivoActivo ? 'var(--accent)' : 'var(--text)',
                }}
              >
                {t('embarcacion.selector.usarActiva', {
                  defaultValue: 'Usar la activa de Ajustes',
                })}
              </span>
              {usarActivoActivo && (
                <span
                  style={{
                    color: 'var(--accent)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
              }}
            >
              {slot1
                ? `${slot1.marca} ${slot1.modelo} (Slot 1)`
                : t('embarcacion.selector.sinDefinir', {
                    defaultValue: 'Sin embarcación definida',
                  })}
            </span>
          </button>

          {/* Slot 1 */}
          {slot1 && (
            <button
              type="button"
              onClick={() => {
                onSelect(slot1.id);
                onClose();
              }}
              style={{
                ...botonBase,
                border: slot1Activo
                  ? '2px solid var(--accent)'
                  : '1px solid var(--border)',
                backgroundColor: slot1Activo
                  ? 'rgba(0, 229, 106, 0.08)'
                  : 'var(--bg)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={badgeSlot}>Slot 1</span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: slot1Activo ? 'var(--accent)' : 'var(--text)',
                    }}
                  >
                    {slot1.marca} {slot1.modelo}
                  </span>
                </div>
                {slot1Activo && (
                  <span
                    style={{
                      color: 'var(--accent)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-dim)',
                }}
              >
                {t('embarcacion.selector.cat', {
                  defaultValue: 'Cat.',
                })}{' '}
                {slot1.categoriaWKF} · {slot1.eslora.toFixed(2)} m ×{' '}
                {slot1.manga.toFixed(2)} m
              </span>
            </button>
          )}

          {/* Slot 2 */}
          {slot2 ? (
            <button
              type="button"
              onClick={() => {
                onSelect(slot2.id);
                onClose();
              }}
              style={{
                ...botonBase,
                border: slot2Activo
                  ? '2px solid var(--accent)'
                  : '1px solid var(--border)',
                backgroundColor: slot2Activo
                  ? 'rgba(0, 229, 106, 0.08)'
                  : 'var(--bg)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={badgeSlot}>Slot 2</span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: slot2Activo ? 'var(--accent)' : 'var(--text)',
                    }}
                  >
                    {slot2.marca} {slot2.modelo}
                  </span>
                </div>
                {slot2Activo && (
                  <span
                    style={{
                      color: 'var(--accent)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-dim)',
                }}
              >
                {t('embarcacion.selector.cat', {
                  defaultValue: 'Cat.',
                })}{' '}
                {slot2.categoriaWKF} · {slot2.eslora.toFixed(2)} m ×{' '}
                {slot2.manga.toFixed(2)} m
              </span>
            </button>
          ) : (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px dashed var(--border)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <span>
                {t('embarcacion.selector.slot2Vacio', {
                  defaultValue: 'Slot 2 sin configurar',
                })}
              </span>
              {onIrAAjustes && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onIrAAjustes();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  {t('embarcacion.selector.irAAjustes', {
                    defaultValue: 'Configurar en Ajustes',
                  })}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pie: enlace a ajustes */}
        {onIrAAjustes && (
          <div
            style={{
              paddingTop: 8,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={() => {
                onClose();
                onIrAAjustes();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                padding: '4px 6px',
                textDecoration: 'underline',
              }}
            >
              ⚙ {t('embarcacion.selector.gestionarAjustes', {
                defaultValue: 'Gestionar embarcaciones en Ajustes',
              })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectorEmbarcacionModal;
