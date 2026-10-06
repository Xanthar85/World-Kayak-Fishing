// src/lib/openmeteo.ts
// WKF — Cliente Open-Meteo (Marine + Forecast).
// v1.010: 7 días completos, todas las variables útiles.
// Variables marinas: wave_height (total), wind_wave_height,
// swell_wave_height, wave_period, wind_wave_period,
// swell_wave_period, wave_direction, wind_wave_direction,
// swell_wave_direction, sea_surface_temperature,
// sea_level_height_msl, ocean_current_velocity,
// ocean_current_direction.
// Variables atmosféricas: wind_speed_10m, wind_gusts_10m,
// wind_direction_10m, temperature_2m, apparent_temperature,
// precipitation, precipitation_probability, cloud_cover,
// pressure_msl, visibility, weather_code.
// v1.010: fetchSpotWeather acepta opcionalmente un flag para
// reducir forecast_days y ahorrar ancho de banda cuando solo
// se necesita hoy.

export type HourlyPoint = {
  time: string;
  // Oleaje
  waveHeight: number | null;         // total (m)
  windWaveHeight: number | null;     // mar de viento (m)
  swellWaveHeight: number | null;    // mar de fondo (m)
  wavePeriod: number | null;         // periodo dominante (s)
  windWavePeriod: number | null;
  swellWavePeriod: number | null;
  waveDirection: number | null;      // dir oleaje total (°)
  windWaveDirection: number | null;
  swellWaveDirection: number | null;
  // Viento
  windSpeed: number | null;          // m/s
  windGusts: number | null;          // m/s
  windDirection: number | null;      // °
  // Temperatura
  temperature: number | null;        // °C aire
  apparentTemperature: number | null; // °C sensación
  seaSurfaceTemperature: number | null; // °C SST
  // Tiempo
  precipitation: number | null;      // mm
  precipitationProbability: number | null; // %
  cloudCover: number | null;         // %
  weatherCode: number | null;
  visibility: number | null;         // m
  // Presión
  pressure: number | null;           // hPa
  // Marea y corriente
  seaLevelHeight: number | null;     // m
  currentVelocity: number | null;    // kn
  currentDirection: number | null;   // °
};

export type SpotWeather = {
  fetchedAt: number;
  lat: number;
  lon: number;
  timezone: string;
  hourly: HourlyPoint[];
};

const MARINE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const ATMOS_URL = 'https://api.open-meteo.com/v1/forecast';

type MarineResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    wave_height: (number | null)[];
    wind_wave_height: (number | null)[];
    swell_wave_height: (number | null)[];
    wave_period: (number | null)[];
    wind_wave_period: (number | null)[];
    swell_wave_period: (number | null)[];
    wave_direction: (number | null)[];
    wind_wave_direction: (number | null)[];
    swell_wave_direction: (number | null)[];
    sea_surface_temperature: (number | null)[];
    sea_level_height_msl: (number | null)[];
    ocean_current_velocity: (number | null)[];
    ocean_current_direction: (number | null)[];
  };
};

type AtmosResponse = {
  timezone: string;
  hourly: {
    time: string[];
    wind_speed_10m: (number | null)[];
    wind_gusts_10m: (number | null)[];
    wind_direction_10m: (number | null)[];
    temperature_2m: (number | null)[];
    apparent_temperature: (number | null)[];
    precipitation: (number | null)[];
    precipitation_probability: (number | null)[];
    cloud_cover: (number | null)[];
    weather_code: (number | null)[];
    visibility: (number | null)[];
    pressure_msl: (number | null)[];
  };
};

export async function fetchSpotWeather(
  lat: number,
  lon: number,
  days = 7
): Promise<SpotWeather> {
  const forecastDays = String(Math.max(1, Math.min(16, days)));

  const marineParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: [
      'wave_height',
      'wind_wave_height',
      'swell_wave_height',
      'wave_period',
      'wind_wave_period',
      'swell_wave_period',
      'wave_direction',
      'wind_wave_direction',
      'swell_wave_direction',
      'sea_surface_temperature',
      'sea_level_height_msl',
      'ocean_current_velocity',
      'ocean_current_direction',
    ].join(','),
    forecast_days: forecastDays,
    timezone: 'auto',
  });

  const atmosParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: [
      'wind_speed_10m',
      'wind_gusts_10m',
      'wind_direction_10m',
      'temperature_2m',
      'apparent_temperature',
      'precipitation',
      'precipitation_probability',
      'cloud_cover',
      'weather_code',
      'visibility',
      'pressure_msl',
    ].join(','),
    forecast_days: forecastDays,
    timezone: 'auto',
  });

  const [marineRes, atmosRes] = await Promise.all([
    fetch(`${MARINE_URL}?${marineParams.toString()}`, {
      headers: { Accept: 'application/json' },
    }),
    fetch(`${ATMOS_URL}?${atmosParams.toString()}`, {
      headers: { Accept: 'application/json' },
    }),
  ]);

  if (!marineRes.ok) throw new Error(`marine http ${marineRes.status}`);
  if (!atmosRes.ok) throw new Error(`atmos http ${atmosRes.status}`);

  const marine = (await marineRes.json()) as MarineResponse;
  const atmos = (await atmosRes.json()) as AtmosResponse;

  const atmosByTime = new Map<string, number>();
  atmos.hourly.time.forEach((t, i) => atmosByTime.set(t, i));

  const hourly: HourlyPoint[] = marine.hourly.time.map((t, i) => {
    const ai = atmosByTime.get(t);
    const rawVelocity = marine.hourly.ocean_current_velocity?.[i] ?? null;
    // Open-Meteo da la corriente en m/s. Pasamos a nudos.
    const currentVelocity =
      rawVelocity != null ? Math.round((rawVelocity / 0.514444) * 100) / 100 : null;

    return {
      time: t,
      // Oleaje
      waveHeight: marine.hourly.wave_height?.[i] ?? null,
      windWaveHeight: marine.hourly.wind_wave_height?.[i] ?? null,
      swellWaveHeight: marine.hourly.swell_wave_height?.[i] ?? null,
      wavePeriod: marine.hourly.wave_period?.[i] ?? null,
      windWavePeriod: marine.hourly.wind_wave_period?.[i] ?? null,
      swellWavePeriod: marine.hourly.swell_wave_period?.[i] ?? null,
      waveDirection: marine.hourly.wave_direction?.[i] ?? null,
      windWaveDirection: marine.hourly.wind_wave_direction?.[i] ?? null,
      swellWaveDirection: marine.hourly.swell_wave_direction?.[i] ?? null,
      // Viento
      windSpeed: ai !== undefined ? atmos.hourly.wind_speed_10m[ai] ?? null : null,
      windGusts: ai !== undefined ? atmos.hourly.wind_gusts_10m[ai] ?? null : null,
      windDirection: ai !== undefined ? atmos.hourly.wind_direction_10m[ai] ?? null : null,
      // Temperatura
      temperature: ai !== undefined ? atmos.hourly.temperature_2m[ai] ?? null : null,
      apparentTemperature:
        ai !== undefined ? atmos.hourly.apparent_temperature?.[ai] ?? null : null,
      seaSurfaceTemperature: marine.hourly.sea_surface_temperature?.[i] ?? null,
      // Tiempo
      precipitation: ai !== undefined ? atmos.hourly.precipitation[ai] ?? null : null,
      precipitationProbability:
        ai !== undefined ? atmos.hourly.precipitation_probability?.[ai] ?? null : null,
      cloudCover: ai !== undefined ? atmos.hourly.cloud_cover?.[ai] ?? null : null,
      weatherCode: ai !== undefined ? atmos.hourly.weather_code?.[ai] ?? null : null,
      visibility: ai !== undefined ? atmos.hourly.visibility?.[ai] ?? null : null,
      // Presión
      pressure: ai !== undefined ? atmos.hourly.pressure_msl?.[ai] ?? null : null,
      // Marea y corriente
      seaLevelHeight: marine.hourly.sea_level_height_msl?.[i] ?? null,
      currentVelocity,
      currentDirection: marine.hourly.ocean_current_direction?.[i] ?? null,
    };
  });

  return {
    fetchedAt: Date.now(),
    lat: marine.latitude,
    lon: marine.longitude,
    timezone: marine.timezone,
    hourly,
  };
}

// ─── Helpers de conversión y presentación ──────────────────────────

// m/s → nudos
export function msAKn(ms: number | null): number | null {
  if (ms == null) return null;
  return Math.round(ms * 1.94384 * 10) / 10;
}

// m/s → km/h
export function msAKmh(ms: number | null): number | null {
  if (ms == null) return null;
  return Math.round(ms * 3.6 * 10) / 10;
}

// m/s → Beaufort (0-12)
export function msABf(ms: number | null): number | null {
  if (ms == null) return null;
  // Tabla de umbrales Bf en m/s (aprox).
  const umbrales = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7];
  for (let i = 0; i < umbrales.length; i++) {
    if (ms < umbrales[i]) return i;
  }
  return 12;
}

// Grados → punto cardinal de 16 rumbos (índice 0-15).
export function gradosACardinal16(grados: number | null): string {
  if (grados == null) return '—';
  const puntos = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  const idx = Math.round(((grados % 360) + 360) % 360 / 22.5) % 16;
  return puntos[idx];
}

// weather_code WMO → emoji simplificado.
export function weatherCodeAIcono(code: number | null, isNight = false): string {
  if (code == null) return '—';
  if (code === 0) return isNight ? '🌙' : '☀️';
  if (code <= 2) return isNight ? '🌙' : '⛅';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '—';
}

// Icono para el mini-gráfico (24 h). Mismo que arriba pero sin
// distinguir noche para no complicar: el eje X ya marca la hora.
export function weatherCodeAIconoGrafico(code: number | null): string {
  if (code == null) return '·';
  if (code === 0) return '☀';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁';
  if (code >= 45 && code <= 48) return '≡';
  if (code >= 51 && code <= 67) return '☂';
  if (code >= 71 && code <= 86) return '❄';
  if (code >= 95) return '⚡';
  return '·';
}