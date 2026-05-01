import type { Agreement } from '../types/agreement'
import { RoleDashboard } from '../components/dashboard/RoleDashboard'

interface DashboardPageProps {
  agreements: Agreement[]
  onViewDetails: (id: string) => void
}

export function DashboardPage({ agreements, onViewDetails }: DashboardPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <RoleDashboard agreements={agreements} onViewDetails={onViewDetails} />
    </main>
  )
}
