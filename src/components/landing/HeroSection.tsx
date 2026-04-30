import { Button } from '../ui/Button'
import { FiActivity, FiArrowUpRight, FiDollarSign, FiTrendingUp } from 'react-icons/fi'

interface HeroSectionProps {
  onLaunchDemo: () => void
}

export function HeroSection({ onLaunchDemo }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <p className="chip">
        <FiActivity className="h-4 w-4 text-indigo-600" aria-hidden="true" />
        Web3 Real Estate Infrastructure
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
        <span className="rgb-title">
          AnticreticSafe
        </span>
      </h1>

      <h3 className="mt-4 max-w-3xl text-lg font-medium text-slate-800 sm:text-xl">
        Confidential real estate agreement infrastructure powered by Nox and ERC7984.
      </h3>
      <p className="mt-3 max-w-3xl text-slate-600">
        Register property-backed occupancy agreements, verify legal milestones through document
        hashes, and protect sensitive financial amounts using confidential smart contracts.
      </p>
      <div className="hero-actions">
        <Button onClick={onLaunchDemo}>
          Launch App <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            document.getElementById('contracts')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          View Contracts
        </Button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">TVL (demo)</p>
            <FiDollarSign className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">$0</p>
          <p className="mt-1 text-sm text-slate-600">Connect wallet to start</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">Minted asUSD (demo)</p>
            <FiActivity className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">0</p>
          <p className="mt-1 text-sm text-slate-600">Confidential balances supported</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">APR (demo)</p>
            <FiTrendingUp className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">—</p>
          <p className="mt-1 text-sm text-slate-600">Not calculated yet</p>
        </div>
      </div>
    </section>
  )
}
