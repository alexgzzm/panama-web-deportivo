import { useEffect, useMemo, useState } from 'react'
import { ROLES, USERS } from '../data/users'
import Icon from '../components/Icon'

const STATUS_CLASS = { Activo: 'ok', Inactivo: 'off', Pendiente: 'warn' }

function formatAccess(iso) {
  if (!iso) return 'Nunca'
  return new Date(iso).toLocaleString('es-PA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function initials(name) {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

export default function Users() {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return USERS.filter(
      (u) =>
        (!role || u.role === role) &&
        (!q || [u.name, u.username, u.email].some((v) => v.toLowerCase().includes(q))),
    )
  }, [query, role])

  const stats = [
    { label: 'Total', value: USERS.length },
    { label: 'Activos', value: USERS.filter((u) => u.status === 'Activo').length },
    { label: 'Personal', value: USERS.filter((u) => u.role !== 'Socio').length },
    { label: 'Socios', value: USERS.filter((u) => u.role === 'Socio').length },
  ]

  // Los formularios de crear/editar no forman parte del demo.
  const openForm = (user) =>
    setToast(user ? `Editar a ${user.name}: formulario disponible próximamente.` : 'Formulario de nuevo usuario disponible próximamente.')

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Módulo</p>
          <h1>Usuarios</h1>
          <p className="muted">Administra las cuentas, roles y accesos del club.</p>
        </div>
        <button className="btn-primary btn-sm" onClick={() => openForm(null)}>
          <Icon name="plus" size={16} /> Nuevo usuario
        </button>
      </header>

      <section className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="toolbar">
          <label className="search">
            <Icon name="search" size={16} />
            <input
              type="search"
              placeholder="Buscar por nombre, usuario o email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filtrar por rol">
            <option value="">Todos los roles</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Último acceso</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="cell-user">
                      <span className="avatar avatar-sm">{initials(u.name)}</span>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td className="mono">@{u.username}</td>
                  <td className="muted">{u.email}</td>
                  <td><span className="tag">{u.role}</span></td>
                  <td className="muted nowrap">{u.phone}</td>
                  <td><span className={`badge ${STATUS_CLASS[u.status]}`}>{u.status}</span></td>
                  <td className="muted nowrap">{formatAccess(u.lastAccess)}</td>
                  <td>
                    <button className="icon-btn" onClick={() => openForm(u)} aria-label={`Editar ${u.name}`} title="Editar">
                      <Icon name="edit" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty">No se encontraron usuarios con esos filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="table-foot muted">Mostrando {filtered.length} de {USERS.length} usuarios</p>
      </section>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
