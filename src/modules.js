// Catálogo de módulos del sistema. `path: null` = aún no disponible en el demo.
export const MODULES = [
  { key: 'usuarios', name: 'Usuarios', icon: 'users', path: '/usuarios', description: 'Cuentas, roles y accesos del personal.' },
  { key: 'deportistas', name: 'Deportistas', icon: 'id', path: '/deportistas', description: 'Alta de deportistas, indicadores antropométricos.' },
  {
    key: 'desarrollo',
    name: 'Desarrollo Deportivo',
    icon: 'activity',
    path: '/desarrollo-deportivo',
    description: 'Evaluación, programación y seguimiento del progreso del deportista.',
    children: [
      { key: 'pruebas-iniciales', name: 'Pruebas Iniciales', icon: 'clipboard', path: '/desarrollo-deportivo/pruebas-iniciales', description: 'Evaluación de ingreso para establecer el punto de partida del deportista.' },
      { key: 'programa-inicial', name: 'Programa Inicial', icon: 'calendar', path: '/desarrollo-deportivo/programa-inicial', description: 'Plan de entrenamiento base según los resultados de las pruebas iniciales.' },
      { key: 'progresiones', name: 'Progresiones', icon: 'trending', path: '/desarrollo-deportivo/progresiones', description: 'Avance gradual de cargas, ejercicios y objetivos.' },
      { key: 'pruebas-progresion', name: 'Pruebas de Progresión', icon: 'chart', path: '/desarrollo-deportivo/pruebas-progresion', description: 'Evaluaciones periódicas para medir y validar la evolución.' },
    ],
  },
  { key: 'pagos', name: 'Pagos', icon: 'card', path: null, description: 'Cuotas, facturación y cobros.' },
  { key: 'reportes', name: 'Reportes', icon: 'chart', path: null, description: 'Indicadores de ocupación e ingresos.' },
]
