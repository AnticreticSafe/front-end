const ARBISCAN = 'https://sepolia.arbiscan.io/address/'
const CONTRACT = '0x40e75D0648BCB2F374dF053DeEa8A70e74699545'
const ASUSD = '0x5e57022c7dfE939456f2aad9B11153d6beAEC06D'

type LinkItem = { label: string; href: string; external?: boolean }
const LINKS: Record<string, LinkItem[]> = {
  Platform: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Create Agreement', href: '/agreements/create' },
    { label: 'Agreement Detail', href: '#' },
  ],
  Features: [
    { label: 'Document Verification', href: '#' },
    { label: 'Confidential Finance', href: '#' },
    { label: 'Agreement Lifecycle', href: '#' },
  ],
  Technology: [
    { label: 'Arbitrum Sepolia', href: 'https://arbitrum.io', external: true },
    { label: 'iExec Nox', href: 'https://iex.ec', external: true },
    { label: 'ERC-7984', href: '#' },
    { label: 'Wagmi + Viem', href: 'https://wagmi.sh', external: true },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'AnticreticSafe Contract', href: ARBISCAN + CONTRACT, external: true },
    { label: 'asUSD Contract', href: ARBISCAN + ASUSD, external: true },
  ],
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#1a1340", borderTop: "1px solid rgba(107,96,242,0.2)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 24px 40px" }}>
        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "48px", marginBottom: "56px" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6b60f2, #d8fab1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#221a4c",
                }}
              >
                AS
              </div>
              <span
                style={{
                  fontFamily: "Brockmann, Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#fff",
                }}
              >
                Anticretic<span style={{ color: "#d8fab1" }}>Safe</span>
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.65, color: "rgba(255,255,255,0.45)", maxWidth: "220px" }}>
              Confidential on-chain anticretic agreements for Bolivian real estate.
              Built on Arbitrum with iExec Nox encryption.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h6
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "16px",
                }}
              >
                {group}
              </h6>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#d8fab1")}
                      onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            &copy; {new Date().getFullYear()} AnticreticSafe. Built for the iExec Hackathon 2025.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy Policy", "Terms"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                }}
              >
                {item}
              </a>
            ))}
            <a
              href={ARBISCAN + CONTRACT}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.75rem", color: "#6b60f2", textDecoration: "none" }}
            >
              Contract on Arbiscan
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}