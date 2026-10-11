// src/components/SelectorEmbarcacionModal.tsx
// WKF — Ventana modal para seleccionar la embarcación de un punto.
// Muestra únicamente los kayaks disponibles (sin etiquetas "slot 1" / "slot 2"),
// su nombre y el botón para consultar la ficha técnica.
// Si un espacio no tiene embarcación configurada, ofrece el botón
// "Asignar embarcación" para ir a Ajustes.

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, buscarEmbarcacionPorId } from '../state/store.ts';
import { FichaTecnicaModal } from './FichaTecnicaModal.tsx';
import type { Kayak } from '../lib/kayaks.ts';
import type { Pato } from '../lib/patos.ts';

interface SelectorEmbarcacionModalProps {
  /** Id de la embarcación actualmente asignada al punto (o null si usa la activa) */
  embarcacionIdActual: string | null;
  /** Callback con el id de embarcación elegido */
  onSelect: (embarcacionId: string | null) => void;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Callback opcional para navegar a Ajustes */
  onIrAAjustes?: () => void;
}

export const SelectorEmbarcacionModal: React.FC<
  SelectorEmbarcacionModalProps
> = ({ embarcacionIdActual, onSelect, onClose, onIrAAjustes }) => {
  const { t } = useTranslation();
  const kayakIds = useAppStore((s) => s.ajustes.kayakIds);

  const [fichaTecnicaKayak, setFichaTecnicaKayak] = useState<Kayak | Pato | null>(null);

  const slot1 = kayakIds[0] ? buscarEmbarcacionPorId(kayakIds[0]) : null;
  const slot2 = kayakIds[1] ? buscarEmbarcacionPorId(kayakIds[1]) : null;

  // Si embarcacionIdActual es igual a slot2.id -> activo es slot2.
  // En cualquier otro caso (null o igual a slot1.id) -> activo es slot1.
  const slot2Activo = slot2 != null && embarcacionIdActual === slot2.id;
  const slot1Activo = slot1 != null && !slot2Activo;

  const handleIrAAjustes = () => {
    onClose();
    if (onIrAAjustes) {
      onIrAAjustes();
    }
    window.dispatchEvent(new CustomEvent('wkf:ir-a-ajustes'));
  };

  const renderCardKayak = (
    kayak: Kayak | Pato,
    activo: boolean
  ) => {
    return (
      <div
        key={kayak.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '12px 14px',
          borderRadius: 8,
          border: activo
            ? '2px solid var(--accent)'
            : '1px solid var(--border)',
          backgroundColor: activo
            ? 'rgba(0, 229, 106, 0.08)'
            : 'var(--bg)',
          transition: 'all 0.15s ease',
        }}
      >
        <div
          onClick={() => {
            onSelect(kayak.id);
            onClose();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: activo ? 'var(--accent)' : 'var(--text)',
            }}
          >
            {kayak.marca} {kayak.modelo}
          </span>
          {activo && (
            <span
              style={{
                color: 'var(--accent)',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              ✓
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFichaTecnicaKayak(kayak);
          }}
          style={{
            alignSelf: 'flex-start',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--accent-2, #00b8ff)',
            padding: '4px 10px',
            fontSize: '0.72rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          📄 {t('kayak.viewSpec', { defaultValue: 'Ver ficha técnica' })}
        </button>
      </div>
    );
  };

  const renderBotonAsignar = (key: string) => (
    <button
      key={key}
      type="button"
      onClick={handleIrAAjustes}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width: '100%',
        padding: '12px 14px',
        borderRadius: 8,
        border: '1px dashed var(--accent)',
        backgroundColor: 'rgba(0, 229, 106, 0.05)',
        color: 'var(--accent)',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s ease',
      }}
    >
      + {t('embarcacion.asignar', { defaultValue: 'Asignar embarcación' })}
    </button>
  );

  return (
    <>
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

          {/* Lista de opciones: Solo las embarcaciones disponibles o botón para asignar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Opción 1 */}
            {slot1 ? renderCardKayak(slot1, slot1Activo) : renderBotonAsignar('asignar-1')}

            {/* Opción 2 */}
            {slot2 ? renderCardKayak(slot2, slot2Activo) : renderBotonAsignar('asignar-2')}
          </div>
        </div>
      </div>

      {/* Modal de Ficha Técnica cuando se solicita */}
      {fichaTecnicaKayak && (
        <FichaTecnicaModal
          embarcacion={fichaTecnicaKayak}
          onClose={() => setFichaTecnicaKayak(null)}
        />
      )}
    </>
  );
};

export default SelectorEmbarcacionModal;
