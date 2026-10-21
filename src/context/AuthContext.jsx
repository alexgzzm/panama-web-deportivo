import { createContext, useContext, useEffect, useState } from 'react'
import { DEMO_USER } from '../config'

// Sin backend: los usuarios y la sesión viven en sessionStorage,
// así que persisten mientras la pestaña esté abierta.
const USERS_KEY = 'deportivo.users'
const SESSION_KEY = 'deportivo.session'

const AuthContext = createContext(null)

function read(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    if (value === null) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // sessionStorage no disponible: el estado sigue en memoria
  }
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => read(USERS_KEY, [DEMO_USER]))
  const [user, setUser] = useState(() => read(SESSION_KEY, null))

  useEffect(() => write(USERS_KEY, users), [users])
  useEffect(() => write(SESSION_KEY, user), [user])

  async function login(email, password) {
    await wait(600) // simula latencia de red
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    )
    if (!found) throw new Error('Correo o contraseña incorrectos.')
    setUser({ name: found.name, email: found.email, loggedAt: new Date().toISOString() })
  }

  async function register({ name, email, password }) {
    await wait(600)
    const normalized = email.trim().toLowerCase()
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      throw new Error('Ya existe una cuenta con ese correo.')
    }
    const newUser = { name: name.trim(), email: normalized, password }
    setUsers((prev) => [...prev, newUser])
    setUser({ name: newUser.name, email: newUser.email, loggedAt: new Date().toISOString() })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
