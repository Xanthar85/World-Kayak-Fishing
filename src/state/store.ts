// WKF — Estado global Zustand con persistencia en localStorage.
// Persist version 2. Clave "wkf-state-v1".
// v1.009: importState con validación estricta (version, shape de
// spots, shape de ajustes). Rechaza el fichero entero si algo no
// cuadra. Devuelve un resultado tipado para que la UI pueda mostrar
// el motivo real del fallo.

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

// ─── Tipos públicos ────────────────────────────────────────────────

export interface Spot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  createdAt: number;
  zona?: Zona;
  tipoAcceso?: TipoAcceso | null;
  profundidad?: number | null;
  accesoLat?: number | null;
  accesoLon?: number | null;
  accesoProfundidad?: number | null;
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
}

// Resultado tipado de importState.
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

// ─── Constantes ────────────────────────────────────────────────────

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

// ─── Validadores ───────────────────────────────────────────────────

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

  // Campos opcionales: si vienen, deben ser del tipo correcto.
  if (raw.zona !== undefined && typeof raw.zona !== 'string') return false;
  if (
    raw.tipoAcceso !== undefined &&
    raw.tipoAcceso !== null &&
    (typeof raw.tipoAcceso !== 'string' ||
      !TIPOS_ACCESO_VALIDOS.includes(raw.tipoAcceso as TipoAcceso))
  ) {
    return false;
  }
  if (
    raw.profundidad !== undefined &&
    raw.profundidad !== null &&
    !esNumeroFinito(raw.profundidad)
  ) {
    return false;
  }
  if (
    raw.accesoLat !== undefined &&
    raw.accesoLat !== null &&
    !esNumeroFinito(raw.accesoLat)
  ) {
    return false;
  }
  if (
    raw.accesoLon !== undefined &&
    raw.accesoLon !== null &&
    !esNumeroFinito(raw.accesoLon)
  ) {
    return false;
  }
  if (
    raw.accesoProfundidad !== undefined &&
    raw.accesoProfundidad !== null &&
    !esNumeroFinito(raw.accesoProfundidad)
  ) {
    return false;
  }

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
  ) {
    return false;
  }
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
  ) {
    return false;
  }

  if (!Array.isArray(raw.kayakIds)) return false;
  if (raw.kayakIds.length > 2) return false;
  if (!raw.kayakIds.every((id) => typeof id === 'string')) return false;

  if (
    typeof raw.categoriaKayak !== 'string' ||
    !CATEGORIAS_VALIDAS.includes(raw.categoriaKayak as CategoriaKayak)
  ) {
    return false;
  }

  if (!validarPerfil(raw.perfil)) return false;

  if (!Array.isArray(raw.franjas)) return false;
  if (raw.franjas.length < 1 || raw.franjas.length > 4) return false;
  if (!raw.franjas.every(validarFranja)) return false;

  if (
    raw.franjaActivaId !== null &&
    typeof raw.franjaActivaId !== 'string'
  ) {
    return false;
  }

  if (!Array.isArray(raw.subpestanasOcultas)) return false;
  if (!raw.subpestanasOcultas.every((id) => typeof id === 'string')) {
    return false;
  }

  return true;
}

// ─── Estado ────────────────────────────────────────────────────────

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
          version: PERSIST_VERSION,
          spots: s.spots,
          ajustes: s.ajustes,
          language: s.language,
          theme: s.theme,
        };
      },

      importState: (data) => {
        // 1. Debe ser un objeto plano.
        if (!esObjeto(data)) {
          return { ok: false, motivo: 'no_es_objeto' };
        }

        // 2. Version exacta.
        if (data.version !== PERSIST_VERSION) {
          return { ok: false, motivo: 'version_incorrecta' };
        }

        // 3. spots: array de spots bien formados.
        if (!Array.isArray(data.spots)) {
          return { ok: false, motivo: 'spots_no_array' };
        }
        if (data.spots.length > 6) {
          return { ok: false, motivo: 'spots_no_array' };
        }
        for (const s of data.spots) {
          if (!validarSpot(s)) {
            return { ok: false, motivo: 'spot_mal_formado' };
          }
        }

        // 4. ajustes: objeto con forma válida.
        if (!esObjeto(data.ajustes)) {
          return { ok: false, motivo: 'ajustes_mal_formados' };
        }
        if (!validarAjustes(data.ajustes)) {
          // Distinguir el motivo concreto para dar mensaje útil.
          const aj = data.ajustes as Record<string, unknown>;
          if (Array.isArray(aj.franjas) && !aj.franjas.every(validarFranja)) {
            return { ok: false, motivo: 'franjas_mal_formadas' };
          }
          if (!validarPerfil(aj.perfil)) {
            return { ok: false, motivo: 'perfil_mal_formado' };
          }
          return { ok: false, motivo: 'ajustes_mal_formados' };
        }

        // 5. Idioma y tema opcionales, si vienen deben ser válidos.
        const lang =
          data.language === 'es' || data.language === 'en'
            ? data.language
            : undefined;
        const theme =
          data.theme === 'dark' || data.theme === 'light'
            ? data.theme
            : undefined;

        // 6. Aplicar. Los spots vienen ya validados: se sustituyen
        //    enteros. Los ajustes se sustituyen enteros (ya validados).
        //    El weather se limpia (los IDs cambian o caducan).
        set(() => ({
          spots: data.spots as Spot[],
          weather: {},
          ajustes: data.ajustes as AjustesApp,
          ...(lang ? { language: lang } : {}),
          ...(theme ? { theme } : {}),
        }));

        if (lang) {
          void i18n.changeLanguage(lang);
        }

        return { ok: true, spotsImportados: (data.spots as Spot[]).length };
      },
    }),
    {
      name: STORAGE_KEY,
      version: PERSIST_VERSION,
    }
  )
);