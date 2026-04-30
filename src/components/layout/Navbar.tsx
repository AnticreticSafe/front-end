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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
          <FiShield className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <span className="text-xl font-bold ml-1 tracking-tight">AnticreticSafe</span>
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
      <Button variant="secondary" onClick={() => onNavigate('dashboard')} className="rounded-xl px-5 py-2 font-medium">
        Launch APP
      </Button>
    </nav>
  )
}
