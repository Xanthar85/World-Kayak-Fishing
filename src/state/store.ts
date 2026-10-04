import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n, { detectInitialLanguage, STORAGE_KEY } from '../i18n/index.ts';
import type { SpotWeather } from '../lib/openmeteo.ts';

export interface Spot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  createdAt: number;
}

const WEATHER_TTL_MS = 30 * 60 * 1000;

export interface AppState {
  language: 'es' | 'en';
  theme: 'dark' | 'light';
  firstRunDone: boolean;
  spots: Spot[];
  weather: Record<string, SpotWeather>;
  setLanguage: (lang: 'es' | 'en') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  markFirstRunDone: () => void;
  addSpot: (spot: Omit<Spot, 'id' | 'createdAt'>) => void;
  updateSpot: (id: string, patch: Partial<Omit<Spot, 'id' | 'createdAt'>>) => void;
  removeSpot: (id: string) => void;
  setWeather: (spotId: string, data: SpotWeather) => void;
  clearWeather: (spotId: string) => void;
  getFreshWeather: (spotId: string) => SpotWeather | null;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: detectInitialLanguage(),
      theme: 'dark',
      firstRunDone: false,
      spots: [],
      weather: {},
      setLanguage: (lang: 'es' | 'en') => {
        void i18n.changeLanguage(lang);
        set({ language: lang });
      },
      setTheme: (theme: 'dark' | 'light') => set({ theme }),
      markFirstRunDone: () => set({ firstRunDone: true }),
      addSpot: (spot) =>
        set((state) => ({
          spots: [
            ...state.spots,
            {
              ...spot,
              id:
                typeof crypto !== 'undefined' && 'randomUUID' in crypto
                  ? crypto.randomUUID()
                  : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              createdAt: Date.now(),
            },
          ],
        })),
      updateSpot: (id, patch) =>
        set((state) => ({
          spots: state.spots.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      removeSpot: (id) =>
        set((state) => {
          const { [id]: _removed, ...rest } = state.weather;
          return {
            spots: state.spots.filter((s) => s.id !== id),
            weather: rest,
          };
        }),
      setWeather: (spotId, data) =>
        set((state) => ({
          weather: { ...state.weather, [spotId]: data },
        })),
      clearWeather: (spotId) =>
        set((state) => {
          const { [spotId]: _removed, ...rest } = state.weather;
          return { weather: rest };
        }),
      getFreshWeather: (spotId) => {
        const entry = get().weather[spotId];
        if (!entry) return null;
        if (Date.now() - entry.fetchedAt > WEATHER_TTL_MS) return null;
        return entry;
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);