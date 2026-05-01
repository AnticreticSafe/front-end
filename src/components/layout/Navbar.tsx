import { useState, useEffect } from 'react'
import { useWallet } from '../../hooks/useWallet'
import { formatAddress } from '../../utils/formatAddress'

export type AppView = 'landing' | 'dashboard' | 'create' | 'detail'

interface NavbarProps {
  activeView: AppView
  onNavigate: (view: AppView) => void
}

const NAV_LINKS: { label: string; view: AppView }[] = [
  { label: 'Features', view: 'landing' },
  { label: 'Dashboard', view: 'dashboard' },
  { label: 'New Agreement', view: 'create' },
]

export function Navbar({ activeView, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const { isConnected, address, connectWallet, disconnectWallet, isConnecting } = useWallet()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(34,26,76,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(107,96,242,0.2)' : 'none',
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #6b60f2, #d8fab1)' }}
          >
            <svg className="h-4 w-4 text-pb-navy" fill="none" stroke="#221a4c" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-white font-brockmann">
            Anticretic<span style={{ color: '#d8fab1' }}>Safe</span>
          </span>
        </button>

        {/* Nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, view }) => (
            <button
              key={view}
              type="button"
              onClick={() => onNavigate(view)}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
              style={{
                color: activeView === view ? '#d8fab1' : 'rgba(255,255,255,0.75)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#d8fab1' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = activeView === view ? '#d8fab1' : 'rgba(255,255,255,0.75)' }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div
                className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
                style={{
                  background: 'rgba(107,96,242,0.15)',
                  border: '1px solid rgba(107,96,242,0.3)',
                  color: '#d8fab1',
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: '#d8fab1', display: 'inline-block' }} />
                {address ? formatAddress(address) : 'Connected'}
              </div>
              <button
                type="button"
                onClick={() => disconnectWallet()}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.6)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)' }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={connectWallet}
              disabled={isConnecting}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#d8fab1', color: '#221a4c' }}
            >
              {isConnecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
