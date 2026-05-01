const PUBLIC_DATA = [
  { icon: '🔑', label: 'Agreement ID', desc: 'Unique identifier anchored on Arbitrum.' },
  { icon: '👛', label: 'Wallet addresses', desc: 'Property owner and occupant public keys.' },
  { icon: '📊', label: 'Agreement status', desc: 'Current milestone: Created, Active, Closed, etc.' },
  { icon: '#️⃣', label: 'Document hashes', desc: 'SHA-256 hashes of legal documents.' },
  { icon: '🕐', label: 'Timestamps', desc: 'When each milestone was achieved on-chain.' },
]

const PRIVATE_DATA = [
  { icon: '💰', label: 'Exact financial amount', desc: 'The anticretic amount is encrypted end-to-end.' },
  { icon: '🔐', label: 'Encrypted amount handle', desc: 'Only readable by authorized parties with Nox.' },
  { icon: '📄', label: 'Document contents', desc: 'Only hashes are stored. Documents stay off-chain.' },
  { icon: '🤫', label: 'Private agreement context', desc: 'Terms, negotiations, and sensitive details.' },
]

export function PrivacySection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-14 text-center">
        <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-semibold text-purple-600">
          Privacy Architecture
        </span>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Transparency for verification.
          <br />
          Confidentiality for value.
        </h2>
        <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
          AnticreticSafe separates what is public for audit from what is private by design.
          Nobody can see the amount — not even the blockchain.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Public */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Public blockchain sees</h3>
              <p className="text-xs text-slate-500">Visible to any auditor or verifier</p>
            </div>
          </div>
          <div className="grid gap-3">
            {PUBLIC_DATA.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-xl bg-emerald-50 px-4 py-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Private */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Private / confidential</h3>
              <p className="text-xs text-slate-500">Protected by Nox encryption — ERC-7984</p>
            </div>
          </div>
          <div className="grid gap-3">
            {PRIVATE_DATA.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
