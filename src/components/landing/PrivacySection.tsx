import { Card } from '../ui/Card'
import { SectionTitle } from '../ui/SectionTitle'

const publicData = ['Agreement ID', 'Wallets', 'Status', 'Document hashes', 'Timestamps']
const privateData = [
  'Exact amount',
  'Sensitive contract values',
  'Financial details',
  'Private agreement context',
]

export function PrivacySection() {
  return (
    <section>
      <SectionTitle kicker="Privacy" title="Transparency for verification, confidentiality for value." />
      <div className="privacy-grid">
        <Card>
          <h4>Public blockchain sees</h4>
          <ul>
            {publicData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h4>Private / confidential</h4>
          <ul>
            {privateData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  )
}
