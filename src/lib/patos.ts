// src/lib/patos.ts
// WKF — Catálogo de patos (float tubes, belly boats, pontones, plataformas
// flotantes) y canoas (embarcaciones ligeras no kayak con categoría CA).
// Archivo separado del catálogo de kayaks.
//
// Nomenclatura:
//   categoriaWKF para patos: 'P1'|'P2'|'P3'|'P4'
//     P1 (<1.40 m)   → pato ligero, aguas tranquilas, 1 pescador.
//     P2 (1.40-1.70) → pato medio, 1 pescador, algo de viento.
//     P3 (1.70-2.00) → pato grande, aguas abiertas, motor eléctrico.
//     P4 (>2.00 m)   → pontón rígido, catamarán, motor, 2 pescadores.
//
//   categoriaWKF para canoas: 'CA1'|'CA2'|'CA3'
//     CA1 (<3.50 m)   → canoa ligera, aguas tranquilas.
//     CA2 (3.50-5.00) → canoa media, aguas costeras.
//     CA3 (>5.00 m)   → canoa grande, aguas abiertas, doble/triple.
//
//   tipoEmbarcacion: 'pato' | 'canoa' → identifica qué tipo de embarcación es.
//
// Todos los patos y canoas se catalogan como NO certificados por defecto.
// Ningún fabricante de patos publica categoría de diseño oficial.
// Las canoas de recreo están exentas de certificación CE si son
// propulsadas exclusivamente a pala. Si algún fabricante publica
// categoría en el futuro, se actualiza la entrada.

export type CategoriaPato = 'P1' | 'P2' | 'P3' | 'P4';
export type CategoriaCanoa = 'CA1' | 'CA2' | 'CA3';
export type TipoEstructura = 'hinchable' | 'rigido' | 'mixto';
export type TipoEmbarcacion = 'pato' | 'canoa';

export interface Pato {
  id: string;
  marca: string;
  modelo: string;
  tipoEmbarcacion: 'pato';
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

export interface Canoa {
  id: string;
  marca: string;
  modelo: string;
  tipoEmbarcacion: 'canoa';
  material: string;
  eslora: number;
  manga: number;
  peso: number;
  capacidadCarga: number;
  tripulantesMax: number;
  categoriaWKF: CategoriaCanoa;
  certificado: boolean;
  certificadoOficial: boolean;
  verificado: boolean;
  notas: string;
}

export type EmbarcacionLigera = Pato | Canoa;

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

// ────────────────────────────────────────────────────────────────────
// CATÁLOGO DE CANOAS
// Solo entradas reales y verificables. Nada de relleno.
// Categorías: CA1, CA2, CA3.
// ────────────────────────────────────────────────────────────────────

export const CATALOGO_CANOAS: Canoa[] = [
  // ── Old Town (USA, canoas de recreo) ──────────────────────────────
  {
    id: 'old-town-discovery-119',
    marca: 'Old Town',
    modelo: 'Discovery 119',
    tipoEmbarcacion: 'canoa',
    material: 'Polietileno de 3 capas',
    eslora: 3.63,
    manga: 0.79,
    peso: 29,
    capacidadCarga: 150,
    tripulantesMax: 1,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa individual de recreo y pesca ligera.',
  },
  {
    id: 'old-town-saranac-146',
    marca: 'Old Town',
    modelo: 'Saranac 146',
    tipoEmbarcacion: 'canoa',
    material: 'Polietileno de 3 capas',
    eslora: 4.42,
    manga: 0.91,
    peso: 36,
    capacidadCarga: 200,
    tripulantesMax: 3,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa doble/triple familiar para lagos y ríos lentos.',
  },

  // ── Mad River (USA, canoas de recreo) ─────────────────────────────
  {
    id: 'mad-river-explorer-14',
    marca: 'Mad River',
    modelo: 'Explorer 14',
    tipoEmbarcacion: 'canoa',
    material: 'Polietileno',
    eslora: 4.27,
    manga: 0.84,
    peso: 27,
    capacidadCarga: 180,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa doble versátil para aguas tranquilas.',
  },
  {
    id: 'mad-river-explorer-16',
    marca: 'Mad River',
    modelo: 'Explorer 16',
    tipoEmbarcacion: 'canoa',
    material: 'Polietileno',
    eslora: 4.88,
    manga: 0.89,
    peso: 31,
    capacidadCarga: 220,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa doble de carga, buena para expediciones cortas.',
  },

  // ── Wenonah (USA, canoas de recreo y expedición) ──────────────────
  {
    id: 'wenonah-adirondack-15',
    marca: 'Wenonah',
    modelo: 'Adirondack 15',
    tipoEmbarcacion: 'canoa',
    material: 'Kevlar / fibra',
    eslora: 4.57,
    manga: 0.86,
    peso: 24,
    capacidadCarga: 200,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa ligera de material compuesto, ideal para porteo.',
  },
  {
    id: 'wenonah-minnesota-ii',
    marca: 'Wenonah',
    modelo: 'Minnesota II',
    tipoEmbarcacion: 'canoa',
    material: 'Kevlar / fibra',
    eslora: 5.49,
    manga: 0.91,
    peso: 30,
    capacidadCarga: 260,
    tripulantesMax: 2,
    categoriaWKF: 'CA3',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa de expedición de gran eslora para aguas abiertas.',
  },

  // ── Nova Craft (Canadá, canoas de recreo) ─────────────────────────
  {
    id: 'nova-craft-prospector-16',
    marca: 'Nova Craft',
    modelo: 'Prospector 16',
    tipoEmbarcacion: 'canoa',
    material: 'Fibra de vidrio / polietileno',
    eslora: 4.88,
    manga: 0.91,
    peso: 34,
    capacidadCarga: 220,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa doble de carga, polivalente.',
  },

  // ── Esquif (Canadá, canoas de río y recreo) ───────────────────────
  {
    id: 'esquif-presage',
    marca: 'Esquif',
    modelo: 'Presage',
    tipoEmbarcacion: 'canoa',
    material: 'Polietileno',
    eslora: 4.27,
    manga: 0.86,
    peso: 30,
    capacidadCarga: 180,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa doble, orientada a río y lago.',
  },

  // ── Pakboats (USA, canoas plegables) ──────────────────────────────
  {
    id: 'pakboats-puffin-12',
    marca: 'Pakboats',
    modelo: 'Puffin 12',
    tipoEmbarcacion: 'canoa',
    material: 'Lona / estructura de aluminio',
    eslora: 3.66,
    manga: 0.76,
    peso: 18,
    capacidadCarga: 120,
    tripulantesMax: 1,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa plegable individual, transportable en mochila.',
  },
  {
    id: 'pakboats-xt-15',
    marca: 'Pakboats',
    modelo: 'XT-15',
    tipoEmbarcacion: 'canoa',
    material: 'Lona / estructura de aluminio',
    eslora: 4.57,
    manga: 0.86,
    peso: 22,
    capacidadCarga: 180,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa plegable doble, ideal para viajes.',
  },

  // ── Ally (Noruega, canoas plegables) ──────────────────────────────
  {
    id: 'ally-ally-165',
    marca: 'Ally',
    modelo: 'Ally 16.5',
    tipoEmbarcacion: 'canoa',
    material: 'Lona PVC / estructura aluminio',
    eslora: 5.03,
    manga: 0.91,
    peso: 20,
    capacidadCarga: 200,
    tripulantesMax: 2,
    categoriaWKF: 'CA3',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa plegable de gran eslora para expedición.',
  },

  // ── Klepper (Alemania, canoas plegables) ──────────────────────────
  {
    id: 'klepper-aerius-480',
    marca: 'Klepper',
    modelo: 'Aerius 480',
    tipoEmbarcacion: 'canoa',
    material: 'Lona / estructura de madera y aluminio',
    eslora: 4.80,
    manga: 0.72,
    peso: 22,
    capacidadCarga: 180,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa plegable clásica, uso recreativo y expedición.',
  },

  // ── Wayland (España, canoas de recreo) ────────────────────────────
  {
    id: 'wayland-amazon',
    marca: 'Wayland',
    modelo: 'Amazon',
    tipoEmbarcacion: 'canoa',
    material: 'Polietileno',
    eslora: 4.00,
    manga: 0.80,
    peso: 30,
    capacidadCarga: 200,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa doble de recreo, uso en lagos y aguas tranquilas.',
  },

  // ── Silverbirch (UK, canoas de recreo) ────────────────────────────
  {
    id: 'silverbirch-broadland-15',
    marca: 'Silverbirch',
    modelo: 'Broadland 15',
    tipoEmbarcacion: 'canoa',
    material: 'Polietileno',
    eslora: 4.57,
    manga: 0.86,
    peso: 32,
    capacidadCarga: 200,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa doble de recreo orientada a ríos lentos.',
  },

  // ── Hou Canoes (UK, canoas de recreo) ─────────────────────────────
  {
    id: 'hou-canoes-prospector-15',
    marca: 'Hou Canoes',
    modelo: 'Prospector 15',
    tipoEmbarcacion: 'canoa',
    material: 'Polietileno',
    eslora: 4.57,
    manga: 0.91,
    peso: 30,
    capacidadCarga: 200,
    tripulantesMax: 2,
    categoriaWKF: 'CA2',
    certificado: false,
    certificadoOficial: false,
    verificado: false,
    notas: 'Canoa doble polivalente para río y lago.',
  },
];

// Alias histórico: el catálogo unificado de embarcaciones ligeras.
// Se usa donde antes se esperaba solo patos y ahora queremos
// patos + canoas. Se mantiene CATALOGO_PATOS como lista de patos
// puros para compatibilidad, y CATALOGO_CANOAS como lista
// separada. El consumidor elige.
export const CATALOGO_EMBARCACIONES_LIGERAS: EmbarcacionLigera[] = [
  ...CATALOGO_PATOS,
  ...CATALOGO_CANOAS,
];

export function buscarPatoPorId(id: string): Pato | undefined {
  return CATALOGO_PATOS.find((p) => p.id === id);
}

export function buscarCanoaPorId(id: string): Canoa | undefined {
  return CATALOGO_CANOAS.find((c) => c.id === id);
}

export function buscarEmbarcacionLigeraPorId(
  id: string
): EmbarcacionLigera | undefined {
  return buscarPatoPorId(id) ?? buscarCanoaPorId(id);
}

export function buscarPatosPorNombre(texto: string): Pato[] {
  const q = texto.trim().toLowerCase();
  if (!q) return [];
  return CATALOGO_PATOS.filter((p) =>
    `${p.marca} ${p.modelo}`.toLowerCase().includes(q)
  ).slice(0, 50);
}

export function buscarCanoasPorNombre(texto: string): Canoa[] {
  const q = texto.trim().toLowerCase();
  if (!q) return [];
  return CATALOGO_CANOAS.filter((c) =>
    `${c.marca} ${c.modelo}`.toLowerCase().includes(q)
  ).slice(0, 50);
}

export const TECHOS_PATOS: Record<CategoriaPato, { vientoMaxBf: number; olaMaxM: number }> = {
  P1: { vientoMaxBf: 3, olaMaxM: 0.3 },
  P2: { vientoMaxBf: 4, olaMaxM: 0.4 },
  P3: { vientoMaxBf: 5, olaMaxM: 0.6 },
  P4: { vientoMaxBf: 6, olaMaxM: 0.8 },
};

export const TECHOS_CANOAS: Record<CategoriaCanoa, { vientoMaxBf: number; olaMaxM: number }> = {
  CA1: { vientoMaxBf: 3, olaMaxM: 0.4 },
  CA2: { vientoMaxBf: 4, olaMaxM: 0.6 },
  CA3: { vientoMaxBf: 5, olaMaxM: 1.0 },
};

export function etiquetaCategoriaPato(pato: Pato): string {
  return pato.categoriaWKF;
}

export function etiquetaCategoriaCanoa(canoa: Canoa): string {
  return canoa.categoriaWKF;
}

// Compatibilidad con el código existente que esperaba TECHOS_PATOS
// y etiquetaCategoriaPato. Nada más cambia en este archivo.