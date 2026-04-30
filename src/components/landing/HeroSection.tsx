import { Button } from '../ui/Button'
import { FiActivity, FiArrowUpRight } from 'react-icons/fi'

interface HeroSectionProps {
  onLaunchDemo: () => void
}

export function HeroSection({ onLaunchDemo }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <p className="chip shadow-sm bg-white border border-slate-100 mb-6">
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-medium">Introducing: Web3 Real Estate Infrastructure</span> 🚀
      </p>

      <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
        The First Web3
        <br />
        <span className="rgb-title leading-tight">
          Confidential Anticretic Contract
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-slate-500">
        Register property-backed occupancy agreements, verify legal milestones through document
        hashes, and protect sensitive financial amounts using confidential smart contracts.
      </p>
      
      <div className="hero-actions mt-10">
        <Button onClick={onLaunchDemo} variant="primary">
          Launch APP
        </Button>
      </div>

      <div className="mt-24 w-full max-w-5xl grid gap-6 sm:grid-cols-3">
        <div className="card bg-gradient-to-br from-[#eff6ff] to-white border-[#dbeafe] shadow-sm text-center py-8 rounded-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Value Locked</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">$342,089,108</p>
        </div>

        <div className="card bg-gradient-to-br from-[#fff7ed] to-white border-[#ffedd5] shadow-sm text-center py-8 rounded-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total asUSD Minted</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">342,089,108</p>
        </div>

        <div className="card bg-gradient-to-br from-[#faf5ff] to-white border-[#f3e8ff] shadow-sm text-center py-8 rounded-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Anticretic APY</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">15%</p>
        </div>
      </div>
    </section>
  )
}
