import { useEffect, useState } from 'react'
import { INITIAL_ATHLETES, SEXES, ageFrom, calcImc, imcCategory } from '../data/athletes'
import Icon from '../components/Icon'

// Los datos viven solo en la sesión (sessionStorage): se pierden al cerrar la pestaña.
const KEY = 'deportivo.athletes'

function load() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : INITIAL_ATHLETES
  } catch {
    return INITIAL_ATHLETES
  }
}

const EMPTY = { nombre: '', nacimiento: '', sexo: '', peso: '', estatura: '' }

function initials(name) {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

function validate(f) {
  const e = {}
  if (!f.nombre.trim()) e.nombre = 'Requerido'
  if (!f.nacimiento) e.nacimiento = 'Requerido'
  else if (new Date(f.nacimiento) > new Date()) e.nacimiento = 'Fecha inválida'
  if (!f.sexo) e.sexo = 'Requerido'
  if (!(Number(f.peso) > 0)) e.peso = 'Requerido'
  if (!(Number(f.estatura) > 0)) e.estatura = 'Requerido'
  return e
}

function AthleteForm({ athlete, onSave, onClose }) {
  const [form, setForm] = useState(athlete ? { ...EMPTY, ...athlete } : EMPTY)
  const [errors, setErrors] = useState({})
  const imc = calcImc(form.peso, form.estatura)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave({
      ...form,
      nombre: form.nombre.trim(),
      peso: Number(form.peso),
      estatura: Number(form.estatura),
    })
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
        <h2>{athlete ? 'Modificar deportista' : 'Alta de deportista'}</h2>

        <fieldset>
          <legend>Datos generales</legend>
          <div className="form-grid">
            <div className="span-2">{field('nombre', 'Nombre completo', { type: 'text', autoFocus: true })}</div>
            {field('nacimiento', 'Fecha de nacimiento', { type: 'date' })}
            <label className="field">
              Sexo
              <select value={form.sexo} onChange={set('sexo')}>
                <option value="">Seleccionar</option>
                {SEXES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors.sexo && <span className="field-error">{errors.sexo}</span>}
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Indicadores antropométricos</legend>
          <div className="form-grid cols-3">
            {field('peso', 'Peso (kg)', { type: 'number', min: 0, step: '0.1' })}
            {field('estatura', 'Estatura (cm)', { type: 'number', min: 0, step: '0.1' })}
            <label className="field">
              IMC
              <input value={imc ?? ''} placeholder="Automático" readOnly tabIndex={-1} />
              <span className="field-hint">{imcCategory(imc) || 'Peso / estatura²'}</span>
            </label>
          </div>
        </fieldset>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary btn-sm">{athlete ? 'Guardar cambios' : 'Dar de alta'}</button>
        </div>
      </form>
    </div>
  )
}

export default function Athletes() {
  const [athletes, setAthletes] = useState(load)
  const [editing, setEditing] = useState(null) // null = cerrado, {} = nuevo, objeto = editar
  const [toast, setToast] = useState('')

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(athletes)) } catch { /* sin storage */ }
  }, [athletes])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const save = (data) => {
    if (editing?.id) {
      setAthletes((l) => l.map((a) => (a.id === editing.id ? { ...a, ...data } : a)))
      setToast('Deportista actualizado.')
    } else {
      setAthletes((l) => [...l, { ...data, id: Math.max(0, ...l.map((a) => a.id)) + 1 }])
      setToast('Deportista registrado.')
    }
    setEditing(null)
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Módulo</p>
          <h1>Deportistas</h1>
          <p className="muted">Alta y seguimiento de indicadores antropométricos.</p>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setEditing({})}>
          <Icon name="plus" size={16} /> Nuevo deportista
        </button>
      </header>

      <section className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Nacimiento</th>
                <th>Sexo</th>
                <th>Peso</th>
                <th>Estatura</th>
                <th>IMC</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {athletes.map((a) => {
                const imc = calcImc(a.peso, a.estatura)
                return (
                  <tr key={a.id}>
                    <td>
                      <div className="cell-user">
                        <span className="avatar avatar-sm">{initials(a.nombre)}</span>
                        <strong>{a.nombre}</strong>
                      </div>
                    </td>
                    <td className="muted nowrap">{a.nacimiento} · {ageFrom(a.nacimiento)} años</td>
                    <td>{a.sexo}</td>
                    <td className="nowrap">{a.peso} kg</td>
                    <td className="nowrap">{a.estatura} cm</td>
                    <td className="nowrap"><strong>{imc}</strong> <span className="tag">{imcCategory(imc)}</span></td>
                    <td>
                      <button className="icon-btn" onClick={() => setEditing(a)} aria-label={`Modificar ${a.nombre}`} title="Modificar">
                        <Icon name="edit" size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {athletes.length === 0 && (
                <tr><td colSpan={7} className="empty">Aún no hay deportistas registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="table-foot muted">{athletes.length} deportistas · los datos se conservan solo durante la sesión</p>
      </section>

      {editing && <AthleteForm athlete={editing.id ? editing : null} onSave={save} onClose={() => setEditing(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
