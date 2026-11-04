export const SEXES = ['Masculino', 'Femenino']

// Indicadores físicos: puntaje de 0 a 100.
export const PHYSICAL = [
  { key: 'resistencia', label: 'Resistencia' },
  { key: 'velocidad', label: 'Velocidad' },
  { key: 'fuerza', label: 'Fuerza' },
]

// IMC = peso (kg) / estatura (m)². Devuelve null si faltan datos.
export function calcImc(peso, estatura) {
  const kg = parseFloat(peso)
  const m = parseFloat(estatura) / 100
  if (!(kg > 0) || !(m > 0)) return null
  return Math.round((kg / (m * m)) * 10) / 10
}

export function imcCategory(imc) {
  if (imc == null) return ''
  if (imc < 18.5) return 'Bajo peso'
  if (imc < 25) return 'Normal'
  if (imc < 30) return 'Sobrepeso'
  return 'Obesidad'
}

export function ageFrom(birth) {
  if (!birth) return null
  const b = new Date(birth)
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) age -= 1
  return age
}

export const INITIAL_ATHLETES = [
  { id: 1, nombre: 'Carlos Mendoza', nacimiento: '2001-03-14', sexo: 'Masculino', resistencia: 78, velocidad: 85, fuerza: 72, peso: 74, estatura: 178 },
  { id: 2, nombre: 'Laura Pérez', nacimiento: '1999-11-02', sexo: 'Femenino', resistencia: 88, velocidad: 76, fuerza: 64, peso: 58, estatura: 165 },
]
