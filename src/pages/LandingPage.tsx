import { ContractsSection } from '../components/landing/ContractsSection'
import { HeroSection } from '../components/landing/HeroSection'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'
import { PrivacySection } from '../components/landing/PrivacySection'
import { ProblemSection } from '../components/landing/ProblemSection'
import { SolutionSection } from '../components/landing/SolutionSection'

interface LandingPageProps {
  onLaunchDemo: () => void
}

export function LandingPage({ onLaunchDemo }: LandingPageProps) {
  return (
    <main className="page landing-page">
      <HeroSection onLaunchDemo={onLaunchDemo} />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <PrivacySection />
      <ContractsSection />
    </main>
  )
}
