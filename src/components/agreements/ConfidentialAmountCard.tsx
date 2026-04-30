import { Card } from '../ui/Card'

interface ConfidentialAmountCardProps {
  isAuthorized: boolean
  amountLabel: string
}

export function ConfidentialAmountCard({ isAuthorized, amountLabel }: ConfidentialAmountCardProps) {
  return (
    <Card>
      <h3>Confidential Amount</h3>
      <p className="confidential-value">
        {isAuthorized ? amountLabel : 'Confidential amount locked'}
      </p>
      <p className="muted">Protected through confidential operations and selective disclosure.</p>
    </Card>
  )
}
