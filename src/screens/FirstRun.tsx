import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../state/store.ts';
import { Logo } from '../components/Logo.tsx';

export const FirstRun: React.FC = () => {
  const { t } = useTranslation();
  const markFirstRunDone = useAppStore((state) => state.markFirstRunDone);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 select-text">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center">
        {/* Large horizontal logo */}
        <header className="mb-10 sm:mb-12">
          <Logo variant="horizontal" size="lg" />
        </header>

        {/* Welcome title */}
        <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-[var(--text)]">
          {t('firstrun.welcome')}
        </h1>

        {/* Introductory description */}
        <p className="font-sans text-base sm:text-lg text-[var(--text-dim)] max-w-md leading-relaxed mb-10">
          {t('firstrun.intro')}
        </p>

        {/* Primary CTA button */}
        <button
          type="button"
          onClick={markFirstRunDone}
          className="cursor-pointer font-sans font-semibold text-base sm:text-lg px-8 py-4 rounded-lg transition-transform active:scale-95"
          style={{
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
