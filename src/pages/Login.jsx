import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CLUB_NAME, CLUB_TAGLINE, DEMO_USER } from '../config'
import Logo from '../components/Logo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      setError('')
    }
  }

  function switchMode() {
    setMode(isRegister ? 'login' : 'register')
    setError('')
  }

  function fillDemo() {
    setMode('login')
    setForm({ name: '', email: DEMO_USER.email, password: DEMO_USER.password })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (isRegister && form.name.trim().length < 2) return setError('Ingresa tu nombre completo.')
    if (!EMAIL_RE.test(form.email.trim())) return setError('Ingresa un correo válido.')
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')

    setLoading(true)
    try {
      if (isRegister) await register(form)
      else await login(form.email, form.password)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <aside className="auth-hero">
        <div className="auth-hero-inner">
          <div className="brand">
            <Logo />
            <span>{CLUB_NAME}</span>
          </div>
          <div className="hero-copy">
            <h1>
              El club, <br />
              <em>en un solo lugar.</em>
            </h1>
            <p>{CLUB_TAGLINE}</p>
          </div>
          <ul className="hero-stats">
            <li><strong>1,200+</strong><span>Socios activos</span></li>
            <li><strong>14</strong><span>Canchas</span></li>
            <li><strong>8</strong><span>Disciplinas</span></li>
          </ul>
        </div>
      </aside>

      <main className="auth-panel">
        <form className="card" onSubmit={handleSubmit} noValidate>
          <div className="brand brand-mobile">
            <Logo size={32} />
            <span>{CLUB_NAME}</span>
          </div>

          <header>
            <h2>{isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</h2>
            <p className="muted">
              {isRegister ? 'Regístrate para acceder al portal del club.' : 'Ingresa tus credenciales para continuar.'}
            </p>
          </header>

          {isRegister && (
            <label className="field">
              <span>Nombre completo</span>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="Juan Pérez"
                autoComplete="name"
                autoFocus
              />
            </label>
          )}

          <label className="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="tu@correo.com"
              autoComplete="email"
              autoFocus={!isRegister}
            />
          </label>

          <label className="field">
            <span className="field-row">
              Contraseña
              {!isRegister && (
                <button type="button" className="link" onClick={() => setError('Función disponible próximamente.')}>
                  ¿La olvidaste?
                </button>
              )}
            </span>
            <div className="input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </label>

          {error && <p className="error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>

          {!isRegister && (
            <button type="button" className="demo" onClick={fillDemo}>
              <span className="demo-dot" />
              Usar cuenta demo · {DEMO_USER.email}
            </button>
          )}

          <p className="switch muted">
            {isRegister ? '¿Ya tienes cuenta?' : '¿Aún no eres socio?'}{' '}
            <button type="button" className="link" onClick={switchMode}>
              {isRegister ? 'Inicia sesión' : 'Crea una cuenta'}
            </button>
          </p>
        </form>
      </main>
    </div>
  )
}
