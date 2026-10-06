// src/lib/shoaling.ts
// WKF — Factor de shoaling. Sin cambios funcionales en v1.010.
// DP-032.

const LIMITE_ROTURA = 0.78;

export interface ResultadoShoaling {
  alturaCorregida: number;
  rompe: boolean;
  factor: number;
}

export function calcularShoaling(
  alturaAguasProfundas: number,
  profundidadProfunda: number,
  profundidadSomeras: number
): ResultadoShoaling {
  if (
    alturaAguasProfundas <= 0 ||
    profundidadProfunda <= 0 ||
    profundidadSomeras <= 0
  ) {
    return {
      alturaCorregida: alturaAguasProfundas,
      rompe: false,
      factor: 1,
    };
  }

  if (profundidadSomeras >= profundidadProfunda) {
    return {
      alturaCorregida: alturaAguasProfundas,
      rompe: false,
      factor: 1,
    };
  }

  const factor = Math.pow(profundidadProfunda / profundidadSomeras, 0.25);
  let alturaCorregida = alturaAguasProfundas * factor;

  const alturaMaxima = LIMITE_ROTURA * profundidadSomeras;
  let rompe = false;
  if (alturaCorregida > alturaMaxima) {
    alturaCorregida = alturaMaxima;
    rompe = true;
  }

  return {
    alturaCorregida,
    rompe,
    factor: alturaCorregida / alturaAguasProfundas,
  };
}

export const PROFUNDIDAD_PROFUNDA_DEFECTO = 20;
export const PROFUNDIDAD_SOMERA_DEFECTO = 5;