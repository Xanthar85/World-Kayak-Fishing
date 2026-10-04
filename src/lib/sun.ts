// WKF — Cálculo de orto, ocaso y crepúsculos.
// Algoritmo NOAA simplificado. Precisión suficiente para pesca.
// Todas las horas en UTC; el consumidor las convierte a zona local.

export interface DatosSol {
  orto: Date;
  ocaso: Date;
  crepusculoCivilInicio: Date;
  crepusculoCivilFin: Date;
  crepusculoNauticoInicio: Date;
  crepusculoNauticoFin: Date;
  crepusculoAstronomicoInicio: Date;
  crepusculoAstronomicoFin: Date;
  mediodiaSolar: Date;
  duracionDia: number; // minutos
}

const RAD = Math.PI / 180;

function diaDelAno(fecha: Date): number {
  const inicio = Date.UTC(fecha.getUTCFullYear(), 0, 0);
  const diff = fecha.getTime() - inicio;
  return Math.floor(diff / 86400000);
}

// Ángulo horario para una elevación solar dada.
// elevation: 0 para orto/ocaso, -6 civil, -12 náutico, -18 astronómico.
function anguloHorario(lat: number, decl: number, elevation: number): number | null {
  const cosH =
    (Math.sin(elevation * RAD) - Math.sin(lat * RAD) * Math.sin(decl * RAD)) /
    (Math.cos(lat * RAD) * Math.cos(decl * RAD));

  if (cosH > 1) return null; // sol nunca sube a esa elevación
  if (cosH < -1) return null; // sol nunca baja a esa elevación

  return Math.acos(cosH) / RAD;
}

// Declinación solar aproximada (grados).
function declinacionSolar(n: number): number {
  return 23.44 * Math.sin(2 * Math.PI * (284 + n) / 365) * RAD;
}

// Corrección por ecuación del tiempo (minutos).
function ecuacionDelTiempo(n: number): number {
  const B = (2 * Math.PI * (n - 81)) / 364;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

export function calcularSol(
  fecha: Date,
  lat: number,
  lon: number
): DatosSol | null {
  // Si estamos en latitudes extremas, el sol puede no salir o no ponerse.
  if (Math.abs(lat) > 89) return null;

  const n = diaDelAno(fecha);
  const decl = declinacionSolar(n);
  const eot = ecuacionDelTiempo(n);

  // Mediodía solar en UTC (minutos desde medianoche UTC).
  const mediodiaSolarUTC = 720 - 4 * lon - eot;

  // Ángulo horario para orto/ocaso.
  const H0 = anguloHorario(lat, decl, 0);
  const H6 = anguloHorario(lat, decl, -6);
  const H12 = anguloHorario(lat, decl, -12);
  const H18 = anguloHorario(lat, decl, -18);

  if (H0 === null) return null;

  const baseUTC = Date.UTC(
    fecha.getUTCFullYear(),
    fecha.getUTCMonth(),
    fecha.getUTCDate(),
    0,
    0,
    0
  );

  const desdeMinutos = (minutos: number) =>
    new Date(baseUTC + minutos * 60000);

  const orto = desdeMinutos(mediodiaSolarUTC - 4 * H0);
  const ocaso = desdeMinutos(mediodiaSolarUTC + 4 * H0);
  const mediodiaSolar = desdeMinutos(mediodiaSolarUTC);

  // Crepúsculos: si el ángulo no existe (sol no baja tanto), usamos
  // el orto/ocaso como aproximación.
  const civilInicio = H6 !== null ? desdeMinutos(mediodiaSolarUTC - 4 * H6) : orto;
  const civilFin = H6 !== null ? desdeMinutos(mediodiaSolarUTC + 4 * H6) : ocaso;
  const nauticoInicio = H12 !== null ? desdeMinutos(mediodiaSolarUTC - 4 * H12) : orto;
  const nauticoFin = H12 !== null ? desdeMinutos(mediodiaSolarUTC + 4 * H12) : ocaso;
  const astroInicio = H18 !== null ? desdeMinutos(mediodiaSolarUTC - 4 * H18) : orto;
  const astroFin = H18 !== null ? desdeMinutos(mediodiaSolarUTC + 4 * H18) : ocaso;

  const duracionDia = (ocaso.getTime() - orto.getTime()) / 60000;

  return {
    orto,
    ocaso,
    crepusculoCivilInicio: civilInicio,
    crepusculoCivilFin: civilFin,
    crepusculoNauticoInicio: nauticoInicio,
    crepusculoNauticoFin: nauticoFin,
    crepusculoAstronomicoInicio: astroInicio,
    crepusculoAstronomicoFin: astroFin,
    mediodiaSolar,
    duracionDia,
  };
}
