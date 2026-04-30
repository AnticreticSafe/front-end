import { Button } from '../ui/Button'
import { FiArrowUpRight, FiShield } from 'react-icons/fi'

export type AppView = 'landing' | 'dashboard' | 'create' | 'detail'

interface NavbarProps {
  activeView: AppView
  onNavigate: (view: AppView) => void
}

export function Navbar({ activeView, onNavigate }: NavbarProps) {
  return (
    <nav className="navbar">
      <button type="button" className="brand" onClick={() => onNavigate('landing')}>
        <FiShield className="h-5 w-5 text-indigo-600" aria-hidden="true" />
        <span>AnticreticSafe</span>
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
        Launch App <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  )
}
