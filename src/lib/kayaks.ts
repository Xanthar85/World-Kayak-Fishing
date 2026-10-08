// src/lib/kayaks.ts
// WKF — Catálogo de kayaks.
// v1.015 final: catálogo ampliado. Dolphin y Fisher pasan a KOL Outdoor
// (marca real confirmada por el fabricante). Nuevos modelos: Dentex One,
// Moken 13 Angler Deluxe, y modelos del CSV ampliado de Galaxy, Todo
// Kayak, KOL Outdoor y Marlin Kayak.
//
// Nomenclatura de categoría:
//   categoriaWKF: 'K1'|'K2'|'K3'|'K4'|'K5'  → características técnicas.
//   certificadoOficial: boolean               → true si asumimos
//                                              certificación oficial (CE,
//                                              UKCA, etc.) según marca
//                                              y geografía. En UI se
//                                              muestra 'K4c' cuando true,
//                                              'K4' cuando false.
//
// Regla de certificación aplicada:
//   - Marcas europeas: certificadoOficial = true (CE C o D según tamaño).
//   - Marcas USA/Canadá: certificadoOficial = false por defecto.
//   - Casos confirmados con ficha oficial (Alborán FX3): true.
//
// Los patos van en archivo aparte (pendiente).

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

// Helper: entrada sin certificación oficial asumida (marcas USA/Canadá).
function entradaNoCertificada(
  marca: string,
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
    marca,
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

// Helper: entrada europea con CE asumido (C por defecto, D para pequeños/modulares).
function entradaEuropeaCE(
  marca: string,
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
  categoriaWKF: CategoriaKayak,
  catDir: 'C' | 'D'
): Kayak {
  return {
    id,
    marca,
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
    categoriaDirectiva: catDir,
    certificado: true,
    certificadoOficial: true,
    verificado: false,
    certificaciones: certCE(catDir),
    techoAbsoluto: catDir === 'C' ? TECHO_C : TECHO_D,
  };
}

export const CATALOGO_KAYAKS: Kayak[] = [
  // ── Stealth Kayaks (Sudáfrica, sin CE publicada) ─────────────────
  entradaNoCertificada('Stealth Kayaks', 'stealth-profisha-525', 'Profisha 525', 5.25, 0.66, 400, 'V', false, true, true, 200, 'pala', 'K5'),
  entradaNoCertificada('Stealth Kayaks', 'stealth-profisha-575', 'Profisha 575', 5.75, 0.66, 420, 'V', false, true, true, 220, 'pala', 'K5'),
  entradaNoCertificada('Stealth Kayaks', 'stealth-profisha-475', 'Profisha 475', 4.75, 0.66, 350, 'V', false, true, true, 180, 'pala', 'K5'),
  entradaNoCertificada('Stealth Kayaks', 'stealth-profisha-425', 'Profisha 425', 4.25, 0.66, 320, 'V', false, true, true, 160, 'pala', 'K4'),
  entradaNoCertificada('Stealth Kayaks', 'stealth-bfs-465', 'BFS 465', 4.65, 0.68, 340, 'V', false, true, true, 170, 'pala', 'K4'),

  // ── Epic Kayaks (Sudáfrica/USA, sin CE publicada) ────────────────
  entradaNoCertificada('Epic Kayaks', 'epic-v5', 'V5', 5.20, 0.51, 300, 'V', false, true, true, 150, 'pala', 'K5'),
  entradaNoCertificada('Epic Kayaks', 'epic-v6', 'V6', 6.10, 0.51, 350, 'V', false, true, true, 180, 'pala', 'K5'),
  entradaNoCertificada('Epic Kayaks', 'epic-v7', 'V7', 6.70, 0.51, 380, 'V', false, true, true, 190, 'pala', 'K5'),
  entradaNoCertificada('Epic Kayaks', 'epic-v8', 'V8', 7.60, 0.51, 400, 'V', false, true, true, 200, 'pala', 'K5'),
  entradaNoCertificada('Epic Kayaks', 'epic-surfski-v10', 'Surfski V10', 6.40, 0.43, 280, 'V', false, true, true, 140, 'pala', 'K5'),

  // ── Tiderace Kayaks (UK, CE C asumida) ────────────────────────────
  entradaEuropeaCE('Tiderace Kayaks', 'tiderace-xcite', 'Xcite', 5.20, 0.53, 320, 'V', false, true, true, 160, 'pala', 'K5', 'C'),
  entradaEuropeaCE('Tiderace Kayaks', 'tiderace-xplore', 'Xplore', 5.30, 0.55, 340, 'V', false, true, true, 170, 'pala', 'K5', 'C'),
  entradaEuropeaCE('Tiderace Kayaks', 'tiderace-xceed', 'Xceed', 5.40, 0.54, 330, 'V', false, true, true, 165, 'pala', 'K5', 'C'),

  // ── Valley Kayaks (UK, CE C asumida) ──────────────────────────────
  entradaEuropeaCE('Valley Kayaks', 'valley-etain-175', 'Etain 17.5', 5.33, 0.53, 340, 'V', false, true, true, 170, 'pala', 'K5', 'C'),
  entradaEuropeaCE('Valley Kayaks', 'valley-etain-177', 'Etain 17.7', 5.40, 0.53, 350, 'V', false, true, true, 175, 'pala', 'K5', 'C'),
  entradaEuropeaCE('Valley Kayaks', 'valley-nordkapp', 'Nordkapp', 5.30, 0.52, 320, 'V', false, true, true, 160, 'pala', 'K5', 'C'),

  // ── P&H Sea Kayaks (UK, CE C asumida) ────────────────────────────
  entradaEuropeaCE('P&H Sea Kayaks', 'ph-cetus', 'Cetus', 5.20, 0.53, 330, 'V', false, true, true, 165, 'pala', 'K5', 'C'),
  entradaEuropeaCE('P&H Sea Kayaks', 'ph-scorpio', 'Scorpio', 5.10, 0.54, 320, 'V', false, true, true, 160, 'pala', 'K5', 'C'),
  entradaEuropeaCE('P&H Sea Kayaks', 'ph-delphin', 'Delphin', 4.80, 0.55, 300, 'V', false, true, true, 150, 'pala', 'K5', 'C'),

  // ── Rockpool Kayaks (UK, CE C asumida) ───────────────────────────
  entradaEuropeaCE('Rockpool Kayaks', 'rockpool-taran', 'Taran', 5.40, 0.52, 330, 'V', false, true, true, 165, 'pala', 'K5', 'C'),
  entradaEuropeaCE('Rockpool Kayaks', 'rockpool-alaw', 'Alaw', 5.20, 0.53, 320, 'V', false, true, true, 160, 'pala', 'K5', 'C'),

  // ── NDK (UK, CE C asumida) ───────────────────────────────────────
  entradaEuropeaCE('NDK', 'ndk-explorer', 'Explorer', 5.30, 0.53, 340, 'V', false, true, true, 170, 'pala', 'K5', 'C'),
  entradaEuropeaCE('NDK', 'ndk-romany', 'Romany', 5.10, 0.54, 320, 'V', false, true, true, 160, 'pala', 'K5', 'C'),

  // ── SKUK (UK, CE C asumida) ──────────────────────────────────────
  entradaEuropeaCE('SKUK', 'skuk-grand-illusion', 'Grand Illusion', 5.40, 0.53, 340, 'V', false, true, true, 170, 'pala', 'K5', 'C'),
  entradaEuropeaCE('SKUK', 'skuk-progression', 'Progression', 5.20, 0.53, 320, 'V', false, true, true, 160, 'pala', 'K5', 'C'),

  // ── Current Designs (Canadá, sin CE publicada) ───────────────────
  entradaNoCertificada('Current Designs', 'current-designs-solstice-gt', 'Solstice GT', 5.40, 0.55, 340, 'V', false, true, true, 170, 'pala', 'K5'),
  entradaNoCertificada('Current Designs', 'current-designs-solstice-gts', 'Solstice GTS', 5.20, 0.55, 320, 'V', false, true, true, 160, 'pala', 'K5'),
  entradaNoCertificada('Current Designs', 'current-designs-karla', 'Karla', 5.00, 0.54, 300, 'V', false, true, true, 150, 'pala', 'K5'),

  // ── Boreal Design (Canadá, sin CE publicada) ─────────────────────
  entradaNoCertificada('Boreal Design', 'boreal-baffin', 'Baffin', 5.20, 0.55, 330, 'V', false, true, true, 165, 'pala', 'K5'),
  entradaNoCertificada('Boreal Design', 'boreal-epsilon', 'Epsilon', 5.00, 0.54, 310, 'V', false, true, true, 155, 'pala', 'K5'),

  // ── Seaward Kayaks (Canadá, sin CE publicada) ────────────────────
  entradaNoCertificada('Seaward Kayaks', 'seaward-navigator', 'Navigator', 5.30, 0.55, 340, 'V', false, true, true, 170, 'pala', 'K5'),
  entradaNoCertificada('Seaward Kayaks', 'seaward-quest', 'Quest', 5.10, 0.54, 320, 'V', false, true, true, 160, 'pala', 'K5'),

  // ── Necky Kayaks (USA, sin CE publicada) ─────────────────────────
  entradaNoCertificada('Necky Kayaks', 'necky-chatham', 'Chatham', 5.20, 0.55, 330, 'V', false, true, true, 165, 'pala', 'K5'),
  entradaNoCertificada('Necky Kayaks', 'necky-looksha', 'Looksha', 5.00, 0.54, 310, 'V', false, true, true, 155, 'pala', 'K5'),

  // ── Wilderness Systems travesía (USA, sin CE publicada) ──────────
  entradaNoCertificada('Wilderness Systems', 'wilderness-tempest-170', 'Tempest 170', 5.20, 0.55, 330, 'V', false, true, true, 165, 'pala', 'K5'),
  entradaNoCertificada('Wilderness Systems', 'wilderness-tempest-165', 'Tempest 165', 5.00, 0.54, 310, 'V', false, true, true, 155, 'pala', 'K5'),

  // ── Dagger Kayaks (USA, sin CE publicada) ────────────────────────
  entradaNoCertificada('Dagger Kayaks', 'dagger-stratos', 'Stratos', 5.10, 0.55, 320, 'V', false, true, true, 160, 'pala', 'K5'),
  entradaNoCertificada('Dagger Kayaks', 'dagger-alchemy', 'Alchemy', 4.90, 0.55, 300, 'V', false, true, true, 150, 'pala', 'K5'),

  // ── Prijon Kayaks (Alemania, CE C asumida) ───────────────────────
  entradaEuropeaCE('Prijon Kayaks', 'prijon-kodiak', 'Kodiak', 5.20, 0.55, 330, 'V', false, true, true, 165, 'pala', 'K5', 'C'),
  entradaEuropeaCE('Prijon Kayaks', 'prijon-seayak', 'Seayak', 5.00, 0.54, 310, 'V', false, true, true, 155, 'pala', 'K5', 'C'),

  // ── Ocean Kayak (USA, sin CE publicada) ──────────────────────────
  entradaNoCertificada('Ocean Kayak', 'ocean-kayak-trident-13', 'Trident 13', 3.96, 0.71, 300, 'V', true, true, false, 150, 'pala', 'K3'),
  entradaNoCertificada('Ocean Kayak', 'ocean-kayak-trident-15', 'Trident 15', 4.57, 0.71, 340, 'V', true, true, false, 170, 'pala', 'K4'),
  entradaNoCertificada('Ocean Kayak', 'ocean-kayak-prowler-13', 'Prowler 13', 3.96, 0.71, 300, 'V', true, false, false, 150, 'pala', 'K3'),
  entradaNoCertificada('Ocean Kayak', 'ocean-kayak-prowler-15', 'Prowler 15', 4.57, 0.71, 340, 'V', true, false, false, 170, 'pala', 'K4'),
  entradaNoCertificada('Ocean Kayak', 'ocean-kayak-malibu-two', 'Malibu Two', 3.66, 0.86, 320, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Ocean Kayak', 'ocean-kayak-caper', 'Caper', 3.35, 0.76, 260, 'U', true, false, false, 130, 'pala', 'K2'),
  entradaNoCertificada('Ocean Kayak', 'ocean-kayak-scrambler', 'Scrambler', 3.66, 0.76, 280, 'U', true, false, false, 140, 'pala', 'K3'),

  // ── Perception (USA/UK, sin CE publicada) ────────────────────────
  entradaNoCertificada('Perception', 'perception-pescador-pro-12', 'Pescador Pro 12', 3.66, 0.81, 350, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Perception', 'perception-pescador-pro-10', 'Pescador Pro 10', 3.05, 0.76, 280, 'U', true, false, false, 140, 'pala', 'K2'),
  entradaNoCertificada('Perception', 'perception-striker-115', 'Striker 11.5', 3.51, 0.81, 330, 'U', true, false, false, 170, 'pala', 'K3'),
  entradaNoCertificada('Perception', 'perception-striker-135', 'Striker 13.5', 4.11, 0.81, 380, 'U', true, true, false, 200, 'pala', 'K3'),
  entradaNoCertificada('Perception', 'perception-pilot-12', 'Pilot 12', 3.66, 0.81, 350, 'U', true, false, false, 180, 'pedal_helice', 'K3'),
  entradaNoCertificada('Perception', 'perception-pilot-10', 'Pilot 10', 3.05, 0.76, 280, 'U', true, false, false, 150, 'pedal_helice', 'K2'),

  // ── Wilderness Systems pesca (USA, sin CE publicada) ─────────────
  entradaNoCertificada('Wilderness Systems', 'wilderness-thresher-140', 'Thresher 140', 4.27, 0.71, 350, 'V', true, true, false, 180, 'pala', 'K4'),
  entradaNoCertificada('Wilderness Systems', 'wilderness-thresher-155', 'Thresher 155', 4.72, 0.71, 380, 'V', true, true, false, 200, 'pala', 'K4'),
  entradaNoCertificada('Wilderness Systems', 'wilderness-tarpon-120', 'Tarpon 120', 3.66, 0.76, 320, 'U', true, false, false, 160, 'pala', 'K3'),
  entradaNoCertificada('Wilderness Systems', 'wilderness-tarpon-140', 'Tarpon 140', 4.27, 0.76, 360, 'U', true, true, false, 190, 'pala', 'K4'),
  entradaNoCertificada('Wilderness Systems', 'wilderness-ride-115', 'Ride 115', 3.51, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Wilderness Systems', 'wilderness-ride-135', 'Ride 135', 4.11, 0.81, 380, 'U', true, true, false, 200, 'pala', 'K3'),
  entradaNoCertificada('Wilderness Systems', 'wilderness-radar-115', 'Radar 115', 3.51, 0.81, 360, 'U', true, false, false, 190, 'pedal_helice', 'K3'),
  entradaNoCertificada('Wilderness Systems', 'wilderness-radar-135', 'Radar 135', 4.11, 0.81, 400, 'U', true, true, false, 200, 'pedal_helice', 'K4'),
  entradaNoCertificada('Wilderness Systems', 'wilderness-helix-13', 'Helix 13', 3.96, 0.81, 380, 'U', true, true, false, 200, 'pedal_helice', 'K3'),

  // ── Jackson Kayak (USA, sin CE publicada) ────────────────────────
  entradaNoCertificada('Jackson Kayak', 'jackson-big-rig-hd', 'Big Rig HD', 3.96, 0.91, 400, 'U', true, true, false, 250, 'pala', 'K3'),
  entradaNoCertificada('Jackson Kayak', 'jackson-kraken-135', 'Kraken 13.5', 4.11, 0.76, 350, 'V', true, true, false, 200, 'pala', 'K4'),
  entradaNoCertificada('Jackson Kayak', 'jackson-kraken-155', 'Kraken 15.5', 4.72, 0.76, 380, 'V', true, true, false, 220, 'pala', 'K4'),
  entradaNoCertificada('Jackson Kayak', 'jackson-cuda-12', 'Cuda 12', 3.66, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Jackson Kayak', 'jackson-cuda-14', 'Cuda 14', 4.27, 0.81, 370, 'U', true, true, false, 200, 'pala', 'K4'),
  entradaNoCertificada('Jackson Kayak', 'jackson-coosa-hd', 'Coosa HD', 3.66, 0.86, 360, 'U', true, false, false, 190, 'pala', 'K3'),
  entradaNoCertificada('Jackson Kayak', 'jackson-mayfly', 'Mayfly', 3.35, 0.76, 280, 'U', true, false, false, 140, 'pala', 'K2'),

  // ── Old Town (USA, sin CE publicada) ─────────────────────────────
  entradaNoCertificada('Old Town', 'old-town-sportsman-120', 'Sportsman 120', 3.66, 0.81, 350, 'U', true, true, false, 200, 'pala', 'K3'),
  entradaNoCertificada('Old Town', 'old-town-sportsman-106', 'Sportsman 106', 3.20, 0.76, 280, 'U', true, false, false, 150, 'pala', 'K2'),
  entradaNoCertificada('Old Town', 'old-town-predator-13', 'Predator 13', 3.96, 0.81, 380, 'U', true, true, false, 200, 'pala', 'K3'),
  entradaNoCertificada('Old Town', 'old-town-predator-mx', 'Predator MX', 3.66, 0.86, 360, 'U', true, false, false, 190, 'pala', 'K3'),
  entradaNoCertificada('Old Town', 'old-town-topwater-120', 'Topwater 120', 3.66, 0.81, 350, 'U', true, true, false, 200, 'pala', 'K3'),
  entradaNoCertificada('Old Town', 'old-town-topwater-106', 'Topwater 106', 3.20, 0.76, 280, 'U', true, false, false, 150, 'pala', 'K2'),
  entradaNoCertificada('Old Town', 'old-town-predator-pdl', 'Predator PDL', 4.11, 0.86, 420, 'U', true, true, false, 250, 'pedal_helice', 'K4'),
  entradaNoCertificada('Old Town', 'old-town-sportsman-pdl-120', 'Sportsman PDL 120', 3.66, 0.86, 400, 'U', true, true, false, 220, 'pedal_helice', 'K3'),
  entradaNoCertificada('Old Town', 'old-town-sportsman-salty-pdl-120', 'Sportsman Salty PDL 120', 3.66, 0.86, 400, 'U', true, true, false, 220, 'pedal_helice', 'K3'),
  entradaNoCertificada('Old Town', 'old-town-topwater-pdl-120', 'Topwater PDL 120', 3.66, 0.86, 400, 'U', true, true, false, 220, 'pedal_helice', 'K3'),

  // ── FeelFree (USA, pero con presencia EU; asumimos CE D para pesca) ──
  entradaEuropeaCE('FeelFree', 'feelfree-lure-115', 'Lure 11.5', 3.51, 0.86, 350, 'U', true, false, false, 180, 'pala', 'K3', 'D'),
  entradaEuropeaCE('FeelFree', 'feelfree-lure-135', 'Lure 13.5', 4.11, 0.86, 390, 'U', true, true, false, 200, 'pala', 'K3', 'D'),
  entradaEuropeaCE('FeelFree', 'feelfree-moken-125', 'Moken 12.5', 3.81, 0.81, 350, 'U', true, false, false, 180, 'pala', 'K3', 'D'),
  entradaEuropeaCE('FeelFree', 'feelfree-moken-10', 'Moken 10', 3.05, 0.76, 280, 'U', true, false, false, 140, 'pala', 'K2', 'D'),
  entradaEuropeaCE('FeelFree', 'feelfree-moken-13-angler-deluxe', 'Moken 13 Angler Deluxe', 3.90, 0.79, 350, 'U', true, true, false, 250, 'pala', 'K3', 'D'),
  entradaEuropeaCE('FeelFree', 'feelfree-lure-115-overdrive', 'Lure 11.5 Overdrive', 3.51, 0.86, 360, 'U', true, false, false, 190, 'pedal_helice', 'K3', 'D'),
  entradaEuropeaCE('FeelFree', 'feelfree-lure-135-overdrive', 'Lure 13.5 Overdrive', 4.11, 0.86, 400, 'U', true, true, false, 210, 'pedal_helice', 'K3', 'D'),
  entradaEuropeaCE('FeelFree', 'feelfree-moken-125-overdrive', 'Moken 12.5 Overdrive', 3.81, 0.81, 360, 'U', true, false, false, 190, 'pedal_helice', 'K3', 'D'),

  // ── Riot Kayaks (Canadá, sin CE publicada) ───────────────────────
  entradaNoCertificada('Riot Kayaks', 'riot-escape-12', 'Escape 12', 3.66, 0.76, 300, 'U', true, false, false, 150, 'pala', 'K3'),
  entradaNoCertificada('Riot Kayaks', 'riot-escape-10', 'Escape 10', 3.05, 0.76, 260, 'U', true, false, false, 130, 'pala', 'K2'),
  entradaNoCertificada('Riot Kayaks', 'riot-escape-11', 'Escape 11', 3.35, 0.76, 280, 'U', true, false, false, 140, 'pala', 'K2'),
  entradaNoCertificada('Riot Kayaks', 'riot-mako-12', 'Mako 12', 3.66, 0.76, 300, 'U', true, false, false, 150, 'pala', 'K3'),
  entradaNoCertificada('Riot Kayaks', 'riot-mako-10', 'Mako 10', 3.05, 0.76, 260, 'U', true, false, false, 130, 'pala', 'K2'),
  entradaNoCertificada('Riot Kayaks', 'riot-escape-12-pedal', 'Escape 12 Pedal', 3.66, 0.76, 310, 'U', true, false, false, 160, 'pedal_helice', 'K3'),

  // ── Viking Kayaks (NZ, sin CE publicada) ─────────────────────────
  entradaNoCertificada('Viking Kayaks', 'viking-profish-reload', 'Profish Reload', 4.27, 0.76, 350, 'V', true, true, false, 200, 'pala', 'K4'),
  entradaNoCertificada('Viking Kayaks', 'viking-profish-reload-pedal', 'Profish Reload Pedal', 4.27, 0.76, 360, 'V', true, true, false, 200, 'pedal_helice', 'K4'),
  entradaNoCertificada('Viking Kayaks', 'viking-profish-gt', 'Profish GT', 3.96, 0.76, 300, 'V', true, true, false, 150, 'pala', 'K3'),
  entradaNoCertificada('Viking Kayaks', 'viking-profish-gt-pedal', 'Profish GT Pedal', 3.96, 0.76, 310, 'V', true, true, false, 160, 'pedal_helice', 'K3'),
  entradaNoCertificada('Viking Kayaks', 'viking-profish-400', 'Profish 400', 4.00, 0.76, 310, 'V', true, true, false, 160, 'pala', 'K3'),
  entradaNoCertificada('Viking Kayaks', 'viking-espri', 'Espri', 3.66, 0.76, 290, 'V', true, false, false, 140, 'pala', 'K3'),
  entradaNoCertificada('Viking Kayaks', 'viking-nemo', 'Nemo', 3.35, 0.76, 270, 'V', true, false, false, 130, 'pala', 'K2'),

  // ── Hobie (USA, sin CE publicada) ────────────────────────────────
  entradaNoCertificada('Hobie', 'hobie-mirage-revolution-13', 'Mirage Revolution 13', 4.01, 0.71, 300, 'V', true, true, false, 150, 'pedal_aletas', 'K3'),
  entradaNoCertificada('Hobie', 'hobie-mirage-revolution-11', 'Mirage Revolution 11', 3.35, 0.71, 270, 'V', true, true, false, 130, 'pedal_aletas', 'K2'),
  entradaNoCertificada('Hobie', 'hobie-mirage-outback', 'Mirage Outback', 3.66, 0.86, 350, 'U', true, true, false, 180, 'pedal_aletas', 'K3'),
  entradaNoCertificada('Hobie', 'hobie-mirage-pro-angler-12', 'Mirage Pro Angler 12', 3.66, 0.91, 400, 'U', true, true, false, 230, 'pedal_aletas', 'K3'),
  entradaNoCertificada('Hobie', 'hobie-mirage-pro-angler-14', 'Mirage Pro Angler 14', 4.17, 0.96, 450, 'U', true, true, false, 250, 'pedal_aletas', 'K4'),
  entradaNoCertificada('Hobie', 'hobie-mirage-pro-angler-17t', 'Mirage Pro Angler 17T', 5.18, 0.96, 500, 'U', true, true, false, 300, 'pedal_aletas', 'K4'),
  entradaNoCertificada('Hobie', 'hobie-mirage-compass', 'Mirage Compass', 3.66, 0.86, 340, 'U', true, true, false, 180, 'pedal_aletas', 'K3'),
  entradaNoCertificada('Hobie', 'hobie-mirage-passport-105', 'Mirage Passport 10.5', 3.20, 0.81, 300, 'U', true, false, false, 160, 'pedal_aletas', 'K2'),
  entradaNoCertificada('Hobie', 'hobie-mirage-passport-12', 'Mirage Passport 12', 3.66, 0.81, 340, 'U', true, true, false, 180, 'pedal_aletas', 'K3'),
  entradaNoCertificada('Hobie', 'hobie-mirage-lynx', 'Mirage Lynx', 3.35, 0.81, 300, 'U', true, false, false, 160, 'pedal_aletas', 'K2'),

  // ── Native Watercraft (USA, sin CE publicada) ────────────────────
  entradaNoCertificada('Native Watercraft', 'native-slayer-propel-10', 'Slayer Propel 10', 3.05, 0.76, 280, 'U', true, false, false, 150, 'pedal_helice', 'K2'),
  entradaNoCertificada('Native Watercraft', 'native-slayer-propel-12', 'Slayer Propel 12', 3.66, 0.81, 340, 'U', true, true, false, 180, 'pedal_helice', 'K3'),
  entradaNoCertificada('Native Watercraft', 'native-slayer-propel-13', 'Slayer Propel 13', 3.96, 0.81, 380, 'U', true, true, false, 200, 'pedal_helice', 'K3'),
  entradaNoCertificada('Native Watercraft', 'native-titan-105', 'Titan 10.5', 3.20, 0.86, 340, 'U', true, false, false, 180, 'pedal_helice', 'K2'),
  entradaNoCertificada('Native Watercraft', 'native-titan-12', 'Titan 12', 3.66, 0.91, 400, 'U', true, true, false, 220, 'pedal_helice', 'K3'),
  entradaNoCertificada('Native Watercraft', 'native-titan-135', 'Titan 13.5', 4.11, 0.91, 420, 'U', true, true, false, 250, 'pedal_helice', 'K4'),
  entradaNoCertificada('Native Watercraft', 'native-ultimate-fx-12', 'Ultimate FX 12', 3.66, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Native Watercraft', 'native-ultimate-fx-15', 'Ultimate FX 15', 4.57, 0.81, 380, 'U', true, true, false, 200, 'pala', 'K4'),

  // ── Pelican (Canadá, sin CE publicada) ───────────────────────────
  entradaNoCertificada('Pelican', 'pelican-catch-120', 'Catch 120', 3.66, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Pelican', 'pelican-catch-100', 'Catch 100', 3.05, 0.76, 270, 'U', true, false, false, 140, 'pala', 'K2'),
  entradaNoCertificada('Pelican', 'pelican-catch-130-hydryve', 'Catch 130 Hydryve', 3.96, 0.81, 370, 'U', true, true, false, 200, 'pedal_helice', 'K3'),
  entradaNoCertificada('Pelican', 'pelican-catch-110-hydryve', 'Catch 110 Hydryve', 3.35, 0.81, 310, 'U', true, false, false, 160, 'pedal_helice', 'K2'),

  // ── Sun Dolphin (USA, sin CE publicada) ──────────────────────────
  entradaNoCertificada('Sun Dolphin', 'sun-dolphin-journey-12', 'Journey 12', 3.66, 0.76, 300, 'U', true, false, false, 150, 'pala', 'K3'),
  entradaNoCertificada('Sun Dolphin', 'sun-dolphin-journey-10', 'Journey 10', 3.05, 0.76, 260, 'U', true, false, false, 130, 'pala', 'K2'),
  entradaNoCertificada('Sun Dolphin', 'sun-dolphin-aruba-10', 'Aruba 10', 3.05, 0.76, 250, 'U', true, false, false, 120, 'pala', 'K2'),

  // ── Lifetime (USA, sin CE publicada) ─────────────────────────────
  entradaNoCertificada('Lifetime', 'lifetime-tamarack-120', 'Tamarack 120', 3.66, 0.76, 300, 'U', true, false, false, 150, 'pala', 'K3'),
  entradaNoCertificada('Lifetime', 'lifetime-tamarack-100', 'Tamarack 100', 3.05, 0.76, 260, 'U', true, false, false, 130, 'pala', 'K2'),
  entradaNoCertificada('Lifetime', 'lifetime-tandem-14', 'Tandem 14', 4.27, 0.81, 360, 'U', true, false, false, 200, 'pala', 'K4'),
  entradaNoCertificada('Lifetime', 'lifetime-stealth-pro', 'Stealth Pro', 3.35, 0.76, 270, 'U', true, false, false, 140, 'pala', 'K2'),

  // ── Ascend (USA, sin CE publicada) ───────────────────────────────
  entradaNoCertificada('Ascend', 'ascend-fs12t', 'FS12T', 3.66, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Ascend', 'ascend-fs10', 'FS10', 3.05, 0.76, 270, 'U', true, false, false, 140, 'pala', 'K2'),
  entradaNoCertificada('Ascend', 'ascend-fs128t', 'FS128T', 3.81, 0.81, 360, 'U', true, true, false, 190, 'pala', 'K3'),
  entradaNoCertificada('Ascend', 'ascend-h12', 'H12', 3.66, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),

  // ── Bonafide (USA, sin CE publicada) ─────────────────────────────
  entradaNoCertificada('Bonafide', 'bonafide-ss107', 'SS107', 3.20, 0.81, 300, 'U', true, false, false, 160, 'pala', 'K2'),
  entradaNoCertificada('Bonafide', 'bonafide-ss127', 'SS127', 3.81, 0.81, 350, 'U', true, false, false, 190, 'pala', 'K3'),
  entradaNoCertificada('Bonafide', 'bonafide-rs117', 'RS117', 3.51, 0.86, 340, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Bonafide', 'bonafide-p127', 'P127', 3.81, 0.86, 360, 'U', true, true, false, 200, 'pedal_helice', 'K3'),
  entradaNoCertificada('Bonafide', 'bonafide-ex123', 'EX123', 3.66, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),

  // ── Crescent (USA, sin CE publicada) ─────────────────────────────
  entradaNoCertificada('Crescent', 'crescent-lite-tackle', 'Lite Tackle', 3.66, 0.81, 330, 'U', true, false, false, 170, 'pala', 'K3'),
  entradaNoCertificada('Crescent', 'crescent-crew', 'Crew', 3.96, 0.81, 350, 'U', true, true, false, 190, 'pala', 'K3'),
  entradaNoCertificada('Crescent', 'crescent-shoalie', 'Shoalie', 3.81, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Crescent', 'crescent-ck1', 'CK1', 3.66, 0.81, 330, 'U', true, false, false, 170, 'pala', 'K3'),

  // ── Nucanoe (USA, sin CE publicada) ──────────────────────────────
  entradaNoCertificada('Nucanoe', 'nucanoe-frontier-12', 'Frontier 12', 3.66, 0.91, 380, 'U', true, true, false, 250, 'pala', 'K3'),
  entradaNoCertificada('Nucanoe', 'nucanoe-pursuit', 'Pursuit', 3.96, 0.91, 400, 'U', true, true, false, 270, 'pala', 'K3'),
  entradaNoCertificada('Nucanoe', 'nucanoe-flint', 'Flint', 3.35, 0.86, 320, 'U', true, false, false, 200, 'pala', 'K2'),
  entradaNoCertificada('Nucanoe', 'nucanoe-unlimited', 'Unlimited', 4.27, 0.91, 420, 'U', true, true, false, 300, 'pala', 'K4'),
  entradaNoCertificada('Nucanoe', 'nucanoe-u10', 'U10', 3.05, 0.86, 300, 'U', true, false, false, 180, 'pala', 'K2'),
  entradaNoCertificada('Nucanoe', 'nucanoe-f10', 'F10', 3.05, 0.91, 320, 'U', true, false, false, 200, 'pala', 'K2'),

  // ── Vibe (USA, sin CE publicada) ─────────────────────────────────
  entradaNoCertificada('Vibe', 'vibe-sea-ghost-110', 'Sea Ghost 110', 3.35, 0.81, 310, 'U', true, false, false, 160, 'pala', 'K2'),
  entradaNoCertificada('Vibe', 'vibe-sea-ghost-130', 'Sea Ghost 130', 3.96, 0.81, 370, 'U', true, true, false, 200, 'pala', 'K3'),
  entradaNoCertificada('Vibe', 'vibe-yellowfin-100', 'Yellowfin 100', 3.05, 0.81, 290, 'U', true, false, false, 150, 'pala', 'K2'),
  entradaNoCertificada('Vibe', 'vibe-yellowfin-120', 'Yellowfin 120', 3.66, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Vibe', 'vibe-yellowfin-130t', 'Yellowfin 130T', 3.96, 0.81, 370, 'U', true, true, false, 200, 'pala', 'K3'),
  entradaNoCertificada('Vibe', 'vibe-shearwater-125', 'Shearwater 125', 3.81, 0.81, 350, 'U', true, false, false, 190, 'pala', 'K3'),
  entradaNoCertificada('Vibe', 'vibe-maverick-120', 'Maverick 120', 3.66, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),

  // ── 3 Waters (USA, sin CE publicada) ─────────────────────────────
  entradaNoCertificada('3 Waters', '3waters-big-fish-105', 'Big Fish 105', 3.20, 0.81, 290, 'U', true, false, false, 150, 'pala', 'K2'),
  entradaNoCertificada('3 Waters', '3waters-big-fish-108', 'Big Fish 108', 3.35, 0.81, 300, 'U', true, false, false, 160, 'pala', 'K2'),
  entradaNoCertificada('3 Waters', '3waters-big-fish-120', 'Big Fish 120', 3.66, 0.81, 340, 'U', true, false, false, 180, 'pala', 'K3'),
  entradaNoCertificada('3 Waters', '3waters-big-fish-103', 'Big Fish 103', 3.05, 0.76, 270, 'U', true, false, false, 140, 'pala', 'K2'),

  // ── Malibu Kayaks (USA, sin CE publicada) ────────────────────────
  entradaNoCertificada('Malibu Kayaks', 'malibu-x-13', 'X-13', 3.96, 0.76, 320, 'V', true, true, false, 170, 'pala', 'K3'),
  entradaNoCertificada('Malibu Kayaks', 'malibu-stealth-12', 'Stealth 12', 3.66, 0.81, 330, 'U', true, false, false, 170, 'pala', 'K3'),
  entradaNoCertificada('Malibu Kayaks', 'malibu-stealth-14', 'Stealth 14', 4.27, 0.81, 360, 'U', true, true, false, 190, 'pala', 'K4'),
  entradaNoCertificada('Malibu Kayaks', 'malibu-pro-explorer', 'Pro Explorer', 3.96, 0.81, 340, 'U', true, true, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Malibu Kayaks', 'malibu-mini-x', 'Mini-X', 2.90, 0.76, 240, 'U', true, false, false, 120, 'pala', 'K1'),

  // ── Cobra Kayaks (USA, sin CE publicada) ─────────────────────────
  entradaNoCertificada('Cobra Kayaks', 'cobra-fish-n-dive', 'Fish n Dive', 3.66, 0.81, 330, 'U', true, false, false, 170, 'pala', 'K3'),
  entradaNoCertificada('Cobra Kayaks', 'cobra-marauder', 'Marauder', 4.27, 0.81, 360, 'U', true, true, false, 190, 'pala', 'K4'),
  entradaNoCertificada('Cobra Kayaks', 'cobra-explorer', 'Explorer', 3.96, 0.81, 340, 'U', true, true, false, 180, 'pala', 'K3'),
  entradaNoCertificada('Cobra Kayaks', 'cobra-navigator', 'Navigator', 3.66, 0.76, 310, 'U', true, false, false, 160, 'pala', 'K3'),
  entradaNoCertificada('Cobra Kayaks', 'cobra-tourer', 'Tourer', 4.57, 0.76, 340, 'V', true, true, false, 180, 'pala', 'K4'),
  entradaNoCertificada('Cobra Kayaks', 'cobra-triple-x', 'Triple X', 4.27, 0.81, 360, 'U', true, true, false, 190, 'pala', 'K4'),
  entradaNoCertificada('Cobra Kayaks', 'cobra-tandem', 'Tandem', 4.57, 0.86, 380, 'U', true, false, false, 220, 'pala', 'K4'),

  // ── Galaxy Kayaks (España, CE C/D asumida) ───────────────────────
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-cruz-ultra', 'Cruz Ultra', 2.92, 0.84, 180, 'U', true, false, false, 150, 'pala', 'K2', 'D'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-rider', 'Rider', 2.64, 0.80, 150, 'U', true, false, false, 130, 'pala', 'K1', 'D'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-ocelote', 'Ocelote', 2.90, 0.82, 200, 'U', true, true, false, 150, 'pedal_aletas', 'K2', 'D'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-alboran-hv', 'Alborán HV', 4.09, 0.80, 350, 'U', true, true, false, 180, 'pala', 'K3', 'C'),
  // Alborán FX3: categoría C confirmada por ficha oficial del fabricante.
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-alboran-fx3', 'Alborán FX3', 4.09, 0.80, 350, 'U', true, true, false, 180, 'pedal_helice', 'K3', 'C'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-wildcat-fx3-wahoo-s', 'Wildcat FX3 / Wahoo S', 3.57, 0.80, 300, 'U', true, true, false, 180, 'pedal_aletas', 'K3', 'D'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-supernova-fx', 'Supernova FX', 3.98, 0.85, 400, 'U', true, true, false, 220, 'pedal_helice', 'K3', 'D'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-supernova-jr-fx', 'Supernova Jr FX', 3.00, 0.80, 200, 'U', true, true, false, 150, 'pedal_helice', 'K2', 'D'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-marlin-430', 'Marlin 430', 4.40, 0.75, 350, 'V', false, true, true, 190, 'pala', 'K4', 'C'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-strike', 'Strike', 3.40, 0.84, 300, 'U', true, true, false, 160, 'pala', 'K3', 'D'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-tandem-tahiti-x', 'Tándem Tahiti X', 3.70, 0.86, 400, 'U', true, false, false, 240, 'pala', 'K4', 'D'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-ranger', 'Ranger', 2.90, 0.78, 180, 'U', true, false, false, 140, 'pala', 'K2', 'D'),
  entradaEuropeaCE('Galaxy Kayaks', 'galaxy-force', 'Force', 2.70, 0.78, 160, 'U', true, false, false, 130, 'pala', 'K1', 'D'),

  // ── Todo Kayak (España, CE C/D asumida) ──────────────────────────
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-hook', 'Hook', 2.39, 0.79, 180, 'U', true, false, false, 125, 'pala', 'K1', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-delta', 'Delta', 2.66, 0.70, 150, 'U', true, false, false, 100, 'pala', 'K1', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-randal', 'Randal', 2.44, 0.79, 200, 'U', true, false, false, 120, 'pala', 'K1', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-tornado', 'Tornado', 2.92, 0.70, 180, 'V', true, false, false, 136, 'pala', 'K2', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-haddock', 'Haddock', 4.50, 0.63, 350, 'V', false, true, true, 155, 'pala', 'K4', 'C'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-racer', 'Racer', 3.68, 0.80, 320, 'U', true, true, false, 180, 'pedal_aletas', 'K3', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-sondeo', 'Sondeo', 3.71, 0.97, 450, 'U', true, true, false, 220, 'pedal_helice', 'K4', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-voluta', 'Voluta', 3.96, 0.82, 400, 'U', true, true, false, 180, 'pedal_helice', 'K3', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-catamaran-f15', 'Catamarán F15', 3.82, 1.00, 500, 'plano', true, true, false, 380, 'pedal_helice', 'K4', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-oxifish', 'Oxifish', 2.90, 0.95, 300, 'U', true, true, false, 230, 'pedal_aletas', 'K3', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-navio-tandem', 'Navío Tándem', 4.53, 0.88, 450, 'U', true, true, false, 300, 'pedal_helice', 'K4', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-taramay-tandem', 'Taramay Tándem', 4.50, 0.91, 450, 'U', true, true, false, 300, 'pedal_aletas', 'K4', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-matrix', 'Matrix', 3.16, 0.87, 300, 'U', true, true, false, 180, 'pedal_helice', 'K3', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-barracuda-pro', 'Barracuda PRO', 2.95, 0.80, 200, 'U', true, false, false, 150, 'pala', 'K2', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-barracuda-tandem', 'Barracuda Tándem', 3.72, 0.89, 350, 'U', true, false, false, 250, 'pala', 'K4', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-barcaza', 'Barcaza', 4.99, 0.90, 500, 'U', true, false, false, 280, 'pala', 'K5', 'C'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-marine', 'Marine', 2.70, 0.80, 180, 'U', true, false, false, 130, 'pala', 'K1', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-marea-tandem', 'Marea Tándem', 3.73, 0.82, 300, 'U', true, false, false, 220, 'pala', 'K3', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-pingo', 'Pingo', 3.30, 0.80, 280, 'U', true, true, false, 150, 'pala', 'K3', 'D'),
  entradaEuropeaCE('Todo Kayak', 'todo-kayak-luna', 'Luna', 3.30, 0.78, 250, 'U', true, false, false, 140, 'pala', 'K2', 'D'),

  // ── KOL Outdoor (España, CE C/D asumida) ─────────────────────────
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-whale-propel-two', 'Whale Propel Two', 4.50, 0.91, 450, 'U', true, true, false, 300, 'pedal_helice', 'K4', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-whale-propel-one', 'Whale Propel One', 3.00, 0.91, 300, 'U', true, true, false, 180, 'pedal_helice', 'K3', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-evo-two', 'EVO Two', 4.20, 0.81, 400, 'U', true, true, false, 250, 'pedal_aletas', 'K4', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-swift-360', 'Swift 360', 3.60, 0.66, 250, 'V', false, true, true, 150, 'pala', 'K3', 'C'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-tarpon-propel-320', 'Tarpon Propel 320', 3.16, 0.86, 300, 'U', true, true, false, 140, 'pedal_helice', 'K3', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-oceanus-r-pro', 'Oceanus R / PRO', 3.72, 0.86, 350, 'U', true, false, false, 250, 'pala', 'K4', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-falco-combo-11', 'Falco Combo 11', 3.35, 0.86, 300, 'U', true, false, false, 160, 'pala', 'K3', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-mini-nori', 'Mini Nori', 2.60, 0.78, 150, 'U', true, false, false, 100, 'pala', 'K1', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-nori-1', 'Nori 1', 3.72, 0.80, 300, 'U', true, false, false, 170, 'pala', 'K3', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-nori-2', 'Nori 2', 4.20, 0.84, 350, 'U', true, false, false, 190, 'pala', 'K4', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-fredy-2', 'Fredy 2', 3.72, 0.82, 350, 'U', true, false, false, 190, 'pala', 'K3', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-dentex-one', 'Dentex One', 3.00, 0.84, 200, 'U', true, true, false, 230, 'pedal_helice', 'K2', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-propel-12', 'Propel 12', 3.65, 0.84, 350, 'U', true, true, false, 180, 'pedal_helice', 'K3', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-fisher-pro-12-pala', 'Fisher Pro 12 (pala)', 3.70, 0.86, 380, 'U', true, true, false, 280, 'pala', 'K3', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-fisher-pro-12-aletas', 'Fisher Pro 12 (aletas)', 3.70, 0.86, 380, 'U', true, true, false, 280, 'pedal_aletas', 'K3', 'D'),
  entradaEuropeaCE('KOL Outdoor', 'kol-outdoor-fisher-pro-12-helice', 'Fisher Pro 12 (hélice)', 3.70, 0.86, 380, 'U', true, true, false, 280, 'pedal_helice', 'K3', 'D'),

  // ── Marlin Kayak (España, CE C/D asumida) ────────────────────────
  entradaEuropeaCE('Marlin Kayak', 'marlin-kayak-fins-max-2025-2026', 'Fins Max 2025/2026', 3.72, 0.84, 350, 'U', true, true, false, 170, 'pedal_helice', 'K3', 'D'),
  entradaEuropeaCE('Marlin Kayak', 'marlin-kayak-fins-409', 'Fins 409', 4.09, 0.80, 350, 'U', true, true, false, 180, 'pedal_aletas', 'K3', 'C'),
  entradaEuropeaCE('Marlin Kayak', 'marlin-kayak-fins-mini', 'Fins Mini', 2.92, 0.83, 200, 'U', true, true, false, 150, 'pedal_aletas', 'K2', 'D'),
  entradaEuropeaCE('Marlin Kayak', 'marlin-kayak-mini-falcon-2026', 'Mini Falcon 2026', 2.50, 0.90, 200, 'U', true, true, false, 165, 'pedal_aletas', 'K2', 'D'),
  entradaEuropeaCE('Marlin Kayak', 'marlin-kayak-one-2026', 'One 2026', 2.96, 0.81, 200, 'U', true, false, false, 165, 'pala', 'K2', 'D'),
  entradaEuropeaCE('Marlin Kayak', 'marlin-kayak-pescador', 'Pescador', 3.57, 0.82, 300, 'U', true, false, false, 160, 'pala', 'K3', 'D'),
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

// Helper: etiqueta visible de categoría WKF.
// Devuelve 'K4c' si certificadoOficial=true, 'K4' si no.
export function etiquetaCategoria(kayak: Kayak): string {
  return `${kayak.categoriaWKF}${kayak.certificadoOficial ? 'c' : ''}`;
}