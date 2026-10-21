import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MODULES } from '../modules'
import Icon from '../components/Icon'

export default function Home() {
  const { user } = useAuth()
  const firstName = user.name.split(' ')[0]
  const since = new Date(user.loggedAt).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Sesión iniciada a las {since}</p>
          <h1>Hola, {firstName}.</h1>
          <p className="muted">Selecciona un módulo para comenzar.</p>
        </div>
      </header>

      <section className="modules">
        {MODULES.map((m) => {
          const body = (
            <>
              <div className="module-icon"><Icon name={m.icon} size={20} /></div>
              <h3>{m.name}</h3>
              <p>{m.description}</p>
              <span className="module-foot">
                {m.path ? <>Abrir <Icon name="arrow" size={16} /></> : <><Icon name="lock" size={14} /> Próximamente</>}
              </span>
            </>
          )
          return m.path ? (
            <Link key={m.key} to={m.path} className="module">{body}</Link>
          ) : (
            <div key={m.key} className="module disabled">{body}</div>
          )
        })}
      </section>
    </div>
  )
}
