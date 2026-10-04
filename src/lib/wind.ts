// WKF — Nombres de los vientos.
// DP-034: rosa mediterránea de 16 rumbos para fachada mediterránea.
// Genéricos en el resto del mundo.

export type ZonaViento = 'mediterraneo' | 'generico';

export interface NombresViento {
  n: string;
  nne: string;
  ne: string;
  ene: string;
  e: string;
  ese: string;
  se: string;
  sse: string;
  s: string;
  sso: string;
  so: string;
  oso: string;
  o: string;
  ono: string;
  no: string;
  nno: string;
}

export const ROSA_MEDITERRANEA: NombresViento = {
  n: 'Tramontana',
  nne: 'Greco-Tramontana',
  ne: 'Gregal',
  ene: 'Greco-Levante',
  e: 'Levante',
  ese: 'Siroco-Levante',
  se: 'Siroco',
  sse: 'Siroco-Ostro',
  s: 'Ostro',
  sso: 'Ostro-Libeccio',
  so: 'Lebeche',
  oso: 'Poniente-Libeccio',
  o: 'Poniente',
  ono: 'Poniente-Mistral',
  no: 'Mistral',
  nno: 'Tramontana-Mistral',
};

export const ROSA_GENERICA: NombresViento = {
  n: 'N',
  nne: 'NNE',
  ne: 'NE',
  ene: 'ENE',
  e: 'E',
  ese: 'ESE',
  se: 'SE',
  sse: 'SSE',
  s: 'S',
  sso: 'SSO',
  so: 'SO',
  oso: 'OSO',
  o: 'O',
  ono: 'ONO',
  no: 'NO',
  nno: 'NNO',
};

// Zonas donde se aplica la rosa mediterránea (DP-034).
export const ZONAS_VIENTO_MEDITERRANEO: string[] = [
  'mediterraneo_espanol',
  'mediterraneo_frances',
  'mediterraneo_italiano',
  'mediterraneo_griego',
  'mediterraneo_turco',
  'mediterraneo_norteafricano',
  'mar_marmara',
  'mar_adriatico',
  'mar_egeo',
];

const CLAVES_RUMBO: (keyof NombresViento)[] = [
  'n', 'nne', 'ne', 'ene',
  'e', 'ese', 'se', 'sse',
  's', 'sso', 'so', 'oso',
  'o', 'ono', 'no', 'nno',
];

const TRADUCCION_EN: Record<string, string> = {
  'Tramontana': 'Tramontana (Northerly)',
  'Greco-Tramontana': 'Greco-Tramontana (NNE)',
  'Gregal': 'Gregal (Northeasterly)',
  'Greco-Levante': 'Greco-Levante (ENE)',
  'Levante': 'Levante (Easterly)',
  'Siroco-Levante': 'Siroco-Levante (ESE)',
  'Siroco': 'Siroco (Southeasterly)',
  'Siroco-Ostro': 'Siroco-Ostro (SSE)',
  'Ostro': 'Ostro (Southerly)',
  'Ostro-Libeccio': 'Ostro-Libeccio (SSW)',
  'Lebeche': 'Lebeche (Southwesterly)',
  'Poniente-Libeccio': 'Poniente-Libeccio (WSW)',
  'Poniente': 'Poniente (Westerly)',
  'Poniente-Mistral': 'Poniente-Mistral (WNW)',
  'Mistral': 'Mistral (Northwesterly)',
  'Tramontana-Mistral': 'Tramontana-Mistral (NNW)',
};

// Devuelve el índice de 0 a 15 correspondiente al rumbo.
// 0 = N, 1 = NNE, 2 = NE, ..., 15 = NNO.
// Cada sector abarca 22.5 grados, centrado en el rumbo.
export function gradosARumbo(grados: number): number {
  const normalizado = ((grados % 360) + 360) % 360;
  return Math.round(normalizado / 22.5) % 16;
}

function traducirAlIngles(nombre: string, clave: keyof NombresViento): string {
  const traduccion = TRADUCCION_EN[nombre];
  if (traduccion) return traduccion;
  return ROSA_GENERICA[clave];
}

// Devuelve el nombre del viento.
// Si la zona no está en el Mediterráneo, usa la rosa genérica.
export function nombreViento(
  grados: number,
  zona: string,
  idioma: 'es' | 'en' = 'es'
): string {
  const rumbo = gradosARumbo(grados);
  const clave = CLAVES_RUMBO[rumbo];
  const esMediterraneo = ZONAS_VIENTO_MEDITERRANEO.includes(zona);
  const rosa = esMediterraneo ? ROSA_MEDITERRANEA : ROSA_GENERICA;
  const nombre = rosa[clave];
  if (idioma === 'en') {
    return traducirAlIngles(nombre, clave);
  }
  return nombre;
}

// Abreviatura estándar (N, NNE, NE, ...).
export function abreviaturaViento(grados: number): string {
  const rumbo = gradosARumbo(grados);
  return ROSA_GENERICA[CLAVES_RUMBO[rumbo]];
}