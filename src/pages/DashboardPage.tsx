import type { Agreement } from '../types/agreement'
import { AgreementCard } from '../components/agreements/AgreementCard'
import { SectionTitle } from '../components/ui/SectionTitle'

interface DashboardPageProps {
  agreements: Agreement[]
  onViewDetails: (id: string) => void
}

export function DashboardPage({ agreements, onViewDetails }: DashboardPageProps) {
  return (
    <main className="page">
      <SectionTitle
        kicker="Dashboard"
        title="Mock agreements"
        description="Tracking real-estate agreements with verifiable milestones and confidential amount states."
      />
      <div className="grid-3">
        {agreements.map((agreement) => (
          <AgreementCard key={agreement.id} agreement={agreement} onViewDetails={onViewDetails} />
        ))}
      </div>
    </main>
  )
}
