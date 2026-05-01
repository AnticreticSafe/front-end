// Propbinder-style dark features section with bento grid tiles

const FEATURES = [
  {
    id: "docverify",
    tag: "Document Verification",
    tagIcon: "📄",
    headline: "Register legal documents with immutable on-chain proof",
    description:
      "Every legal milestone — title report, property deed, party approvals — is anchored on Arbitrum via SHA-256 hashes. No tampering possible.",
    bentoLeft: {
      headline: "Hash-based proof",
      description:
        "Upload any document and its SHA-256 hash is stored on-chain. Any third party can independently verify authenticity.",
    },
    bentoRight: {
      headline: "Immutable milestones",
      description:
        "Once a document hash is registered it cannot be altered or deleted. Permanent legal record on the blockchain.",
    },
  },
  {
    id: "confidential",
    tag: "Confidential Finance",
    tagIcon: "🔒",
    headline: "Protect financial amounts using ERC-7984 confidential tokens",
    description:
      "The anticretic amount stays fully encrypted. iExec Nox encryption ensures only authorized parties can view the balance — never exposed on-chain.",
    bentoLeft: {
      headline: "ERC-7984 standard",
      description:
        "Industry-standard confidential token protocol. Compatible with any EVM wallet — no special setup required.",
    },
    bentoRight: {
      headline: "iExec Nox encryption",
      description:
        "Multi-party encryption scheme. The amount is split into encrypted shares — safe even if one party is compromised.",
    },
  },
  {
    id: "lifecycle",
    tag: "Agreement Lifecycle",
    tagIcon: "⚡",
    headline: "Enforce every milestone of the anticretic agreement on-chain",
    description:
      "From creation to closure, 11 enforced states ensure no party can skip steps. Both parties must approve before moving forward.",
    bentoLeft: {
      headline: "Multi-party approval",
      description:
        "Owner and Occupant must independently approve each milestone. Smart contract enforces the order.",
    },
    bentoRight: {
      headline: "Real-time status",
      description:
        "Anyone can verify the current agreement state publicly. No need for third-party intermediaries.",
    },
  },
]

function BentoTile({
  headline,
  description,
  side,
}: {
  headline: string
  description: string
  side: "left" | "right"
}) {
  return (
    <div className="card-gradient-border" style={{ height: "100%" }}>
      <div className="bento-tile" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h6
          style={{
            fontFamily: "Brockmann, Syne, sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#fff",
            margin: 0,
          }}
        >
          {headline}
        </h6>
        <p style={{ fontSize: "0.75rem", lineHeight: 1.6, color: "rgba(255,255,255,0.55)", margin: 0 }}>
          {description}
        </p>
        <div
          style={{
            marginTop: "auto",
            height: "64px",
            borderRadius: "8px",
            opacity: 0.4,
            background:
              side === "left"
                ? "linear-gradient(135deg, rgba(107,96,242,0.5) 0%, transparent 80%)"
                : "linear-gradient(225deg, rgba(216,250,177,0.35) 0%, transparent 80%)",
          }}
        />
      </div>
    </div>
  )
}

export function SolutionSection() {
  return (
    <section style={{ backgroundColor: "#221a4c" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "96px 24px" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#6b60f2",
              marginBottom: "16px",
            }}
          >
            Features
          </p>
          <h2
            style={{
              fontFamily: "Brockmann, Syne, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#ffffff",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.2,
            }}
          >
            Everything you need for a secure anticretic agreement
          </h2>
        </div>

        {/* Feature blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "112px" }}>
          {FEATURES.map((feat, idx) => (
            <div
              key={feat.id}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "48px",
                alignItems: "start",
              }}
            >
              {/* Header column */}
              <div style={{ order: idx % 2 === 1 ? 2 : 1 }}>
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
                  <span>{feat.tagIcon}</span>
                  <span>{feat.tag}</span>
                </div>

                <h2
                  style={{
                    fontFamily: "Brockmann, Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    color: "#ffffff",
                    lineHeight: 1.25,
                    marginBottom: "20px",
                  }}
                >
                  {feat.headline}
                </h2>

                <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "rgba(255,255,255,0.55)", marginBottom: "32px" }}>
                  {feat.description}
                </p>

                <a
                  href="#"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    padding: "10px 20px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    background: "#6b60f2",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  Learn more
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                {/* Main feature tile */}
                <div
                  style={{
                    marginTop: "32px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(107,96,242,0.2)",
                    overflow: "hidden",
                    minHeight: "180px",
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      height: "32px",
                      width: "128px",
                      borderRadius: "8px",
                      background: "rgba(107,96,242,0.25)",
                      marginBottom: "16px",
                    }}
                  />
                  {[80, 55, 90, 40].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: "8px",
                        borderRadius: "9999px",
                        width: `${w}%`,
                        marginBottom: "8px",
                        background: i % 2 === 0 ? "rgba(107,96,242,0.4)" : "rgba(216,250,177,0.25)",
                      }}
                    />
                  ))}
                  <div
                    style={{
                      marginTop: "16px",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      background: "rgba(107,96,242,0.1)",
                      border: "1px solid rgba(107,96,242,0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#d8fab1" }} />
                    <span style={{ fontSize: "0.75rem", color: "#d8fab1" }}>{feat.tag} · Active</span>
                  </div>
                </div>
              </div>

              {/* Bento grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  order: idx % 2 === 1 ? 1 : 2,
                }}
              >
                <BentoTile {...feat.bentoLeft} side="left" />
                <BentoTile {...feat.bentoRight} side="right" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
