// src/components/FichaTecnicaModal.tsx
// WKF — Modal con la ficha técnica completa de un kayak o pato.

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Kayak, CertificacionesKayak } from '../lib/kayaks.ts';
import { type Pato, TECHOS_PATOS } from '../lib/patos.ts';

type Embarcacion = Kayak | Pato;

interface FilaCertificacion {
  labelKey: string;
  activa: boolean;
  valor?: string;
}

function construirFilasCertificaciones(
  cert: CertificacionesKayak
): FilaCertificacion[] {
  return [
    { labelKey: 'kayak.certCE', activa: cert.ce != null, valor: cert.ce ?? undefined },
    { labelKey: 'kayak.certUKCA', activa: cert.ukca != null, valor: cert.ukca ?? undefined },
    { labelKey: 'kayak.certUSCG', activa: cert.uscg },
    { labelKey: 'kayak.certABYC', activa: cert.abyc },
    { labelKey: 'kayak.certNMMA', activa: cert.nmma },
    { labelKey: 'kayak.certASNZS', activa: cert.as_nzs },
    { labelKey: 'kayak.certJCI', activa: cert.jci },
    { labelKey: 'kayak.certISO12217', activa: cert.iso_12217 },
    { labelKey: 'kayak.certISO14946', activa: cert.iso_14946 },
    { labelKey: 'kayak.certISO10087', activa: cert.iso_10087 },
  ];
}

interface FichaTecnicaModalProps {
  embarcacion: Embarcacion;
  onClose: () => void;
}

export const FichaTecnicaModal: React.FC<FichaTecnicaModalProps> = ({
  embarcacion,
  onClose,
}) => {
  const { t } = useTranslation();

  const fichaRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '7px 0',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.8rem',
  };
  const fichaLabelStyle: React.CSSProperties = {
    color: 'var(--text-dim)',
  };
  const fichaValorStyle: React.CSSProperties = {
    fontWeight: 600,
    fontFamily: 'var(--font-mono, Fira Code, monospace)',
    color: 'var(--text)',
  };

  const esPato = 'tipoEmbarcacion' in embarcacion && embarcacion.tipoEmbarcacion === 'pato';

  const filas = esPato
    ? (() => {
        const pato = embarcacion as Pato;
        const tp = TECHOS_PATOS[pato.categoriaWKF] ?? TECHOS_PATOS.P1;
        return [
          { label: t('kayak.length'), val: `${pato.eslora.toFixed(2)} m` },
          { label: t('kayak.beam'), val: `${pato.manga.toFixed(2)} m` },
          { label: 'Peso', val: `${pato.peso} kg` },
          { label: t('kayak.capacity'), val: `${pato.capacidadCarga} kg` },
          { label: 'Estructura', val: pato.tipoEstructura },
          { label: 'Material', val: pato.material },
          { label: t('kayak.category'), val: pato.categoriaWKF },
          {
            label: t('kayak.techoAbsoluto'),
            val: `${tp.vientoMaxBf} Bf / ${tp.olaMaxM.toFixed(1)} m`,
          },
          { label: t('kayak.fuente'), val: 'estimado' },
          {
            label: t('kayak.certificado'),
            val: pato.certificado
              ? t('kayak.certificadoSiWkf')
              : t('kayak.certificadoNoWkf'),
          },
          {
            label: t('kayak.verificado'),
            val: pato.verificado ? '✓' : '—',
          },
        ];
      })()
    : (() => {
        const kayak = embarcacion as Kayak;
        return [
          { label: t('kayak.length'), val: `${kayak.eslora.toFixed(2)} m` },
          { label: t('kayak.beam'), val: `${kayak.manga.toFixed(2)} m` },
          { label: t('kayak.volume'), val: `${kayak.volumen} L` },
          { label: t('kayak.hull'), val: kayak.tipoCasco },
          { label: t('kayak.sitOnTop'), val: kayak.autovaciable ? '✓' : '—' },
          { label: t('kayak.rudder'), val: kayak.timon ? '✓' : '—' },
          { label: t('kayak.bulkheads'), val: kayak.compartimentosEstancos ? '✓' : '—' },
          { label: t('kayak.capacity'), val: `${kayak.capacidadCarga} kg` },
          { label: t('kayak.propulsion'), val: kayak.propulsion },
          { label: t('kayak.category'), val: kayak.categoriaWKF },
          { label: t('kayak.directiveCategory'), val: kayak.categoriaDirectiva },
          {
            label: t('kayak.techoAbsoluto'),
            val: `${kayak.techoAbsoluto.vientoMaxBf} Bf / ${kayak.techoAbsoluto.olaMaxM.toFixed(1)} m`,
          },
          { label: t('kayak.fuente'), val: kayak.techoAbsoluto.fuente },
          {
            label: t('kayak.certificado'),
            val: kayak.certificado
              ? t('kayak.certificadoSiWkf')
              : t('kayak.certificadoNoWkf'),
          },
          { label: t('kayak.verificado'), val: kayak.verificado ? '✓' : '—' },
        ];
      })();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 2000,
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
          border: '1px solid var(--accent-2)',
          borderRadius: 12,
          padding: 20,
          maxWidth: 520,
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
          <div>
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--accent-2)',
              }}
            >
              {embarcacion.marca} {embarcacion.modelo}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                marginTop: 2,
              }}
            >
              {t('kayak.title')} — {t('kayak.category')} {embarcacion.categoriaWKF}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {filas.map(({ label, val }) => (
          <div key={label} style={fichaRowStyle}>
            <span style={fichaLabelStyle}>{label}</span>
            <span style={fichaValorStyle}>{val}</span>
          </div>
        ))}

        {'certificaciones' in embarcacion && embarcacion.certificaciones && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-dim)',
                marginBottom: 6,
              }}
            >
              {t('kayak.certificaciones')}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 6,
              }}
            >
              {construirFilasCertificaciones(embarcacion.certificaciones).map(
                ({ labelKey, activa, valor }) => (
                  <div
                    key={labelKey}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: `1px solid ${activa ? 'var(--accent)' : 'var(--border)'}`,
                      backgroundColor: activa
                        ? 'var(--accent-subtle, rgba(0, 229, 106, 0.10))'
                        : 'transparent',
                      fontSize: '0.75rem',
                      color: activa ? 'var(--text)' : 'var(--text-dim)',
                    }}
                  >
                    <span>{t(labelKey)}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono, Fira Code, monospace)',
                        fontWeight: activa ? 700 : 400,
                      }}
                    >
                      {activa ? (valor ?? '✓') : '—'}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {!embarcacion.certificado && (
          <div
            style={{
              marginTop: 12,
              padding: '8px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              lineHeight: 1.4,
            }}
          >
            {t('kayak.noCertDisclaimer')}
          </div>
        )}
      </div>
    </div>
  );
};

export default FichaTecnicaModal;
