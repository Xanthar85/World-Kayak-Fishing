import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo.tsx';
import MapScreen from './MapScreen.tsx';
import { useAppStore } from '../state/store.ts';

const MAX_SPOTS = 6;

export function Home() {
  const { t } = useTranslation();
  const spots = useAppStore((s) => s.spots);
  const addSpot = useAppStore((s) => s.addSpot);
  const [showMap, setShowMap] = useState(false);

  const atLimit = spots.length >= MAX_SPOTS;

  if (showMap) {
    return (
      <MapScreen
        onCancel={() => setShowMap(false)}
        onSave={(draft) => {
          addSpot(draft);
          setShowMap(false);
        }}
      />
    );
  }

  return (
    <div
      className="screen"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      <header
        className="home-header"
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <Logo size="md" />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            letterSpacing: '0.05em',
          }}
        >
          {spots.length} / {MAX_SPOTS}
        </span>
      </header>

      <main
        className="home-main"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: 12,
        }}
      >
        {spots.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 16,
            }}
          >
            <p
              className="home-empty"
              style={{
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
                fontSize: 16,
                margin: 0,
              }}
            >
              {t('home.noSpots', { defaultValue: t('home.empty.title') })}
            </p>
          </div>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {spots.map((spot) => (
              <li
                key={spot.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: 15,
                    color: 'var(--text)',
                  }}
                >
                  {spot.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {spot.lat.toFixed(5)}, {spot.lon.toFixed(5)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowMap(true)}
          disabled={atLimit}
          style={{
            marginTop: 'auto',
            backgroundColor: atLimit ? 'var(--surface)' : 'var(--accent)',
            color: atLimit ? 'var(--text-secondary)' : '#0A0A0A',
            border: atLimit ? '1px solid var(--border)' : 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 15,
            cursor: atLimit ? 'not-allowed' : 'pointer',
            boxShadow: atLimit ? 'none' : '0 0 16px rgba(0, 229, 106, 0.35)',
          }}
        >
          {atLimit
            ? t('home.limitReached', { defaultValue: 'Límite de 6 puntos alcanzado' })
            : t('home.addSpot', { defaultValue: 'Añadir punto' })}
        </button>
      </main>
    </div>
  );
}

export default Home;