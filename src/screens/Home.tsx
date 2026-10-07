// src/screens/Home.tsx — completo
// v1.010 (bugs 5, 6, 7, 15, 17, 20):
//   - SpotCard rediseñada (delegada).
//   - Home 7 días (DP-079), ya en SpotCard.
//   - Franjas clicables desde Home (bug 6): abre SpotScreen con
//     la franja activa y el día elegido.
//   - Botón "Invitar a un café" reubicado arriba a la derecha,
//     debajo de Ajustes (bug 15, DP-094).
//   - Reordenar por arrastre (DP-083).
//   - El aviso de actualización se mantiene. Sin cambios.

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type Spot } from '../state/store.ts';
import { Logo } from '../components/Logo.tsx';
import { SettingsScreen } from './SettingsScreen.tsx';
import { SpotScreen } from './SpotScreen.tsx';
import { MapScreen } from './MapScreen.tsx';
import { TutorialScreen } from './TutorialScreen.tsx';
import { SpotCard } from '../components/SpotCard.tsx';
import { PWAInstallButton } from '../components/PWAInstallButton.tsx';
import { PantallaDeslizante } from '../components/PantallaDeslizante.tsx';
import { fetchSpotWeather } from '../lib/openmeteo.ts';
import { PrevisionScreen } from './PrevisionScreen.tsx';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const [pestanaActiva, setPestanaActiva] = useState<'puntos' | 'prevision' | 'ajustes'>('puntos');
  const [cerrando, setCerrando] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [viewingSpotId, setViewingSpotId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'new' | 'edit' | null>(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [editSpot, setEditSpot] = useState<Spot | null>(null);
  const [refreshingMap, setRefreshingMap] = useState<Record<string, boolean>>({});

  // Reordenar por arrastre (DP-083).
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const spots = useAppStore((s) => s.spots);
  const ajustes = useAppStore((s) => s.ajustes);
  const getFreshWeather = useAppStore((s) => s.getFreshWeather);
  const getWeatherEntry = useAppStore((s) => s.getWeatherEntry);
  const setWeather = useAppStore((s) => s.setWeather);
  const addSpot = useAppStore((s) => s.addSpot);
  const updateSpot = useAppStore((s) => s.updateSpot);
  const removeSpot = useAppStore((s) => s.removeSpot);
  const setFranjaActiva = useAppStore((s) => s.setFranjaActiva);
  const reorderSpots = useAppStore((s) => s.reorderSpots);

  const autoFetchDoneRef = useRef(false);

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

  useEffect(() => {
    if (spots.length === 0) return;
    if (autoFetchDoneRef.current) return;
    autoFetchDoneRef.current = true;

    for (const spot of spots) {
      const entry = getWeatherEntry(spot.id);
      if (!entry || entry.stale) {
        void handleRefreshSpot(spot.id, spot.lat, spot.lon);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spots.length]);

  const volverAHome = () => {
    setMapMode(null);
    setEditSpot(null);
    setViewingSpotId(null);
    setMostrarMapa(false);
    setCerrando(false);
  };

  // Abrir un punto en concreto y, si aplica, activar una franja
  // y el día elegido.
  const abrirPunto = (spotId: string, franjaId?: string) => {
    if (franjaId) setFranjaActiva(franjaId);
    setViewingSpotId(spotId);
  };

  if (showTutorial) {
    return (
      <PantallaDeslizante
        activa={!cerrando}
        onClose={() => {
          setShowTutorial(false);
          setCerrando(false);
        }}
      >
        <TutorialScreen onClose={() => setCerrando(true)} />
      </PantallaDeslizante>
    );
  }

  // Manejadores de drag and drop para reordenar.
  const handleDragStart = (spotId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', spotId);
    setDraggingId(spotId);
  };

  const handleDragOver = (spotId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== spotId) setDragOverId(spotId);
  };

  const handleDrop = (targetId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggingId;
    setDraggingId(null);
    setDragOverId(null);
    if (!sourceId || sourceId === targetId) return;
    const from = spots.findIndex((s) => s.id === sourceId);
    const to = spots.findIndex((s) => s.id === targetId);
    if (from < 0 || to < 0) return;
    const copia = [...spots];
    const [movido] = copia.splice(from, 1);
    copia.splice(to, 0, movido);
    reorderSpots(copia.map((s) => s.id));
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
          <PWAInstallButton />
          {/* Ko-fi arriba a la derecha, debajo de Ajustes (bug 15,
              DP-094). */}
          <a
            href="https://ko-fi.com/xanthar"
            target="_blank"
            rel="noopener noreferrer"
            title={t('settings.donate')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '8px 10px',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--accent)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>☕</span>
          </a>
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
          paddingBottom: '80px',
        }}
      >
        {pestanaActiva === 'puntos' &&
          (spots.length === 0 ? (
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
                marginTop: 20,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.7 }}>📍</div>
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
                  maxWidth: 360,
                }}
              >
                {t('home.empty.subtitle')}
              </p>
              <button
                onClick={() => {
                  setEditSpot(null);
                  setMapMode('new');
                  setMostrarMapa(true);
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
                  onOpenFranja={(franjaId) => abrirPunto(spot.id, franjaId)}
                  draggable
                  isDragging={draggingId === spot.id}
                  onDragStart={handleDragStart(spot.id)}
                  onDragOver={handleDragOver(spot.id)}
                  onDrop={handleDrop(spot.id)}
                />
              ))}
            </div>
          ))}

        {pestanaActiva === 'prevision' && <PrevisionScreen />}

        {pestanaActiva === 'ajustes' && (
          <SettingsScreen
            onClose={() => setPestanaActiva('puntos')}
            onOpenTutorial={() => {
              setPestanaActiva('puntos');
              setShowTutorial(true);
            }}
          />
        )}
      </main>

      {pestanaActiva === 'puntos' && spots.length > 0 && spots.length < 6 && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
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
              setMostrarMapa(true);
            }}
            style={{
              pointerEvents: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              backgroundColor: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: 24,
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow:
                '0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 229, 106, 0.3)',
            }}
          >
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span>
            <span>{t('home.addSpot')}</span>
          </button>
        </div>
      )}

      {/* Barra inferior fija */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 100,
        }}
      >
        <button
          type="button"
          onClick={() => setPestanaActiva('puntos')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '8px 16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: pestanaActiva === 'puntos' ? 'var(--accent)' : 'var(--text-dim)',
            fontWeight: pestanaActiva === 'puntos' ? 600 : 400,
            fontSize: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>📍</span>
          <span>Puntos</span>
        </button>

        <button
          type="button"
          onClick={() => setPestanaActiva('prevision')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '8px 16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: pestanaActiva === 'prevision' ? 'var(--accent)' : 'var(--text-dim)',
            fontWeight: pestanaActiva === 'prevision' ? 600 : 400,
            fontSize: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🌊</span>
          <span>Previsión</span>
        </button>

        <button
          type="button"
          onClick={() => setPestanaActiva('ajustes')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '8px 16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: pestanaActiva === 'ajustes' ? 'var(--accent)' : 'var(--text-dim)',
            fontWeight: pestanaActiva === 'ajustes' ? 600 : 400,
            fontSize: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>⚙</span>
          <span>Ajustes</span>
        </button>
      </nav>

      {/* Superposición: MapScreen */}
      {mostrarMapa && (
        <PantallaDeslizante
          activa={!cerrando}
          onClose={() => {
            setMostrarMapa(false);
            volverAHome();
          }}
        >
          <MapScreen
            initialSpot={editSpot}
            onCancel={() => setCerrando(true)}
            onSave={(draft) => {
              if (editSpot) updateSpot(editSpot.id, draft);
              else addSpot(draft);
              setCerrando(true);
            }}
          />
        </PantallaDeslizante>
      )}

      {/* Superposición: SpotScreen */}
      {viewingSpotId !== null && (
        <PantallaDeslizante
          activa={!cerrando}
          onClose={() => {
            setViewingSpotId(null);
            setCerrando(false);
          }}
        >
          <SpotScreen
            spotId={viewingSpotId}
            onClose={() => setCerrando(true)}
            onAddAccess={(spotId) => {
              const s = spots.find((x) => x.id === spotId);
              if (s) {
                setEditSpot(s);
                setMapMode('edit');
                setMostrarMapa(true);
              }
            }}
          />
        </PantallaDeslizante>
      )}
    </div>
  );
};

export default Home;