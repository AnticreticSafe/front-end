import { Card } from '../ui/Card'
import { SectionTitle } from '../ui/SectionTitle'

const problems = [
  'Real estate agreements depend on trust, paper documents, and fragmented registries.',
  'Sensitive amounts and identities should not be exposed publicly.',
  'Parties need verifiable proof without leaking private information.',
]

export function ProblemSection() {
  return (
    <section>
      <SectionTitle
        kicker="Problem"
        title="Traditional agreements fail under global, digital, and privacy requirements."
      />
      <div className="grid-3">
        {problems.map((item) => (
          <Card key={item}>
            <p>{item}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
