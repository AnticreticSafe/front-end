import type { Agreement } from '../../types/agreement'
import { formatDate } from '../../utils/format'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { StatusBadge } from './StatusBadge'

interface AgreementCardProps {
  agreement: Agreement
  onViewDetails: (id: string) => void
}

export function AgreementCard({ agreement, onViewDetails }: AgreementCardProps) {
  return (
    <Card className="agreement-card">
      <div className="agreement-card-head">
        <h3>{agreement.id}</h3>
        <StatusBadge status={agreement.status} />
      </div>
      <p>
        <strong>Property Owner:</strong> {agreement.propertyOwner}
      </p>
      <p>
        <strong>Occupant:</strong> {agreement.occupant}
      </p>
      <p>
        <strong>Start Date:</strong>{' '}
        {agreement.startDate && agreement.startDate !== '0'
          ? formatDate(agreement.startDate)
          : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
      </p>
      <p>
        <strong>End Date:</strong> {formatDate(agreement.endDate)}
      </p>
      <p>
        <strong>Amount Registered:</strong> {agreement.amountRegistered ? 'Yes' : 'No'}
      </p>
      <Button variant="secondary" onClick={() => onViewDetails(agreement.id)}>
        View details
      </Button>
    </Card>
  )
}
