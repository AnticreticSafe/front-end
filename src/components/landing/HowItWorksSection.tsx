import { Card } from '../ui/Card'
import { SectionTitle } from '../ui/SectionTitle'

const steps = [
  'Create Agreement',
  'Upload Title Report',
  'Parties Approve',
  'Upload Agreement Contract',
  'Upload Public Registry Proof',
  'Register Confidential Amount',
  'Confirm Possession Delivery',
  'Close Agreement',
]

export function HowItWorksSection() {
  return (
    <section>
      <SectionTitle kicker="How It Works" title="A deterministic milestone timeline for all parties." />
      <div className="steps-grid">
        {steps.map((step, index) => (
          <Card key={step} className="step-card">
            <p className="step-index">{String(index + 1).padStart(2, '0')}</p>
            <p>{step}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
