import { Card } from '../ui/Card'
import { SectionTitle } from '../ui/SectionTitle'

export function ContractsSection() {
  return (
    <section id="contracts">
      <SectionTitle kicker="Contracts" title="Arbitrum Sepolia deployed contracts" />
      <div className="grid-2">
        <Card>
          <h4>AnticreticSafeUSD / asUSD</h4>
          <code>0x5e57022c7dfE939456f2aad9B11153d6beAEC06D</code>
        </Card>
        <Card>
          <h4>AnticreticSafe</h4>
          <code>0x40e75D0648BCB2F374dF053DeEa8A70e74699545</code>
        </Card>
      </div>
    </section>
  )
}
