// Set mínimo de íconos lineales (estilo Lucide) para no agregar dependencias.
const PATHS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  id: 'M3 5h18v14H3zM7 15c.5-1.5 1.6-2 3-2s2.5.5 3 2M10 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4M15 9h3M15 13h3',
  court: 'M3 5h18v14H3zM12 5v14M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M3 9h3v6H3M21 9h-3v6h3',
  calendar: 'M3 6h18v15H3zM3 10h18M8 3v4M16 3v4',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
  card: 'M2 6h20v12H2zM2 10h20M6 15h4',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  plus: 'M12 5v14M5 12h14',
  edit: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16M21 21l-4.35-4.35',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
}

export default function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
