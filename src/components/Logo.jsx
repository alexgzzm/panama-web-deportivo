export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
      <path
        d="M8 16h16M16 8c3 2.5 3 13.5 0 16M16 8c-3 2.5-3 13.5 0 16"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
      />
    </svg>
  )
}
