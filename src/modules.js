// Catálogo de módulos del sistema. `path: null` = aún no disponible en el demo.
export const MODULES = [
  { key: 'usuarios', name: 'Usuarios', icon: 'users', path: '/usuarios', description: 'Cuentas, roles y accesos del personal.' },
  { key: 'deportistas', name: 'Deportistas', icon: 'id', path: '/deportistas', description: 'Alta de deportistas, indicadores antropométricos.' },
  {
    key: 'desarrollo',
    name: 'Desarrollo Deportivo',
    icon: 'activity',
    path: null,
    description: 'Evaluación, programación y seguimiento del progreso del deportista.',
    children: [
      { key: 'pruebas-iniciales', name: 'Pruebas Iniciales' },
      { key: 'programa-inicial', name: 'Programa Inicial' },
      { key: 'progresiones', name: 'Progresiones' },
      { key: 'pruebas-progresion', name: 'Pruebas de Progresión' },
    ],
  },
  { key: 'pagos', name: 'Pagos', icon: 'card', path: null, description: 'Cuotas, facturación y cobros.' },
  { key: 'reportes', name: 'Reportes', icon: 'chart', path: null, description: 'Indicadores de ocupación e ingresos.' },
]
