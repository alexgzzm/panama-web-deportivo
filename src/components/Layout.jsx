import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CLUB_NAME } from '../config'
import { MODULES } from '../modules'
import Logo from './Logo'
import Icon from './Icon'

export default function Layout() {
  const { user, logout } = useAuth()
  const [openGroup, setOpenGroup] = useState('desarrollo')

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <Logo size={30} />
          <span>{CLUB_NAME}</span>
        </div>

        <nav className="nav">
          <NavLink to="/" end className="nav-item">
            <Icon name="home" /> <span>Inicio</span>
          </NavLink>
          <p className="nav-label">Módulos</p>
          {MODULES.map((m) => {
            if (m.children) {
              const open = openGroup === m.key
              return (
                <div key={m.key} className="nav-group">
                  <button className="nav-item nav-toggle" aria-expanded={open} onClick={() => setOpenGroup(open ? null : m.key)}>
                    <Icon name={m.icon} /> <span>{m.name}</span> <Icon name="chevron" size={14} />
                  </button>
                  {open && (
                    <div className="nav-sub">
                      {m.children.map((c) => (
                        <span key={c.key} className="nav-item nav-subitem disabled" title="Próximamente">
                          <span>{c.name}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return m.path ? (
              <NavLink key={m.key} to={m.path} className="nav-item">
                <Icon name={m.icon} /> <span>{m.name}</span>
              </NavLink>
            ) : (
              <span key={m.key} className="nav-item disabled" title="Próximamente">
                <Icon name={m.icon} /> <span>{m.name}</span>
              </span>
            )
          })}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{user.name[0]?.toUpperCase()}</div>
          <div className="topbar-meta">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button className="icon-btn" onClick={logout} aria-label="Cerrar sesión" title="Cerrar sesión">
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
