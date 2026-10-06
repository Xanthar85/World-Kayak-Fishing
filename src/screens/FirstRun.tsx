// src/screens/FirstRun.tsx
// WKF — Pantalla de primer arranque. Sin cambios en v1.010.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../state/store.ts';
import { Logo } from '../components/Logo.tsx';

export const FirstRun: React.FC = () => {
  const { t } = useTranslation();
  const markFirstRunDone = useAppStore((state) => state.markFirstRunDone);

  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <header style={{ marginBottom: 40 }}>
          <Logo variant="horizontal" size="lg" />
        </header>

        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            marginBottom: 16,
            color: 'var(--text)',
          }}
        >
          {t('firstrun.welcome')}
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--text-dim)',
            maxWidth: 420,
            marginBottom: 40,
          }}
        >
          {t('firstrun.intro')}
        </p>

        <button
          type="button"
          onClick={markFirstRunDone}
          style={{
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 17,
            padding: '16px 32px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: 'var(--accent)',
            color: '#0A0A0A',
            boxShadow: '0 0 20px rgba(0, 229, 106, 0.45)',
          }}
        >
          {t('firstrun.addFirstSpot')}
        </button>
      </div>
    </main>
  );
};

export default FirstRun;