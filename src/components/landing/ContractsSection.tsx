const CONTRACTS = [
  {
    name: 'AnticreticSafe',
    symbol: 'Core Agreement Contract',
    address: '0x40e75D0648BCB2F374dF053DeEa8A70e74699545',
    description: 'Manages the full anticretic agreement lifecycle: creation, milestones, possession, and closure.',
    color: 'indigo',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    name: 'AnticreticSafeUSD',
    symbol: 'asUSD',
    address: '0x5e57022c7dfE939456f2aad9B11153d6beAEC06D',
    description: 'ERC-7984 confidential token. Amounts are encrypted with Nox — never readable on-chain.',
    color: 'purple',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
]

const TECH_STACK = [
  { name: 'Arbitrum Sepolia', desc: 'Chain ID 421614', color: 'blue' },
  { name: 'ERC-7984', desc: 'Confidential tokens', color: 'purple' },
  { name: 'iExec Nox', desc: 'Client-side encryption', color: 'indigo' },
  { name: 'Wagmi / Viem', desc: 'React Web3 hooks', color: 'cyan' },
]

const EXPLORER = 'https://sepolia.arbiscan.io/address/'

export function ContractsSection() {
  return (
    <section className="bg-slate-50/80">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-14 text-center">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600">
            On-Chain Contracts
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Deployed on Arbitrum Sepolia
          </h2>
          <p className="mt-3 text-lg text-slate-500">
            All contracts are open source and publicly verifiable on Arbiscan.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-12">
          {CONTRACTS.map((c) => {
            const indigo = 'border-indigo-200 bg-indigo-50 text-indigo-600'
            const purple = 'border-purple-200 bg-purple-50 text-purple-600'
            const iconBg = c.color === 'indigo' ? indigo : purple
            return (
              <div
                key={c.name}
                className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${iconBg}`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {c.symbol}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-500">{c.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <code className="flex-1 break-all rounded-lg bg-slate-50 px-3 py-2 text-xs text-sky-700 border border-slate-100">
                        {c.address}
                      </code>
                      <a
                        href={`${EXPLORER}${c.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-900 transition"
                        title="View on Arbiscan"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tech stack */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Tech Stack</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TECH_STACK.map((t) => (
              <div key={t.name} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
                <p className="text-sm font-bold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
