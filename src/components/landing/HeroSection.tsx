import { Button } from '../ui/Button'

interface HeroSectionProps {
  onLaunchDemo: () => void
}

export function HeroSection({ onLaunchDemo }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <p className="chip">Web3 Real Estate Infrastructure</p>
      <h1>AnticreticSafe</h1>
      <h3>Confidential real estate agreement infrastructure powered by Nox and ERC7984.</h3>
      <p>
        Register property-backed occupancy agreements, verify legal milestones through document
        hashes, and protect sensitive financial amounts using confidential smart contracts.
      </p>
      <div className="hero-actions">
        <Button onClick={onLaunchDemo}>Launch Demo</Button>
        <Button
          variant="ghost"
          onClick={() =>
            document.getElementById('contracts')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          View Contracts
        </Button>
      </div>
    </section>
  )
}
