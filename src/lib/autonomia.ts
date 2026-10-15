// src/lib/autonomia.ts
// WKF — Calculadora experimental de autonomía y velocidad de crucero
// para kayaks, patos y canoas con motor eléctrico.
//
// ADVERTENCIA: es una estimación. La autonomía real depende del viento,
// la corriente, el peso total, la eficiencia de la hélice, el estado de
// la batería y el estilo de conducción. No sustituye a las pruebas
// reales ni a los datos del fabricante.
//
// Método de cálculo:
//   1. Energía útil de la batería (Wh) = capacidadAh × voltajeV.
//   2. Solo se puede usar ~80% de la energía nominal (regla de
//      profundidad de descarga segura para no dañar la batería).
//   3. Potencia consumida (W) = voltaje × amperaje del motor.
//   4. Autonomía (h) = energía útil × eficiencia_hélice / potencia.
//   5. Velocidad estimada: se deriva del empuje con una fórmula
//      empírica que asume casco de kayak medio.
//
// Aviso legal: es experimental. Lo dice la UI en cada cálculo.

import type { MotorElectrico, BateriaElectrica } from './motores-electricos.ts';
import {
  estimarAmperajePorEmpuje,
  estimarPotencia,
} from './motores-electricos.ts';

export interface EntradaAutonomia {
  motor: MotorElectrico | null;
  motorCustom: {
    empujeLbs: number;
    voltajeV: number;
    amperajeCruceroA: number | null;
  } | null;
  bateria: BateriaElectrica | null;
  bateriaCustom: {
    quimica: 'litio' | 'agm' | 'gel';
    voltajeV: number;
    capacidadAh: number;
    pesoKg: number;
  } | null;
  /** Peso total del conjunto: kayak + motor + batería + kayakista + equipo. kg */
  pesoTotalKg: number;
}

export interface ResultadoModo {
  /** Velocidad estimada en nudos. */
  velocidadKt: number;
  /** Autonomía estimada en horas. */
  autonomiaHoras: number;
  /** Autonomía estimada en millas náuticas. */
  autonomiaMillas: number;
  /** Consumo del motor a esa velocidad, en amperios. */
  amperajeA: number;
  /** Potencia del motor a esa velocidad, en vatios. */
  potenciaW: number;
}

export interface ResultadoAutonomia {
  modoMaximaAutonomia: ResultadoModo;
  modoCrucero: ResultadoModo;
  /** Energía útil de la batería en Wh (después de aplicar 80% DoD). */
  energiaUtilWh: number;
  /** Eficiencia de hélice aplicada. Entre 0.35 y 0.55. */
  eficienciaHelice: number;
  /** Peso total aplicado. */
  pesoTotalKg: number;
}

/** Eficiencia estimada según la calidad del conjunto. Se usa un valor
 *  conservador por defecto. En el futuro, el usuario podría ajustarlo. */
const EFICIENCIA_HÉLICE_DEFECTO = 0.45;
const PROFUNDIDAD_DESCARGA = 0.8;

/** Factor de empuje a velocidad de crucero. Los motores eléctricos de
 *  kayak rinden mejor al 60-70% de su potencia máxima. */
const FACTOR_CRUCERO = 0.65;
const FACTOR_MAXIMA_AUTONOMIA = 0.35;

/** Convierte empuje (lbs) a velocidad estimada (nudos) para un kayak
 *  medio. Fórmula empírica. Relación no lineal porque la resistencia
 *  al avance crece más rápido que el empuje. */
function empujeAVelocidad(empujeLbs: number, factorPotencia: number): number {
  if (empujeLbs <= 0) return 0;
  const empujeEfectivo = empujeLbs * factorPotencia;
  // Regla empírica: 1 nudo por cada 8-10 lbs de empuje efectivo en kayak medio.
  // Se aplica un exponente para simular la resistencia no lineal.
  const velocidad = Math.pow(empujeEfectivo / 8, 0.85);
  return Math.round(velocidad * 100) / 100;
}

export function calcularAutonomia(entrada: EntradaAutonomia): ResultadoAutonomia | null {
  const { motor, motorCustom, bateria, bateriaCustom, pesoTotalKg } = entrada;

  // Determinar empuje, voltaje y amperaje del motor.
  let empujeLbs = 0;
  let voltajeMotorV = 12;
  let amperajeCruceroA = 0;

  if (motor && !motor.generico) {
    empujeLbs = motor.empujeLbs;
    voltajeMotorV = motor.voltajeV;
    amperajeCruceroA = motor.amperajeCruceroA ?? estimarAmperajePorEmpuje(motor.empujeLbs, motor.voltajeV);
  } else if (motorCustom) {
    empujeLbs = motorCustom.empujeLbs;
    voltajeMotorV = motorCustom.voltajeV;
    amperajeCruceroA = motorCustom.amperajeCruceroA ?? estimarAmperajePorEmpuje(motorCustom.empujeLbs, motorCustom.voltajeV);
  } else {
    return null;
  }

  if (empujeLbs <= 0 || amperajeCruceroA <= 0) return null;

  // Determinar capacidad y voltaje de la batería.
  let capacidadAh = 0;
  let voltajeBateriaV = 12;

  if (bateria && !bateria.generico) {
    capacidadAh = bateria.capacidadAh;
    voltajeBateriaV = bateria.voltajeV;
  } else if (bateriaCustom) {
    capacidadAh = bateriaCustom.capacidadAh;
    voltajeBateriaV = bateriaCustom.voltajeV;
  } else if (bateria && bateria.generico && bateria.capacidadAh > 0) {
    capacidadAh = bateria.capacidadAh;
    voltajeBateriaV = bateria.voltajeV;
  } else {
    return null;
  }

  if (capacidadAh <= 0) return null;

  // Energía útil de la batería.
  const energiaNominalWh = capacidadAh * voltajeBateriaV;
  const energiaUtilWh = energiaNominalWh * PROFUNDIDAD_DESCARGA;

  const eficiencia = EFICIENCIA_HÉLICE_DEFECTO;

  // Modo máxima autonomía: se usa el 35% de la potencia.
  const empujeMaxAut = empujeLbs * FACTOR_MAXIMA_AUTONOMIA;
  const amperajeMaxAut = amperajeCruceroA * FACTOR_MAXIMA_AUTONOMIA;
  const potenciaMaxAut = estimarPotencia(voltajeBateriaV, amperajeMaxAut);
  const horasMaxAut = potenciaMaxAut > 0
    ? (energiaUtilWh * eficiencia) / potenciaMaxAut
    : 0;
  const velocidadMaxAut = empujeAVelocidad(empujeLbs, FACTOR_MAXIMA_AUTONOMIA);
  const millasMaxAut = velocidadMaxAut * horasMaxAut;

  // Modo crucero: se usa el 65% de la potencia.
  const empujeCrucero = empujeLbs * FACTOR_CRUCERO;
  const amperajeCruceroReal = amperajeCruceroA * FACTOR_CRUCERO;
  const potenciaCrucero = estimarPotencia(voltajeBateriaV, amperajeCruceroReal);
  const horasCrucero = potenciaCrucero > 0
    ? (energiaUtilWh * eficiencia) / potenciaCrucero
    : 0;
  const velocidadCrucero = empujeAVelocidad(empujeLbs, FACTOR_CRUCERO);
  const millasCrucero = velocidadCrucero * horasCrucero;

  // Ajuste por peso: a más peso, menos velocidad y menos autonomía.
  // Referencia: 150 kg. A más peso, se aplica un factor.
  const factorPeso = Math.max(0.5, Math.min(1.2, 150 / Math.max(pesoTotalKg, 60)));

  return {
    modoMaximaAutonomia: {
      velocidadKt: Math.round(velocidadMaxAut * factorPeso * 100) / 100,
      autonomiaHoras: Math.round(horasMaxAut * factorPeso * 100) / 100,
      autonomiaMillas: Math.round(millasMaxAut * factorPeso * 100) / 100,
      amperajeA: Math.round(amperajeMaxAut * 10) / 10,
      potenciaW: Math.round(potenciaMaxAut),
    },
    modoCrucero: {
      velocidadKt: Math.round(velocidadCrucero * factorPeso * 100) / 100,
      autonomiaHoras: Math.round(horasCrucero * factorPeso * 100) / 100,
      autonomiaMillas: Math.round(millasCrucero * factorPeso * 100) / 100,
      amperajeA: Math.round(amperajeCruceroReal * 10) / 10,
      potenciaW: Math.round(potenciaCrucero),
    },
    energiaUtilWh: Math.round(energiaUtilWh),
    eficienciaHelice: eficiencia,
    pesoTotalKg: Math.round(pesoTotalKg),
  };
}