import type { Agreement } from '../types/agreement'
import { RoleDashboard } from '../components/dashboard/RoleDashboard'

interface DashboardPageProps {
  agreements: Agreement[]
  onViewDetails: (id: string) => void
}

export function DashboardPage({ agreements, onViewDetails }: DashboardPageProps) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#221a4c',
        padding: '96px 24px 64px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <RoleDashboard agreements={agreements} onViewDetails={onViewDetails} />
      </div>
    </main>
  )
}
