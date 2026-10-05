// WKF — Colores de celda por veredicto.
// v1.009.4: helper para colorear tablas celda a celda según el
// sub-veredicto del dato. Configurable desde Ajustes.
// 5 niveles de coloración:
//   'ninguno'  → sin color.
//   'rojos'    → solo DESACONSEJADO.
//   'rn'       → DESACONSEJADO + EXIGENTE.
//   'rna'      → DESACONSEJADO + EXIGENTE + ACEPTABLE (recomendado).
//   'todo'     → todos los niveles, incluido FAVORABLE.

import type { Veredicto } from './verdict.ts';

export type NivelColorTabla = 'ninguno' | 'rojos' | 'rn' | 'rna' | 'todo';

// Devuelve el color de fondo de celda según el veredicto y la
// configuración del usuario. Devuelve null si no toca pintar.
export function colorCelda(
  veredicto: Veredicto | null,
  nivel: NivelColorTabla
): string | null {
  if (!veredicto || nivel === 'ninguno') return null;

  switch (nivel) {
    case 'rojos':
      if (veredicto === 'DESACONSEJADO') return 'rgba(255, 45, 85, 0.35)';
      return null;
    case 'rn':
      if (veredicto === 'DESACONSEJADO') return 'rgba(255, 45, 85, 0.35)';
      if (veredicto === 'EXIGENTE') return 'rgba(255, 138, 0, 0.30)';
      return null;
    case 'rna':
      if (veredicto === 'DESACONSEJADO') return 'rgba(255, 45, 85, 0.35)';
      if (veredicto === 'EXIGENTE') return 'rgba(255, 138, 0, 0.30)';
      if (veredicto === 'ACEPTABLE') return 'rgba(229, 229, 0, 0.25)';
      return null;
    case 'todo':
      if (veredicto === 'DESACONSEJADO') return 'rgba(255, 45, 85, 0.35)';
      if (veredicto === 'EXIGENTE') return 'rgba(255, 138, 0, 0.30)';
      if (veredicto === 'ACEPTABLE') return 'rgba(229, 229, 0, 0.25)';
      if (veredicto === 'FAVORABLE') return 'rgba(0, 229, 106, 0.20)';
      return null;
  }
}