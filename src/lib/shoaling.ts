// WKF — Factor de shoaling.
// DP-032: corrección de ola al acercarse a la costa.
// Fórmula: Green's law + límite de rotura H/h ≈ 0.78.

// Ley de Green: la altura de ola es inversamente proporcional a la
// raíz cuarta de la profundidad.
// H2 = H1 * (h1 / h2) ^ (1/4)
//
// Pero la ola rompe cuando H/h ≈ 0.78. A partir de ahí, la altura
// se limita a 0.78 * h.

const LIMITE_ROTURA = 0.78;

export interface ResultadoShoaling {
  alturaCorregida: number; // metros
  rompe: boolean;
  factor: number; // multiplicador aplicado
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

  // Si la profundidad somera es mayor o igual a la profunda, no hay
  // shoaling. Devolvemos la altura tal cual.
  if (profundidadSomeras >= profundidadProfunda) {
    return {
      alturaCorregida: alturaAguasProfundas,
      rompe: false,
      factor: 1,
    };
  }

  // Ley de Green.
  const factor = Math.pow(profundidadProfunda / profundidadSomeras, 0.25);
  let alturaCorregida = alturaAguasProfundas * factor;

  // Límite de rotura.
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

// Profundidad por defecto cuando no tenemos dato batimétrico.
// 5 m es un valor conservador para aguas costeras típicas.
export const PROFUNDIDAD_PROFUNDA_DEFECTO = 20; // m
export const PROFUNDIDAD_SOMERA_DEFECTO = 5; // m