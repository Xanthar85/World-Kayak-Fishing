// src/lib/patos.ts
// WKF — Catálogo de patos (float tubes, belly boats, pontones, plataformas
// flotantes). Archivo separado del catálogo de kayaks.
//
// Nomenclatura:
//   categoriaWKF para patos: 'P1'|'P2'|'P3'|'P4'
//     P1 (<1.40 m)  → pato ligero, aguas tranquilas, 1 pescador.
//     P2 (1.40-1.70) → pato medio, 1 pescador, algo de viento.
//     P3 (1.70-2.00) → pato grande, aguas abiertas, motor eléctrico.
//     P4 (>2.00 m)   → pontón rígido, catamarán, motor, 2 pescadores.
//
//   tipoEmbarcacion: 'pato' → identifica que no es un kayak.
//
// Todos los patos se catalogan como NO certificados por defecto. Ningún
// fabricante del CSV publica categoría de diseño oficial. Si alguno la
// publica en el futuro, se actualiza la entrada correspondiente.

export type CategoriaPato = 'P1' | 'P2' | 'P3' | 'P4';
export type TipoEstructura = 'hinchable' | 'rigido' | 'mixto';
export type TipoEmbarcacion = 'pato';

export interface Pato {
  id: string;
  marca: string;
  modelo: string;
  tipoEmbarcacion: TipoEmbarcacion;
  tipoEstructura: TipoEstructura;
  material: string;
  eslora: number;
  manga: number;
  peso: number;
  capacidadCarga: number;
  categoriaWKF: CategoriaPato;
  certificado: boolean;
  certificadoOficial: boolean;
  verificado: boolean;
  notas: string;
}

export const CATALOGO_PATOS: Pato[] = [
  // ── Hart ──────────────────────────────────────────────────────────
  {
    id: 'hart-the-mosquito',
    marca: 'Hart',
    modelo: 'The Mosquito',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Cordura 420D / cámaras de aire',
    eslora: 1.30,
    manga: 1.03,
    peso: 4.5,
    capacidadCarga: 113,
    categoriaWKF: 'P1',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Ultra ligero y compacto para desplazamientos rápidos.',
  },
  {
    id: 'hart-savior',
    marca: 'Hart',
    modelo: 'Savior',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Cordura 600D / cámaras independientes',
    eslora: 1.45,
    manga: 1.10,
    peso: 6,
    capacidadCarga: 130,
    categoriaWKF: 'P2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Asiento y respaldo inflables elevados, gran flotabilidad media.',
  },
  {
    id: 'hart-vendetta-v2',
    marca: 'Hart',
    modelo: 'Vendetta V2',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Cordura reforzada 900D',
    eslora: 1.45,
    manga: 1.15,
    peso: 7,
    capacidadCarga: 140,
    categoriaWKF: 'P2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Pato de forma en V optimizada para navegación fluida.',
  },
  {
    id: 'hart-sikkario-x-fast-4k',
    marca: 'Hart',
    modelo: 'Sikkario X-Fast / 4K',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'PVC termosellado 0,9 mm (sin cámaras)',
    eslora: 1.70,
    manga: 1.18,
    peso: 12,
    capacidadCarga: 180,
    categoriaWKF: 'P3',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Alta resistencia a roces, incluye suelo hinchable y remos.',
  },
  {
    id: 'hart-guardian-centinel',
    marca: 'Hart',
    modelo: 'Guardian Centinel',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'PVC 0,9 mm + refuerzos en bajos',
    eslora: 1.70,
    manga: 1.25,
    peso: 15,
    capacidadCarga: 200,
    categoriaWKF: 'P3',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Gran estabilidad, suelo rígido dropstitch para pescar de pie.',
  },
  {
    id: 'hart-flat-fighter',
    marca: 'Hart',
    modelo: 'Flat Fighter',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Estructura Dropstitch alta presión',
    eslora: 2.00,
    manga: 1.20,
    peso: 18,
    capacidadCarga: 220,
    categoriaWKF: 'P3',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Formato plataforma plana, soporte para motor integrado.',
  },
  {
    id: 'hart-vi-pontoon-catamaran',
    marca: 'Hart',
    modelo: 'VI Pontoon Catamarán',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'mixto',
    material: 'Estructura aluminio + flotadores PVC',
    eslora: 1.43,
    manga: 1.40,
    peso: 5.4,
    capacidadCarga: 113,
    categoriaWKF: 'P4',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Diseño pontón/catamarán con remos y asiento elevado de armazón.',
  },

  // ── Seven Bass ────────────────────────────────────────────────────
  {
    id: 'seven-bass-armada',
    marca: 'Seven Bass',
    modelo: 'Seven Bass Armada',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Cordura 900D / cámaras PVC',
    eslora: 1.60,
    manga: 1.16,
    peso: 8,
    capacidadCarga: 160,
    categoriaWKF: 'P2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Diseño clásico V-Shape con bolsillos de gran capacidad.',
  },
  {
    id: 'seven-bass-cobra-170',
    marca: 'Seven Bass',
    modelo: 'Cobra 170',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'PVC 0,9 mm recubierto',
    eslora: 1.70,
    manga: 1.16,
    peso: 9.5,
    capacidadCarga: 180,
    categoriaWKF: 'P3',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Sin cámaras de aire internas, con remos y soporte motor.',
  },
  {
    id: 'seven-bass-expedition-navy',
    marca: 'Seven Bass',
    modelo: 'Expedition Navy',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'PVC laminado 1000D',
    eslora: 1.80,
    manga: 1.20,
    peso: 12.5,
    capacidadCarga: 180,
    categoriaWKF: 'P3',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Híbrido entre pato y lancha compacta con quillas integradas.',
  },
  {
    id: 'seven-bass-flatform-xl',
    marca: 'Seven Bass',
    modelo: 'Flatform XL',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Full Dropstitch 3D Mesh',
    eslora: 2.45,
    manga: 1.70,
    peso: 21,
    capacidadCarga: 300,
    categoriaWKF: 'P4',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Plataforma flotante masiva, permite motor eléctrico y pescar de pie.',
  },

  // ── Savage Gear ───────────────────────────────────────────────────
  {
    id: 'savage-gear-stealth-155',
    marca: 'Savage Gear',
    modelo: 'Stealth 155',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'PVC 0,9 mm sin costuras',
    eslora: 1.55,
    manga: 1.05,
    peso: 9,
    capacidadCarga: 155,
    categoriaWKF: 'P2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Ligero, líneas afiladas, incluye soporte para transductor.',
  },
  {
    id: 'savage-gear-high-rider-v2-170',
    marca: 'Savage Gear',
    modelo: 'High Rider V2 170',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'PVC 0,9 mm termosellado',
    eslora: 1.70,
    manga: 1.16,
    peso: 14,
    capacidadCarga: 180,
    categoriaWKF: 'P3',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Asiento elevable de dropstitch para no tocar el agua.',
  },

  // ── Rapala ────────────────────────────────────────────────────────
  {
    id: 'rapala-ft-100',
    marca: 'Rapala',
    modelo: 'FT 100',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Cordura 600D / cámaras de aire',
    eslora: 1.34,
    manga: 1.00,
    peso: 6,
    capacidadCarga: 100,
    categoriaWKF: 'P1',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Modelo de entrada, muy ligero y fácil de transportar.',
  },
  {
    id: 'rapala-ft-140',
    marca: 'Rapala',
    modelo: 'FT 140',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Cordura 900D reforzada',
    eslora: 1.40,
    manga: 1.10,
    peso: 7,
    capacidadCarga: 135,
    categoriaWKF: 'P2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Asiento de espuma de alta densidad para mayor confort.',
  },
  {
    id: 'rapala-ft-160',
    marca: 'Rapala',
    modelo: 'FT 160',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'PVC 0,7 mm sin cámara',
    eslora: 1.60,
    manga: 1.10,
    peso: 9.3,
    capacidadCarga: 150,
    categoriaWKF: 'P2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'PVC de media-alta gama, buena relación peso/resistencia.',
  },

  // ── Caperlan (Decathlon) ──────────────────────────────────────────
  {
    id: 'caperlan-fltb-1',
    marca: 'Caperlan (Decathlon)',
    modelo: 'FLTB-1',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Poliéster 600D / cámaras aire',
    eslora: 1.15,
    manga: 1.05,
    peso: 6,
    capacidadCarga: 100,
    categoriaWKF: 'P1',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Compacto para pequeñas masas de agua o iniciación.',
  },
  {
    id: 'caperlan-fltb-5-v2',
    marca: 'Caperlan (Decathlon)',
    modelo: 'FLTB-5 V2',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Poliéster 900D / cámara reforzada',
    eslora: 1.50,
    manga: 1.08,
    peso: 8.5,
    capacidadCarga: 125,
    categoriaWKF: 'P2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Asiento inflable elevado con bakkanes modulares.',
  },
  {
    id: 'caperlan-fltb-9',
    marca: 'Caperlan (Decathlon)',
    modelo: 'FLTB-9',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Malla Dropstitch alta presión',
    eslora: 1.90,
    manga: 1.20,
    peso: 16,
    capacidadCarga: 160,
    categoriaWKF: 'P3',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Suelo y laterales rígidos hinchables a alta presión.',
  },

  // ── Pond Hopper / Outcast ─────────────────────────────────────────
  {
    id: 'pond-hopper-fish-cat-4',
    marca: 'Pond Hopper / Outcast',
    modelo: 'Fish Cat 4',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'hinchable',
    material: 'Lona de PVC / Nylon 420D',
    eslora: 1.37,
    manga: 1.12,
    peso: 6.3,
    capacidadCarga: 113,
    categoriaWKF: 'P1',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Diseño de corte en "L" con asiento elevado sobre el agua.',
  },
  {
    id: 'outcast-pac-1200-pontoon',
    marca: 'Outcast',
    modelo: 'PAC 1200 / Pontoon',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'mixto',
    material: 'Cuadro tubo de acero + PVC 1100D',
    eslora: 3.05,
    manga: 1.40,
    peso: 32,
    capacidadCarga: 180,
    categoriaWKF: 'P4',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Catamarán pontón rígido para descenso de ríos y grandes embalses.',
  },

  // ── Pelican / Bass Raider ─────────────────────────────────────────
  {
    id: 'pelican-bass-raider-10e',
    marca: 'Pelican / Bass Raider',
    modelo: '10E / 8E',
    tipoEmbarcacion: 'pato',
    tipoEstructura: 'rigido',
    material: 'Polietileno RAM-X de alta densidad',
    eslora: 3.05,
    manga: 1.27,
    peso: 65,
    capacidadCarga: 272,
    categoriaWKF: 'P4',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Embarcación rígida estilo pontón/plataforma con asientos giratorios.',
  },
];

export function buscarPatoPorId(id: string): Pato | undefined {
  return CATALOGO_PATOS.find((p) => p.id === id);
}

export function buscarPatosPorNombre(texto: string): Pato[] {
  const q = texto.trim().toLowerCase();
  if (!q) return [];
  return CATALOGO_PATOS.filter((p) =>
    `${p.marca} ${p.modelo}`.toLowerCase().includes(q)
  ).slice(0, 50);
}

export const TECHOS_PATOS: Record<CategoriaPato, { vientoMaxBf: number; olaMaxM: number }> = {
  P1: { vientoMaxBf: 3, olaMaxM: 0.3 },
  P2: { vientoMaxBf: 4, olaMaxM: 0.4 },
  P3: { vientoMaxBf: 5, olaMaxM: 0.6 },
  P4: { vientoMaxBf: 6, olaMaxM: 0.8 },
};

export function etiquetaCategoriaPato(pato: Pato): string {
  return pato.categoriaWKF;
}
