import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type FranjaUsuario } from '../state/store.ts';
import { CATALOGO_KAYAKS, buscarKayakPorId, type Kayak } from '../lib/kayaks.ts';
import {
  CATEGORIAS_KAYAK,
  NIVELES_EXPERIENCIA,
  type CategoriaKayak,
  type NivelExperiencia,
} from '../lib/verdict.ts';
import type { FormatoCoords } from '../lib/coords.ts';

interface SettingsScreenProps {
  onClose: () => void;
}

const SUBPESTANAS: Array<{ id: string; labelKey: string; locked?: boolean }> = [
  { id: 'waves', labelKey: 'tabs.waves', locked: true },
  { id: 'wind', labelKey: 'tabs.wind', locked: true },
  { id: 'weather', labelKey: 'tabs.weather' },
  { id: 'air', labelKey: 'tabs.air' },
  { id: 'barometer', labelKey: 'tabs.barometer' },
  { id: 'activity', labelKey: 'tabs.activity' },
  { id: 'sun', labelKey: 'tabs.sun' },
  { id: 'moon', labelKey: 'tabs.moon' },
  { id: 'tides', labelKey: 'tabs.tides' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store state
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const ajustes = useAppStore((s) => s.ajustes);
  const setFormatoCoords = useAppStore((s) => s.setFormatoCoords);
  const setKayakIds = useAppStore((s) => s.setKayakIds);
  const setCategoriaKayak = useAppStore((s) => s.setCategoriaKayak);
  const setPerfil = useAppStore((s) => s.setPerfil);
  const setFranjas = useAppStore((s) => s.setFranjas);
  const toggleSubpestana = useAppStore((s) => s.toggleSubpestana);
  const resetAll = useAppStore((s) => s.resetAll);
  const exportState = useAppStore((s) => s.exportState);
  const importState = useAppStore((s) => s.importState);

  // Local state for kayak picker modal/dropdown
  const [activeSlotPicker, setActiveSlotPicker] = useState<number | null>(null);
  const [kayakSearchQuery, setKayakSearchQuery] = useState('');

  // Kayak slot selection
  const kayakSlot1 = ajustes.kayakIds[0] ? buscarKayakPorId(ajustes.kayakIds[0]) : null;
  const kayakSlot2 = ajustes.kayakIds[1] ? buscarKayakPorId(ajustes.kayakIds[1]) : null;

  const handleSelectKayak = (slotIndex: number, kayak: Kayak) => {
    const current = [...ajustes.kayakIds];
    current[slotIndex] = kayak.id;
    setKayakIds(current.slice(0, 2));
    // Also auto-suggest category from kayak if not already set or updated
    setCategoriaKayak(kayak.categoriaWKF);
    setActiveSlotPicker(null);
    setKayakSearchQuery('');
  };

  const handleRemoveKayakSlot = (slotIndex: number) => {
    const current = [...ajustes.kayakIds];
    current.splice(slotIndex, 1);
    setKayakIds(current);
  };

  const filteredKayaks = CATALOGO_KAYAKS.filter((k) => {
    const text = `${k.marca} ${k.modelo}`.toLowerCase();
    return text.includes(kayakSearchQuery.toLowerCase());
  });

  // Franjas editing
  const handleFranjaChange = (
    index: number,
    field: keyof FranjaUsuario,
    value: string | number
  ) => {
    const updated = ajustes.franjas.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    setFranjas(updated);
  };

  const handleAddFranja = () => {
    if (ajustes.franjas.length >= 4) return;
    const newId = `franja_${Date.now()}`;
    const newFranja: FranjaUsuario = {
      id: newId,
      nombre: `Franja ${ajustes.franjas.length + 1}`,
      inicio: 8,
      fin: 14,
    };
    setFranjas([...ajustes.franjas, newFranja]);
  };

  const handleDeleteFranja = (index: number) => {
    if (ajustes.franjas.length <= 1) return;
    setFranjas(ajustes.franjas.filter((_, i) => i !== index));
  };

  // Data import/export
  const handleExportJson = () => {
    const data = exportState();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const filename = `wkf-backup-${yyyy}${mm}${dd}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const confirmed = window.confirm(t('settings.clearAllConfirm'));
        if (confirmed) {
          const success = importState(parsed);
          if (success) {
            window.alert(t('common.ok'));
          } else {
            window.alert(t('common.error'));
          }
        }
      } catch {
        window.alert(t('common.error'));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(t('settings.clearAllConfirm'));
    if (confirmed) {
      resetAll();
    }
  };

  // Common styles
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '16px',
    marginBottom: '16px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    marginBottom: '12px',
  };

  const segmentedContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const buttonOptionStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    backgroundColor: active ? 'var(--accent-subtle, rgba(56, 189, 248, 0.15))' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text)',
    fontSize: '0.9rem',
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s ease',
  });

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
      {/* Header fijo */}
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
          {t('settings.title')}
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

      {/* Contenido con scroll vertical */}
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
        {/* 1. Idioma */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.language')}</div>
          <div style={segmentedContainerStyle}>
            <button
              onClick={() => setLanguage('es')}
              style={buttonOptionStyle(language === 'es')}
            >
              {t('settings.languageEs')}
            </button>
            <button
              onClick={() => setLanguage('en')}
              style={buttonOptionStyle(language === 'en')}
            >
              {t('settings.languageEn')}
            </button>
          </div>
        </div>

        {/* 2. Tema */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.theme')}</div>
          <div style={segmentedContainerStyle}>
            <button
              onClick={() => setTheme('dark')}
              style={buttonOptionStyle(theme === 'dark')}
            >
              {t('settings.themeDark')}
            </button>
            <button
              onClick={() => setTheme('light')}
              style={buttonOptionStyle(theme === 'light')}
            >
              {t('settings.themeLight')}
            </button>
          </div>
        </div>

        {/* 3. Formato de coordenadas */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('coords.format')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(['dd', 'dms', 'ddm'] as FormatoCoords[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatoCoords(fmt)}
                style={{
                  ...buttonOptionStyle(ajustes.formatoCoords === fmt),
                  textAlign: 'left',
                }}
              >
                {t(`coords.${fmt}`)}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Mi kayak (dos slots) */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('kayak.myKayaks')}</div>

          {/* Slot 1 */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg)',
              borderRadius: 8,
              border: '1px solid var(--border)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Slot 1
              </div>
              {kayakSlot1 ? (
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {kayakSlot1.marca} {kayakSlot1.modelo}{' '}
                  <span
                    style={{
                      fontFamily: 'Fira Code, monospace',
                      fontSize: '0.85rem',
                      color: 'var(--accent)',
                    }}
                  >
                    ({kayakSlot1.categoriaWKF})
                  </span>
                </div>
              ) : (
                <div style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  {t('kayak.notFound')}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setActiveSlotPicker(0);
                  setKayakSearchQuery('');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {t('kayak.select')}
              </button>
              {kayakSlot1 && (
                <button
                  onClick={() => handleRemoveKayakSlot(0)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {t('common.delete')}
                </button>
              )}
            </div>
          </div>

          {/* Slot 2 */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg)',
              borderRadius: 8,
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Slot 2
              </div>
              {kayakSlot2 ? (
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {kayakSlot2.marca} {kayakSlot2.modelo}{' '}
                  <span
                    style={{
                      fontFamily: 'Fira Code, monospace',
                      fontSize: '0.85rem',
                      color: 'var(--accent)',
                    }}
                  >
                    ({kayakSlot2.categoriaWKF})
                  </span>
                </div>
              ) : (
                <div style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  {t('kayak.notFound')}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setActiveSlotPicker(1);
                  setKayakSearchQuery('');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {t('kayak.select')}
              </button>
              {kayakSlot2 && (
                <button
                  onClick={() => handleRemoveKayakSlot(1)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {t('common.delete')}
                </button>
              )}
            </div>
          </div>

          {/* Modal / Panel buscador de kayaks */}
          {activeSlotPicker !== null && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: 'var(--bg)',
                borderRadius: 8,
                border: '1px solid var(--accent)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {t('kayak.select')} (Slot {activeSlotPicker + 1})
                </span>
                <button
                  onClick={() => setActiveSlotPicker(null)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {t('common.cancel')}
                </button>
              </div>
              <input
                type="text"
                value={kayakSearchQuery}
                onChange={(e) => setKayakSearchQuery(e.target.value)}
                placeholder={t('kayak.searchPlaceholder')}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                }}
              />
              <div
                style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {filteredKayaks.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => handleSelectKayak(activeSlotPicker, k)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      color: 'var(--text)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>
                      {k.marca} {k.modelo}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Fira Code, monospace',
                        fontSize: '0.8rem',
                        color: 'var(--accent)',
                      }}
                    >
                      {k.categoriaWKF}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Categoría de kayak */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.kayakCategory')}</div>
          {!ajustes.categoriaKayak && (
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--accent)',
                marginBottom: '8px',
              }}
            >
              {t('settings.kayakCategoryAssumed')}
            </div>
          )}
          <div style={segmentedContainerStyle}>
            {CATEGORIAS_KAYAK.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaKayak(cat)}
                style={{
                  ...buttonOptionStyle(ajustes.categoriaKayak === cat),
                  fontFamily: 'Fira Code, monospace',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Perfil del kayakista */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('perfil.title')}</div>

          {/* Experiencia */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '6px',
              }}
            >
              {t('perfil.experience')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {NIVELES_EXPERIENCIA.map((lvl) => {
                const active = ajustes.perfil.experiencia === lvl;
                // Capitalizar primera letra para mapear a clave i18n
                const keySuffix = lvl.charAt(0).toUpperCase() + lvl.slice(1);
                return (
                  <button
                    key={lvl}
                    onClick={() =>
                      setPerfil({ experiencia: lvl as NivelExperiencia })
                    }
                    style={{
                      ...buttonOptionStyle(active),
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      padding: '8px 12px',
                    }}
                  >
                    {t(`perfil.experience${keySuffix}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Equipo */}
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '6px',
              }}
            >
              {t('perfil.equipment')}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              {[
                { key: 'vhf', labelKey: 'perfil.equipmentVhf' },
                { key: 'remoRepuesto', labelKey: 'perfil.equipmentRemoRepuesto' },
                { key: 'ropaSeca', labelKey: 'perfil.equipmentRopaSeca' },
                {
                  key: 'compartimentosEstancos',
                  labelKey: 'perfil.equipmentCompartimentos',
                },
              ].map(({ key, labelKey }) => {
                const val = (ajustes.perfil as any)[key] as boolean;
                return (
                  <button
                    key={key}
                    onClick={() => setPerfil({ [key]: !val })}
                    style={{
                      ...buttonOptionStyle(val),
                      fontSize: '0.85rem',
                      padding: '8px 10px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{t(labelKey)}</span>
                    <span
                      style={{
                        fontFamily: 'Fira Code, monospace',
                        fontSize: '0.8rem',
                      }}
                    >
                      {val ? '✓' : '—'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              lineHeight: 1.4,
              borderTop: '1px solid var(--border)',
              paddingTop: '8px',
            }}
          >
            {t('perfil.disclaimer')}
          </div>
        </div>

        {/* 7. Franjas del día */}
        <div style={cardStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div style={sectionTitleStyle}>{t('franjas.title')}</div>
            <button
              onClick={handleAddFranja}
              disabled={ajustes.franjas.length >= 4}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color:
                  ajustes.franjas.length >= 4
                    ? 'var(--text-muted)'
                    : 'var(--accent)',
                fontSize: '0.8rem',
                cursor:
                  ajustes.franjas.length >= 4 ? 'not-allowed' : 'pointer',
                opacity: ajustes.franjas.length >= 4 ? 0.5 : 1,
              }}
            >
              + {t('franjas.add')}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ajustes.franjas.map((franja, index) => (
              <div
                key={franja.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                }}
              >
                <input
                  type="text"
                  value={franja.nombre}
                  onChange={(e) =>
                    handleFranjaChange(index, 'nombre', e.target.value)
                  }
                  style={{
                    flex: 2,
                    padding: '6px 8px',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    color: 'var(--text)',
                    fontSize: '0.85rem',
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={franja.inicio}
                    onChange={(e) =>
                      handleFranjaChange(
                        index,
                        'inicio',
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    style={{
                      width: '48px',
                      padding: '6px 4px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      color: 'var(--text)',
                      fontFamily: 'Fira Code, monospace',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                    }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={franja.fin}
                    onChange={(e) =>
                      handleFranjaChange(
                        index,
                        'fin',
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    style={{
                      width: '48px',
                      padding: '6px 4px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      color: 'var(--text)',
                      fontFamily: 'Fira Code, monospace',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                    }}
                  />
                </div>
                <button
                  onClick={() => handleDeleteFranja(index)}
                  disabled={ajustes.franjas.length <= 1}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 4,
                    border: '1px solid var(--border)',
                    backgroundColor: 'transparent',
                    color:
                      ajustes.franjas.length <= 1
                        ? 'var(--text-muted)'
                        : 'var(--text)',
                    fontSize: '0.75rem',
                    cursor:
                      ajustes.franjas.length <= 1 ? 'not-allowed' : 'pointer',
                    opacity: ajustes.franjas.length <= 1 ? 0.4 : 1,
                  }}
                >
                  {t('common.delete')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Subpestañas visibles (9 toggles) */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.tabsVisibility')}</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '8px',
            }}
          >
            {SUBPESTANAS.map(({ id, labelKey, locked }) => {
              const isHidden = ajustes.subpestanasOcultas.includes(id);
              const isVisible = locked ? true : !isHidden;

              return (
                <button
                  key={id}
                  disabled={locked}
                  onClick={() => !locked && toggleSubpestana(id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: `1px solid ${
                      isVisible ? 'var(--accent)' : 'var(--border)'
                    }`,
                    backgroundColor: isVisible
                      ? 'var(--accent-subtle, rgba(56, 189, 248, 0.12))'
                      : 'var(--bg)',
                    color: isVisible ? 'var(--text)' : 'var(--text-muted)',
                    cursor: locked ? 'default' : 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    opacity: locked ? 0.8 : 1,
                  }}
                >
                  <span>{t(labelKey)}</span>
                  {locked ? (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                      }}
                    >
                      {t('settings.tabLocked')}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontFamily: 'Fira Code, monospace',
                        fontSize: '0.8rem',
                      }}
                    >
                      {isVisible ? '✓' : '✕'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 9. Tutorial */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.tutorial')}</div>
          <button
            onClick={() => {
              // TODO v1.008: integración tutorial completo
              window.alert('TODO v1.008');
            }}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            {t('settings.tutorialRestart')}
          </button>
        </div>

        {/* 10. Datos */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.data')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleExportJson}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              📥 {t('settings.exportJson')}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              📤 {t('settings.importJson')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <button
              onClick={handleClearAll}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid #ef4444',
                backgroundColor: 'transparent',
                color: '#ef4444',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                marginTop: '4px',
              }}
            >
              ⚠️ {t('settings.clearAll')}
            </button>
          </div>
        </div>

        {/* 11. Acerca de */}
        <div style={{ ...cardStyle, marginBottom: '32px' }}>
          <div style={sectionTitleStyle}>{t('settings.about')}</div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              margin: '0 0 12px 0',
            }}
          >
            {t('settings.aboutText')}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              marginBottom: '14px',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {t('settings.version')}
            </span>
            <span
              style={{
                fontFamily: 'Fira Code, monospace',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              v1.007
            </span>
          </div>

          <a
            href="https://ko-fi.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg)',
              color: 'var(--accent)',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ☕ {t('settings.donate')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
