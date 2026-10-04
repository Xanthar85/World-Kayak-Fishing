export type HourlyPoint = {
  time: string;
  waveHeight: number | null;
  wavePeriod: number | null;
  waveDirection: number | null;
  windSpeed: number | null;
  windGusts: number | null;
  windDirection: number | null;
  temperature: number | null;
  precipitation: number | null;
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
    wave_period: (number | null)[];
    wave_direction: (number | null)[];
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
    precipitation: (number | null)[];
  };
};

export async function fetchSpotWeather(lat: number, lon: number): Promise<SpotWeather> {
  const marineParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: 'wave_height,wave_period,wave_direction',
    forecast_days: '7',
    timezone: 'auto',
  });

  const atmosParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: 'wind_speed_10m,wind_gusts_10m,wind_direction_10m,temperature_2m,precipitation',
    forecast_days: '7',
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
    return {
      time: t,
      waveHeight: marine.hourly.wave_height[i] ?? null,
      wavePeriod: marine.hourly.wave_period[i] ?? null,
      waveDirection: marine.hourly.wave_direction[i] ?? null,
      windSpeed: ai !== undefined ? atmos.hourly.wind_speed_10m[ai] ?? null : null,
      windGusts: ai !== undefined ? atmos.hourly.wind_gusts_10m[ai] ?? null : null,
      windDirection: ai !== undefined ? atmos.hourly.wind_direction_10m[ai] ?? null : null,
      temperature: ai !== undefined ? atmos.hourly.temperature_2m[ai] ?? null : null,
      precipitation: ai !== undefined ? atmos.hourly.precipitation[ai] ?? null : null,
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