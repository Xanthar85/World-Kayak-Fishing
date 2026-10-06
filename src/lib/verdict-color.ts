// src/lib/verdict-color.ts
// WKF — Colores de celda por veredicto.
// v1.010: bug 18. El color ya NO se aplica como fondo de celda.
// Se aplica al NÚMERO (color de texto). El helper devuelve el
// color CSS del texto. DP-091: modifica DP-042.
// 5 niveles de coloración:
//   'ninguno'  → sin color.
//   'rojos'    → solo DESACONSEJADO.
//   'rn'       → DESACONSEJADO + EXIGENTE.
//   'rna'      → DESACONSEJADO + EXIGENTE + ACEPTABLE.
//   'todo'     → todos los niveles, incluido FAVORABLE.
// Por defecto (DP-092): 'todo'.

import type { Veredicto } from './verdict.ts';

export type NivelColorTabla = 'ninguno' | 'rojos' | 'rn' | 'rna' | 'todo';

// Devuelve el color de TEXTO de una celda según el veredicto y
// la configuración del usuario. Devuelve null si no toca colorear
// (el número va en color normal).
export function colorNumero(
  veredicto: Veredicto | null,
  nivel: NivelColorTabla
): string | null {
  if (!veredicto || nivel === 'ninguno') return null;

  switch (nivel) {
    case 'rojos':
      if (veredicto === 'DESACONSEJADO') return 'var(--verdict-desaconsejado)';
      return null;
    case 'rn':
      if (veredicto === 'DESACONSEJADO') return 'var(--verdict-desaconsejado)';
      if (veredicto === 'EXIGENTE') return 'var(--verdict-exigente)';
      return null;
    case 'rna':
      if (veredicto === 'DESACONSEJADO') return 'var(--verdict-desaconsejado)';
      if (veredicto === 'EXIGENTE') return 'var(--verdict-exigente)';
      if (veredicto === 'ACEPTABLE') return 'var(--verdict-aceptable)';
      return null;
    case 'todo':
      if (veredicto === 'DESACONSEJADO') return 'var(--verdict-desaconsejado)';
      if (veredicto === 'EXIGENTE') return 'var(--verdict-exigente)';
      if (veredicto === 'ACEPTABLE') return 'var(--verdict-aceptable)';
      if (veredicto === 'FAVORABLE') return 'var(--verdict-favorable)';
      return null;
  }
}