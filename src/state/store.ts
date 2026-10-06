// src/state/store.ts
// WKF — Estado global Zustand con persistencia en localStorage.
// Persist version 2. Clave "wkf-state-v1".
// v1.010:
//   - Color de tabla por defecto: 'todo' (DP-092).
//   - Nuevo método reorderSpots (DP-083) para arrastrar puntos.
//   - Se conserva el resto.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n, { detectInitialLanguage, STORAGE_KEY } from '../i18n/index.ts';
import type { SpotWeather } from '../lib/openmeteo.ts';
import type { NivelColorTabla } from '../lib/verdict-color.ts';
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
  zona?: Zona;
  tipoAcceso?: TipoAcceso | null;
  accesoLat?: number | null;
  accesoLon?: number | null;
}

export type FranjaUsuario = {
  id: string;
  nombre: string;
  inicio: number;
  fin: number;
};

export interface AjustesApp {
  formatoCoords: FormatoCoords;
  kayakIds: string[];
  categoriaKayak: CategoriaKayak;
  perfil: PerfilKayakista;
  franjas: FranjaUsuario[];
  franjaActivaId: string | null;
  subpestanasOcultas: string[];
  colorTabla: NivelColorTabla;
  filtroFranja: boolean;
}

export type ImportResult =
  | { ok: true; spotsImportados: number }
  | { ok: false; motivo: ImportFailReason };

export type ImportFailReason =
  | 'no_es_objeto'
  | 'version_incorrecta'
  | 'spots_no_array'
  | 'spot_mal_formado'
  | 'ajustes_mal_formados'
  | 'franjas_mal_formadas'
  | 'perfil_mal_formado';

export interface WeatherEntry {
  data: SpotWeather;
  stale: boolean;
  ageMin: number;
}

const WEATHER_TTL_MS = 30 * 60 * 1000;
export const PERSIST_VERSION = 2;

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

const CATEGORIAS_VALIDAS: CategoriaKayak[] = ['K1', 'K2', 'K3', 'K4', 'K5'];
const EXPERIENCIAS_VALIDAS: NivelExperiencia[] = [
  'novel',
  'principiante',
  'intermedio',
  'avanzado',
  'experto',
];
const FORMATOS_VALIDOS: FormatoCoords[] = ['dd', 'dms', 'ddm'];
const TIPOS_ACCESO_VALIDOS: TipoAcceso[] = [
  'playa',
  'roca',
  'puerto_escollera',
  'otro',
];
const COLORES_TABLA_VALIDOS: NivelColorTabla[] = [
  'ninguno',
  'rojos',
  'rn',
  'rna',
  'todo',
];

function esObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function esNumeroFinito(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function validarSpot(raw: unknown): raw is Spot {
  if (!esObjeto(raw)) return false;
  if (typeof raw.id !== 'string' || raw.id.length === 0) return false;
  if (typeof raw.name !== 'string') return false;
  if (!esNumeroFinito(raw.lat) || !esNumeroFinito(raw.lon)) return false;
  if (raw.lat < -90 || raw.lat > 90) return false;
  if (raw.lon < -180 || raw.lon > 180) return false;
  if (!esNumeroFinito(raw.createdAt)) return false;
  if (raw.zona !== undefined && typeof raw.zona !== 'string') return false;
  if (
    raw.tipoAcceso !== undefined &&
    raw.tipoAcceso !== null &&
    (typeof raw.tipoAcceso !== 'string' ||
      !TIPOS_ACCESO_VALIDOS.includes(raw.tipoAcceso as TipoAcceso))
  )
    return false;
  if (
    raw.accesoLat !== undefined &&
    raw.accesoLat !== null &&
    !esNumeroFinito(raw.accesoLat)
  )
    return false;
  if (
    raw.accesoLon !== undefined &&
    raw.accesoLon !== null &&
    !esNumeroFinito(raw.accesoLon)
  )
    return false;
  return true;
}

function validarFranja(raw: unknown): raw is FranjaUsuario {
  if (!esObjeto(raw)) return false;
  if (typeof raw.id !== 'string' || raw.id.length === 0) return false;
  if (typeof raw.nombre !== 'string') return false;
  if (!esNumeroFinito(raw.inicio) || !esNumeroFinito(raw.fin)) return false;
  if (raw.inicio < 0 || raw.inicio > 23) return false;
  if (raw.fin < 0 || raw.fin > 23) return false;
  return true;
}

function validarPerfil(raw: unknown): raw is PerfilKayakista {
  if (!esObjeto(raw)) return false;
  if (
    typeof raw.experiencia !== 'string' ||
    !EXPERIENCIAS_VALIDAS.includes(raw.experiencia as NivelExperiencia)
  )
    return false;
  if (typeof raw.vhf !== 'boolean') return false;
  if (typeof raw.remoRepuesto !== 'boolean') return false;
  if (typeof raw.ropaSeca !== 'boolean') return false;
  if (typeof raw.compartimentosEstancos !== 'boolean') return false;
  return true;
}

function validarAjustes(raw: unknown): raw is AjustesApp {
  if (!esObjeto(raw)) return false;
  if (
    typeof raw.formatoCoords !== 'string' ||
    !FORMATOS_VALIDOS.includes(raw.formatoCoords as FormatoCoords)
  )
    return false;
  if (!Array.isArray(raw.kayakIds)) return false;
  if (raw.kayakIds.length > 2) return false;
  if (!raw.kayakIds.every((id) => typeof id === 'string')) return false;
  if (
    typeof raw.categoriaKayak !== 'string' ||
    !CATEGORIAS_VALIDAS.includes(raw.categoriaKayak as CategoriaKayak)
  )
    return false;
  if (!validarPerfil(raw.perfil)) return false;
  if (!Array.isArray(raw.franjas)) return false;
  if (raw.franjas.length < 1 || raw.franjas.length > 4) return false;
  if (!raw.franjas.every(validarFranja)) return false;
  if (raw.franjaActivaId !== null && typeof raw.franjaActivaId !== 'string')
    return false;
  if (!Array.isArray(raw.subpestanasOcultas)) return false;
  if (!raw.subpestanasOcultas.every((id) => typeof id === 'string')) return false;
  if (
    raw.colorTabla !== undefined &&
    (typeof raw.colorTabla !== 'string' ||
      !COLORES_TABLA_VALIDOS.includes(raw.colorTabla as NivelColorTabla))
  )
    return false;
  if (raw.filtroFranja !== undefined && typeof raw.filtroFranja !== 'boolean')
    return false;
  return true;
}

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
  updateSpot: (
    id: string,
    patch: Partial<Omit<Spot, 'id' | 'createdAt'>>
  ) => void;
  removeSpot: (id: string) => void;
  /** Reordena los puntos según el array de ids dado (DP-083). */
  reorderSpots: (ids: string[]) => void;

  setWeather: (spotId: string, data: SpotWeather) => void;
  clearWeather: (spotId: string) => void;
  getWeatherEntry: (spotId: string) => WeatherEntry | null;
  getFreshWeather: (spotId: string) => SpotWeather | null;
  isWeatherStale: (spotId: string) => boolean;

  setFormatoCoords: (f: FormatoCoords) => void;
  setKayakIds: (ids: string[]) => void;
  setCategoriaKayak: (c: CategoriaKayak) => void;
  setPerfil: (patch: Partial<PerfilKayakista>) => void;
  setFranjas: (franjas: FranjaUsuario[]) => void;
  setFranjaActiva: (id: string | null) => void;
  toggleSubpestana: (id: string) => void;
  setColorTabla: (nivel: NivelColorTabla) => void;
  setFiltroFranja: (activo: boolean) => void;

  resetAll: () => void;
  exportState: () => Record<string, unknown>;
  importState: (data: unknown) => ImportResult;
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
        // DP-092: color de tabla por defecto = "todo".
        colorTabla: 'todo',
        filtroFranja: false,
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
              accesoLat: null,
              accesoLon: null,
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

      reorderSpots: (ids) =>
        set((state) => {
          const map = new Map(state.spots.map((s) => [s.id, s]));
          const ordenados = ids
            .map((id) => map.get(id))
            .filter((s): s is Spot => s !== undefined);
          // Cualquier spot que no estuviera en la lista se añade al final.
          const faltantes = state.spots.filter((s) => !ids.includes(s.id));
          return { spots: [...ordenados, ...faltantes] };
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
      getWeatherEntry: (spotId) => {
        const data = get().weather[spotId];
        if (!data) return null;
        const ageMs = Date.now() - data.fetchedAt;
        return {
          data,
          stale: ageMs > WEATHER_TTL_MS,
          ageMin: Math.floor(ageMs / 60000),
        };
      },
      getFreshWeather: (spotId) => {
        const entry = get().getWeatherEntry(spotId);
        if (!entry) return null;
        if (entry.stale) return null;
        return entry.data;
      },
      isWeatherStale: (spotId) => {
        const entry = get().getWeatherEntry(spotId);
        return entry ? entry.stale : false;
      },

      setFormatoCoords: (f) =>
        set((state) => ({ ajustes: { ...state.ajustes, formatoCoords: f } })),
      setKayakIds: (ids) =>
        set((state) => ({
          ajustes: { ...state.ajustes, kayakIds: ids.slice(0, 2) },
        })),
      setCategoriaKayak: (c) =>
        set((state) => ({ ajustes: { ...state.ajustes, categoriaKayak: c } })),
      setPerfil: (patch) =>
        set((state) => ({
          ajustes: {
            ...state.ajustes,
            perfil: { ...state.ajustes.perfil, ...patch },
          },
        })),
      setFranjas: (franjas) =>
        set((state) => ({ ajustes: { ...state.ajustes, franjas } })),
      setFranjaActiva: (id) =>
        set((state) => ({ ajustes: { ...state.ajustes, franjaActivaId: id } })),
      toggleSubpestana: (id) =>
        set((state) => {
          const ocultas = state.ajustes.subpestanasOcultas;
          const nuevas = ocultas.includes(id)
            ? ocultas.filter((x) => x !== id)
            : [...ocultas, id];
          return { ajustes: { ...state.ajustes, subpestanasOcultas: nuevas } };
        }),
      setColorTabla: (nivel) =>
        set((state) => ({ ajustes: { ...state.ajustes, colorTabla: nivel } })),
      setFiltroFranja: (activo) =>
        set((state) => ({ ajustes: { ...state.ajustes, filtroFranja: activo } })),

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
            colorTabla: 'todo',
            filtroFranja: false,
          },
        })),

      exportState: () => {
        const s = get();
        return {
          version: PERSIST_VERSION,
          spots: s.spots,
          ajustes: s.ajustes,
          language: s.language,
          theme: s.theme,
        };
      },

      importState: (data) => {
        if (!esObjeto(data)) return { ok: false, motivo: 'no_es_objeto' };
        if (data.version !== PERSIST_VERSION)
          return { ok: false, motivo: 'version_incorrecta' };
        if (!Array.isArray(data.spots))
          return { ok: false, motivo: 'spots_no_array' };
        if (data.spots.length > 6)
          return { ok: false, motivo: 'spots_no_array' };
        for (const s of data.spots) {
          if (!validarSpot(s)) return { ok: false, motivo: 'spot_mal_formado' };
        }
        if (!esObjeto(data.ajustes))
          return { ok: false, motivo: 'ajustes_mal_formados' };
        if (!validarAjustes(data.ajustes)) {
          const aj = data.ajustes as Record<string, unknown>;
          if (Array.isArray(aj.franjas) && !aj.franjas.every(validarFranja)) {
            return { ok: false, motivo: 'franjas_mal_formadas' };
          }
          if (!validarPerfil(aj.perfil))
            return { ok: false, motivo: 'perfil_mal_formado' };
          return { ok: false, motivo: 'ajustes_mal_formados' };
        }

        const lang =
          data.language === 'es' || data.language === 'en'
            ? data.language
            : undefined;
        const theme =
          data.theme === 'dark' || data.theme === 'light'
            ? data.theme
            : undefined;

        const ajustesImportados = data.ajustes as AjustesApp;
        const ajustesConDefaults: AjustesApp = {
          ...ajustesImportados,
          colorTabla: ajustesImportados.colorTabla ?? 'todo',
          filtroFranja: ajustesImportados.filtroFranja ?? false,
        };

        set(() => ({
          spots: data.spots as Spot[],
          weather: {},
          ajustes: ajustesConDefaults,
          ...(lang ? { language: lang } : {}),
          ...(theme ? { theme } : {}),
        }));

        if (lang) void i18n.changeLanguage(lang);

        return { ok: true, spotsImportados: (data.spots as Spot[]).length };
      },
    }),
    {
      name: STORAGE_KEY,
      version: PERSIST_VERSION,
    }
  )
);