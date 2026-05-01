import type { Agreement } from '../types/agreement'
import { RoleDashboard } from '../components/dashboard/RoleDashboard'

interface DashboardPageProps {
  agreements: Agreement[]
  isLoading?: boolean
  onViewDetails: (id: string) => void
}

export function DashboardPage({ agreements, isLoading, onViewDetails }: DashboardPageProps) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#221a4c',
        padding: '96px 24px 64px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '120px', gap: '20px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: '3px solid rgba(107,96,242,0.2)',
              borderTop: '3px solid #6b60f2',
              animation: 'spin 0.9s linear infinite',
            }} />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Loading your agreements from the blockchain…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <RoleDashboard agreements={agreements} onViewDetails={onViewDetails} />
        )}
      </div>
    </main>
  )
}
