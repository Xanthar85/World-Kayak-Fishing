// WKF — Utilidades de UI y visualización de veredictos.
// Funciones puras, sin JSX, sin React.

import type { SpotWeather } from './openmeteo.ts';
import {
  calcularVeredicto,
  type Veredicto,
  type VeredictoAcceso,
  type CategoriaKayak,
  type PerfilKayakista,
  type FranjaDia,
  type Condiciones,
} from './verdict.ts';
import type { Spot, FranjaUsuario } from '../state/store.ts';

const ORDEN_VEREDICTO: Veredicto[] = [
  'FAVORABLE',
  'ACEPTABLE',
  'EXIGENTE',
  'DESACONSEJADO',
];

function peorVeredicto(a: Veredicto, b: Veredicto): Veredicto {
  return ORDEN_VEREDICTO.indexOf(a) >= ORDEN_VEREDICTO.indexOf(b) ? a : b;
}

// 1. Color de veredicto
export function veredictoAColor(v: Veredicto): string {
  switch (v) {
    case 'FAVORABLE':
      return 'var(--verdict-favorable)';
    case 'ACEPTABLE':
      return 'var(--verdict-aceptable)';
    case 'EXIGENTE':
      return 'var(--verdict-exigente)';
    case 'DESACONSEJADO':
      return 'var(--verdict-desaconsejado)';
  }
}

// 2. Clave i18n de veredicto
export function veredictoAClaveI18n(v: Veredicto): string {
  switch (v) {
    case 'FAVORABLE':
      return 'verdict.favorable';
    case 'ACEPTABLE':
      return 'verdict.acceptable';
    case 'EXIGENTE':
      return 'verdict.demanding';
    case 'DESACONSEJADO':
      return 'verdict.advisedAgainst';
  }
}

// 3. Color de veredicto de acceso
export function veredictoAccesoAColor(v: VeredictoAcceso): string {
  switch (v) {
    case 'SEGURA':
      return 'var(--verdict-favorable)';
    case 'VIGILAR':
      return 'var(--verdict-aceptable)';
    case 'DIFICIL':
      return 'var(--verdict-exigente)';
    case 'NO_SALIR':
      return 'var(--verdict-desaconsejado)';
  }
}

// 4. Clave i18n de veredicto de acceso
export function veredictoAccesoAClaveI18n(v: VeredictoAcceso): string {
  switch (v) {
    case 'SEGURA':
      return 'verdict.launch.safe';
    case 'VIGILAR':
      return 'verdict.launch.watch';
    case 'DIFICIL':
      return 'verdict.launch.hard';
    case 'NO_SALIR':
      return 'verdict.launch.noGo';
  }
}

// 5. Calcula el veredicto para cada franja horaria definida
export function calcularVeredictoPorFranja(
  spot: Spot,
  weather: SpotWeather | null,
  franjas: FranjaUsuario[],
  categoria: CategoriaKayak,
  perfil: PerfilKayakista
): Record<string, Veredicto | null> {
  const res: Record<string, Veredicto | null> = {};
  for (const f of franjas) {
    res[f.id] = null;
  }

  if (!weather || !weather.hourly || weather.hourly.length === 0) {
    return res;
  }

  for (const franja of franjas) {
    // Mapeo por hora de inicio: 0-11 -> manana, 12-19 -> tarde, resto -> noche
    const inicio = franja.inicio;
    const franjaDia: FranjaDia =
      inicio >= 0 && inicio < 12
        ? 'manana'
        : inicio >= 12 && inicio < 20
        ? 'tarde'
        : 'noche';

    let peor: Veredicto | null = null;

    for (const h of weather.hourly) {
      const localHour = new Date(h.time).getHours();

      let dentro = false;
      if (franja.inicio < franja.fin) {
        dentro = localHour >= franja.inicio && localHour < franja.fin;
      } else if (franja.inicio > franja.fin) {
        dentro = localHour >= franja.inicio || localHour < franja.fin;
      } else {
        dentro = true;
      }

      if (!dentro) continue;
      if (h.waveHeight == null || h.windSpeed == null) continue;

      // Beaufort: round(pow(v / 0.836, 2/3))
      const bf = Math.round(Math.pow(h.windSpeed / 0.836, 2 / 3));
      const condiciones: Condiciones = {
        viento: bf,
        ola: h.waveHeight,
        periodo: h.wavePeriod ?? 0,
        corriente: 0,
        marea: 0,
      };

      const resultado = calcularVeredicto(
        spot.zona ?? 'mediterraneo_espanol',
        categoria,
        perfil,
        franjaDia,
        condiciones
      );

      peor = peor ? peorVeredicto(peor, resultado.veredicto) : resultado.veredicto;
    }

    res[franja.id] = peor;
  }

  return res;
}

// 6. Mini-gráfico SVG de ola y viento (viewBox 0 0 100 30)
export function miniGraficoOlaViento(
  weather: SpotWeather | null,
  _franjaId?: string,
  _franjas?: FranjaUsuario[]
): { ola: string; viento: string } {
  if (!weather || !weather.hourly || weather.hourly.length === 0) {
    return { ola: '', viento: '' };
  }

  const puntos = weather.hourly.slice(0, 24);
  if (puntos.length < 2) {
    return { ola: '', viento: '' };
  }

  const N = puntos.length;
  const olaCoords: string[] = [];
  const vientoCoords: string[] = [];

  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * 100;
    const p = puntos[i];

    // Ola: normalizada a 3 m max
    const olaVal = Math.max(0, Math.min(3, p.waveHeight ?? 0));
    const yOla = 28 - (olaVal / 3) * 26;

    // Viento: normalizado a 20 m/s max
    const vientoVal = Math.max(0, Math.min(20, p.windSpeed ?? 0));
    const yViento = 28 - (vientoVal / 20) * 26;

    const prefix = i === 0 ? 'M' : 'L';
    olaCoords.push(`${prefix} ${x.toFixed(1)},${yOla.toFixed(1)}`);
    vientoCoords.push(`${prefix} ${x.toFixed(1)},${yViento.toFixed(1)}`);
  }

  return {
    ola: olaCoords.join(' '),
    viento: vientoCoords.join(' '),
  };
}
