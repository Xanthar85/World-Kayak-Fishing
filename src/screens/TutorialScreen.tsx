import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../components/Logo.tsx';

interface TutorialScreenProps {
  onClose: () => void;
}

interface Paso {
  tituloKey: string;
  bodyKey: string;
}

const PASOS: Paso[] = [
  { tituloKey: 'tutorial.step1Title', bodyKey: 'tutorial.step1Body' },
  { tituloKey: 'tutorial.step2Title', bodyKey: 'tutorial.step2Body' },
  { tituloKey: 'tutorial.step3Title', bodyKey: 'tutorial.step3Body' },
  { tituloKey: 'tutorial.step4Title', bodyKey: 'tutorial.step4Body' },
  { tituloKey: 'tutorial.step5Title', bodyKey: 'tutorial.step5Body' },
  { tituloKey: 'tutorial.step6Title', bodyKey: 'tutorial.step6Body' },
];

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'Inter, system-ui, sans-serif',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          {t('tutorial.title')}
        </h1>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--text)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t('common.close')}
        </button>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 24,
            marginTop: 8,
          }}
        >
          <Logo variant="horizontal" size="md" />
        </div>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--text-dim)',
            margin: '0 0 28px 0',
          }}
        >
          {t('tutorial.intro')}
        </p>

        {PASOS.map((paso, index) => {
          const esUltimo = index === PASOS.length - 1;
          return (
            <section
              key={paso.tituloKey}
              style={{
                backgroundColor: 'var(--surface)',
                border: `1px solid ${
                  esUltimo ? 'var(--verdict-aceptable)' : 'var(--border)'
                }`,
                borderRadius: 8,
                padding: '16px',
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: esUltimo ? 'var(--verdict-aceptable)' : 'var(--accent)',
                }}
              >
                {t(paso.tituloKey)}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--text)',
                }}
              >
                {t(paso.bodyKey)}
              </p>
            </section>
          );
        })}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 24,
            marginBottom: 32,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialScreen;