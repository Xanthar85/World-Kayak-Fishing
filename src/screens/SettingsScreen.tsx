// src/screens/SettingsScreen.tsx
// WKF — Pantalla de Ajustes.
// v1.014:
//   - Ficha técnica de kayak ampliada: certificaciones múltiples y
//     techo absoluto. Requiere las claves i18n `kayak.techoAbsoluto`,
//     `kayak.certificaciones`, `kayak.fuente`.
//   - Resto de la pantalla intacta respecto a v1.010.

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAppStore,
  type FranjaUsuario,
  type ImportFailReason,
} from '../state/store.ts';
import {
  CATALOGO_KAYAKS,
  buscarKayakPorId,
  type Kayak,
  type CertificacionesKayak,
} from '../lib/kayaks.ts';
import {
  CATEGORIAS_KAYAK,
  NIVELES_EXPERIENCIA,
  type CategoriaKayak,
  type NivelExperiencia,
} from '../lib/verdict.ts';
import type { FormatoCoords } from '../lib/coords.ts';
import type { NivelColorTabla } from '../lib/verdict-color.ts';

interface SettingsScreenProps {
  onClose: () => void;
  onOpenTutorial: () => void;
}

type FeedbackImport =
  | { tipo: 'ok'; spots: number }
  | { tipo: 'error'; motivo: ImportFailReason }
  | null;

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

const OPCIONES_COLOR: Array<{ valor: NivelColorTabla; labelKey: string }> = [
  { valor: 'ninguno', labelKey: 'settings.colorTablaNinguno' },
  { valor: 'rojos', labelKey: 'settings.colorTablaRojos' },
  { valor: 'rn', labelKey: 'settings.colorTablaRN' },
  { valor: 'rna', labelKey: 'settings.colorTablaRNA' },
  { valor: 'todo', labelKey: 'settings.colorTablaTodo' },
];

const MAPA_MOTIVO_A_CLAVE_I18N: Record<ImportFailReason, string> = {
  no_es_objeto: 'import.errors.notObject',
  version_incorrecta: 'import.errors.wrongVersion',
  spots_no_array: 'import.errors.spotsNotArray',
  spot_mal_formado: 'import.errors.spotMalformed',
  ajustes_mal_formados: 'import.errors.settingsMalformed',
  franjas_mal_formadas: 'import.errors.slotsMalformed',
  perfil_mal_formado: 'import.errors.profileMalformed',
};

interface FilaCertificacion {
  labelKey: string;
  activa: boolean;
  valor?: string;
}

function construirFilasCertificaciones(
  cert: CertificacionesKayak
): FilaCertificacion[] {
  return [
    { labelKey: 'kayak.certCE', activa: cert.ce != null, valor: cert.ce ?? undefined },
    { labelKey: 'kayak.certUKCA', activa: cert.ukca != null, valor: cert.ukca ?? undefined },
    { labelKey: 'kayak.certUSCG', activa: cert.uscg },
    { labelKey: 'kayak.certABYC', activa: cert.abyc },
    { labelKey: 'kayak.certNMMA', activa: cert.nmma },
    { labelKey: 'kayak.certASNZS', activa: cert.as_nzs },
    { labelKey: 'kayak.certJCI', activa: cert.jci },
    { labelKey: 'kayak.certISO12217', activa: cert.iso_12217 },
    { labelKey: 'kayak.certISO14946', activa: cert.iso_14946 },
    { labelKey: 'kayak.certISO10087', activa: cert.iso_10087 },
  ];
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onClose,
  onOpenTutorial,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const setColorTabla = useAppStore((s) => s.setColorTabla);
  const setFiltroFranja = useAppStore((s) => s.setFiltroFranja);
  const resetAll = useAppStore((s) => s.resetAll);
  const exportState = useAppStore((s) => s.exportState);
  const importState = useAppStore((s) => s.importState);

  const [activeSlotPicker, setActiveSlotPicker] = useState<number | null>(null);
  const [kayakSearchQuery, setKayakSearchQuery] = useState('');
  const [fichaTecnicaKayak, setFichaTecnicaKayak] = useState<Kayak | null>(null);
  const [feedbackImport, setFeedbackImport] = useState<FeedbackImport>(null);

  const kayakSlot1 = ajustes.kayakIds[0]
    ? buscarKayakPorId(ajustes.kayakIds[0])
    : null;
  const kayakSlot2 = ajustes.kayakIds[1]
    ? buscarKayakPorId(ajustes.kayakIds[1])
    : null;

  const handleSelectKayak = (slotIndex: number, kayak: Kayak) => {
    const current = [...ajustes.kayakIds];
    current[slotIndex] = kayak.id;
    setKayakIds(current.slice(0, 2));
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
    const newFranja: FranjaUsuario = {
      id: `franja_${Date.now()}`,
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
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(event.target?.result as string);
      } catch {
        setFeedbackImport({ tipo: 'error', motivo: 'no_es_objeto' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const confirmed = window.confirm(t('import.confirmReplace'));
      if (!confirmed) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const result = importState(parsed);
      if ('motivo' in result) {
        setFeedbackImport({
          tipo: 'error',
          motivo: result.motivo as ImportFailReason,
        });
      } else {
        setFeedbackImport({ tipo: 'ok', spots: result.spotsImportados });
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm(t('settings.clearAllConfirm'))) resetAll();
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    marginBottom: 12,
  };
  const segmentedContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
  };
  const buttonOptionStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    backgroundColor: active
      ? 'var(--accent-subtle, rgba(56, 189, 248, 0.15))'
      : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text)',
    fontSize: '0.9rem',
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s ease',
  });
  const fichaRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.85rem',
  };
  const fichaLabelStyle: React.CSSProperties = { color: 'var(--text-muted)' };
  const fichaValorStyle: React.CSSProperties = {
    fontFamily: 'Fira Code, monospace',
    color: 'var(--text)',
    fontWeight: 500,
  };

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

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 20,
          maxWidth: 680,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
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

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('coords.format')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('kayak.myKayaks')}</div>
          {[0, 1].map((slotIndex) => {
            const kayak = slotIndex === 0 ? kayakSlot1 : kayakSlot2;
            return (
              <div
                key={slotIndex}
                style={{
                  padding: 12,
                  backgroundColor: 'var(--bg)',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  marginBottom: slotIndex === 0 ? 10 : 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  >
                    Slot {slotIndex + 1}
                  </div>
                  {kayak ? (
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {kayak.marca} {kayak.modelo}{' '}
                      <span
                        style={{
                          fontFamily: 'Fira Code, monospace',
                          fontSize: '0.85rem',
                          color: 'var(--accent)',
                        }}
                      >
                        ({kayak.categoriaWKF})
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontStyle: 'italic',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {t('kayak.notFound')}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {kayak && (
                    <button
                      onClick={() => setFichaTecnicaKayak(kayak)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                        backgroundColor: 'transparent',
                        color: 'var(--accent-2)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {t('kayak.viewSpec')}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveSlotPicker(slotIndex);
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
                  {kayak && (
                    <button
                      onClick={() => handleRemoveKayakSlot(slotIndex)}
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
            );
          })}

          {activeSlotPicker !== null && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
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
                  marginBottom: 8,
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
                  marginBottom: 8,
                  boxSizing: 'border-box',
                }}
              />
              <div
                style={{
                  maxHeight: 220,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {filteredKayaks.length === 0 && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontStyle: 'italic',
                      color: 'var(--text-muted)',
                      padding: '8px 4px',
                    }}
                  >
                    {t('kayak.notFound')}
                  </div>
                )}
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

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.kayakCategory')}</div>
          {!ajustes.categoriaKayak && (
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--accent)',
                marginBottom: 8,
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

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('perfil.title')}</div>
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: 6,
              }}
            >
              {t('perfil.experience')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {NIVELES_EXPERIENCIA.map((lvl) => {
                const active = ajustes.perfil.experiencia === lvl;
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
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: 6,
              }}
            >
              {t('perfil.equipment')}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
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
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              lineHeight: 1.4,
              borderTop: '1px solid var(--border)',
              paddingTop: 8,
            }}
          >
            {t('perfil.disclaimer')}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ajustes.franjas.map((franja, index) => (
              <div
                key={franja.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
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
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
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
                      width: 48,
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
                      width: 48,
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
                      ajustes.franjas.length <= 1
                        ? 'not-allowed'
                        : 'pointer',
                    opacity: ajustes.franjas.length <= 1 ? 0.4 : 1,
                  }}
                >
                  {t('common.delete')}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.colorTabla')}</div>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              margin: '0 0 12px 0',
            }}
          >
            {t('settings.colorTablaDesc')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {OPCIONES_COLOR.map(({ valor, labelKey }) => (
              <button
                key={valor}
                onClick={() => setColorTabla(valor)}
                style={{
                  ...buttonOptionStyle(ajustes.colorTabla === valor),
                  textAlign: 'left',
                }}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
              {t('settings.filtroFranja')}
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4,
                margin: '0 0 8px 0',
              }}
            >
              {t('settings.filtroFranjaDesc')}
            </p>
            <button
              onClick={() => setFiltroFranja(!ajustes.filtroFranja)}
              style={{
                ...buttonOptionStyle(ajustes.filtroFranja),
                textAlign: 'left',
              }}
            >
              {ajustes.filtroFranja ? '✓ ' : ''}
              {t('settings.filtroFranja')}
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.tabsVisibility')}</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 8,
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

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.tutorial')}</div>
          <button
            onClick={onOpenTutorial}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid var(--accent)',
              backgroundColor: 'transparent',
              color: 'var(--accent)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            📖 {t('settings.tutorialExtended')}
          </button>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t('settings.data')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
              accept=".json,application/json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {feedbackImport && feedbackImport.tipo === 'ok' && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 6,
                  border: '1px solid var(--verdict-favorable)',
                  backgroundColor: 'rgba(0, 229, 106, 0.1)',
                  color: 'var(--verdict-favorable)',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                }}
              >
                ✓ {t('import.success', { count: feedbackImport.spots })}
              </div>
            )}
            {feedbackImport && feedbackImport.tipo === 'error' && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 6,
                  border: '1px solid var(--verdict-desaconsejado)',
                  backgroundColor: 'rgba(255, 45, 85, 0.1)',
                  color: 'var(--verdict-desaconsejado)',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                }}
              >
                ✕ {t('import.error')}{' '}
                <span style={{ opacity: 0.85 }}>
                  {t(MAPA_MOTIVO_A_CLAVE_I18N[feedbackImport.motivo])}
                </span>
              </div>
            )}
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
                marginTop: 4,
              }}
            >
              ⚠️ {t('settings.clearAll')}
            </button>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: 32 }}>
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
              marginBottom: 14,
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
              v1.014
            </span>
          </div>
          <a
            href="https://ko-fi.com/xanthar"
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

      {fichaTecnicaKayak && (
        <div
          onClick={() => setFichaTecnicaKayak(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--accent-2)',
              borderRadius: 12,
              padding: 20,
              maxWidth: 520,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--accent-2)',
                  }}
                >
                  {fichaTecnicaKayak.marca} {fichaTecnicaKayak.modelo}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: 2,
                  }}
                >
                  {t('kayak.title')} — {t('kayak.category')}{' '}
                  {fichaTecnicaKayak.categoriaWKF}
                </div>
              </div>
              <button
                onClick={() => setFichaTecnicaKayak(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            {[
              {
                label: t('kayak.length'),
                val: `${fichaTecnicaKayak.eslora.toFixed(2)} m`,
              },
              {
                label: t('kayak.beam'),
                val: `${fichaTecnicaKayak.manga.toFixed(2)} m`,
              },
              {
                label: t('kayak.volume'),
                val: `${fichaTecnicaKayak.volumen} L`,
              },
              { label: t('kayak.hull'), val: fichaTecnicaKayak.tipoCasco },
              {
                label: t('kayak.sitOnTop'),
                val: fichaTecnicaKayak.autovaciable ? '✓' : '—',
              },
              {
                label: t('kayak.rudder'),
                val: fichaTecnicaKayak.timon ? '✓' : '—',
              },
              {
                label: t('kayak.bulkheads'),
                val: fichaTecnicaKayak.compartimentosEstancos ? '✓' : '—',
              },
              {
                label: t('kayak.capacity'),
                val: `${fichaTecnicaKayak.capacidadCarga} kg`,
              },
              {
                label: t('kayak.propulsion'),
                val: fichaTecnicaKayak.propulsion,
              },
              {
                label: t('kayak.category'),
                val: fichaTecnicaKayak.categoriaWKF,
              },
              {
                label: t('kayak.directiveCategory'),
                val: fichaTecnicaKayak.categoriaDirectiva,
              },
              {
                label: t('kayak.techoAbsoluto'),
                val: `${fichaTecnicaKayak.techoAbsoluto.vientoMaxBf} Bf / ${fichaTecnicaKayak.techoAbsoluto.olaMaxM.toFixed(1)} m`,
              },
              {
                label: t('kayak.fuente'),
                val: fichaTecnicaKayak.techoAbsoluto.fuente,
              },
              {
                label: t('kayak.certificado'),
                val: fichaTecnicaKayak.certificado ? '✓' : '—',
              },
              {
                label: t('kayak.verificado'),
                val: fichaTecnicaKayak.verificado ? '✓' : '—',
              },
            ].map(({ label, val }) => (
              <div key={label} style={fichaRowStyle}>
                <span style={fichaLabelStyle}>{label}</span>
                <span style={fichaValorStyle}>{val}</span>
              </div>
            ))}

            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                }}
              >
                {t('kayak.certificaciones')}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 6,
                }}
              >
                {construirFilasCertificaciones(fichaTecnicaKayak.certificaciones).map(
                  ({ labelKey, activa, valor }) => (
                    <div
                      key={labelKey}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: `1px solid ${activa ? 'var(--accent)' : 'var(--border)'}`,
                        backgroundColor: activa
                          ? 'var(--accent-subtle, rgba(0, 229, 106, 0.10))'
                          : 'transparent',
                        fontSize: '0.75rem',
                        color: activa ? 'var(--text)' : 'var(--text-muted)',
                      }}
                    >
                      <span>{t(labelKey)}</span>
                      <span
                        style={{
                          fontFamily: 'Fira Code, monospace',
                          fontWeight: activa ? 700 : 400,
                        }}
                      >
                        {activa ? (valor ?? '✓') : '—'}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {!fichaTecnicaKayak.certificado && (
              <div
                style={{
                  marginTop: 12,
                  padding: '8px 10px',
                  backgroundColor: 'rgba(229, 229, 0, 0.1)',
                  border: '1px solid var(--verdict-aceptable)',
                  borderRadius: 6,
                  fontSize: '0.8rem',
                  color: 'var(--verdict-aceptable)',
                }}
              >
                {t('kayak.noCertNote')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;