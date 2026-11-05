import { ENTRENADORES } from './athletes'

export const EVALUADORES = ENTRENADORES.filter((e) => e !== 'Sin asignar')

// Pruebas físicas estándar de la evaluación inicial.
export const TESTS = [
  { key: 'resistencia', label: 'Resistencia · Test de Cooper (12 min)', short: 'Resistencia', unit: 'm', step: '1' },
  { key: 'velocidad', label: 'Velocidad · 30 metros planos', short: 'Velocidad', unit: 's', step: '0.01' },
  { key: 'saltoVertical', label: 'Fuerza · Salto vertical', short: 'Salto vertical', unit: 'cm', step: '0.1' },
  { key: 'flexiones', label: 'Fuerza · Flexiones de brazos (1 min)', short: 'Flexiones', unit: 'rep', step: '1' },
  { key: 'flexibilidad', label: 'Flexibilidad · Sit and reach', short: 'Flexibilidad', unit: 'cm', step: '0.1' },
]

export const INITIAL_TESTS_KEY = 'deportivo.initialTests'

export function loadInitialTests() {
  try {
    const raw = sessionStorage.getItem(INITIAL_TESTS_KEY)
    return raw ? JSON.parse(raw) : INITIAL_TESTS
  } catch {
    return INITIAL_TESTS
  }
}

export const INITIAL_TESTS = [
  { id: 1, athleteId: 1, fecha: '2026-10-12', evaluador: 'Luis Sánchez', resistencia: 2850, velocidad: 4.35, saltoVertical: 52, flexiones: 38, flexibilidad: 14, observaciones: 'Buena base aeróbica. Mejorar flexibilidad.' },
  { id: 2, athleteId: 2, fecha: '2026-10-14', evaluador: 'Gabriela Delgado', resistencia: 2400, velocidad: 4.9, saltoVertical: 41, flexiones: 22, flexibilidad: 19, observaciones: '' },
]
