// WKF — Núcleo de cálculo de veredictos.
// Generado a partir de InformeDeUmbralesSeguridad v2.
// No modificar las tablas sin actualizar el informe.

// ─── TIPOS ────────────────────────────────────────────────────────

export type Zona =
  | 'mediterraneo_espanol'
  | 'mediterraneo_frances'
  | 'mediterraneo_italiano'
  | 'mediterraneo_griego'
  | 'mediterraneo_turco'
  | 'mediterraneo_norteafricano'
  | 'mar_marmara'
  | 'mar_adriatico'
  | 'mar_egeo'
  | 'mar_negro'
  | 'atlantico_norte_espanol'
  | 'atlantico_portugues'
  | 'atlantico_frances_bretana'
  | 'canal_mancha'
  | 'mar_irlanda'
  | 'mar_celtico'
  | 'atlantico_britanico'
  | 'mar_noruega'
  | 'mar_barents_sur'
  | 'mar_baltico'
  | 'mar_del_norte'
  | 'islandia'
  | 'azores'
  | 'madeira'
  | 'canarias'
  | 'pacifico_americano'
  | 'pacifico_washington'
  | 'columbia_britanica'
  | 'alaska_sur'
  | 'atlantico_canadiense'
  | 'atlantico_usa_maine_massachusetts'
  | 'atlantico_usa_carolinas_florida'
  | 'golfo_mexico'
  | 'grandes_lagos'
  | 'chesapeake_long_island'
  | 'pacifico_mexicano'
  | 'golfo_california'
  | 'pacifico_centroamericano'
  | 'caribe_mexicano'
  | 'caribe_insular'
  | 'caribe_sur'
  | 'pacifico_sudamericano'
  | 'atlantico_sudamericano'
  | 'patagonia_pacifico'
  | 'patagonia_atlantico'
  | 'costa_este_australia'
  | 'costa_sur_australia'
  | 'costa_oeste_australia'
  | 'costa_norte_australia'
  | 'nueva_zelanda'
  | 'papua_nueva_guinea'
  | 'fiyi'
  | 'polinesia_francesa'
  | 'japon_pacifico'
  | 'japon_mar_japon'
  | 'corea_sur'
  | 'china_costera'
  | 'taiwan'
  | 'hong_kong'
  | 'vietnam'
  | 'tailandia_golfo'
  | 'tailandia_andaman'
  | 'malasia_peninsular'
  | 'malasia_borneo'
  | 'indonesia_bali'
  | 'indonesia_java'
  | 'indonesia_sumatra'
  | 'indonesia_sulawesi'
  | 'indonesia_flores'
  | 'filipinas'
  | 'india'
  | 'sri_lanka'
  | 'maldivas'
  | 'emiratos_arabes_unidos'
  | 'oman'
  | 'mar_rojo'
  | 'marruecos_atlantico'
  | 'sahara_occidental'
  | 'senegal'
  | 'costa_marfil'
  | 'ghana'
  | 'nigeria'
  | 'camerun'
  | 'angola'
  | 'namibia'
  | 'sudafrica_atlantico'
  | 'sudafrica_indico'
  | 'mozambique'
  | 'tanzania'
  | 'kenia'
  | 'somalia'
  | 'eritrea'
  | 'mar_rojo_africano'
  | 'madagascar'
  | 'mauricio'
  | 'reunion'
  | 'seychelles'
  | 'mar_artico'
  | 'groenlandia_sur';

export type CategoriaKayak = 'K1' | 'K2' | 'K3' | 'K4' | 'K5';

export type NivelExperiencia =
  | 'novel'
  | 'principiante'
  | 'intermedio'
  | 'avanzado'
  | 'experto';

export type FranjaDia = 'manana' | 'tarde' | 'noche';

export type Veredicto =
  | 'FAVORABLE'
  | 'ACEPTABLE'
  | 'EXIGENTE'
  | 'DESACONSEJADO';

export type TipoAcceso =
  | 'playa'
  | 'roca'
  | 'puerto_escollera'
  | 'otro';

export type VeredictoAcceso =
  | 'SEGURA'
  | 'VIGILAR'
  | 'DIFICIL'
  | 'NO_SALIR';

export interface Umbral {
  viento: { fav: number; ace: number; exi: number; des: number };
  ola: { fav: number; ace: number; exi: number; des: number };
  periodo: { fav: number; ace: number; exi: number; des: number };
  corriente: { fav: number; ace: number; exi: number; des: number };
  marea: { fav: number; ace: number; exi: number; des: number };
}

export interface Condiciones {
  viento: number; // Bf
  ola: number; // m
  periodo: number; // s
  corriente: number; // nudos
  marea: number; // m
}

export interface PerfilKayakista {
  experiencia: NivelExperiencia;
  vhf: boolean;
  remoRepuesto: boolean;
  ropaSeca: boolean;
  compartimentosEstancos: boolean;
}

export interface ResultadoVeredicto {
  veredicto: Veredicto;
  factorDisparador: keyof Umbral | null;
  veredictoPorFactor: {
    viento: Veredicto;
    ola: Veredicto;
    periodo: Veredicto;
    corriente: Veredicto;
    marea: Veredicto;
  };
  umbralAplicado: Umbral;
}

// ─── CONSTANTES ───────────────────────────────────────────────────

export const ZONAS: Zona[] = [
  'mediterraneo_espanol',
  'mediterraneo_frances',
  'mediterraneo_italiano',
  'mediterraneo_griego',
  'mediterraneo_turco',
  'mediterraneo_norteafricano',
  'mar_marmara',
  'mar_adriatico',
  'mar_egeo',
  'mar_negro',
  'atlantico_norte_espanol',
  'atlantico_portugues',
  'atlantico_frances_bretana',
  'canal_mancha',
  'mar_irlanda',
  'mar_celtico',
  'atlantico_britanico',
  'mar_noruega',
  'mar_barents_sur',
  'mar_baltico',
  'mar_del_norte',
  'islandia',
  'azores',
  'madeira',
  'canarias',
  'pacifico_americano',
  'pacifico_washington',
  'columbia_britanica',
  'alaska_sur',
  'atlantico_canadiense',
  'atlantico_usa_maine_massachusetts',
  'atlantico_usa_carolinas_florida',
  'golfo_mexico',
  'grandes_lagos',
  'chesapeake_long_island',
  'pacifico_mexicano',
  'golfo_california',
  'pacifico_centroamericano',
  'caribe_mexicano',
  'caribe_insular',
  'caribe_sur',
  'pacifico_sudamericano',
  'atlantico_sudamericano',
  'patagonia_pacifico',
  'patagonia_atlantico',
  'costa_este_australia',
  'costa_sur_australia',
  'costa_oeste_australia',
  'costa_norte_australia',
  'nueva_zelanda',
  'papua_nueva_guinea',
  'fiyi',
  'polinesia_francesa',
  'japon_pacifico',
  'japon_mar_japon',
  'corea_sur',
  'china_costera',
  'taiwan',
  'hong_kong',
  'vietnam',
  'tailandia_golfo',
  'tailandia_andaman',
  'malasia_peninsular',
  'malasia_borneo',
  'indonesia_bali',
  'indonesia_java',
  'indonesia_sumatra',
  'indonesia_sulawesi',
  'indonesia_flores',
  'filipinas',
  'india',
  'sri_lanka',
  'maldivas',
  'emiratos_arabes_unidos',
  'oman',
  'mar_rojo',
  'marruecos_atlantico',
  'sahara_occidental',
  'senegal',
  'costa_marfil',
  'ghana',
  'nigeria',
  'camerun',
  'angola',
  'namibia',
  'sudafrica_atlantico',
  'sudafrica_indico',
  'mozambique',
  'tanzania',
  'kenia',
  'somalia',
  'eritrea',
  'mar_rojo_africano',
  'madagascar',
  'mauricio',
  'reunion',
  'seychelles',
  'mar_artico',
  'groenlandia_sur',
];

export const CATEGORIAS_KAYAK: CategoriaKayak[] = ['K1', 'K2', 'K3', 'K4', 'K5'];

export const NIVELES_EXPERIENCIA: NivelExperiencia[] = [
  'novel',
  'principiante',
  'intermedio',
  'avanzado',
  'experto',
];

export const FRANJAS_DIA: FranjaDia[] = ['manana', 'tarde', 'noche'];

export const VEREDICTOS: Veredicto[] = [
  'FAVORABLE',
  'ACEPTABLE',
  'EXIGENTE',
  'DESACONSEJADO',
];

export const TIPOS_ACCESO: TipoAcceso[] = [
  'playa',
  'roca',
  'puerto_escollera',
  'otro',
];

export const VEREDICTOS_ACCESO: VeredictoAcceso[] = [
  'SEGURA',
  'VIGILAR',
  'DIFICIL',
  'NO_SALIR',
];

// ─── TABLA DE UMBRALES BASE ───────────────────────────────────────
// Formato: UMBRALES_BASE[zona][categoria] = Umbral
// Valores en: viento (Bf), ola (m), periodo (s), corriente (nudos),
//             marea (m).
// Nivel base: Intermedio. Franja base: Mañana.
// Los ajustes por perfil, franja y equipo se aplican después.

export const UMBRALES_BASE: Record<Zona, Record<CategoriaKayak, Umbral>> = {
  mediterraneo_espanol: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
  },
  mediterraneo_frances: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
  },
  mediterraneo_italiano: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.5, exi: 0.7, des: 1.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.5, exi: 0.7, des: 1.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.5, exi: 0.7, des: 1.0 } },
  },
  mediterraneo_griego: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
  },
  mediterraneo_turco: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
  },
  mediterraneo_norteafricano: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
  },
  mar_marmara: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 4, ace: 3, exi: 2, des: 1 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K3: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 4, ace: 3, exi: 2, des: 1 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.0 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 4, ace: 3, exi: 2, des: 1 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.4 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 4, ace: 3, exi: 2, des: 1 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.6 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
  },
  mar_adriatico: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.5, exi: 0.7, des: 1.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.5, exi: 0.7, des: 1.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.5, exi: 0.7, des: 1.0 } },
  },
  mar_egeo: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 7, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.6 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.7 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.7, des: 2.2 }, marea: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.8 } },
  },
  mar_negro: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
  },
  atlantico_norte_espanol: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  atlantico_portugues: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  atlantico_frances_bretana: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
  },
  canal_mancha: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.5, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.8, exi: 2.5, des: 3.5 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 2.0, exi: 2.8, des: 3.8 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
  },
  mar_irlanda: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
  },
  mar_celtico: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 6.0 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 6.0 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
  },
  atlantico_britanico: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
  },
  mar_noruega: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.4, exi: 0.8, des: 1.2 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.5, exi: 1.0, des: 1.5 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.2, des: 1.8 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.4, des: 2.1 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.8, exi: 1.6, des: 2.4 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  mar_barents_sur: {
    K1: { viento: { fav: 0, ace: 1, exi: 2, des: 3 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.5 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.5 } },
    K3: { viento: { fav: 0, ace: 2, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.2, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.2, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.2, exi: 2.0, des: 3.0 } },
  },
  mar_baltico: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
  },
  mar_del_norte: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  islandia: {
    K1: { viento: { fav: 0, ace: 1, exi: 2, des: 3 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 2, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  azores: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  madeira: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  canarias: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  pacifico_americano: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  pacifico_washington: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.7, des: 1.1 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.8, des: 1.2 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 1.0, des: 1.5 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.2, des: 1.8 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.4, des: 2.1 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  columbia_britanica: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
  },
  alaska_sur: {
    K1: { viento: { fav: 0, ace: 1, exi: 2, des: 3 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K3: { viento: { fav: 0, ace: 2, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
  },
  atlantico_canadiense: {
    K1: { viento: { fav: 0, ace: 1, exi: 2, des: 3 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K3: { viento: { fav: 0, ace: 2, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.5, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.8, exi: 2.5, des: 3.5 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 2.0, exi: 2.8, des: 3.8 }, marea: { fav: 0.0, ace: 4.0, exi: 6.0, des: 9.0 } },
  },
  atlantico_usa_maine_massachusetts: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  atlantico_usa_carolinas_florida: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  golfo_mexico: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
  },
  grandes_lagos: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.5 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.8 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.9, exi: 1.6, des: 2.0 }, marea: { fav: 0.0, ace: 0.1, exi: 0.2, des: 0.3 } },
  },
  chesapeake_long_island: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 4, ace: 3, exi: 2, des: 1 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 4, ace: 3, exi: 2, des: 1 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 4, ace: 3, exi: 2, des: 1 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.0 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 4, ace: 3, exi: 2, des: 1 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.2 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
  },
  pacifico_mexicano: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  golfo_california: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  pacifico_centroamericano: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  caribe_mexicano: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.2 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
  },
  caribe_insular: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 7, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
  },
  caribe_sur: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 7, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
  },
  pacifico_sudamericano: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  atlantico_sudamericano: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  patagonia_pacifico: {
    K1: { viento: { fav: 0, ace: 1, exi: 2, des: 3 }, ola: { fav: 0.0, ace: 0.4, exi: 0.8, des: 1.2 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.5, exi: 1.0, des: 1.5 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K3: { viento: { fav: 0, ace: 2, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.6, exi: 1.2, des: 1.8 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.5, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.7, exi: 1.4, des: 2.1 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.8, exi: 2.5, des: 3.5 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.8, exi: 1.6, des: 2.4 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 2.0, exi: 2.8, des: 3.8 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
  },
  patagonia_atlantico: {
    K1: { viento: { fav: 0, ace: 1, exi: 2, des: 3 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 6.0 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 6.0 } },
    K3: { viento: { fav: 0, ace: 2, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.5, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.8, exi: 2.5, des: 3.5 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 2.0, exi: 2.8, des: 3.8 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
  },
  costa_este_australia: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  costa_sur_australia: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  costa_oeste_australia: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
  },
  costa_norte_australia: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 6.0 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.5, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 6.0 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.8, exi: 2.5, des: 3.5 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 2.0, exi: 2.8, des: 3.8 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 2.2, exi: 3.0, des: 4.0 }, marea: { fav: 0.0, ace: 3.0, exi: 5.0, des: 7.0 } },
  },
  nueva_zelanda: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  papua_nueva_guinea: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  fiyi: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  polinesia_francesa: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.2, exi: 0.3, des: 0.4 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.3, exi: 0.4, des: 0.5 } },
  },
  japon_pacifico: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  japon_mar_japon: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  corea_sur: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.5, des: 5.0 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.5, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.8, exi: 2.5, des: 3.5 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 2.0, exi: 2.8, des: 3.8 }, marea: { fav: 0.0, ace: 2.5, exi: 4.0, des: 5.5 } },
  },
  china_costera: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  taiwan: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  hong_kong: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  vietnam: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 7, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  tailandia_golfo: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  tailandia_andaman: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  malasia_peninsular: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  malasia_borneo: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 7, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  indonesia_bali: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  indonesia_java: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  indonesia_sumatra: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  indonesia_sulawesi: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  indonesia_flores: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  filipinas: {
    K1: { viento: { fav: 0, ace: 1, exi: 2, des: 3 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 2, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  india: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  sri_lanka: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  maldivas: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
  },
  emiratos_arabes_unidos: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  oman: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 7, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  mar_rojo: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
  },
  marruecos_atlantico: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  sahara_occidental: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  senegal: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  costa_marfil: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  ghana: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  nigeria: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  camerun: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  angola: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  namibia: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  sudafrica_atlantico: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  sudafrica_indico: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.5, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.8, exi: 2.5, des: 3.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 2.0, exi: 2.8, des: 3.8 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  mozambique: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 10, ace: 8, exi: 6, des: 5 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.5, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.8, exi: 2.5, des: 3.5 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 2.0, exi: 2.8, des: 3.8 }, marea: { fav: 0.0, ace: 1.5, exi: 2.0, des: 3.0 } },
  },
  tanzania: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  kenia: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  somalia: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.4, exi: 2.0, des: 2.8 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 7, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.6, exi: 2.2, des: 3.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
  eritrea: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
  },
  mar_rojo_africano: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.2, exi: 0.4, des: 0.6 }, periodo: { fav: 6, ace: 5, exi: 4, des: 3 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.3, exi: 0.5, des: 0.7 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.4, exi: 0.6, des: 0.9 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.1 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, periodo: { fav: 5, ace: 4, exi: 3, des: 2 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
  },
  madagascar: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.8, exi: 1.2, des: 1.8 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.2 } },
  },
  mauricio: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
  },
  reunion: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
  },
  seychelles: {
    K1: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K2: { viento: { fav: 0, ace: 3, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 0.5, exi: 0.8, des: 1.2 } },
    K3: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K4: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
    K5: { viento: { fav: 0, ace: 4, exi: 6, des: 7 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 0.7, exi: 1.0, des: 1.5 } },
  },
  mar_artico: {
    K1: { viento: { fav: 0, ace: 1, exi: 2, des: 3 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.5 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.0, exi: 1.5, des: 2.5 } },
    K3: { viento: { fav: 0, ace: 2, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 1.2, exi: 2.0, des: 3.0 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 1.2, exi: 2.0, des: 3.0 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 1.2, exi: 2.0, des: 3.0 } },
  },
  groenlandia_sur: {
    K1: { viento: { fav: 0, ace: 1, exi: 2, des: 3 }, ola: { fav: 0.0, ace: 0.3, exi: 0.6, des: 0.9 }, periodo: { fav: 9, ace: 7, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.6, exi: 1.0, des: 1.4 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K2: { viento: { fav: 0, ace: 2, exi: 3, des: 4 }, ola: { fav: 0.0, ace: 0.4, exi: 0.7, des: 1.0 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.7, exi: 1.2, des: 1.6 }, marea: { fav: 0.0, ace: 1.5, exi: 2.5, des: 3.5 } },
    K3: { viento: { fav: 0, ace: 2, exi: 4, des: 5 }, ola: { fav: 0.0, ace: 0.5, exi: 0.9, des: 1.3 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 0.8, exi: 1.4, des: 2.0 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K4: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.6, exi: 1.1, des: 1.6 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.0, exi: 1.6, des: 2.2 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
    K5: { viento: { fav: 0, ace: 3, exi: 5, des: 6 }, ola: { fav: 0.0, ace: 0.7, exi: 1.3, des: 1.9 }, periodo: { fav: 8, ace: 6, exi: 5, des: 4 }, corriente: { fav: 0.0, ace: 1.2, exi: 1.8, des: 2.5 }, marea: { fav: 0.0, ace: 2.0, exi: 3.0, des: 4.0 } },
  },
};

// ─── TABLAS DE AJUSTE ─────────────────────────────────────────────

export const AJUSTE_PERFIL: Record<
  NivelExperiencia,
  { viento: number; ola: number; periodo: number; corriente: number; marea: number }
> = {
  novel:        { viento: -2, ola: -0.5, periodo: 1,  corriente: -0.5, marea: -0.5 },
  principiante: { viento: -1, ola: -0.3, periodo: 0.5, corriente: -0.3, marea: -0.3 },
  intermedio:   { viento: 0,  ola: 0,   periodo: 0,  corriente: 0,   marea: 0 },
  avanzado:     { viento: 1,  ola: 0.3, periodo: -0.5, corriente: 0.3, marea: 0.3 },
  experto:      { viento: 2,  ola: 0.5, periodo: -1, corriente: 0.5, marea: 0.5 },
};

export const AJUSTE_FRANJA: Record<
  FranjaDia,
  { viento: number; ola: number; corriente: number }
> = {
  manana: { viento: 0,  ola: 0,   corriente: 0 },
  tarde:  { viento: -1, ola: -0.2, corriente: -0.2 },
  noche:  { viento: -1, ola: -0.2, corriente: -0.2 },
};

export const AJUSTE_EQUIPO: Record<
  'vhf' | 'remoRepuesto' | 'ropaSeca' | 'compartimentosEstancos',
  { viento: number }
> = {
  vhf: { viento: 0.5 },
  remoRepuesto: { viento: 0.5 },
  ropaSeca: { viento: 0.5 },
  compartimentosEstancos: { viento: 0.5 },
};

export const UMBRALES_ACCESO: Record<
  TipoAcceso,
  { segura: number; vigilar: number; dificil: number; noSalir: number }
> = {
  playa:            { segura: 0.3, vigilar: 0.6, dificil: 0.9, noSalir: 1.0 },
  roca:             { segura: 0.2, vigilar: 0.4, dificil: 0.6, noSalir: 0.7 },
  puerto_escollera: { segura: 0.3, vigilar: 0.5, dificil: 0.8, noSalir: 0.9 },
  otro:             { segura: 0.3, vigilar: 0.6, dificil: 0.9, noSalir: 1.0 },
};

// ─── FUNCIONES ────────────────────────────────────────────────────

function evaluarFactor(
  valor: number,
  umbral: { fav: number; ace: number; exi: number; des: number },
  invertido = false
): Veredicto {
  if (invertido) {
    // Para periodo: valores más altos son mejores.
    // fav es el mínimo, des es el máximo.
    if (valor >= umbral.fav) return 'FAVORABLE';
    if (valor >= umbral.ace) return 'ACEPTABLE';
    if (valor >= umbral.exi) return 'EXIGENTE';
    return 'DESACONSEJADO';
  }
  if (valor <= umbral.fav) return 'FAVORABLE';
  if (valor <= umbral.ace) return 'ACEPTABLE';
  if (valor <= umbral.exi) return 'EXIGENTE';
  return 'DESACONSEJADO';
}

function peorVeredicto(a: Veredicto, b: Veredicto): Veredicto {
  const orden: Veredicto[] = ['FAVORABLE', 'ACEPTABLE', 'EXIGENTE', 'DESACONSEJADO'];
  return orden.indexOf(a) >= orden.indexOf(b) ? a : b;
}

function aplicarAjuste(
  umbral: { fav: number; ace: number; exi: number; des: number },
  ajuste: number,
  invertido = false
): { fav: number; ace: number; exi: number; des: number } {
  if (invertido) {
    return {
      fav: umbral.fav + ajuste,
      ace: umbral.ace + ajuste,
      exi: umbral.exi + ajuste,
      des: umbral.des + ajuste,
    };
  }
  return {
    fav: umbral.fav + ajuste,
    ace: umbral.ace + ajuste,
    exi: umbral.exi + ajuste,
    des: umbral.des + ajuste,
  };
}

export function calcularVeredicto(
  zona: Zona,
  categoria: CategoriaKayak,
  perfil: PerfilKayakista,
  franja: FranjaDia,
  condiciones: Condiciones
): ResultadoVeredicto {
  const base = UMBRALES_BASE[zona][categoria];
  const ajPerfil = AJUSTE_PERFIL[perfil.experiencia];
  const ajFranja = AJUSTE_FRANJA[franja];

  let ajEquipoViento = 0;
  if (perfil.vhf) ajEquipoViento += AJUSTE_EQUIPO.vhf.viento;
  if (perfil.remoRepuesto) ajEquipoViento += AJUSTE_EQUIPO.remoRepuesto.viento;
  if (perfil.ropaSeca) ajEquipoViento += AJUSTE_EQUIPO.ropaSeca.viento;
  if (perfil.compartimentosEstancos)
    ajEquipoViento += AJUSTE_EQUIPO.compartimentosEstancos.viento;

  const umbralAplicado: Umbral = {
    viento: aplicarAjuste(
      base.viento,
      ajPerfil.viento + ajFranja.viento + ajEquipoViento
    ),
    ola: aplicarAjuste(base.ola, ajPerfil.ola + ajFranja.ola),
    periodo: aplicarAjuste(base.periodo, ajPerfil.periodo, true),
    corriente: aplicarAjuste(base.corriente, ajPerfil.corriente + ajFranja.corriente),
    marea: aplicarAjuste(base.marea, ajPerfil.marea),
  };

  const vViento = evaluarFactor(condiciones.viento, umbralAplicado.viento);
  const vOla = evaluarFactor(condiciones.ola, umbralAplicado.ola);
  const vPeriodo = evaluarFactor(condiciones.periodo, umbralAplicado.periodo, true);
  const vCorriente = evaluarFactor(condiciones.corriente, umbralAplicado.corriente);
  const vMarea = evaluarFactor(condiciones.marea, umbralAplicado.marea);

  let veredicto: Veredicto = 'FAVORABLE';
  veredicto = peorVeredicto(veredicto, vViento);
  veredicto = peorVeredicto(veredicto, vOla);
  veredicto = peorVeredicto(veredicto, vPeriodo);
  veredicto = peorVeredicto(veredicto, vCorriente);
  veredicto = peorVeredicto(veredicto, vMarea);

  let factorDisparador: keyof Umbral | null = null;
  if (veredicto === 'EXIGENTE' || veredicto === 'DESACONSEJADO') {
    if (vViento === veredicto) factorDisparador = 'viento';
    else if (vOla === veredicto) factorDisparador = 'ola';
    else if (vPeriodo === veredicto) factorDisparador = 'periodo';
    else if (vCorriente === veredicto) factorDisparador = 'corriente';
    else if (vMarea === veredicto) factorDisparador = 'marea';
  }

  return {
    veredicto,
    factorDisparador,
    veredictoPorFactor: {
      viento: vViento,
      ola: vOla,
      periodo: vPeriodo,
      corriente: vCorriente,
      marea: vMarea,
    },
    umbralAplicado,
  };
}

export function calcularVeredictoAcceso(
  tipoAcceso: TipoAcceso,
  olaCorregida: number
): VeredictoAcceso {
  const u = UMBRALES_ACCESO[tipoAcceso];
  if (olaCorregida <= u.segura) return 'SEGURA';
  if (olaCorregida <= u.vigilar) return 'VIGILAR';
  if (olaCorregida <= u.dificil) return 'DIFICIL';
  return 'NO_SALIR';
}
