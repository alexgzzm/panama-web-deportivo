import { useEffect, useMemo, useState } from 'react'
import { ROLES, ROLE_DEPORTISTA, USERS } from '../data/users'
import { loadAthletes } from '../data/athletes'
import Icon from '../components/Icon'

const STATUS_CLASS = { Activo: 'ok', Inactivo: 'off', Pendiente: 'warn' }
const STATUSES = ['Activo', 'Inactivo', 'Pendiente']

// Los usuarios viven solo en la sesión (sessionStorage): se pierden al cerrar la pestaña.
const KEY = 'deportivo.usuarios'

function loadUsers() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : USERS
  } catch {
    return USERS
  }
}

const EMPTY = { name: '', username: '', email: '', phone: '', role: '', status: 'Activo', athleteId: '' }

function formatAccess(iso) {
  if (!iso) return 'Nunca'
  return new Date(iso).toLocaleString('es-PA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function initials(name) {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

function UserForm({ user, users, athletes, onSave, onClose }) {
  const [form, setForm] = useState(user ? { ...EMPTY, ...user, athleteId: user.athleteId ?? '' } : EMPTY)
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const isAthlete = form.role === ROLE_DEPORTISTA

  // Deportistas ya vinculados a otro usuario no se ofrecen de nuevo.
  const taken = new Set(users.filter((u) => u.id !== user?.id && u.athleteId).map((u) => u.athleteId))
  const available = athletes.filter((a) => !taken.has(a.id))

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Requerido'
    if (!form.username.trim()) errs.username = 'Requerido'
    else if (users.some((u) => u.id !== user?.id && u.username === form.username.trim())) errs.username = 'Ya existe'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'Correo inválido'
    if (!form.role) errs.role = 'Requerido'
    if (isAthlete && !form.athleteId) errs.athleteId = 'Selecciona un deportista'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const data = {
      ...form,
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      athleteId: isAthlete ? Number(form.athleteId) : undefined,
    }
    onSave(data)
  }

  const field = (k, label, props = {}) => (
    <label className="field">
      {label}
      <input value={form[k]} onChange={set(k)} {...props} />
      {errors[k] && <span className="field-error">{errors[k]}</span>}
    </label>
  )

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} noValidate role="dialog" aria-modal="true">
        <h2>{user ? 'Modificar usuario' : 'Nuevo usuario'}</h2>

        <fieldset>
          <legend>Cuenta</legend>
          <div className="form-grid">
            <div className="span-2">{field('name', 'Nombre completo', { type: 'text', autoFocus: true })}</div>
            {field('username', 'Usuario', { type: 'text' })}
            {field('email', 'Correo electrónico', { type: 'email' })}
            {field('phone', 'Teléfono', { type: 'tel' })}
            <label className="field">
              Estado
              <select value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Rol y vínculo</legend>
          <div className="form-grid">
            <label className="field">
              Rol
              <select value={form.role} onChange={set('role')}>
                <option value="">Seleccionar</option>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
              {errors.role && <span className="field-error">{errors.role}</span>}
            </label>
            {isAthlete && (
              <label className="field">
                Deportista asignado
                <select value={form.athleteId} onChange={set('athleteId')}>
                  <option value="">Seleccionar</option>
                  {available.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
                {errors.athleteId && <span className="field-error">{errors.athleteId}</span>}
                {available.length === 0 && <span className="field-hint">No hay deportistas disponibles.</span>}
              </label>
            )}
          </div>
        </fieldset>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary btn-sm">{user ? 'Guardar cambios' : 'Crear usuario'}</button>
        </div>
      </form>
    </div>
  )
}

export default function Users() {
  const [users, setUsers] = useState(loadUsers)
  const [athletes] = useState(loadAthletes)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [editing, setEditing] = useState(null) // null = cerrado, {} = nuevo, objeto = editar
  const [toast, setToast] = useState('')

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(users)) } catch { /* sin storage */ }
  }, [users])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const athleteName = (id) => athletes.find((a) => a.id === id)?.nombre

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter(
      (u) =>
        (!role || u.role === role) &&
        (!q || [u.name, u.username, u.email].some((v) => v.toLowerCase().includes(q))),
    )
  }, [users, query, role])

  const stats = [
    { label: 'Total', value: users.length },
    { label: 'Activos', value: users.filter((u) => u.status === 'Activo').length },
  ]

  const save = (data) => {
    if (editing?.id) {
      setUsers((l) => l.map((u) => (u.id === editing.id ? { ...u, ...data } : u)))
      setToast('Usuario actualizado.')
    } else {
      setUsers((l) => [...l, { ...data, id: Math.max(0, ...l.map((u) => u.id)) + 1, lastAccess: null }])
      setToast('Usuario creado.')
    }
    setEditing(null)
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Módulo</p>
          <h1>Usuarios</h1>
          <p className="muted">Administra las cuentas, roles y accesos del club.</p>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setEditing({})}>
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
                <th>Deportista</th>
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
                  <td className="muted">{u.role === ROLE_DEPORTISTA ? athleteName(u.athleteId) || 'Sin asignar' : '—'}</td>
                  <td className="muted nowrap">{u.phone}</td>
                  <td><span className={`badge ${STATUS_CLASS[u.status]}`}>{u.status}</span></td>
                  <td className="muted nowrap">{formatAccess(u.lastAccess)}</td>
                  <td>
                    <button className="icon-btn" onClick={() => setEditing(u)} aria-label={`Editar ${u.name}`} title="Editar">
                      <Icon name="edit" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="empty">No se encontraron usuarios con esos filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="table-foot muted">Mostrando {filtered.length} de {users.length} usuarios</p>
      </section>

      {editing && (
        <UserForm
          user={editing.id ? editing : null}
          users={users}
          athletes={athletes}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
