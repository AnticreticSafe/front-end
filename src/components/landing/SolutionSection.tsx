import { Card } from '../ui/Card'
import { SectionTitle } from '../ui/SectionTitle'

const items = [
  'Hash-based document verification',
  'Confidential amount registration with Nox',
  'ERC7984 confidential token asUSD',
  'Global agreement flow adaptable to Bolivia, the US, and other jurisdictions',
]

export function SolutionSection() {
  return (
    <section>
      <SectionTitle kicker="Solution" title="A privacy-preserving legal flow anchored on-chain." />
      <div className="grid-2">
        {items.map((item) => (
          <Card key={item}>
            <p>{item}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
