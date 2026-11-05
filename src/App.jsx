import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Users from './pages/Users'
import Athletes from './pages/Athletes'
import SportsDevelopment, { SubModulePage } from './pages/SportsDevelopment'
import { MODULES } from './modules'

const DEVELOPMENT = MODULES.find((m) => m.key === 'desarrollo')

function Protected({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicOnly({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/deportistas" element={<Athletes />} />
        <Route path={DEVELOPMENT.path} element={<SportsDevelopment module={DEVELOPMENT} />} />
        {DEVELOPMENT.children.map((c) => (
          <Route key={c.key} path={c.path} element={<SubModulePage parent={DEVELOPMENT} sub={c} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
