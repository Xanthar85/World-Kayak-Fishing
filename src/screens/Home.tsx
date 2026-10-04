import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../components/Logo.tsx';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex flex-col select-text">
      {/* Top Header */}
      <header
        className="w-full px-4 sm:px-6 py-3.5 flex items-center border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <Logo variant="horizontal" size="sm" />
      </header>

      {/* Main Content Area (Empty state in Phase 1) */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto space-y-2">
          <h2
            className="font-sans text-lg sm:text-xl font-medium tracking-tight"
            style={{ color: 'var(--text-dim)' }}
          >
            {t('home.empty.title')}
          </h2>
          <p
            className="font-sans text-sm sm:text-base leading-relaxed"
            style={{ color: 'var(--text-dim)' }}
          >
            {t('home.empty.subtitle')}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
