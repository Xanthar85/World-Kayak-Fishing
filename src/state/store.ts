import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n, { detectInitialLanguage, STORAGE_KEY } from '../i18n/index.ts';

export interface Spot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  createdAt: number;
}

export interface AppState {
  language: 'es' | 'en';
  theme: 'dark' | 'light';
  firstRunDone: boolean;
  spots: Spot[];
  setLanguage: (lang: 'es' | 'en') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  markFirstRunDone: () => void;
  addSpot: (spot: Omit<Spot, 'id' | 'createdAt'>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: detectInitialLanguage(),
      theme: 'dark',
      firstRunDone: false,
      spots: [],
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
    }),
    {
      name: STORAGE_KEY,
    }
  )
);