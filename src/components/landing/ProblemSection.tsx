const PROBLEMS = [
  {
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    title: 'Paper-based agreements',
    description:
      'Traditional anticretic contracts depend on notaries, paper documents, and fragmented local registries that are impossible to verify remotely.',
  },
  {
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    title: 'Financial amounts exposed',
    description:
      'On public blockchains, transaction amounts are visible to everyone. Sensitive confidential values of anticretic agreements must not be revealed on-chain.',
  },
  {
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    title: 'No verifiable proof of milestones',
    description:
      'Parties need cryptographic proof of each legal milestone — title report, public registry, possession — without leaking private information to third parties.',
  },
]

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="text-center mb-14">
        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600">
          The Problem
        </span>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Traditional real estate agreements
          <br />
          fail in a digital, global world.
        </h2>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          Anticretic contracts in Bolivia and Latin America are centuries-old instruments
          that were never designed for transparency, privacy, or cross-border trust.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {PROBLEMS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={p.icon} />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
