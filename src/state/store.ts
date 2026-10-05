import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n, { detectInitialLanguage, STORAGE_KEY } from '../i18n/index.ts';
import type { SpotWeather } from '../lib/openmeteo.ts';
import type {
  CategoriaKayak,
  FranjaDia,
  NivelExperiencia,
  TipoAcceso,
  Zona,
  PerfilKayakista,
} from '../lib/verdict.ts';
import type { FormatoCoords } from '../lib/coords.ts';

export interface Spot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  createdAt: number;
  // Ampliación DP-044: acceso integrado + zona + categoría.
  zona?: Zona;
  tipoAcceso?: TipoAcceso | null;
  profundidad?: number | null; // m, del punto de pesca
  accesoLat?: number | null;
  accesoLon?: number | null;
  accesoProfundidad?: number | null;
}

export type FranjaUsuario = {
  id: string;
  nombre: string;
  inicio: number; // hora 0-23
  fin: number; // hora 0-23
};

export interface AjustesApp {
  formatoCoords: FormatoCoords;
  kayakIds: string[]; // hasta 2
  categoriaKayak: CategoriaKayak;
  perfil: PerfilKayakista;
  franjas: FranjaUsuario[];
  franjaActivaId: string | null;
  subpestanasOcultas: string[];
}

const WEATHER_TTL_MS = 30 * 60 * 1000;

const FRANJAS_DEFECTO: FranjaUsuario[] = [
  { id: 'manana', nombre: 'Mañana', inicio: 6, fin: 12 },
  { id: 'tarde', nombre: 'Tarde', inicio: 12, fin: 20 },
  { id: 'noche', nombre: 'Noche', inicio: 20, fin: 6 },
];

const PERFIL_DEFECTO: PerfilKayakista = {
  experiencia: 'intermedio',
  vhf: false,
  remoRepuesto: false,
  ropaSeca: false,
  compartimentosEstancos: false,
};

export interface AppState {
  language: 'es' | 'en';
  theme: 'dark' | 'light';
  firstRunDone: boolean;
  spots: Spot[];
  weather: Record<string, SpotWeather>;
  ajustes: AjustesApp;

  setLanguage: (lang: 'es' | 'en') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  markFirstRunDone: () => void;

  addSpot: (spot: Omit<Spot, 'id' | 'createdAt'>) => void;
  updateSpot: (id: string, patch: Partial<Omit<Spot, 'id' | 'createdAt'>>) => void;
  removeSpot: (id: string) => void;

  setWeather: (spotId: string, data: SpotWeather) => void;
  clearWeather: (spotId: string) => void;
  getFreshWeather: (spotId: string) => SpotWeather | null;

  setFormatoCoords: (f: FormatoCoords) => void;
  setKayakIds: (ids: string[]) => void;
  setCategoriaKayak: (c: CategoriaKayak) => void;
  setPerfil: (patch: Partial<PerfilKayakista>) => void;
  setFranjas: (franjas: FranjaUsuario[]) => void;
  setFranjaActiva: (id: string | null) => void;
  toggleSubpestana: (id: string) => void;

  resetAll: () => void;
  exportState: () => Record<string, unknown>;
  importState: (data: unknown) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: detectInitialLanguage(),
      theme: 'dark',
      firstRunDone: false,
      spots: [],
      weather: {},
      ajustes: {
        formatoCoords: 'dd',
        kayakIds: [],
        categoriaKayak: 'K3',
        perfil: PERFIL_DEFECTO,
        franjas: FRANJAS_DEFECTO,
        franjaActivaId: 'manana',
        subpestanasOcultas: [],
      },

      setLanguage: (lang) => {
        void i18n.changeLanguage(lang);
        set({ language: lang });
      },
      setTheme: (theme) => set({ theme }),
      markFirstRunDone: () => set({ firstRunDone: true }),

      addSpot: (spot) =>
        set((state) => ({
          spots: [
            ...state.spots,
            {
              zona: 'mediterraneo_espanol',
              tipoAcceso: null,
              profundidad: null,
              accesoLat: null,
              accesoLon: null,
              accesoProfundidad: null,
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

      setFormatoCoords: (f) =>
        set((state) => ({
          ajustes: { ...state.ajustes, formatoCoords: f },
        })),
      setKayakIds: (ids) =>
        set((state) => ({
          ajustes: { ...state.ajustes, kayakIds: ids.slice(0, 2) },
        })),
      setCategoriaKayak: (c) =>
        set((state) => ({
          ajustes: { ...state.ajustes, categoriaKayak: c },
        })),
      setPerfil: (patch) =>
        set((state) => ({
          ajustes: {
            ...state.ajustes,
            perfil: { ...state.ajustes.perfil, ...patch },
          },
        })),
      setFranjas: (franjas) =>
        set((state) => ({
          ajustes: { ...state.ajustes, franjas },
        })),
      setFranjaActiva: (id) =>
        set((state) => ({
          ajustes: { ...state.ajustes, franjaActivaId: id },
        })),
      toggleSubpestana: (id) =>
        set((state) => {
          const ocultas = state.ajustes.subpestanasOcultas;
          const nuevas = ocultas.includes(id)
            ? ocultas.filter((x) => x !== id)
            : [...ocultas, id];
          return {
            ajustes: { ...state.ajustes, subpestanasOcultas: nuevas },
          };
        }),

      resetAll: () =>
        set(() => ({
          spots: [],
          weather: {},
          ajustes: {
            formatoCoords: 'dd',
            kayakIds: [],
            categoriaKayak: 'K3',
            perfil: PERFIL_DEFECTO,
            franjas: FRANJAS_DEFECTO,
            franjaActivaId: 'manana',
            subpestanasOcultas: [],
          },
        })),

      exportState: () => {
        const s = get();
        return {
          version: 2,
          spots: s.spots,
          ajustes: s.ajustes,
          language: s.language,
          theme: s.theme,
        };
      },

      importState: (data: unknown) => {
        if (!data || typeof data !== 'object') return false;
        const d = data as Record<string, any>;
        if (!Array.isArray(d.spots) || !d.ajustes || typeof d.ajustes !== 'object') {
          return false;
        }
        set((state) => ({
          spots: d.spots,
          ajustes: {
            ...state.ajustes,
            ...d.ajustes,
          },
          ...(d.language === 'es' || d.language === 'en' ? { language: d.language } : {}),
          ...(d.theme === 'dark' || d.theme === 'light' ? { theme: d.theme } : {}),
        }));
        if (d.language === 'es' || d.language === 'en') {
          void i18n.changeLanguage(d.language);
        }
        return true;
      },
    }),
    {
      name: STORAGE_KEY,
      version: 2,
    }
  )
);