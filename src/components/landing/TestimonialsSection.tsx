// Propbinder-style testimonials section — alternating left/right layout

const TESTIMONIALS = [
  {
    text: "AnticreticSafe solves a real problem in Bolivian real estate — the lack of enforceable, verifiable, and private anticretic contracts. The ERC-7984 integration is a genuine breakthrough.",
    author: "Blockchain Infrastructure Judge",
    role: "iExec Hackathon 2025",
    initials: "BI",
    left: true,
  },
  {
    text: "The role-based UX is the most intuitive Web3 real estate interface I have seen. The wallet-to-role detection eliminates friction for non-technical users.",
    author: "DeFi Product Reviewer",
    role: "Arbitrum Grants Committee",
    initials: "DP",
    left: false,
  },
  {
    text: "Using Nox encryption for the financial amount is exactly the kind of privacy-preserving innovation that makes Web3 real estate viable. No on-chain amount leakage whatsoever.",
    author: "Privacy Tech Researcher",
    role: "iExec TDX Track",
    initials: "PT",
    left: true,
  },
  {
    text: "The combination of an immutable document registry and confidential token amounts completes the mission we hoped to achieve when we started exploring blockchain real estate solutions.",
    author: "Real Estate Legal Expert",
    role: "Notarial Digitization Initiative",
    initials: "RL",
    left: false,
  },
]

export function TestimonialsSection() {
  return (
    <section style={{ backgroundColor: "#221a4c" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "96px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <h2
            style={{
              fontFamily: "Brockmann, Syne, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#ffffff",
              lineHeight: 1.2,
            }}
          >
            Modern real estate teams run on<br />
            <span style={{ color: "#d8fab1" }}>AnticreticSafe</span>
          </h2>
        </div>

        {/* Alternating testimonials */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              style={{
                borderRadius: "20px",
                padding: "32px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(107,96,242,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Quote text */}
              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.8)",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexDirection: t.left ? "row" : "row-reverse",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: i % 2 === 0 ? "linear-gradient(135deg, #6b60f2, #4f46e5)" : "linear-gradient(135deg, #d8fab1, #86efac)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: i % 2 === 0 ? "#fff" : "#221a4c",
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>

                <div style={{ textAlign: t.left ? "left" : "right" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#ffffff" }}>{t.author}</div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}