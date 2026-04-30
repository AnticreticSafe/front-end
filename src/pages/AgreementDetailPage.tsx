import type { Agreement } from '../types/agreement'
import { AgreementTimeline } from '../components/agreements/AgreementTimeline'
import { ConfidentialAmountCard } from '../components/agreements/ConfidentialAmountCard'
import { DocumentHashList } from '../components/agreements/DocumentHashList'
import { StatusBadge } from '../components/agreements/StatusBadge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionTitle } from '../components/ui/SectionTitle'
import { ConfidentialAsUSDBalancePanel } from '../components/web3/ConfidentialAsUSDBalancePanel'
import { MintConfidentialAsUSDPanel } from '../components/web3/MintConfidentialAsUSDPanel'
import { RegisterConfidentialAmountPanel } from '../components/web3/RegisterConfidentialAmountPanel'
import { formatDate, shortenHash } from '../utils/format'

interface AgreementDetailPageProps {
  agreement: Agreement
}

export function AgreementDetailPage({ agreement }: AgreementDetailPageProps) {
  const actions = [
    'Upload Title Report Hash',
    'Approve Agreement',
    'Upload Agreement Contract Hash',
    'Upload Public Registry Proof Hash',
    'Register Confidential Amount',
    'Confirm Possession Delivery',
    'Close Agreement',
  ]

  return (
    <main className="page">
      <SectionTitle kicker="Agreement Detail" title={agreement.id} />
      <div className="detail-grid">
        <Card>
          <div className="agreement-card-head">
            <h3>State</h3>
            <StatusBadge status={agreement.status} />
          </div>
          <p>
            <strong>Property Owner:</strong> {agreement.propertyOwner}
          </p>
          <p>
            <strong>Occupant:</strong> {agreement.occupant}
          </p>
          <p>
            <strong>Start Date:</strong> {formatDate(agreement.startDate)}
          </p>
          <p>
            <strong>End Date:</strong> {formatDate(agreement.endDate)}
          </p>
          <p>
            <strong>Property Hash:</strong> <code>{shortenHash(agreement.propertyHash)}</code>
          </p>
        </Card>
        <ConfidentialAmountCard
          isAuthorized={agreement.amountRegistered}
          amountLabel={agreement.confidentialAmountLabel}
        />
      </div>

      <Card>
        <h3>Agreement timeline</h3>
        <AgreementTimeline currentStatus={agreement.status} />
      </Card>

      <DocumentHashList agreement={agreement} />

      <Card>
        <h3>Mock actions</h3>
        <div className="actions-grid">
          {actions.map((action) => (
            <Button key={action} variant="secondary">
              {action}
            </Button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="muted">Step 1: Mint confidential asUSD to the occupant.</p>
        <p className="muted">
          Step 2: Use the mint transaction hash as the asUSD operation reference in the agreement.
        </p>
      </Card>

      <MintConfidentialAsUSDPanel />
      <ConfidentialAsUSDBalancePanel />
      <RegisterConfidentialAmountPanel />
    </main>
  )
}
