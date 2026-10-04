// WKF — Coeficiente solunar.
// DP-019: calcula franjas horarias con puntuación > 5 sobre 10.
// Basado en: posición lunar + fase + horas mayores y menores.

import { calcularLuna } from './moon.ts';

export interface FranjaSolunar {
  inicio: Date;
  fin: Date;
  puntuacion: number; // 0-10
}

export interface DatosSolunar {
  coeficienteDia: number; // 0-10
  franjasMayores: FranjaSolunar[];
  franjasMenores: FranjaSolunar[];
}

// Tránsito lunar aproximado: cuándo cruza el meridiano local.
// Aproximación: la luna sale ~50 min más tarde cada día. La hora
// del tránsito está desplazada de la solar por la fase lunar.
function transitoLunar(fecha: Date, lon: number): Date {
  const luna = calcularLuna(fecha);
  // Fracción del ciclo: 0 = nueva (tránsito a mediodía solar),
  // 0.5 = llena (tránsito a medianoche solar).
  const fraccion = luna.edad / 29.530588853;

  // Mediodía solar local aproximado en UTC.
  const mediodiaSolarUTC = 720 - 4 * lon;

  // Hora del tránsito en minutos desde medianoche UTC.
  // En luna nueva, tránsito a mediodía. En llena, tránsito a medianoche.
  // Se desplaza 12 horas (720 min) por cada media vuelta.
  const desplazamiento = fraccion * 1440;
  const transitoUTC = (mediodiaSolarUTC + desplazamiento) % 1440;

  const base = new Date(Date.UTC(
    fecha.getUTCFullYear(),
    fecha.getUTCMonth(),
    fecha.getUTCDate(),
    0, 0, 0
  ));

  return new Date(base.getTime() + transitoUTC * 60000);
}

function clasificarFranja(puntuacion: number): boolean {
  return puntuacion > 5;
}

// Construye las franjas mayores (tránsito lunar ± 2 h) y menores
// (orto/ocaso lunar ± 1 h) con sus puntuaciones.
function construirFranjas(
  transito: Date,
  edadLunar: number
): { mayores: FranjaSolunar[]; menores: FranjaSolunar[] } {
  // Puntuación base: máxima en luna nueva o llena, mínima en cuartos.
  // Usamos 1 - |cos(2π * fraccion)| para picos en 0 y 0.5.
  const fraccion = edadLunar / 29.530588853;
  const pico = Math.abs(Math.cos(2 * Math.PI * fraccion));
  const base = 5 + pico * 5; // 5-10

  const mayorInicio = new Date(transito.getTime() - 2 * 3600000);
  const mayorFin = new Date(transito.getTime() + 2 * 3600000);

  // Orto y ocaso lunar: ~6 h antes y después del tránsito.
  const ortoLunar = new Date(transito.getTime() - 6 * 3600000);
  const ocasoLunar = new Date(transito.getTime() + 6 * 3600000);

  const menorInicio1 = new Date(ortoLunar.getTime() - 1 * 3600000);
  const menorFin1 = new Date(ortoLunar.getTime() + 1 * 3600000);
  const menorInicio2 = new Date(ocasoLunar.getTime() - 1 * 3600000);
  const menorFin2 = new Date(ocasoLunar.getTime() + 1 * 3600000);

  return {
    mayores: [
      { inicio: mayorInicio, fin: mayorFin, puntuacion: base },
    ],
    menores: [
      { inicio: menorInicio1, fin: menorFin1, puntuacion: base * 0.7 },
      { inicio: menorInicio2, fin: menorFin2, puntuacion: base * 0.7 },
    ],
  };
}

export function calcularSolunar(
  fecha: Date,
  lat: number,
  lon: number
): DatosSolunar {
  const luna = calcularLuna(fecha);
  const transito = transitoLunar(fecha, lon);
  const { mayores, menores } = construirFranjas(transito, luna.edad);

  const todas = [...mayores, ...menores];
  const coeficienteDia = todas.reduce(
    (max, f) => Math.max(max, f.puntuacion),
    0
  );

  return {
    coeficienteDia,
    franjasMayores: mayores.filter((f) => clasificarFranja(f.puntuacion)),
    franjasMenores: menores.filter((f) => clasificarFranja(f.puntuacion)),
  };
}

// Corrige la influencia lunar según la latitud: en latitudes altas el
// efecto solunar es más débil. Ajuste lineal de 1.0 (ecuador) a 0.6 (60°).
export function factorLatitud(lat: number): number {
  const absLat = Math.min(Math.abs(lat), 60);
  return 1 - (absLat / 60) * 0.4;
}
