import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { Spot } from '../state/store.ts';
import type { Zona, TipoAcceso } from '../lib/verdict.ts';
import { stringsEs } from '../i18n/strings.es.ts';
import { obtenerProfundidad, proponerAcceso } from '../lib/batimetria.ts';

const SPAIN_CENTER: [number, number] = [39.5, -0.5];
const INITIAL_ZOOM = 6;

function createPinIcon(color: string) {
  return L.divIcon({
    className: 'wkf-pin',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="16" r="11" stroke="${color}" stroke-width="2" fill="#0A0A0A"/>
        <circle cx="20" cy="16" r="3.5" fill="${color}"/>
        <line x1="20" y1="3" x2="20" y2="6" stroke="${color}" stroke-width="1.5"/>
        <line x1="20" y1="26" x2="20" y2="29" stroke="${color}" stroke-width="1.5"/>
        <line x1="7" y1="16" x2="10" y2="16" stroke="${color}" stroke-width="1.5"/>
        <line x1="30" y1="16" x2="33" y2="16" stroke="${color}" stroke-width="1.5"/>
        <path d="M20 29 L17 34 L20 33 L23 34 Z" fill="${color}"/>
      </svg>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 34],
  });
}

const pinPescaIcon = createPinIcon('#00E56A'); // verde lima
const pinAccesoNormalIcon = createPinIcon('#00B8FF'); // azul cian
const pinAccesoPocoClaroIcon = createPinIcon('#E5E500'); // amarillo

const TODAS_ZONAS = Object.keys(stringsEs.zones) as Zona[];
const TIPOS_ACCESO: TipoAcceso[] = ['playa', 'roca', 'puerto_escollera', 'otro'];

export interface MapScreenProps {
  initialSpot?: Spot | null;
  onCancel: () => void;
  onSave: (draft: Omit<Spot, 'id' | 'createdAt'>) => void;
}

function ClickHandler({
  disabled,
  onPick,
}: {
  disabled: boolean;
  onPick: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapController({ onMap }: { onMap: (map: L.Map) => void }) {
  const map = useMap();
  React.useEffect(() => {
    onMap(map);
  }, [map, onMap]);
  return null;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  initialSpot,
  onCancel,
  onSave,
}) => {
  const { t, i18n } = useTranslation();
  const isEditing = !!initialSpot;

  // Estado del mapa
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  // Estado de búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

  // Estado local del punto
  const [puntoPesca, setPuntoPesca] = useState<{ lat: number; lon: number } | null>(
    initialSpot ? { lat: initialSpot.lat, lon: initialSpot.lon } : null
  );

  const [puntoAcceso, setPuntoAcceso] = useState<{
    lat: number;
    lon: number;
    profundidad: number | null;
    pocoClaro: boolean;
  } | null>(
    initialSpot?.accesoLat != null && initialSpot?.accesoLon != null
      ? {
          lat: initialSpot.accesoLat,
          lon: initialSpot.accesoLon,
          profundidad: initialSpot.accesoProfundidad ?? null,
          pocoClaro: false,
        }
      : null
  );

  const [profundidadPesca, setProfundidadPesca] = useState<number | null>(
    initialSpot?.profundidad ?? null
  );

  const [nombre, setNombre] = useState(initialSpot?.name ?? '');
  const [nombreEditadoManualmente, setNombreEditadoManualmente] = useState(
    !!initialSpot?.name
  );

  const [zona, setZona] = useState<Zona>(
    initialSpot?.zona ?? 'mediterraneo_espanol'
  );
  const [tipoAcceso, setTipoAcceso] = useState<TipoAcceso | null>(
    initialSpot?.tipoAcceso ?? null
  );

  const [cargandoProfundidad, setCargandoProfundidad] = useState(false);
  const [buscandoAcceso, setBuscandoAcceso] = useState(false);

  // Zonas ordenadas alfabéticamente por su traducción
  const zonasOrdenadas = React.useMemo(() => {
    return [...TODAS_ZONAS].sort((a, b) => {
      const labelA = t(`zones.${a}`);
      const labelB = t(`zones.${b}`);
      return labelA.localeCompare(labelB);
    });
  }, [t]);

  // Buscador por nombre
  async function handleBuscar(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const query = busqueda.trim();
    if (!query) return;

    setBuscando(true);
    setErrorBusqueda(null);

    const lang = i18n.language && i18n.language.startsWith('en') ? 'en' : 'es';

    try {
      let lat: number | null = null;
      let lon: number | null = null;

      // 1. Intentar Nominatim search
      try {
        const urlNominatim = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          query
        )}&limit=5&accept-language=${lang}`;
        const res = await fetch(urlNominatim, {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'WKF-WebApp/0.1',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            lat = parseFloat(data[0].lat);
            lon = parseFloat(data[0].lon);
          }
        }
      } catch {
        // Continuar al fallback
      }

      // 2. Si no hay resultados de Nominatim, intentar Open-Meteo Geocoding
      if (lat === null || lon === null || isNaN(lat) || isNaN(lon)) {
        try {
          const urlOpenMeteo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query
          )}&count=5&language=${lang}`;
          const res = await fetch(urlOpenMeteo, {
            headers: { Accept: 'application/json' },
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.results) && data.results.length > 0) {
              lat = data.results[0].latitude;
              lon = data.results[0].longitude;
            }
          }
        } catch {
          // Fallback falló
        }
      }

      // 3. Evaluar resultado y recentrar
      if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)) {
        if (mapInstance) {
          mapInstance.flyTo([lat, lon], 11);
        }
      } else {
        setErrorBusqueda(t('errores.geocoder'));
        setTimeout(() => setErrorBusqueda(null), 3000);
      }
    } finally {
      setBuscando(false);
    }
  }

  // Selección de punto en el mapa (solo creación)
  async function handlePick(lat: number, lon: number) {
    setPuntoPesca({ lat, lon });
    setCargandoProfundidad(true);
    setBuscandoAcceso(true);

    // 1. Obtener profundidad de pesca
    obtenerProfundidad(lat, lon)
      .then((prof) => {
        setProfundidadPesca(prof);
      })
      .finally(() => {
        setCargandoProfundidad(false);
      });

    // 2. Proponer nombre inverso vía Nominatim si no ha sido editado manualmente
    try {
      const lang = i18n.language && i18n.language.startsWith('en') ? 'en' : 'es';
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=12&accept-language=${lang}`;
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'WKF-WebApp/0.1',
        },
      });
      if (res.ok) {
        const data = await res.json();
        const suggested =
          data?.address?.village ||
          data?.address?.town ||
          data?.address?.city ||
          data?.address?.municipality ||
          data?.address?.county ||
          data?.name ||
          '';
        if (suggested && !nombreEditadoManualmente) {
          setNombre(suggested);
        }
      }
    } catch {
      // Ignorar fallo de geocodificación
    }

    // 3. Proponer punto de acceso automáticamente
    proponerAcceso(lat, lon)
      .then((prop) => {
        if (prop) {
          setPuntoAcceso(prop);
        } else {
          setPuntoAcceso(null);
        }
      })
      .finally(() => {
        setBuscandoAcceso(false);
      });
  }

  // Guardar punto
  function handleSave() {
    if (!puntoPesca) return;
    const trimmed = nombre.trim() || t('map.unnamed');
    onSave({
      name: trimmed,
      lat: puntoPesca.lat,
      lon: puntoPesca.lon,
      zona,
      tipoAcceso,
      profundidad: profundidadPesca,
      accesoLat: puntoAcceso?.lat ?? null,
      accesoLon: puntoAcceso?.lon ?? null,
      accesoProfundidad: puntoAcceso?.profundidad ?? null,
    });
  }

  const mapCenter: [number, number] = puntoPesca
    ? [puntoPesca.lat, puntoPesca.lon]
    : SPAIN_CENTER;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'Inter, system-ui, sans-serif',
        zIndex: 1000,
      }}
    >
      {/* Cabecera */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '6px 12px',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--text)',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          {t('common.cancel')}
        </button>

        <span
          style={{
            fontFamily: 'var(--font-mono, Fira Code, monospace)',
            fontWeight: 600,
            fontSize: '0.95rem',
            letterSpacing: '0.04em',
          }}
        >
          {isEditing ? t('map.editSpot') : t('map.newSpot')}
        </span>

        <button
          type="button"
          disabled={!puntoPesca}
          onClick={handleSave}
          style={{
            padding: '6px 16px',
            backgroundColor: puntoPesca ? 'var(--accent)' : 'var(--border)',
            color: puntoPesca ? '#000' : 'var(--text-dim)',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: puntoPesca ? 'pointer' : 'not-allowed',
          }}
        >
          {t('common.save')}
        </button>
      </header>

      {/* Mapa Leaflet */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Buscador flotante por nombre */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            pointerEvents: 'none',
          }}
        >
          <form
            onSubmit={handleBuscar}
            style={{
              display: 'flex',
              gap: 8,
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 10,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              pointerEvents: 'auto',
            }}
          >
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={t('common.search')}
              style={{
                flex: 1,
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '8px 12px',
                color: 'var(--text)',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              disabled={buscando || !busqueda.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--accent)',
                color: '#000',
                border: 'none',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: buscando || !busqueda.trim() ? 'not-allowed' : 'pointer',
                opacity: buscando || !busqueda.trim() ? 0.6 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {buscando ? '...' : t('common.search')}
            </button>
          </form>

          {errorBusqueda && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.95)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: '0.8rem',
                fontWeight: 500,
                textAlign: 'center',
                pointerEvents: 'auto',
                alignSelf: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              {errorBusqueda}
            </div>
          )}
        </div>

        <MapContainer
          center={mapCenter}
          zoom={puntoPesca ? 12 : INITIAL_ZOOM}
          style={{ width: '100%', height: '100%' }}
        >
          <MapController onMap={setMapInstance} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler disabled={isEditing} onPick={handlePick} />

          {/* Marcador de punto de pesca (verde lima) */}
          {puntoPesca && (
            <Marker
              position={[puntoPesca.lat, puntoPesca.lon]}
              icon={pinPescaIcon}
            />
          )}

          {/* Marcador de punto de acceso (azul cian o amarillo) si tipoAcceso != null */}
          {tipoAcceso != null && puntoAcceso && (
            <Marker
              position={[puntoAcceso.lat, puntoAcceso.lon]}
              icon={
                puntoAcceso.pocoClaro
                  ? pinAccesoPocoClaroIcon
                  : pinAccesoNormalIcon
              }
              draggable={true}
              eventHandlers={{
                dragend: async (e) => {
                  const marker = e.target as L.Marker;
                  const latlng = marker.getLatLng();
                  const prof = await obtenerProfundidad(latlng.lat, latlng.lng);
                  setPuntoAcceso({
                    lat: latlng.lat,
                    lon: latlng.lng,
                    profundidad: prof,
                    pocoClaro: false,
                  });
                },
              }}
            >
              {puntoAcceso.pocoClaro && (
                <Tooltip permanent direction="bottom" offset={[0, 10]}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {t('access.proposed')} • {t('access.dragToAdjust')}
                  </span>
                </Tooltip>
              )}
            </Marker>
          )}

          {/* Línea discontinua entre pesca y acceso */}
          {tipoAcceso != null && puntoPesca && puntoAcceso && (
            <Polyline
              positions={[
                [puntoPesca.lat, puntoPesca.lon],
                [puntoAcceso.lat, puntoAcceso.lon],
              ]}
              pathOptions={{
                color: '#00B8FF',
                dashArray: '4 4',
                weight: 2,
              }}
            />
          )}
        </MapContainer>

        {/* Panel inferior */}
        {puntoPesca && (
          <div
            style={{
              position: 'absolute',
              left: 12,
              right: 12,
              bottom: 16,
              maxHeight: '45vh',
              overflowY: 'auto',
              padding: 12,
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Input nombre */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginBottom: 4,
                }}
              >
                {t('map.spotName')}
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => {
                  const val = e.target.value;
                  setNombre(val);
                  if (val.trim() === '') {
                    setNombreEditadoManualmente(false);
                  } else {
                    setNombreEditadoManualmente(true);
                  }
                }}
                placeholder={t('map.spotNamePlaceholder')}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  borderRadius: 6,
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Selector de zona */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginBottom: 4,
                }}
              >
                {t('settings.zones')}
              </label>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value as Zona)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: 6,
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              >
                {zonasOrdenadas.map((z) => (
                  <option key={z} value={z}>
                    {t(`zones.${z}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de tipo de acceso: 4 botones segmentados */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginBottom: 4,
                }}
              >
                {t('access.title')}
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {TIPOS_ACCESO.map((tipo) => {
                  const active = tipoAcceso === tipo;
                  return (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() =>
                        setTipoAcceso(active ? null : tipo)
                      }
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: `1px solid ${
                          active ? 'var(--accent-2)' : 'var(--border)'
                        }`,
                        backgroundColor: active
                          ? 'rgba(0, 184, 255, 0.15)'
                          : 'var(--bg)',
                        color: active ? 'var(--accent-2)' : 'var(--text-dim)',
                        fontSize: '0.75rem',
                        fontWeight: active ? 600 : 400,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {t(`access.${tipo}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bloque de acceso (solo si tipoAcceso != null) */}
            {tipoAcceso != null && (
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--accent-2)', marginBottom: 2 }}>
                  {t('access.proposed')}{' '}
                  {buscandoAcceso && '⏳'}
                </div>
                <div>
                  {puntoAcceso?.profundidad != null
                    ? `${t('detalle.depth')}: ${puntoAcceso.profundidad.toFixed(1)} m`
                    : t('detalle.noDepth')}{' '}
                  • <span style={{ fontStyle: 'italic' }}>{t('access.dragToAdjust')}</span>
                </div>
              </div>
            )}

            {/* Coordenadas + Profundidad de pesca */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'var(--font-mono, Fira Code, monospace)',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                borderTop: '1px solid var(--border)',
                paddingTop: 6,
              }}
            >
              <span>
                {puntoPesca.lat.toFixed(5)}, {puntoPesca.lon.toFixed(5)}
              </span>
              <span>
                {cargandoProfundidad ? (
                  t('common.loading')
                ) : profundidadPesca != null ? (
                  `${profundidadPesca.toFixed(1)} m`
                ) : (
                  <span style={{ color: '#ef4444' }}>
                    {t('errores.noAccess')}
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapScreen;
