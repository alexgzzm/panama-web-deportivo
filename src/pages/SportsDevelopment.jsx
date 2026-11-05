import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

// Hub del módulo: muestra sus submódulos.
export default function SportsDevelopment({ module }) {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Módulo</p>
          <h1>{module.name}</h1>
          <p className="muted">{module.description}</p>
        </div>
      </header>

      <section className="modules">
        {module.children.map((c) => (
          <Link key={c.key} to={c.path} className="module">
            <div className="module-icon"><Icon name={c.icon} size={20} /></div>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <span className="module-foot">Abrir <Icon name="arrow" size={16} /></span>
          </Link>
        ))}
      </section>
    </div>
  )
}

// Página base de cada submódulo (contenido pendiente de definir).
export function SubModulePage({ parent, sub }) {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="breadcrumb"><Link to={parent.path}>{parent.name}</Link> / {sub.name}</p>
          <h1>{sub.name}</h1>
          <p className="muted">{sub.description}</p>
        </div>
      </header>

      <div className="panel">
        <p className="empty">Este submódulo estará disponible próximamente.</p>
      </div>
    </div>
  )
}
