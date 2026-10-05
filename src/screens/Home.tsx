// src/screens/Home.tsx — completo
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type Spot } from '../state/store.ts';
import { Logo } from '../components/Logo.tsx';
import { SettingsScreen } from './SettingsScreen.tsx';
import { SpotScreen } from './SpotScreen.tsx';
import { MapScreen } from './MapScreen.tsx';
import { SpotCard } from '../components/SpotCard.tsx';
import { fetchSpotWeather } from '../lib/openmeteo.ts';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const [showSettings, setShowSettings] = useState(false);
  const [viewingSpotId, setViewingSpotId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'new' | 'edit' | null>(null);
  const [editSpot, setEditSpot] = useState<Spot | null>(null);
  const [refreshingMap, setRefreshingMap] = useState<Record<string, boolean>>({});

  const spots = useAppStore((s) => s.spots);
  const ajustes = useAppStore((s) => s.ajustes);
  const getFreshWeather = useAppStore((s) => s.getFreshWeather);
  const setWeather = useAppStore((s) => s.setWeather);
  const addSpot = useAppStore((s) => s.addSpot);
  const updateSpot = useAppStore((s) => s.updateSpot);
  const removeSpot = useAppStore((s) => s.removeSpot);

  const handleRefreshSpot = async (spotId: string, lat: number, lon: number) => {
    if (refreshingMap[spotId]) return;
    setRefreshingMap((prev) => ({ ...prev, [spotId]: true }));
    try {
      const data = await fetchSpotWeather(lat, lon);
      setWeather(spotId, data);
    } catch (err) {
      console.error('Error refreshing weather for spot', spotId, err);
    } finally {
      setRefreshingMap((prev) => ({ ...prev, [spotId]: false }));
    }
  };

  // Cierra toda la navegación interna y vuelve a la lista de Home.
  const volverAHome = () => {
    setMapMode(null);
    setEditSpot(null);
    setViewingSpotId(null);
  };

  if (mapMode !== null) {
    return (
      <MapScreen
        initialSpot={editSpot}
        onCancel={volverAHome}
        onSave={(draft) => {
          if (editSpot) {
            updateSpot(editSpot.id, draft);
          } else {
            addSpot(draft);
          }
          volverAHome();
        }}
      />
    );
  }

  if (viewingSpotId !== null) {
    return (
      <SpotScreen
        spotId={viewingSpotId}
        onClose={() => setViewingSpotId(null)}
        onAddAccess={(spotId) => {
          const s = spots.find((x) => x.id === spotId);
          if (s) {
            setEditSpot(s);
            setMapMode('edit');
            // Mantenemos viewingSpotId como estaba: si el usuario
            // cancela el MapScreen, volverAHome lo limpia igual.
            // Pero como queremos volver a Home tras guardar/cancelar,
            // volverAHome se encarga de ambos casos.
          }
        }}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Logo size="md" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, Fira Code, monospace)',
              fontSize: '0.85rem',
              color: 'var(--text-dim)',
              backgroundColor: 'var(--bg)',
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid var(--border)',
            }}
          >
            {t('home.counter', { count: spots.length, max: 6 })}
          </span>

          <button
            onClick={() => setShowSettings(true)}
            title={t('settings.title')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>⚙</span>
            <span>{t('settings.title')}</span>
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          padding: '20px',
          boxSizing: 'border-box',
          paddingBottom: spots.length > 0 && spots.length < 6 ? '90px' : '40px',
        }}
      >
        {spots.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--surface)',
              borderRadius: 8,
              border: '1px solid var(--border)',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                fontSize: '2rem',
                marginBottom: '12px',
                opacity: 0.7,
              }}
            >
              📍
            </div>
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--text)',
              }}
            >
              {t('home.noSpots')}
            </h3>
            <p
              style={{
                margin: '0 0 20px 0',
                fontSize: '0.9rem',
                color: 'var(--text-dim)',
                maxWidth: '360px',
              }}
            >
              {t('home.empty.subtitle')}
            </p>
            <button
              onClick={() => {
                setEditSpot(null);
                setMapMode('new');
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--accent)',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 229, 106, 0.25)',
              }}
            >
              + {t('home.addSpot')}
            </button>
          </div>
        ) : (
          <div>
            {spots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                weather={getFreshWeather(spot.id)}
                franjas={ajustes.franjas}
                categoria={ajustes.categoriaKayak}
                perfil={ajustes.perfil}
                formatoCoords={ajustes.formatoCoords}
                refreshing={!!refreshingMap[spot.id]}
                onRefresh={() => handleRefreshSpot(spot.id, spot.lat, spot.lon)}
                onEdit={() => setViewingSpotId(spot.id)}
                onDelete={() => removeSpot(spot.id)}
              />
            ))}
          </div>
        )}
      </main>

      {spots.length > 0 && spots.length < 6 && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 90,
            pointerEvents: 'none',
          }}
        >
          <button
            onClick={() => {
              setEditSpot(null);
              setMapMode('new');
            }}
            style={{
              pointerEvents: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: 24,
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 229, 106, 0.3)',
            }}
          >
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span>
            <span>{t('home.addSpot')}</span>
          </button>
        </div>
      )}

      <footer
        style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          padding: '16px 20px',
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        <a
          href="https://ko-fi.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent)',
            fontSize: '0.85rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          <span>☕</span>
          <span>{t('settings.donate')}</span>
        </a>
      </footer>

      {showSettings && (
        <SettingsScreen onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default Home;