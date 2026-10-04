// WKF — Cálculo de fase lunar y edad lunar.
// Algoritmo simplificado (Conway/Arnol'd). Precisión ±1 día.
// Suficiente para pesca: lo que importa es la fase, no el minuto exacto.

export type FaseLunar =
  | 'nueva'
  | 'creciente'
  | 'cuarto_creciente'
  | 'gibosa_creciente'
  | 'llena'
  | 'gibosa_menguante'
  | 'cuarto_menguante'
  | 'menguante';

export interface DatosLuna {
  edad: number; // días desde luna nueva (0-29.53)
  fase: FaseLunar;
  iluminacion: number; // 0-1
}

const CICLO_LUNAR = 29.530588853;

// Fecha de referencia: luna nueva conocida (6 enero 2000, 18:14 UTC).
const LUNA_NUEVA_REF = Date.UTC(2000, 0, 6, 18, 14, 0);

export function calcularLuna(fecha: Date): DatosLuna {
  const diff = fecha.getTime() - LUNA_NUEVA_REF;
  const dias = diff / 86400000;
  const ciclos = dias / CICLO_LUNAR;
  const faseCiclo = ciclos - Math.floor(ciclos);
  const edad = faseCiclo * CICLO_LUNAR;

  // Iluminación aproximada: 0 en nueva, 1 en llena.
  const iluminacion = (1 - Math.cos(2 * Math.PI * faseCiclo)) / 2;

  return {
    edad,
    fase: clasificarFase(edad),
    iluminacion,
  };
}

function clasificarFase(edad: number): FaseLunar {
  // Ocho fases de ~3.69 días cada una.
  if (edad < 1.85) return 'nueva';
  if (edad < 5.53) return 'creciente';
  if (edad < 9.22) return 'cuarto_creciente';
  if (edad < 12.91) return 'gibosa_creciente';
  if (edad < 16.61) return 'llena';
  if (edad < 20.30) return 'gibosa_menguante';
  if (edad < 23.99) return 'cuarto_menguante';
  if (edad < 27.68) return 'menguante';
  return 'nueva';
}