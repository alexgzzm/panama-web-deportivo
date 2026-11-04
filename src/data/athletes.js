export const SEXES = ['Masculino', 'Femenino']

// Opciones de referencia (sin catálogos reales por ahora).
export const PARENTESCOS = ['Madre', 'Padre', 'Cónyuge', 'Hermano/a', 'Abuelo/a', 'Otro']
export const DEPORTES = ['Fútbol', 'Baloncesto', 'Voleibol', 'Béisbol', 'Natación', 'Atletismo']
export const CATEGORIAS = ['Infantil', 'Juvenil', 'Sub-20', 'Libre', 'Veteranos']
export const EQUIPOS = ['Tiburones', 'Halcones', 'Delfines', 'Leones', 'Sin equipo']
export const ENTRENADORES = ['Luis Sánchez', 'Gabriela Delgado', 'Roberto Arias', 'Sin asignar']
export const ESTADOS_INSCRIPCION = ['Inscrito', 'Pendiente', 'Suspendido', 'Retirado']

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
  { id: 1, nombre: 'Carlos Mendoza', nacimiento: '2001-03-14', sexo: 'Masculino', telefono: '+507 6612-4501', email: 'carlos.mendoza@gmail.com', emergenciaNombre: 'Rosa Mendoza', emergenciaParentesco: 'Madre', emergenciaTelefono: '+507 6700-1122', deporte: 'Fútbol', categoria: 'Sub-20', equipo: 'Tiburones', posicion: 'Delantero', entrenador: 'Luis Sánchez', inscripcion: 'Inscrito', peso: 74, estatura: 178 },
  { id: 2, nombre: 'Laura Pérez', nacimiento: '1999-11-02', sexo: 'Femenino', telefono: '+507 6230-8845', email: 'laura.perez@hotmail.com', emergenciaNombre: 'Jorge Pérez', emergenciaParentesco: 'Padre', emergenciaTelefono: '+507 6455-9023', deporte: 'Voleibol', categoria: 'Libre', equipo: 'Halcones', posicion: 'Central', entrenador: 'Gabriela Delgado', inscripcion: 'Inscrito', peso: 58, estatura: 165 },
]
