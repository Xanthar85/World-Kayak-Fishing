import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo.tsx';
import MapScreen from './MapScreen.tsx';
import { useAppStore, type Spot } from '../state/store.ts';

const MAX_SPOTS = 6;

export function Home() {
  const { t } = useTranslation();
  const spots = useAppStore((s) => s.spots);
  const addSpot = useAppStore((s) => s.addSpot);
  const updateSpot = useAppStore((s) => s.updateSpot);
  const removeSpot = useAppStore((s) => s.removeSpot);

  const [showMap, setShowMap] = useState(false);
  const [editing, setEditing] = useState<Spot | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const atLimit = spots.length >= MAX_SPOTS;

  function openNew() {
    setEditing(null);
    setShowMap(true);
  }

  function openEdit(spot: Spot) {
    setEditing(spot);
    setShowMap(true);
  }

  if (showMap) {
    return (
      <MapScreen
        initialSpot={
          editing ? { name: editing.name, lat: editing.lat, lon: editing.lon } : null
        }
        onCancel={() => {
          setShowMap(false);
          setEditing(null);
        }}
        onSave={(draft) => {
          if (editing) {
            updateSpot(editing.id, draft);
          } else {
            addSpot(draft);
          }
          setShowMap(false);
          setEditing(null);
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
          {t('home.counter', { count: spots.length, max: MAX_SPOTS })}
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
              {t('home.noSpots')}
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
            {spots.map((spot) => {
              const isConfirming = confirmDeleteId === spot.id;
              return (
                <li
                  key={spot.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => openEdit(spot)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
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
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    {isConfirming ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          {t('common.cancel')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removeSpot(spot.id);
                            setConfirmDeleteId(null);
                          }}
                          style={{
                            background: '#FF2D55',
                            color: '#0A0A0A',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 12px',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          {t('common.delete')}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(spot.id)}
                        style={{
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        {t('common.delete')}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <button
          type="button"
          className="btn-primary"
          onClick={openNew}
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
          {atLimit ? t('home.limitReached') : t('home.addSpot')}
        </button>
      </main>
    </div>
  );
}

export default Home;