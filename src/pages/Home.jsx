import { useAuth } from '../context/AuthContext'
import { CLUB_NAME } from '../config'
import Logo from '../components/Logo'

// Pantalla provisional tras el login; aquí irán los siguientes módulos del demo.
export default function Home() {
  const { user, logout } = useAuth()
  const firstName = user.name.split(' ')[0]
  const since = new Date(user.loggedAt).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="home">
      <header className="topbar">
        <div className="brand">
          <Logo size={30} />
          <span>{CLUB_NAME}</span>
        </div>
        <div className="topbar-user">
          <div className="avatar">{firstName[0]?.toUpperCase()}</div>
          <div className="topbar-meta">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button className="btn-ghost" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="home-main">
        <p className="eyebrow">Sesión iniciada a las {since}</p>
        <h1>Hola, {firstName}.</h1>
        <p className="muted">Bienvenido al portal del club. Los módulos estarán disponibles pronto.</p>
      </main>
    </div>
  )
}
