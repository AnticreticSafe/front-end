// Propbinder-style Integrations section with orbital animation

const OUTER_LOGOS = [
  { name: 'Arbitrum', short: 'ARB', color: '#6b60f2' },
  { name: 'wagmi', short: 'WGM', color: '#d8fab1' },
  { name: 'Zapier', short: 'ZAP', color: '#6b60f2' },
  { name: 'iExec', short: 'RLC', color: '#d8fab1' },
  { name: 'Viem', short: 'VIM', color: '#6b60f2' },
  { name: 'GSAP', short: 'GS', color: '#d8fab1' },
  { name: 'Solidity', short: 'SOL', color: '#6b60f2' },
  { name: 'Ethers', short: 'ETH', color: '#d8fab1' },
]

const INNER_LOGOS = [
  { name: 'ERC-7984', short: 'ERC', color: '#d8fab1' },
  { name: 'Nox', short: 'NOX', color: '#6b60f2' },
  { name: 'Vite', short: 'VIT', color: '#d8fab1' },
  { name: 'React', short: 'RCT', color: '#6b60f2' },
]

function OrbitalLogo({
  short,
  color,
  angle,
  radius,
  counterRotate,
}: {
  name: string
  short: string
  color: string
  angle: number
  radius: number
  counterRotate?: boolean
}) {
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(34,26,76,0.95)",
          border: `1.5px solid ${color}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.6rem",
          fontWeight: 700,
          color: color,
          animation: counterRotate ? "orbit-ccw-text 22s linear infinite" : "orbit-cw-text 22s linear infinite",
        }}
      >
        {short}
      </div>
    </div>
  )
}

export function EcosystemSection() {
  const outerCount = OUTER_LOGOS.length
  const innerCount = INNER_LOGOS.length

  return (
    <section style={{ backgroundColor: "#1a1340" }}>
      <style>{`
        @keyframes orbit-cw  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes orbit-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes orbit-cw-text  { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
        @keyframes orbit-ccw-text { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "96px 24px" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "64px", alignItems: "center" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "9999px",
                padding: "8px 16px",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginBottom: "24px",
                background: "rgba(107,96,242,0.15)",
                color: "#d8fab1",
                border: "1px solid rgba(107,96,242,0.3)",
              }}
            >
              ⚡ Integrations
            </div>

            <h2
              style={{
                fontFamily: "Brockmann, Syne, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: "#ffffff",
                lineHeight: 1.2,
                marginBottom: "20px",
              }}
            >
              Automate your Web3 workflows
            </h2>

            <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "rgba(255,255,255,0.55)", marginBottom: "32px" }}>
              AnticreticSafe connects seamlessly with Arbitrum, iExec Nox, ERC-7984, and the full
              Ethereum toolchain to deliver a complete confidential agreement experience.
            </p>

            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "0.875rem",
                fontWeight: 600,
                background: "#d8fab1",
                color: "#221a4c",
                textDecoration: "none",
              }}
            >
              See all integrations
            </a>

            {/* Integration list */}
            <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {["Arbitrum Sepolia", "iExec Nox", "ERC-7984 tokens", "Wagmi + Viem", "Solidity 0.8", "React + Vite"].map((name) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6b60f2", flexShrink: 0 }} />
                  {name}
                </div>
              ))}
            </div>
          </div>

          {/* Orbital animation */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: "380px", height: "380px" }}>
              {/* Outer orbit ring */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "1px solid rgba(107,96,242,0.25)",
                  animation: "orbit-cw 22s linear infinite",
                }}
              >
                {OUTER_LOGOS.map((logo, i) => (
                  <OrbitalLogo
                    key={logo.name}
                    {...logo}
                    angle={(i / outerCount) * 360}
                    radius={190}
                    counterRotate
                  />
                ))}
              </div>

              {/* Inner orbit ring */}
              <div
                style={{
                  position: "absolute",
                  inset: "70px",
                  borderRadius: "50%",
                  border: "1px solid rgba(216,250,177,0.2)",
                  animation: "orbit-ccw 16s linear infinite",
                }}
              >
                {INNER_LOGOS.map((logo, i) => (
                  <OrbitalLogo
                    key={logo.name}
                    {...logo}
                    angle={(i / innerCount) * 360}
                    radius={120}
                  />
                ))}
              </div>

              {/* Center logo */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6b60f2, #d8fab1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#221a4c",
                  boxShadow: "0 0 40px rgba(107,96,242,0.4)",
                  zIndex: 10,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                ANTI<br />CRETIC
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}