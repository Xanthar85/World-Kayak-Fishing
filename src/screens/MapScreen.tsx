import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SPAIN_CENTER: [number, number] = [39.5, -0.5];
const INITIAL_ZOOM = 6;

const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="16" r="11" stroke="#00E56A" stroke-width="2" fill="#0A0A0A"/>
  <circle cx="20" cy="16" r="3.5" fill="#00E56A"/>
  <line x1="20" y1="3" x2="20" y2="6" stroke="#00E56A" stroke-width="1.5"/>
  <line x1="20" y1="26" x2="20" y2="29" stroke="#00E56A" stroke-width="1.5"/>
  <line x1="7" y1="16" x2="10" y2="16" stroke="#00E56A" stroke-width="1.5"/>
  <line x1="30" y1="16" x2="33" y2="16" stroke="#00E56A" stroke-width="1.5"/>
  <path d="M20 29 L17 34 L20 33 L23 34 Z" fill="#00E56A"/>
</svg>
`;

const pinIcon = L.divIcon({
  className: 'wkf-pin',
  html: PIN_SVG,
  iconSize: [40, 40],
  iconAnchor: [20, 34],
});

type SpotDraft = {
  name: string;
  lat: number;
  lon: number;
};

type Props = {
  onCancel?: () => void;
  onSave?: (spot: SpotDraft) => void;
  initialSpot?: SpotDraft | null;
};

function ClickHandler({ onPick }: { onPick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapScreen({ onCancel, onSave, initialSpot }: Props) {
  const { t, i18n } = useTranslation();
  const [position, setPosition] = useState<[number, number] | null>(
    initialSpot ? [initialSpot.lat, initialSpot.lon] : null
  );
  const [name, setName] = useState(initialSpot?.name ?? '');
  const [busy, setBusy] = useState(false);

  const isEditing = !!initialSpot;

  async function handlePick(lat: number, lon: number) {
    setPosition([lat, lon]);
    if (!isEditing) setName('');
    setBusy(true);
    try {
      const lang = i18n.language && i18n.language.startsWith('en') ? 'en' : 'es';
      const url =
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
        `&lat=${lat}&lon=${lon}&zoom=12&accept-language=${lang}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('nominatim failed');
      const data = await res.json();
      const suggested =
        data?.address?.village ||
        data?.address?.town ||
        data?.address?.city ||
        data?.address?.municipality ||
        data?.address?.county ||
        data?.name ||
        '';
      setName(suggested);
    } catch {
      setName('');
    } finally {
      setBusy(false);
    }
  }

  function handleSave() {
    if (!position || !onSave) return;
    const trimmed = name.trim() || t('map.unnamed');
    onSave({ name: trimmed, lat: position[0], lon: position[1] });
  }

  const canSave = !!position && !busy;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          gap: 12,
        }}
      >
        <button type="button" className="btn-ghost" onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
          {isEditing ? t('map.editSpot') : t('map.newSpot')}
        </span>
        <button
          type="button"
          className="btn-primary"
          disabled={!canSave}
          onClick={handleSave}
        >
          {t('common.save')}
        </button>
      </header>

      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={position ?? SPAIN_CENTER}
          zoom={position ? 12 : INITIAL_ZOOM}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ClickHandler onPick={handlePick} />
          {position && <Marker position={position} icon={pinIcon} />}
        </MapContainer>

        {position && (
          <div
            style={{
              position: 'absolute',
              left: 12,
              right: 12,
              bottom: 12,
              padding: 12,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              zIndex: 1000,
            }}
          >
            <label
              style={{
                display: 'block',
                fontSize: 12,
                color: 'var(--text-secondary)',
                marginBottom: 4,
              }}
            >
              {t('map.spotName')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={busy ? t('map.searching') : t('map.spotNamePlaceholder')}
              style={{
                width: '100%',
                padding: '8px 10px',
                background: '#0A0A0A',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                borderRadius: 4,
              }}
            />
            <div
              style={{
                marginTop: 6,
                fontSize: 11,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}