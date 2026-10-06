// src/lib/verdict.ts
// WKF — Núcleo de cálculo de veredictos.
// Sin cambios en v1.010.

import {
  UMBRALES_BASE,
  type Umbral,
  type ZonaTabla,
  type CategoriaKayakTabla,
  type NivelExperienciaTabla,
  type FranjaDiaTabla,
  type TipoAccesoTabla,
} from './verdict-tabla.ts';

export type Zona = ZonaTabla;
export type CategoriaKayak = CategoriaKayakTabla;
export type NivelExperiencia = NivelExperienciaTabla;
export type FranjaDia = FranjaDiaTabla;
export type TipoAcceso = TipoAccesoTabla;

export type Veredicto =
  | 'FAVORABLE'
  | 'ACEPTABLE'
  | 'EXIGENTE'
  | 'DESACONSEJADO';

export type VeredictoAcceso = 'SEGURA' | 'VIGILAR' | 'DIFICIL' | 'NO_SALIR';

export type { Umbral };

export interface Condiciones {
  viento: number;
  ola: number;
  periodo: number;
  corriente: number;
  marea: number;
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

export type ClaveEquipo =
  | 'vhf'
  | 'remoRepuesto'
  | 'ropaSeca'
  | 'compartimentosEstancos';

export const AJUSTE_EQUIPO: Record<ClaveEquipo, { viento: number }> = {
  vhf: { viento: 0.5 },
  remoRepuesto: { viento: 0.5 },
  ropaSeca: { viento: 0.5 },
  compartimentosEstancos: { viento: 0.5 },
};

export const AJUSTE_EQUIPO_NEGATIVO: Record<ClaveEquipo, { viento: number }> = {
  vhf: { viento: -0.5 },
  remoRepuesto: { viento: -0.5 },
  ropaSeca: { viento: -0.5 },
  compartimentosEstancos: { viento: -0.5 },
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

function evaluarFactor(
  valor: number,
  umbral: { fav: number; ace: number; exi: number; des: number },
  invertido = false
): Veredicto {
  if (invertido) {
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
  ajuste: number
): { fav: number; ace: number; exi: number; des: number } {
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
  ajEquipoViento += perfil.vhf
    ? AJUSTE_EQUIPO.vhf.viento
    : AJUSTE_EQUIPO_NEGATIVO.vhf.viento;
  ajEquipoViento += perfil.remoRepuesto
    ? AJUSTE_EQUIPO.remoRepuesto.viento
    : AJUSTE_EQUIPO_NEGATIVO.remoRepuesto.viento;
  ajEquipoViento += perfil.ropaSeca
    ? AJUSTE_EQUIPO.ropaSeca.viento
    : AJUSTE_EQUIPO_NEGATIVO.ropaSeca.viento;
  ajEquipoViento += perfil.compartimentosEstancos
    ? AJUSTE_EQUIPO.compartimentosEstancos.viento
    : AJUSTE_EQUIPO_NEGATIVO.compartimentosEstancos.viento;

  const umbralAplicado: Umbral = {
    viento: aplicarAjuste(
      base.viento,
      ajPerfil.viento + ajFranja.viento + ajEquipoViento
    ),
    ola: aplicarAjuste(base.ola, ajPerfil.ola + ajFranja.ola),
    periodo: aplicarAjuste(base.periodo, ajPerfil.periodo),
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