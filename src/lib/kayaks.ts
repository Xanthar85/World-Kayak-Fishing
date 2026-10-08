// src/lib/kayaks.ts
// WKF — Catálogo de kayaks.
// v1.015: catálogo ampliado. Dolphin y Fisher pasan a KOL Outdoor (marca
// real confirmada por el fabricante). Nuevos modelos: Dentex One,
// Moken 13 Angler Deluxe, modelos de Galaxy, Todo Kayak, KOL y Marlin
// del CSV ampliado.
//
// Nomenclatura de categoría:
//   categoriaWKF: 'K1'|'K2'|'K3'|'K4'|'K5'  → características técnicas.
//   certificadoOficial: boolean               → true si el fabricante
//                                              certifica según Directiva
//                                              2013/53/UE u otra
//                                              certificación equivalente.
//   En UI se muestra 'K4c' cuando certificadoOficial=true, 'K4' si no.

import type { CategoriaKayak } from './verdict.ts';

export type Propulsion = 'pala' | 'pedal_aletas' | 'pedal_helice';
export type CategoriaDirectiva = 'A' | 'B' | 'C' | 'D' | 'no_certificado';
export type TipoCasco = 'V' | 'U' | 'plano';

export interface CertificacionesKayak {
  ce: 'A' | 'B' | 'C' | 'D' | null;
  ukca: 'A' | 'B' | 'C' | 'D' | null;
  uscg: boolean;
  abyc: boolean;
  nmma: boolean;
  as_nzs: boolean;
  jci: boolean;
  iso_12217: boolean;
  iso_14946: boolean;
  iso_10087: boolean;
}

export interface TechoAbsoluto {
  vientoMaxBf: number;
  olaMaxM: number;
  fuente: 'CE' | 'UKCA' | 'ABYC' | 'NMMA' | 'AS/NZS' | 'JCI' | 'ISO' | 'estimado';
}

export interface Kayak {
  id: string;
  marca: string;
  modelo: string;
  eslora: number;
  manga: number;
  volumen: number;
  tipoCasco: TipoCasco;
  autovaciable: boolean;
  timon: boolean;
  compartimentosEstancos: boolean;
  capacidadCarga: number;
  propulsion: Propulsion;
  categoriaWKF: CategoriaKayak;
  categoriaDirectiva: CategoriaDirectiva;
  certificado: boolean;
  certificadoOficial: boolean;
  verificado: boolean;
  certificaciones: CertificacionesKayak;
  techoAbsoluto: TechoAbsoluto;
}

const SIN_CERTIFICAR: CertificacionesKayak = {
  ce: null, ukca: null, uscg: false, abyc: false, nmma: false,
  as_nzs: false, jci: false, iso_12217: false, iso_14946: false, iso_10087: false,
};

const TECHO_D: TechoAbsoluto = { vientoMaxBf: 4, olaMaxM: 0.5, fuente: 'estimado' };
const TECHO_C: TechoAbsoluto = { vientoMaxBf: 6, olaMaxM: 2.0, fuente: 'CE' };

function certCE(cat: 'A' | 'B' | 'C' | 'D'): CertificacionesKayak {
  return { ...SIN_CERTIFICAR, ce: cat, iso_12217: true, iso_14946: true, iso_10087: true };
}

function certUSCG(): CertificacionesKayak {
  return { ...SIN_CERTIFICAR, uscg: true, iso_12217: true, iso_14946: true, iso_10087: true };
}

// Helper: entrada KOL Outdoor sin certificar (Dolphin, Fisher, Dentex).
function kolNoCertificado(
  id: string,
  modelo: string,
  eslora: number,
  manga: number,
  volumen: number,
  tipoCasco: TipoCasco,
  autovaciable: boolean,
  timon: boolean,
  compartimentosEstancos: boolean,
  capacidadCarga: number,
  propulsion: Propulsion,
  categoriaWKF: CategoriaKayak
): Kayak {
  return {
    id,
    marca: 'KOL Outdoor',
    modelo,
    eslora,
    manga,
    volumen,
    tipoCasco,
    autovaciable,
    timon,
    compartimentosEstancos,
    capacidadCarga,
    propulsion,
    categoriaWKF,
    categoriaDirectiva: 'no_certificado',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    certificaciones: { ...SIN_CERTIFICAR },
    techoAbsoluto: TECHO_D,
  };
}

export const CATALOGO_KAYAKS: Kayak[] = [
  // ── Stealth Kayaks ────────────────────────────────────────────────
  { id: 'stealth-profisha-525', marca: 'Stealth Kayaks', modelo: 'Profisha 525', eslora: 5.25, manga: 0.66, volumen: 400, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'stealth-profisha-575', marca: 'Stealth Kayaks', modelo: 'Profisha 575', eslora: 5.75, manga: 0.66, volumen: 420, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 220, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'stealth-profisha-475', marca: 'Stealth Kayaks', modelo: 'Profisha 475', eslora: 4.75, manga: 0.66, volumen: 350, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'stealth-profisha-425', marca: 'Stealth Kayaks', modelo: 'Profisha 425', eslora: 4.25, manga: 0.66, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'stealth-bfs-465', marca: 'Stealth Kayaks', modelo: 'BFS 465', eslora: 4.65, manga: 0.68, volumen: 340, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Epic Kayaks ───────────────────────────────────────────────────
  { id: 'epic-v5', marca: 'Epic Kayaks', modelo: 'V5', eslora: 5.20, manga: 0.51, volumen: 300, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'epic-v6', marca: 'Epic Kayaks', modelo: 'V6', eslora: 6.10, manga: 0.51, volumen: 350, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'epic-v7', marca: 'Epic Kayaks', modelo: 'V7', eslora: 6.70, manga: 0.51, volumen: 380, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'epic-v8', marca: 'Epic Kayaks', modelo: 'V8', eslora: 7.60, manga: 0.51, volumen: 400, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'epic-surfski-v10', marca: 'Epic Kayaks', modelo: 'Surfski V10', eslora: 6.40, manga: 0.43, volumen: 280, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Tiderace Kayaks ───────────────────────────────────────────────
  { id: 'tiderace-xcite', marca: 'Tiderace Kayaks', modelo: 'Xcite', eslora: 5.20, manga: 0.53, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'tiderace-xplore', marca: 'Tiderace Kayaks', modelo: 'Xplore', eslora: 5.30, manga: 0.55, volumen: 340, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'tiderace-xceed', marca: 'Tiderace Kayaks', modelo: 'Xceed', eslora: 5.40, manga: 0.54, volumen: 330, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 165, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Valley Kayaks ─────────────────────────────────────────────────
  { id: 'valley-etain-175', marca: 'Valley Kayaks', modelo: 'Etain 17.5', eslora: 5.33, manga: 0.53, volumen: 340, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'valley-etain-177', marca: 'Valley Kayaks', modelo: 'Etain 17.7', eslora: 5.40, manga: 0.53, volumen: 350, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 175, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'valley-nordkapp', marca: 'Valley Kayaks', modelo: 'Nordkapp', eslora: 5.30, manga: 0.52, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── P&H Sea Kayaks ────────────────────────────────────────────────
  { id: 'ph-cetus', marca: 'P&H Sea Kayaks', modelo: 'Cetus', eslora: 5.20, manga: 0.53, volumen: 330, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 165, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'ph-scorpio', marca: 'P&H Sea Kayaks', modelo: 'Scorpio', eslora: 5.10, manga: 0.54, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'ph-delphin', marca: 'P&H Sea Kayaks', modelo: 'Delphin', eslora: 4.80, manga: 0.55, volumen: 300, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Rockpool Kayaks ───────────────────────────────────────────────
  { id: 'rockpool-taran', marca: 'Rockpool Kayaks', modelo: 'Taran', eslora: 5.40, manga: 0.52, volumen: 330, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 165, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'rockpool-alaw', marca: 'Rockpool Kayaks', modelo: 'Alaw', eslora: 5.20, manga: 0.53, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── NDK ───────────────────────────────────────────────────────────
  { id: 'ndk-explorer', marca: 'NDK', modelo: 'Explorer', eslora: 5.30, manga: 0.53, volumen: 340, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'ndk-romany', marca: 'NDK', modelo: 'Romany', eslora: 5.10, manga: 0.54, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── SKUK ──────────────────────────────────────────────────────────
  { id: 'skuk-grand-illusion', marca: 'SKUK', modelo: 'Grand Illusion', eslora: 5.40, manga: 0.53, volumen: 340, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'skuk-progression', marca: 'SKUK', modelo: 'Progression', eslora: 5.20, manga: 0.53, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Current Designs ───────────────────────────────────────────────
  { id: 'current-designs-solstice-gt', marca: 'Current Designs', modelo: 'Solstice GT', eslora: 5.40, manga: 0.55, volumen: 340, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'current-designs-solstice-gts', marca: 'Current Designs', modelo: 'Solstice GTS', eslora: 5.20, manga: 0.55, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'current-designs-karla', marca: 'Current Designs', modelo: 'Karla', eslora: 5.00, manga: 0.54, volumen: 300, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Boreal Design ─────────────────────────────────────────────────
  { id: 'boreal-baffin', marca: 'Boreal Design', modelo: 'Baffin', eslora: 5.20, manga: 0.55, volumen: 330, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 165, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'boreal-epsilon', marca: 'Boreal Design', modelo: 'Epsilon', eslora: 5.00, manga: 0.54, volumen: 310, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 155, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Seaward Kayaks ────────────────────────────────────────────────
  { id: 'seaward-navigator', marca: 'Seaward Kayaks', modelo: 'Navigator', eslora: 5.30, manga: 0.55, volumen: 340, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'seaward-quest', marca: 'Seaward Kayaks', modelo: 'Quest', eslora: 5.10, manga: 0.54, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Necky Kayaks ──────────────────────────────────────────────────
  { id: 'necky-chatham', marca: 'Necky Kayaks', modelo: 'Chatham', eslora: 5.20, manga: 0.55, volumen: 330, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 165, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'necky-looksha', marca: 'Necky Kayaks', modelo: 'Looksha', eslora: 5.00, manga: 0.54, volumen: 310, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 155, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Wilderness Systems (travesía, CE C) ───────────────────────────
  { id: 'wilderness-tempest-170', marca: 'Wilderness Systems', modelo: 'Tempest 170', eslora: 5.20, manga: 0.55, volumen: 330, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 165, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'wilderness-tempest-165', marca: 'Wilderness Systems', modelo: 'Tempest 165', eslora: 5.00, manga: 0.54, volumen: 310, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 155, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Dagger Kayaks ─────────────────────────────────────────────────
  { id: 'dagger-stratos', marca: 'Dagger Kayaks', modelo: 'Stratos', eslora: 5.10, manga: 0.55, volumen: 320, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'dagger-alchemy', marca: 'Dagger Kayaks', modelo: 'Alchemy', eslora: 4.90, manga: 0.55, volumen: 300, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Prijon Kayaks ─────────────────────────────────────────────────
  { id: 'prijon-kodiak', marca: 'Prijon Kayaks', modelo: 'Kodiak', eslora: 5.20, manga: 0.55, volumen: 330, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 165, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },
  { id: 'prijon-seayak', marca: 'Prijon Kayaks', modelo: 'Seayak', eslora: 5.00, manga: 0.54, volumen: 310, tipoCasco: 'V', autovaciable: false, timon: true, compartimentosEstancos: true, capacidadCarga: 155, propulsion: 'pala', categoriaWKF: 'K5', categoriaDirectiva: 'C', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certCE('C'), techoAbsoluto: TECHO_C },

  // ── Ocean Kayak ───────────────────────────────────────────────────
  { id: 'ocean-kayak-trident-13', marca: 'Ocean Kayak', modelo: 'Trident 13', eslora: 3.96, manga: 0.71, volumen: 300, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'ocean-kayak-trident-15', marca: 'Ocean Kayak', modelo: 'Trident 15', eslora: 4.57, manga: 0.71, volumen: 340, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'ocean-kayak-prowler-13', marca: 'Ocean Kayak', modelo: 'Prowler 13', eslora: 3.96, manga: 0.71, volumen: 300, tipoCasco: 'V', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'ocean-kayak-prowler-15', marca: 'Ocean Kayak', modelo: 'Prowler 15', eslora: 4.57, manga: 0.71, volumen: 340, tipoCasco: 'V', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'ocean-kayak-malibu-two', marca: 'Ocean Kayak', modelo: 'Malibu Two', eslora: 3.66, manga: 0.86, volumen: 320, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'ocean-kayak-caper', marca: 'Ocean Kayak', modelo: 'Caper', eslora: 3.35, manga: 0.76, volumen: 260, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 130, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'ocean-kayak-scrambler', marca: 'Ocean Kayak', modelo: 'Scrambler', eslora: 3.66, manga: 0.76, volumen: 280, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Perception ────────────────────────────────────────────────────
  { id: 'perception-pescador-pro-12', marca: 'Perception', modelo: 'Pescador Pro 12', eslora: 3.66, manga: 0.81, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'perception-pescador-pro-10', marca: 'Perception', modelo: 'Pescador Pro 10', eslora: 3.05, manga: 0.76, volumen: 280, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'perception-striker-115', marca: 'Perception', modelo: 'Striker 11.5', eslora: 3.51, manga: 0.81, volumen: 330, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'perception-striker-135', marca: 'Perception', modelo: 'Striker 13.5', eslora: 4.11, manga: 0.81, volumen: 380, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'perception-pilot-12', marca: 'Perception', modelo: 'Pilot 12', eslora: 3.66, manga: 0.81, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'perception-pilot-10', marca: 'Perception', modelo: 'Pilot 10', eslora: 3.05, manga: 0.76, volumen: 280, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pedal_helice', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Wilderness Systems (pesca, categoría D) ───────────────────────
  { id: 'wilderness-thresher-140', marca: 'Wilderness Systems', modelo: 'Thresher 140', eslora: 4.27, manga: 0.71, volumen: 350, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'wilderness-thresher-155', marca: 'Wilderness Systems', modelo: 'Thresher 155', eslora: 4.72, manga: 0.71, volumen: 380, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'wilderness-tarpon-120', marca: 'Wilderness Systems', modelo: 'Tarpon 120', eslora: 3.66, manga: 0.76, volumen: 320, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'wilderness-tarpon-140', marca: 'Wilderness Systems', modelo: 'Tarpon 140', eslora: 4.27, manga: 0.76, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'wilderness-ride-115', marca: 'Wilderness Systems', modelo: 'Ride 115', eslora: 3.51, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'wilderness-ride-135', marca: 'Wilderness Systems', modelo: 'Ride 135', eslora: 4.11, manga: 0.81, volumen: 380, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'wilderness-radar-115', marca: 'Wilderness Systems', modelo: 'Radar 115', eslora: 3.51, manga: 0.81, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'wilderness-radar-135', marca: 'Wilderness Systems', modelo: 'Radar 135', eslora: 4.11, manga: 0.81, volumen: 400, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pedal_helice', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'wilderness-helix-13', marca: 'Wilderness Systems', modelo: 'Helix 13', eslora: 3.96, manga: 0.81, volumen: 380, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Jackson Kayak ─────────────────────────────────────────────────
  { id: 'jackson-big-rig-hd', marca: 'Jackson Kayak', modelo: 'Big Rig HD', eslora: 3.96, manga: 0.91, volumen: 400, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 250, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'jackson-kraken-135', marca: 'Jackson Kayak', modelo: 'Kraken 13.5', eslora: 4.11, manga: 0.76, volumen: 350, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'jackson-kraken-155', marca: 'Jackson Kayak', modelo: 'Kraken 15.5', eslora: 4.72, manga: 0.76, volumen: 380, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 220, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'jackson-cuda-12', marca: 'Jackson Kayak', modelo: 'Cuda 12', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'jackson-cuda-14', marca: 'Jackson Kayak', modelo: 'Cuda 14', eslora: 4.27, manga: 0.81, volumen: 370, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'jackson-coosa-hd', marca: 'Jackson Kayak', modelo: 'Coosa HD', eslora: 3.66, manga: 0.86, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'jackson-mayfly', marca: 'Jackson Kayak', modelo: 'Mayfly', eslora: 3.35, manga: 0.76, volumen: 280, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Old Town ──────────────────────────────────────────────────────
  { id: 'old-town-sportsman-120', marca: 'Old Town', modelo: 'Sportsman 120', eslora: 3.66, manga: 0.81, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'old-town-sportsman-106', marca: 'Old Town', modelo: 'Sportsman 106', eslora: 3.20, manga: 0.76, volumen: 280, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'old-town-predator-13', marca: 'Old Town', modelo: 'Predator 13', eslora: 3.96, manga: 0.81, volumen: 380, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'old-town-predator-mx', marca: 'Old Town', modelo: 'Predator MX', eslora: 3.66, manga: 0.86, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'old-town-topwater-120', marca: 'Old Town', modelo: 'Topwater 120', eslora: 3.66, manga: 0.81, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'old-town-topwater-106', marca: 'Old Town', modelo: 'Topwater 106', eslora: 3.20, manga: 0.76, volumen: 280, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'old-town-predator-pdl', marca: 'Old Town', modelo: 'Predator PDL', eslora: 4.11, manga: 0.86, volumen: 420, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 250, propulsion: 'pedal_helice', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'old-town-sportsman-pdl-120', marca: 'Old Town', modelo: 'Sportsman PDL 120', eslora: 3.66, manga: 0.86, volumen: 400, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 220, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'old-town-sportsman-salty-pdl-120', marca: 'Old Town', modelo: 'Sportsman Salty PDL 120', eslora: 3.66, manga: 0.86, volumen: 400, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 220, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'old-town-topwater-pdl-120', marca: 'Old Town', modelo: 'Topwater PDL 120', eslora: 3.66, manga: 0.86, volumen: 400, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 220, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── FeelFree ──────────────────────────────────────────────────────
  { id: 'feelfree-lure-115', marca: 'FeelFree', modelo: 'Lure 11.5', eslora: 3.51, manga: 0.86, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'feelfree-lure-135', marca: 'FeelFree', modelo: 'Lure 13.5', eslora: 4.11, manga: 0.86, volumen: 390, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'feelfree-moken-125', marca: 'FeelFree', modelo: 'Moken 12.5', eslora: 3.81, manga: 0.81, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'feelfree-moken-10', marca: 'FeelFree', modelo: 'Moken 10', eslora: 3.05, manga: 0.76, volumen: 280, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'feelfree-moken-13-angler-deluxe', marca: 'FeelFree', modelo: 'Moken 13 Angler Deluxe', eslora: 3.90, manga: 0.79, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 250, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'no_certificado', certificado: false, certificadoOficial: false, verificado: false, certificaciones: { ...SIN_CERTIFICAR }, techoAbsoluto: TECHO_D },
  { id: 'feelfree-lure-115-overdrive', marca: 'FeelFree', modelo: 'Lure 11.5 Overdrive', eslora: 3.51, manga: 0.86, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'feelfree-lure-135-overdrive', marca: 'FeelFree', modelo: 'Lure 13.5 Overdrive', eslora: 4.11, manga: 0.86, volumen: 400, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 210, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'feelfree-moken-125-overdrive', marca: 'FeelFree', modelo: 'Moken 12.5 Overdrive', eslora: 3.81, manga: 0.81, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Riot Kayaks ───────────────────────────────────────────────────
  { id: 'riot-escape-12', marca: 'Riot Kayaks', modelo: 'Escape 12', eslora: 3.66, manga: 0.76, volumen: 300, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'riot-escape-10', marca: 'Riot Kayaks', modelo: 'Escape 10', eslora: 3.05, manga: 0.76, volumen: 260, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 130, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'riot-escape-11', marca: 'Riot Kayaks', modelo: 'Escape 11', eslora: 3.35, manga: 0.76, volumen: 280, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'riot-mako-12', marca: 'Riot Kayaks', modelo: 'Mako 12', eslora: 3.66, manga: 0.76, volumen: 300, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'riot-mako-10', marca: 'Riot Kayaks', modelo: 'Mako 10', eslora: 3.05, manga: 0.76, volumen: 260, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 130, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'riot-escape-12-pedal', marca: 'Riot Kayaks', modelo: 'Escape 12 Pedal', eslora: 3.66, manga: 0.76, volumen: 310, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Viking Kayaks ─────────────────────────────────────────────────
  { id: 'viking-profish-reload', marca: 'Viking Kayaks', modelo: 'Profish Reload', eslora: 4.27, manga: 0.76, volumen: 350, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'viking-profish-reload-pedal', marca: 'Viking Kayaks', modelo: 'Profish Reload Pedal', eslora: 4.27, manga: 0.76, volumen: 360, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pedal_helice', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'viking-profish-gt', marca: 'Viking Kayaks', modelo: 'Profish GT', eslora: 3.96, manga: 0.76, volumen: 300, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'viking-profish-gt-pedal', marca: 'Viking Kayaks', modelo: 'Profish GT Pedal', eslora: 3.96, manga: 0.76, volumen: 310, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'viking-profish-400', marca: 'Viking Kayaks', modelo: 'Profish 400', eslora: 4.00, manga: 0.76, volumen: 310, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'viking-espri', marca: 'Viking Kayaks', modelo: 'Espri', eslora: 3.66, manga: 0.76, volumen: 290, tipoCasco: 'V', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'viking-nemo', marca: 'Viking Kayaks', modelo: 'Nemo', eslora: 3.35, manga: 0.76, volumen: 270, tipoCasco: 'V', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 130, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Hobie ─────────────────────────────────────────────────────────
  { id: 'hobie-mirage-revolution-13', marca: 'Hobie', modelo: 'Mirage Revolution 13', eslora: 4.01, manga: 0.71, volumen: 300, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pedal_aletas', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'hobie-mirage-revolution-11', marca: 'Hobie', modelo: 'Mirage Revolution 11', eslora: 3.35, manga: 0.71, volumen: 270, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 130, propulsion: 'pedal_aletas', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'hobie-mirage-outback', marca: 'Hobie', modelo: 'Mirage Outback', eslora: 3.66, manga: 0.86, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pedal_aletas', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'hobie-mirage-pro-angler-12', marca: 'Hobie', modelo: 'Mirage Pro Angler 12', eslora: 3.66, manga: 0.91, volumen: 400, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 230, propulsion: 'pedal_aletas', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'hobie-mirage-pro-angler-14', marca: 'Hobie', modelo: 'Mirage Pro Angler 14', eslora: 4.17, manga: 0.96, volumen: 450, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 250, propulsion: 'pedal_aletas', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'hobie-mirage-pro-angler-17t', marca: 'Hobie', modelo: 'Mirage Pro Angler 17T', eslora: 5.18, manga: 0.96, volumen: 500, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 300, propulsion: 'pedal_aletas', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'hobie-mirage-compass', marca: 'Hobie', modelo: 'Mirage Compass', eslora: 3.66, manga: 0.86, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pedal_aletas', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'hobie-mirage-passport-105', marca: 'Hobie', modelo: 'Mirage Passport 10.5', eslora: 3.20, manga: 0.81, volumen: 300, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pedal_aletas', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'hobie-mirage-passport-12', marca: 'Hobie', modelo: 'Mirage Passport 12', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pedal_aletas', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'hobie-mirage-lynx', marca: 'Hobie', modelo: 'Mirage Lynx', eslora: 3.35, manga: 0.81, volumen: 300, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pedal_aletas', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Native Watercraft ─────────────────────────────────────────────
  { id: 'native-slayer-propel-10', marca: 'Native Watercraft', modelo: 'Slayer Propel 10', eslora: 3.05, manga: 0.76, volumen: 280, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pedal_helice', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'native-slayer-propel-12', marca: 'Native Watercraft', modelo: 'Slayer Propel 12', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'native-slayer-propel-13', marca: 'Native Watercraft', modelo: 'Slayer Propel 13', eslora: 3.96, manga: 0.81, volumen: 380, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'native-titan-105', marca: 'Native Watercraft', modelo: 'Titan 10.5', eslora: 3.20, manga: 0.86, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pedal_helice', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'native-titan-12', marca: 'Native Watercraft', modelo: 'Titan 12', eslora: 3.66, manga: 0.91, volumen: 400, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 220, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'native-titan-135', marca: 'Native Watercraft', modelo: 'Titan 13.5', eslora: 4.11, manga: 0.91, volumen: 420, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 250, propulsion: 'pedal_helice', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'native-ultimate-fx-12', marca: 'Native Watercraft', modelo: 'Ultimate FX 12', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'native-ultimate-fx-15', marca: 'Native Watercraft', modelo: 'Ultimate FX 15', eslora: 4.57, manga: 0.81, volumen: 380, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Pelican ───────────────────────────────────────────────────────
  { id: 'pelican-catch-120', marca: 'Pelican', modelo: 'Catch 120', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'pelican-catch-100', marca: 'Pelican', modelo: 'Catch 100', eslora: 3.05, manga: 0.76, volumen: 270, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'pelican-catch-130-hydryve', marca: 'Pelican', modelo: 'Catch 130 Hydryve', eslora: 3.96, manga: 0.81, volumen: 370, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'pelican-catch-110-hydryve', marca: 'Pelican', modelo: 'Catch 110 Hydryve', eslora: 3.35, manga: 0.81, volumen: 310, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pedal_helice', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Sun Dolphin ───────────────────────────────────────────────────
  { id: 'sun-dolphin-journey-12', marca: 'Sun Dolphin', modelo: 'Journey 12', eslora: 3.66, manga: 0.76, volumen: 300, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'sun-dolphin-journey-10', marca: 'Sun Dolphin', modelo: 'Journey 10', eslora: 3.05, manga: 0.76, volumen: 260, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 130, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'sun-dolphin-aruba-10', marca: 'Sun Dolphin', modelo: 'Aruba 10', eslora: 3.05, manga: 0.76, volumen: 250, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 120, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Lifetime ──────────────────────────────────────────────────────
  { id: 'lifetime-tamarack-120', marca: 'Lifetime', modelo: 'Tamarack 120', eslora: 3.66, manga: 0.76, volumen: 300, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'lifetime-tamarack-100', marca: 'Lifetime', modelo: 'Tamarack 100', eslora: 3.05, manga: 0.76, volumen: 260, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 130, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'lifetime-tandem-14', marca: 'Lifetime', modelo: 'Tandem 14', eslora: 4.27, manga: 0.81, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'lifetime-stealth-pro', marca: 'Lifetime', modelo: 'Stealth Pro', eslora: 3.35, manga: 0.76, volumen: 270, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Ascend ────────────────────────────────────────────────────────
  { id: 'ascend-fs12t', marca: 'Ascend', modelo: 'FS12T', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'ascend-fs10', marca: 'Ascend', modelo: 'FS10', eslora: 3.05, manga: 0.76, volumen: 270, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'ascend-fs128t', marca: 'Ascend', modelo: 'FS128T', eslora: 3.81, manga: 0.81, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'ascend-h12', marca: 'Ascend', modelo: 'H12', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Bonafide ──────────────────────────────────────────────────────
  { id: 'bonafide-ss107', marca: 'Bonafide', modelo: 'SS107', eslora: 3.20, manga: 0.81, volumen: 300, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'bonafide-ss127', marca: 'Bonafide', modelo: 'SS127', eslora: 3.81, manga: 0.81, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'bonafide-rs117', marca: 'Bonafide', modelo: 'RS117', eslora: 3.51, manga: 0.86, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'bonafide-p127', marca: 'Bonafide', modelo: 'P127', eslora: 3.81, manga: 0.86, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pedal_helice', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'bonafide-ex123', marca: 'Bonafide', modelo: 'EX123', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Crescent ──────────────────────────────────────────────────────
  { id: 'crescent-lite-tackle', marca: 'Crescent', modelo: 'Lite Tackle', eslora: 3.66, manga: 0.81, volumen: 330, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'crescent-crew', marca: 'Crescent', modelo: 'Crew', eslora: 3.96, manga: 0.81, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'crescent-shoalie', marca: 'Crescent', modelo: 'Shoalie', eslora: 3.81, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'crescent-ck1', marca: 'Crescent', modelo: 'CK1', eslora: 3.66, manga: 0.81, volumen: 330, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Nucanoe ───────────────────────────────────────────────────────
  { id: 'nucanoe-frontier-12', marca: 'Nucanoe', modelo: 'Frontier 12', eslora: 3.66, manga: 0.91, volumen: 380, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 250, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'nucanoe-pursuit', marca: 'Nucanoe', modelo: 'Pursuit', eslora: 3.96, manga: 0.91, volumen: 400, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 270, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'nucanoe-flint', marca: 'Nucanoe', modelo: 'Flint', eslora: 3.35, manga: 0.86, volumen: 320, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'nucanoe-unlimited', marca: 'Nucanoe', modelo: 'Unlimited', eslora: 4.27, manga: 0.91, volumen: 420, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 300, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'nucanoe-u10', marca: 'Nucanoe', modelo: 'U10', eslora: 3.05, manga: 0.86, volumen: 300, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'nucanoe-f10', marca: 'Nucanoe', modelo: 'F10', eslora: 3.05, manga: 0.91, volumen: 320, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Vibe ──────────────────────────────────────────────────────────
  { id: 'vibe-sea-ghost-110', marca: 'Vibe', modelo: 'Sea Ghost 110', eslora: 3.35, manga: 0.81, volumen: 310, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'vibe-sea-ghost-130', marca: 'Vibe', modelo: 'Sea Ghost 130', eslora: 3.96, manga: 0.81, volumen: 370, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'vibe-yellowfin-100', marca: 'Vibe', modelo: 'Yellowfin 100', eslora: 3.05, manga: 0.81, volumen: 290, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'vibe-yellowfin-120', marca: 'Vibe', modelo: 'Yellowfin 120', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'vibe-yellowfin-130t', marca: 'Vibe', modelo: 'Yellowfin 130T', eslora: 3.96, manga: 0.81, volumen: 370, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 200, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'vibe-shearwater-125', marca: 'Vibe', modelo: 'Shearwater 125', eslora: 3.81, manga: 0.81, volumen: 350, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'vibe-maverick-120', marca: 'Vibe', modelo: 'Maverick 120', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── 3 Waters ──────────────────────────────────────────────────────
  { id: '3waters-big-fish-105', marca: '3 Waters', modelo: 'Big Fish 105', eslora: 3.20, manga: 0.81, volumen: 290, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 150, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: '3waters-big-fish-108', marca: '3 Waters', modelo: 'Big Fish 108', eslora: 3.35, manga: 0.81, volumen: 300, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: '3waters-big-fish-120', marca: '3 Waters', modelo: 'Big Fish 120', eslora: 3.66, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: '3waters-big-fish-103', marca: '3 Waters', modelo: 'Big Fish 103', eslora: 3.05, manga: 0.76, volumen: 270, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 140, propulsion: 'pala', categoriaWKF: 'K2', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Malibu Kayaks ─────────────────────────────────────────────────
  { id: 'malibu-x-13', marca: 'Malibu Kayaks', modelo: 'X-13', eslora: 3.96, manga: 0.76, volumen: 320, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'malibu-stealth-12', marca: 'Malibu Kayaks', modelo: 'Stealth 12', eslora: 3.66, manga: 0.81, volumen: 330, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'malibu-stealth-14', marca: 'Malibu Kayaks', modelo: 'Stealth 14', eslora: 4.27, manga: 0.81, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'malibu-pro-explorer', marca: 'Malibu Kayaks', modelo: 'Pro Explorer', eslora: 3.96, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'malibu-mini-x', marca: 'Malibu Kayaks', modelo: 'Mini-X', eslora: 2.90, manga: 0.76, volumen: 240, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 120, propulsion: 'pala', categoriaWKF: 'K1', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Cobra Kayaks ──────────────────────────────────────────────────
  { id: 'cobra-fish-n-dive', marca: 'Cobra Kayaks', modelo: 'Fish n Dive', eslora: 3.66, manga: 0.81, volumen: 330, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 170, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'cobra-marauder', marca: 'Cobra Kayaks', modelo: 'Marauder', eslora: 4.27, manga: 0.81, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'cobra-explorer', marca: 'Cobra Kayaks', modelo: 'Explorer', eslora: 3.96, manga: 0.81, volumen: 340, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'cobra-navigator', marca: 'Cobra Kayaks', modelo: 'Navigator', eslora: 3.66, manga: 0.76, volumen: 310, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 160, propulsion: 'pala', categoriaWKF: 'K3', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'cobra-tourer', marca: 'Cobra Kayaks', modelo: 'Tourer', eslora: 4.57, manga: 0.76, volumen: 340, tipoCasco: 'V', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 180, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'cobra-triple-x', marca: 'Cobra Kayaks', modelo: 'Triple X', eslora: 4.27, manga: 0.81, volumen: 360, tipoCasco: 'U', autovaciable: true, timon: true, compartimentosEstancos: false, capacidadCarga: 190, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },
  { id: 'cobra-tandem', marca: 'Cobra Kayaks', modelo: 'Tandem', eslora: 4.57, manga: 0.86, volumen: 380, tipoCasco: 'U', autovaciable: true, timon: false, compartimentosEstancos: false, capacidadCarga: 220, propulsion: 'pala', categoriaWKF: 'K4', categoriaDirectiva: 'D', certificado: true, certificadoOficial: true, verificado: false, certificaciones: certUSCG(), techoAbsoluto: TECHO_D },

  // ── Galaxy Kayaks ─────────────────────────────────────────────────
  kolNoCertificado('galaxy-cruz-ultra', 'Cruz Ultra', 2.92, 0.84, 180, 'U', true, false, false, 150, 'pala', 'K2'),
  kolNoCertificado('galaxy-rider', 'Rider', 2.64, 0.80, 150, 'U', true, false, false, 130, 'pala', 'K1'),
  kolNoCertificado('galaxy-ocelote', 'Ocelote', 2.90, 0.82, 200, 'U', true, true, false, 150, 'pedal_aletas', 'K2'),
  kolNoCertificado('galaxy-alboran-hv', 'Alborán HV', 4.09, 0.80, 350, 'U', true, true, false, 180, 'pala', 'K3'),
  kolNoCertificado('galaxy-alboran-fx3', 'Alborán FX3', 4.09, 0.80, 350, 'U', true, true, false, 180, 'pedal_helice', 'K3'),
  kolNoCertificado('galaxy-wildcat-fx3-wahoo-s', 'Wildcat FX3 / Wahoo S', 3.57, 0.80, 300, 'U', true, true, false, 180, 'pedal_aletas', 'K3'),
  kolNoCertificado('galaxy-supernova-fx', 'Supernova FX', 3.98, 0.85, 400, 'U', true, true, false, 220, 'pedal_helice', 'K3'),
  kolNoCertificado('galaxy-supernova-jr-fx', 'Supernova Jr FX', 3.00, 0.80, 200, 'U', true, true, false, 150, 'pedal_helice', 'K2'),
  kolNoCertificado('galaxy-marlin-430', 'Marlin 430', 4.40, 0.75, 350, 'V', false, true, true, 190, 'pala', 'K4'),
  kolNoCertificado('galaxy-strike', 'Strike', 3.40, 0.84, 300, 'U', true, true, false, 160, 'pala', 'K3'),
  kolNoCertificado('galaxy-tandem-tahiti-x', 'Tándem Tahiti X', 3.70, 0.86, 400, 'U', true, false, false, 240, 'pala', 'K4'),
  kolNoCertificado('galaxy-ranger', 'Ranger', 2.90, 0.78, 180, 'U', true, false, false, 140, 'pala', 'K2'),
  kolNoCertificado('galaxy-force', 'Force', 2.70, 0.78, 160, 'U', true, false, false, 130, 'pala', 'K1'),

  // ── Todo Kayak ────────────────────────────────────────────────────
  kolNoCertificado('todo-kayak-hook', 'Hook', 2.39, 0.79, 180, 'U', true, false, false, 125, 'pala', 'K1'),
  kolNoCertificado('todo-kayak-delta', 'Delta', 2.66, 0.70, 150, 'U', true, false, false, 100, 'pala', 'K1'),
  kolNoCertificado('todo-kayak-randal', 'Randal', 2.44, 0.79, 200, 'U', true, false, false, 120, 'pala', 'K1'),
  kolNoCertificado('todo-kayak-tornado', 'Tornado', 2.92, 0.70, 180, 'V', true, false, false, 136, 'pala', 'K2'),
  kolNoCertificado('todo-kayak-haddock', 'Haddock', 4.50, 0.63, 350, 'V', false, true, true, 155, 'pala', 'K4'),
  kolNoCertificado('todo-kayak-racer', 'Racer', 3.68, 0.80, 320, 'U', true, true, false, 180, 'pedal_aletas', 'K3'),
  kolNoCertificado('todo-kayak-sondeo', 'Sondeo', 3.71, 0.97, 450, 'U', true, true, false, 220, 'pedal_helice', 'K4'),
  kolNoCertificado('todo-kayak-voluta', 'Voluta', 3.96, 0.82, 400, 'U', true, true, false, 180, 'pedal_helice', 'K3'),
  kolNoCertificado('todo-kayak-catamaran-f15', 'Catamarán F15', 3.82, 1.00, 500, 'plano', true, true, false, 380, 'pedal_helice', 'K4'),
  kolNoCertificado('todo-kayak-oxifish', 'Oxifish', 2.90, 0.95, 300, 'U', true, true, false, 230, 'pedal_aletas', 'K3'),
  kolNoCertificado('todo-kayak-navio-tandem', 'Navío Tándem', 4.53, 0.88, 450, 'U', true, true, false, 300, 'pedal_helice', 'K4'),
  kolNoCertificado('todo-kayak-taramay-tandem', 'Taramay Tándem', 4.50, 0.91, 450, 'U', true, true, false, 300, 'pedal_aletas', 'K4'),
  kolNoCertificado('todo-kayak-matrix', 'Matrix', 3.16, 0.87, 300, 'U', true, true, false, 180, 'pedal_helice', 'K3'),
  kolNoCertificado('todo-kayak-barracuda-pro', 'Barracuda PRO', 2.95, 0.80, 200, 'U', true, false, false, 150, 'pala', 'K2'),
  kolNoCertificado('todo-kayak-barracuda-tandem', 'Barracuda Tándem', 3.72, 0.89, 350, 'U', true, false, false, 250, 'pala', 'K4'),
  kolNoCertificado('todo-kayak-barcaza', 'Barcaza', 4.99, 0.90, 500, 'U', true, false, false, 280, 'pala', 'K5'),
  kolNoCertificado('todo-kayak-marine', 'Marine', 2.70, 0.80, 180, 'U', true, false, false, 130, 'pala', 'K1'),
  kolNoCertificado('todo-kayak-marea-tandem', 'Marea Tándem', 3.73, 0.82, 300, 'U', true, false, false, 220, 'pala', 'K3'),
  kolNoCertificado('todo-kayak-pingo', 'Pingo', 3.30, 0.80, 280, 'U', true, true, false, 150, 'pala', 'K3'),
  kolNoCertificado('todo-kayak-luna', 'Luna', 3.30, 0.78, 250, 'U', true, false, false, 140, 'pala', 'K2'),

  // ── KOL Outdoor ───────────────────────────────────────────────────
  kolNoCertificado('kol-outdoor-whale-propel-two', 'Whale Propel Two', 4.50, 0.91, 450, 'U', true, true, false, 300, 'pedal_helice', 'K4'),
  kolNoCertificado('kol-outdoor-whale-propel-one', 'Whale Propel One', 3.00, 0.91, 300, 'U', true, true, false, 180, 'pedal_helice', 'K3'),
  kolNoCertificado('kol-outdoor-evo-two', 'EVO Two', 4.20, 0.81, 400, 'U', true, true, false, 250, 'pedal_aletas', 'K4'),
  kolNoCertificado('kol-outdoor-swift-360', 'Swift 360', 3.60, 0.66, 250, 'V', false, true, true, 150, 'pala', 'K3'),
  kolNoCertificado('kol-outdoor-tarpon-propel-320', 'Tarpon Propel 320', 3.16, 0.86, 300, 'U', true, true, false, 140, 'pedal_helice', 'K3'),
  kolNoCertificado('kol-outdoor-oceanus-r-pro', 'Oceanus R / PRO', 3.72, 0.86, 350, 'U', true, false, false, 250, 'pala', 'K4'),
  kolNoCertificado('kol-outdoor-falco-combo-11', 'Falco Combo 11', 3.35, 0.86, 300, 'U', true, false, false, 160, 'pala', 'K3'),
  kolNoCertificado('kol-outdoor-mini-nori', 'Mini Nori', 2.60, 0.78, 150, 'U', true, false, false, 100, 'pala', 'K1'),
  kolNoCertificado('kol-outdoor-nori-1', 'Nori 1', 3.72, 0.80, 300, 'U', true, false, false, 170, 'pala', 'K3'),
  kolNoCertificado('kol-outdoor-nori-2', 'Nori 2', 4.20, 0.84, 350, 'U', true, false, false, 190, 'pala', 'K4'),
  kolNoCertificado('kol-outdoor-fredy-2', 'Fredy 2', 3.72, 0.82, 350, 'U', true, false, false, 190, 'pala', 'K3'),
  kolNoCertificado('kol-outdoor-dentex-one', 'Dentex One', 3.00, 0.84, 200, 'U', true, true, false, 230, 'pedal_helice', 'K2'),
  kolNoCertificado('kol-outdoor-propel-12', 'Propel 12', 3.65, 0.84, 350, 'U', true, true, false, 180, 'pedal_helice', 'K3'),
  kolNoCertificado('kol-outdoor-fisher-pro-12-pala', 'Fisher Pro 12 (pala)', 3.70, 0.86, 380, 'U', true, true, false, 280, 'pala', 'K3'),
  kolNoCertificado('kol-outdoor-fisher-pro-12-aletas', 'Fisher Pro 12 (aletas)', 3.70, 0.86, 380, 'U', true, true, false, 280, 'pedal_aletas', 'K3'),
  kolNoCertificado('kol-outdoor-fisher-pro-12-helice', 'Fisher Pro 12 (hélice)', 3.70, 0.86, 380, 'U', true, true, false, 280, 'pedal_helice', 'K3'),

  // ── Marlin Kayak ──────────────────────────────────────────────────
  kolNoCertificado('marlin-kayak-fins-max-2025-2026', 'Fins Max 2025/2026', 3.72, 0.84, 350, 'U', true, true, false, 170, 'pedal_helice', 'K3'),
  kolNoCertificado('marlin-kayak-fins-409', 'Fins 409', 4.09, 0.80, 350, 'U', true, true, false, 180, 'pedal_aletas', 'K3'),
  kolNoCertificado('marlin-kayak-fins-mini', 'Fins Mini', 2.92, 0.83, 200, 'U', true, true, false, 150, 'pedal_aletas', 'K2'),
  kolNoCertificado('marlin-kayak-mini-falcon-2026', 'Mini Falcon 2026', 2.50, 0.90, 200, 'U', true, true, false, 165, 'pedal_aletas', 'K2'),
  kolNoCertificado('marlin-kayak-one-2026', 'One 2026', 2.96, 0.81, 200, 'U', true, false, false, 165, 'pala', 'K2'),
  kolNoCertificado('marlin-kayak-pescador', 'Pescador', 3.57, 0.82, 300, 'U', true, false, false, 160, 'pala', 'K3'),
];

export function buscarKayakPorId(id: string): Kayak | undefined {
  return CATALOGO_KAYAKS.find((k) => k.id === id);
}

export function buscarKayaksPorNombre(texto: string): Kayak[] {
  const q = texto.trim().toLowerCase();
  if (!q) return [];
  return CATALOGO_KAYAKS.filter((k) =>
    `${k.marca} ${k.modelo}`.toLowerCase().includes(q)
  ).slice(0, 50);
}

// Helper: etiqueta visible de categoría WKF, con 'c' si hay certificado oficial.
// Ejemplo: 'K4c' si certificadoOficial=true, 'K4' si no.
export function etiquetaCategoria(kayak: Kayak): string {
  return `${kayak.categoriaWKF}${kayak.certificadoOficial ? 'c' : ''}`;
}