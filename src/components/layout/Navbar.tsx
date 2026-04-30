import { Button } from '../ui/Button'

export type AppView = 'landing' | 'dashboard' | 'create' | 'detail'

interface NavbarProps {
  activeView: AppView
  onNavigate: (view: AppView) => void
}

export function Navbar({ activeView, onNavigate }: NavbarProps) {
  return (
    <nav className="navbar">
      <button type="button" className="brand" onClick={() => onNavigate('landing')}>
        AnticreticSafe
      </button>
      <div className="nav-links">
        {(['landing', 'dashboard', 'create', 'detail'] as AppView[]).map((view) => (
          <button
            key={view}
            type="button"
            className={`nav-link ${activeView === view ? 'is-active' : ''}`}
            onClick={() => onNavigate(view)}
          >
            {view === 'landing' && 'Landing'}
            {view === 'dashboard' && 'Dashboard'}
            {view === 'create' && 'Create'}
            {view === 'detail' && 'Detail'}
          </button>
        ))}
      </div>
      <Button variant="secondary" onClick={() => onNavigate('dashboard')}>
        Launch Demo
      </Button>
    </nav>
  )
}
