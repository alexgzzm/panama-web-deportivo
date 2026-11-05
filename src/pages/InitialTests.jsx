import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { calcImc, imcCategory, loadAthletes } from '../data/athletes'
import { EVALUADORES, INITIAL_TESTS_KEY, TESTS, loadInitialTests } from '../data/initialTests'
import Icon from '../components/Icon'

const today = () => new Date().toISOString().slice(0, 10)
const EMPTY = { athleteId: '', fecha: today(), evaluador: '', resistencia: '', velocidad: '', saltoVertical: '', flexiones: '', flexibilidad: '', observaciones: '' }

function validate(f) {
  const e = {}
  if (!f.athleteId) e.athleteId = 'Requerido'
  if (!f.fecha) e.fecha = 'Requerido'
  else if (new Date(f.fecha) > new Date()) e.fecha = 'Fecha inválida'
  if (!f.evaluador) e.evaluador = 'Requerido'
  TESTS.forEach((t) => { if (!(Number(f[t.key]) > 0)) e[t.key] = 'Requerido' })
  return e
}

function TestForm({ test, athletes, onSave, onClose }) {
  const [form, setForm] = useState(test ? { ...EMPTY, ...test, athleteId: String(test.athleteId) } : EMPTY)
  const [errors, setErrors] = useState({})
  const athlete = athletes.find((a) => String(a.id) === form.athleteId)
  const imc = athlete ? calcImc(athlete.peso, athlete.estatura) : null
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
    const data = { ...form, athleteId: Number(form.athleteId), observaciones: form.observaciones.trim() }
    TESTS.forEach((t) => { data[t.key] = Number(form[t.key]) })
    onSave(data)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} noValidate role="dialog" aria-modal="true">
        <h2>{test ? 'Modificar prueba inicial' : 'Registrar prueba inicial'}</h2>

        <fieldset>
          <legend>Datos generales</legend>
          <div className="form-grid">
            <div className="span-2">
              <label className="field">
                Deportista
                <select value={form.athleteId} onChange={set('athleteId')} disabled={!!test}>
                  <option value="">Seleccionar</option>
                  {athletes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
                {errors.athleteId && <span className="field-error">{errors.athleteId}</span>}
                {athlete && (
                  <span className="field-hint">
                    {athlete.peso} kg · {athlete.estatura} cm · IMC {imc} ({imcCategory(imc)})
                  </span>
                )}
              </label>
            </div>
            <label className="field">
              Fecha de evaluación
              <input type="date" value={form.fecha} onChange={set('fecha')} />
              {errors.fecha && <span className="field-error">{errors.fecha}</span>}
            </label>
            <label className="field">
              Evaluador
              <select value={form.evaluador} onChange={set('evaluador')}>
                <option value="">Seleccionar</option>
                {EVALUADORES.map((o) => <option key={o}>{o}</option>)}
              </select>
              {errors.evaluador && <span className="field-error">{errors.evaluador}</span>}
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Resultados de las pruebas</legend>
          <div className="form-grid">
            {TESTS.map((t) => (
              <label className="field" key={t.key}>
                {t.label} ({t.unit})
                <input type="number" min="0" step={t.step} value={form[t.key]} onChange={set(t.key)} />
                {errors[t.key] && <span className="field-error">{errors[t.key]}</span>}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Observaciones</legend>
          <label className="field">
            <textarea rows={3} value={form.observaciones} onChange={set('observaciones')} />
          </label>
        </fieldset>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary btn-sm">{test ? 'Guardar cambios' : 'Registrar'}</button>
        </div>
      </form>
    </div>
  )
}

export default function InitialTests({ parent, sub }) {
  const [athletes] = useState(loadAthletes)
  const [tests, setTests] = useState(loadInitialTests)
  const [editing, setEditing] = useState(null) // null = cerrado, {} = nuevo, objeto = editar
  const [toast, setToast] = useState('')

  useEffect(() => {
    try { sessionStorage.setItem(INITIAL_TESTS_KEY, JSON.stringify(tests)) } catch { /* sin storage */ }
  }, [tests])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const save = (data) => {
    if (editing?.id) {
      setTests((l) => l.map((t) => (t.id === editing.id ? { ...t, ...data } : t)))
      setToast('Prueba actualizada.')
    } else {
      setTests((l) => [...l, { ...data, id: Math.max(0, ...l.map((t) => t.id)) + 1 }])
      setToast('Prueba registrada.')
    }
    setEditing(null)
  }

  const nameOf = (id) => athletes.find((a) => a.id === id)?.nombre ?? 'Deportista eliminado'

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="breadcrumb"><Link to={parent.path}>{parent.name}</Link> / {sub.name}</p>
          <h1>{sub.name}</h1>
          <p className="muted">{sub.description}</p>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setEditing({})}>
          <Icon name="plus" size={16} /> Nueva prueba
        </button>
      </header>

      <section className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Deportista</th>
                <th>Fecha</th>
                <th>Evaluador</th>
                {TESTS.map((t) => <th key={t.key}>{t.short} ({t.unit})</th>)}
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id}>
                  <td><strong>{nameOf(t.athleteId)}</strong></td>
                  <td className="muted nowrap">{t.fecha}</td>
                  <td className="nowrap">{t.evaluador}</td>
                  {TESTS.map((x) => <td key={x.key} className="nowrap">{t[x.key]}</td>)}
                  <td>
                    <button className="icon-btn" onClick={() => setEditing(t)} aria-label={`Modificar prueba de ${nameOf(t.athleteId)}`} title="Modificar">
                      <Icon name="edit" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {tests.length === 0 && (
                <tr><td colSpan={4 + TESTS.length} className="empty">Aún no hay pruebas iniciales registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="table-foot muted">{tests.length} pruebas · los datos se conservan solo durante la sesión</p>
      </section>

      {editing && <TestForm test={editing.id ? editing : null} athletes={athletes} onSave={save} onClose={() => setEditing(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
