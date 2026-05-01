import { AllInOneSection } from '../components/landing/AllInOneSection'
import { EcosystemSection } from '../components/landing/EcosystemSection'
import { HeroSection } from '../components/landing/HeroSection'
import { SolutionSection } from '../components/landing/SolutionSection'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'

interface LandingPageProps {
  onLaunchDemo: () => void
}

function CtaSection({ onLaunchDemo }: { onLaunchDemo: () => void }) {
  return (
    <section style={{ backgroundColor: "#1a1340" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
        <div
          style={{
            borderRadius: "24px",
            padding: "72px 48px",
            background: "linear-gradient(135deg, rgba(107,96,242,0.25) 0%, rgba(34,26,76,0.9) 100%)",
            border: "1px solid rgba(107,96,242,0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative blobs */}
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(107,96,242,0.15)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(216,250,177,0.1)", filter: "blur(40px)", pointerEvents: "none" }} />

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
              background: "rgba(107,96,242,0.2)",
              color: "#d8fab1",
              border: "1px solid rgba(107,96,242,0.3)",
            }}
          >
            Live on Arbitrum Sepolia · Testnet
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
            Register the first confidential<br />
            anticretic agreement.
          </h2>

          <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "rgba(255,255,255,0.55)", maxWidth: "560px", margin: "0 auto 40px" }}>
            Connect your wallet, create an agreement, and experience the full on-chain lifecycle
            of a real estate contract — with privacy-preserving confidential amounts.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
            <button
              type="button"
              onClick={onLaunchDemo}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "12px",
                padding: "14px 32px",
                fontSize: "0.9rem",
                fontWeight: 700,
                background: "#d8fab1",
                color: "#221a4c",
                border: "none",
                cursor: "pointer",
              }}
            >
              Launch App
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <a
              href="https://sepolia.arbiscan.io/address/0x40e75D0648BCB2F374dF053DeEa8A70e74699545"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "12px",
                padding: "14px 28px",
                fontSize: "0.9rem",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                background: "rgba(255,255,255,0.08)",
                textDecoration: "none",
              }}
            >
              View on Arbiscan
            </a>
          </div>

          <p style={{ marginTop: "24px", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
            Arbitrum Sepolia · Chain ID 421614 · Testnet only
          </p>
        </div>
      </div>
    </section>
  )
}

export function LandingPage({ onLaunchDemo }: LandingPageProps) {
  return (
    <main style={{ overflow: "hidden" }}>
      <HeroSection onLaunchDemo={onLaunchDemo} />
      <AllInOneSection />
      <SolutionSection />
      <EcosystemSection />
      <TestimonialsSection />
      <CtaSection onLaunchDemo={onLaunchDemo} />
    </main>
  )
}
