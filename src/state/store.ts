import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n, { detectInitialLanguage, STORAGE_KEY } from '../i18n/index.ts';

export interface AppState {
  language: 'es' | 'en';
  theme: 'dark' | 'light';
  firstRunDone: boolean;
  spots: unknown[];
  setLanguage: (lang: 'es' | 'en') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  markFirstRunDone: () => void;
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
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
