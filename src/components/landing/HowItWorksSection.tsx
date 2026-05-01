const STEPS = [
  {
    number: '01',
    title: 'Create Agreement',
    description: 'Either party creates the agreement on-chain with both wallet addresses and a property hash.',
    owner: true,
    occupant: false,
  },
  {
    number: '02',
    title: 'Upload Title Report',
    description: 'Property owner uploads the Informe Alodial hash, verifying legal ownership of the property.',
    owner: true,
    occupant: false,
  },
  {
    number: '03',
    title: 'Parties Approve',
    description: 'Both property owner and occupant approve the terms. Agreement advances only when both sign.',
    owner: true,
    occupant: true,
  },
  {
    number: '04',
    title: 'Upload Agreement Contract',
    description: 'Property owner anchors the signed Minuta hash on-chain as immutable proof.',
    owner: true,
    occupant: false,
  },
  {
    number: '05',
    title: 'Upload Registry Proof',
    description: 'Property owner uploads the Derechos Reales hash — the public registry confirmation.',
    owner: true,
    occupant: false,
  },
  {
    number: '06',
    title: 'Mint Confidential asUSD',
    description: 'Property owner mints encrypted asUSD to the occupant using Nox and ERC-7984.',
    owner: true,
    occupant: false,
  },
  {
    number: '07',
    title: 'Register Confidential Amount',
    description: 'Occupant registers the encrypted amount handle on-chain, anchoring it to the agreement.',
    owner: false,
    occupant: true,
  },
  {
    number: '08',
    title: 'Confirm Possession',
    description: 'Both parties confirm physical possession of the property has been delivered.',
    owner: true,
    occupant: true,
  },
  {
    number: '09',
    title: 'Agreement Active',
    description: 'The anticretic agreement is now fully live on Arbitrum Sepolia with all milestones verified.',
    owner: false,
    occupant: false,
  },
  {
    number: '10',
    title: 'Money & Property Return',
    description: 'At term end, occupant confirms money returned; owner confirms property returned.',
    owner: true,
    occupant: true,
  },
  {
    number: '11',
    title: 'Close Agreement',
    description: 'Either party closes the agreement. A closure proof hash is anchored on-chain.',
    owner: true,
    occupant: true,
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-slate-50/80">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-14 text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold text-indigo-600">
            How It Works
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            A deterministic milestone timeline
            <br />
            for all parties.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Every step is enforced by the smart contract. No party can skip ahead or bypass the
            process. The flow is the same every time.
          </p>
          <div className="mt-5 flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-blue-600"><span className="h-2.5 w-2.5 rounded-full bg-blue-400 inline-block" /> Property Owner action</span>
            <span className="flex items-center gap-1.5 text-emerald-600"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" /> Occupant action</span>
            <span className="flex items-center gap-1.5 text-purple-600"><span className="h-2.5 w-2.5 rounded-full bg-purple-400 inline-block" /> Both parties</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => {
            const isBoth = step.owner && step.occupant
            const borderColor = isBoth ? 'border-purple-200' : step.owner ? 'border-blue-200' : step.occupant ? 'border-emerald-200' : 'border-slate-200'
            const badgeColor = isBoth ? 'bg-purple-100 text-purple-700' : step.owner ? 'bg-blue-100 text-blue-700' : step.occupant ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            const badgeLabel = isBoth ? 'Both' : step.owner ? 'Owner' : step.occupant ? 'Occupant' : 'System'

            return (
              <div
                key={step.number}
                className={`rounded-2xl border ${borderColor} bg-white p-5 shadow-sm`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-2xl font-black text-slate-200">{step.number}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}>
                    {badgeLabel}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
