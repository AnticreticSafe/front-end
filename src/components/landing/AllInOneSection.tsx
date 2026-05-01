// Tech partner logos for the scrolling marquee
const TECH_LOGOS = [
  { name: 'Arbitrum', icon: '⚡', color: '#6b60f2' },
  { name: 'iExec Nox', icon: '🔒', color: '#d8fab1' },
  { name: 'ERC-7984', icon: '🪙', color: '#6b60f2' },
  { name: 'Wagmi', icon: '🔗', color: '#d8fab1' },
  { name: 'Viem', icon: '📡', color: '#6b60f2' },
  { name: 'Solidity', icon: '📜', color: '#d8fab1' },
  { name: 'Arbitrum', icon: '⚡', color: '#6b60f2' },
  { name: 'iExec Nox', icon: '🔒', color: '#d8fab1' },
  { name: 'ERC-7984', icon: '🪙', color: '#6b60f2' },
  { name: 'Wagmi', icon: '🔗', color: '#d8fab1' },
  { name: 'Viem', icon: '📡', color: '#6b60f2' },
  { name: 'Solidity', icon: '📜', color: '#d8fab1' },
]

export function AllInOneSection() {
  return (
    <section style={{ backgroundColor: '#1a1340', borderTop: '1px solid rgba(107,96,242,0.2)' }}>
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">

        {/* Demo Video */}
        <div
          className="relative mx-auto mb-20 overflow-hidden rounded-2xl"
          style={{
            maxWidth: '900px',
            border: '2px solid rgba(107,96,242,0.5)',
            boxShadow: '0 0 60px rgba(107,96,242,0.25)',
            background: '#0d0b26',
          }}
        >
          {/* Banner label */}
          <div
            className="flex items-center justify-center gap-3 px-6 py-3"
            style={{ borderBottom: '1px solid rgba(107,96,242,0.3)', background: 'rgba(107,96,242,0.12)' }}
          >
            <span className="text-base font-semibold tracking-wide" style={{ color: '#d8fab1' }}>
              AnticreticSafe · Demo
            </span>
            <span
              className="rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-widest"
              style={{ background: '#6b60f2', color: '#fff' }}
            >
              Live on Arbitrum Sepolia
            </span>
          </div>

          {/* 16:9 iframe */}
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              src="https://www.youtube.com/embed/bV2p5aG4Sxs"
              title="AnticreticSafe Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
        </div>

        {/* Eyebrow */}
        <p
          className="mb-4 text-xs font-bold tracking-widest uppercase"
          style={{ color: '#6b60f2' }}
        >
          All-in-one Web3 Anticretic Infrastructure
        </p>

        {/* Headline */}
        <h2
          className="mx-auto max-w-3xl leading-tight"
          style={{
            fontFamily: 'Brockmann, Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            color: '#ffffff',
          }}
        >
          The on-chain platform for property owners,
          occupants, and auditors
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          From agreement creation to confidential financial registration — every step secured
          by Arbitrum, privacy-preserved by iExec Nox, and fully auditable on-chain.
        </p>

        {/* Logo marquee */}
        <div className="relative mt-14 overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
          <div className="marquee-track gap-4" style={{ display: 'flex', alignItems: 'center' }}>
            {[...TECH_LOGOS, ...TECH_LOGOS].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center gap-3 rounded-2xl px-6 py-3.5"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: '140px',
                }}
              >
                <span className="text-xl">{logo.icon}</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: logo.color, whiteSpace: 'nowrap' }}
                >
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Browser/dashboard screenshot placeholder */}
        <div
          className="relative mx-auto mt-16 overflow-hidden rounded-2xl"
          style={{
            maxWidth: '900px',
            border: '1px solid rgba(107,96,242,0.3)',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.05)' }}
          >
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#28c940' }} />
            <div
              className="mx-auto rounded-full px-6 py-1 text-xs"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
            >
              app.anticreticsafe.io/dashboard
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="grid grid-cols-3 gap-4 p-8" style={{ minHeight: '280px' }}>
            {[
              { label: 'Active Agreements', value: '3', color: '#6b60f2' },
              { label: 'Total asUSD Locked', value: '150,000', color: '#d8fab1' },
              { label: 'Documents On-Chain', value: '12', color: '#6b60f2' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="text-3xl font-bold"
                  style={{ fontFamily: 'Brockmann, Syne, sans-serif', color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{stat.label}</div>
              </div>
            ))}
            <div
              className="col-span-3 rounded-xl p-5"
              style={{ background: 'rgba(107,96,242,0.08)', border: '1px solid rgba(107,96,242,0.2)' }}
            >
              <div className="mb-3 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Agreement AS-0002 · ApprovedByParties</div>
              <div className="flex gap-2">
                {['Created', 'TitleReport', 'DeedReport', 'ApprovedByParties'].map((step) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: '#d8fab1' }} />
                    <span className="text-xs" style={{ color: '#d8fab1' }}>{step}</span>
                    {step !== 'ApprovedByParties' && <span className="text-white/20 text-xs">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



