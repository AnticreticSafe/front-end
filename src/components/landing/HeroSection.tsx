import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface HeroSectionProps {
  onLaunchDemo: () => void
}

// Chat bubbles content â€” adapted for anticretic agreements
const CHAT_RIGHT = [
  {
    bubbles: [
      { type: 'left',  text: 'What is the status of our agreement?' },
      { type: 'right', text: 'AS-0002 is approved by both parties âœ“' },
      { type: 'icon',  text: 'Agreement confirmed on-chain' },
    ],
  },
  {
    bubbles: [
      { type: 'left',  text: 'Can I see the document hashes?' },
      { type: 'left',  text: 'I need them for the notary' },
      { type: 'right', text: 'Title report: 0xf7c3â€¦a2b1 âœ“' },
      { type: 'icon',  text: 'Hash verified on Arbitrum' },
    ],
  },
  {
    bubbles: [
      { type: 'left',  text: 'How do I register the confidential amount?' },
      { type: 'right', text: 'Mint asUSD first, then register' },
      { type: 'right', text: 'Your amount stays fully encrypted' },
      { type: 'icon',  text: 'Amount encrypted with Nox' },
    ],
  },
]

const CHAT_LEFT = [
  {
    bubbles: [
      { type: 'left',  text: 'My agreement is not showing up' },
      { type: 'right', text: 'Connect with owner address 0x2051â€¦' },
      { type: 'icon',  text: 'Wallet connected' },
    ],
  },
  {
    bubbles: [
      { type: 'left',  text: 'My asUSD balance shows zero' },
      { type: 'left',  text: 'Is the contract active?' },
      { type: 'right', text: 'Balance: 50,000 asUSD encrypted âœ“' },
      { type: 'icon',  text: 'Balance confirmed' },
    ],
  },
  {
    bubbles: [
      { type: 'left',  text: 'Where is the property deed stored?' },
      { type: 'right', text: 'Stored on-chain via SHA-256 hash' },
      { type: 'right', text: 'Immutable and publicly verifiable' },
      { type: 'icon',  text: 'Document verified' },
    ],
  },
]

// Popover card data
const POPOVERS = [
  {
    title: 'Agreement Status',
    content: (
      <>
        <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Brockmann, Syne, sans-serif' }}>AS-0002</div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#d8fab1' }}>
          <span className="h-2 w-2 rounded-full inline-block" style={{ background: '#d8fab1' }} />
          Approved by both parties
        </div>
        <div className="mt-2 text-xs text-white/40">Arbitrum Sepolia Â· Chain ID 421614</div>
      </>
    ),
  },
  {
    title: 'Confidential Balance',
    content: (
      <>
        <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Brockmann, Syne, sans-serif' }}>50,000 asUSD</div>
        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Encrypted Â· iExec Nox powered
        </div>
      </>
    ),
  },
  {
    title: 'Document Hashes',
    content: (
      <>
        <div className="space-y-2 mt-1">
          {[
            { label: 'Title report', hash: '0xf7c3â€¦a2b1' },
            { label: 'Property deed', hash: '0x8b4eâ€¦c7d3' },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-xs text-white">
              <span style={{ color: '#d8fab1' }}>âœ“</span>
              <span className="font-mono" style={{ color: '#6b60f2' }}>{d.hash}</span>
              <span className="text-white/40">{d.label}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: 'Parties',
    content: (
      <>
        <div className="space-y-2 mt-1">
          <div className="flex items-center gap-2 text-xs text-white">
            <span className="h-2 w-2 rounded-full" style={{ background: '#6b60f2', display: 'inline-block' }} />
            <span className="text-white/50">Owner</span>
            <span className="font-mono text-white/80">0x2051â€¦6355</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white">
            <span className="h-2 w-2 rounded-full" style={{ background: '#d8fab1', display: 'inline-block' }} />
            <span className="text-white/50">Occupant</span>
            <span className="font-mono text-white/80">0xafffâ€¦ddE7</span>
          </div>
        </div>
      </>
    ),
  },
]

// Positions for popovers (relative to hero-image-inner)
const POPOVER_POSITIONS: React.CSSProperties[] = [
  { right: '26%', bottom: '220px' },
  { left: '22%',  bottom: '200px' },
  { right: '30%', bottom: '100px' },
  { left: '26%',  bottom: '90px'  },
]

export function HeroSection({ onLaunchDemo }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // â”€â”€â”€ Badge & headline entrance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      gsap.from('.hero-badge', {
        opacity: 0, y: -40, scale: 0,
        duration: 0.9, delay: 0.2,
        ease: 'elastic.out(0.4, 0.4)',
      })
      gsap.from('.hero-headline', {
        opacity: 0, y: 40,
        duration: 0.8, delay: 0.45,
        ease: 'power3.out',
      })
      gsap.from('.hero-cta', {
        opacity: 0, y: 50, scale: 0.5,
        duration: 0.7, delay: 0.75,
        ease: 'back.out(1.7)',
      })

      // â”€â”€â”€ Logo carousel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const carouselItems = gsap.utils.toArray<HTMLElement>('.hero-carousel-item > *')
      if (carouselItems.length) {
        const carouselTl = gsap.timeline({ repeat: -1 })
        carouselItems.forEach((item) => {
          carouselTl
            .fromTo(item, { yPercent: -100 }, { yPercent: 0, duration: 0.75, ease: 'power2.inOut' })
            .to(item, { yPercent: 0, duration: 2.2, ease: 'none' })
            .to(item, { yPercent: 100, duration: 0.75, ease: 'power2.inOut' })
        })
      }

      // â”€â”€â”€ Popovers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const popovers = gsap.utils.toArray<HTMLElement>('.pb-popover')
      const hotspots = gsap.utils.toArray<HTMLElement>('.pb-hotspot')
      gsap.set(popovers, { opacity: 0, scale: 0, y: 80 })
      gsap.set('.pb-popover > *', { opacity: 0, scale: 0.5, y: 30 })
      gsap.set(hotspots, { opacity: 0.45 })

      const popoverTl = gsap.timeline({ repeat: -1, delay: 1.2 })
      popovers.forEach((el, i) => {
        const hs = hotspots[i]
        popoverTl
          .to(el, {
            duration: 1, opacity: 1, scale: 1, y: 0,
            ease: 'elastic.out(0.4, 0.4)', force3D: true,
            onStart: () => hs && gsap.to(hs, { duration: 0.3, opacity: 1, scale: 1.35, ease: 'elastic.out(0.6, 0.4)' }),
          })
          .to(Array.from(el.children), {
            duration: 0.45, opacity: 1, scale: 1, y: 0,
            stagger: 0.12, ease: 'back.out(0.3)',
          }, '-=0.45')
          .to(el, {
            duration: 0.85, opacity: 0, scale: 0, y: 80,
            ease: 'power2.in', delay: 2,
            onStart: () => hs && gsap.to(hs, { duration: 0.2, opacity: 0.45, scale: 1 }),
          })
      })

      // â”€â”€â”€ Chat threads â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const animateChats = (selector: string): gsap.core.Timeline => {
        const tl = gsap.timeline()
        const wraps = document.querySelectorAll(`${selector} .chat-wrap-item`)
        gsap.set(`${selector} .cb`, { opacity: 0, scale: 0, y: 40 })
        wraps.forEach((wrap) => {
          const bubbles = wrap.querySelectorAll<HTMLElement>('.cb')
          let delay = 0
          let lastType = ''
          bubbles.forEach((bubble) => {
            const type = bubble.classList.contains('cb-left') ? 'left'
              : bubble.classList.contains('cb-right') ? 'right' : 'icon'
            delay += type === lastType ? 0.05 : 0.12
            lastType = type
            tl.to(bubble, {
              duration: 0.45, opacity: 1, scale: 1, y: 0,
              transformOrigin: 'bottom center',
              ease: 'elastic.out(0.4, 0.4)',
            }, `+=${delay}`)
          })
          tl.to(Array.from(bubbles), {
            duration: 0.4, opacity: 0, scale: 0, y: 40,
            ease: 'power2.in', stagger: 0.05,
          }, `+=${delay + 0.8}`)
        })
        return tl
      }

      const master = gsap.timeline({ repeat: -1 })
      master.add(animateChats('.chat-threads-right'), 0)
      master.add(animateChats('.chat-threads-left'), 13)
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      style={{ backgroundColor: '#221a4c', position: 'relative', overflow: 'hidden', minHeight: '95vh' }}
    >
      {/* City SVG — absolute to the full section, bottom-anchored */}
      <img
        src="https://cdn.prod.website-files.com/654a4eca1f8c2ba5f4a71133/6693cdf253ab0ff3941e57ef_Slide%2016_9%20-%20(compressed).svg"
        alt=""
        style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: 'auto',
          objectFit: 'contain', objectPosition: 'bottom center',
          opacity: 0.92,
          pointerEvents: 'none',
          zIndex: 1,
        }}
        loading="eager"
      />

      {/* Gradient: tall fade from solid navy at top → transparent at ~80% → leaves city visible at bottom */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '82%',
        background: 'linear-gradient(to bottom, #221a4c 0%, #221a4c 45%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* â"€â"€ Content: badge + headline + CTA â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
      <div className="relative flex flex-col items-center justify-center text-center px-4"
        style={{ paddingTop: '140px', paddingBottom: '340px', zIndex: 10 }}>

        {/* Badge */}
        <div className="hero-badge mb-6">
          <div
            className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-medium"
            style={{
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            <span>Powered by</span>
            <div className="relative overflow-hidden" style={{ height: '20px', width: '90px' }}>
              <div className="hero-carousel-item flex flex-col" style={{ position: 'absolute', width: '100%' }}>
                <div className="flex items-center gap-2 text-white font-semibold text-xs" style={{ height: '20px' }}>
                  <span>âš¡ Arbitrum</span>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold text-xs" style={{ height: '20px' }}>
                  <span>ðŸ”’ iExec Nox</span>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold text-xs" style={{ height: '20px' }}>
                  <span>ðŸª™ ERC-7984</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="hero-headline max-w-4xl leading-tight"
          style={{
            fontFamily: 'Brockmann, Syne, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            color: '#ffffff',
          }}
        >
          Secure your anticretic agreement<br />
          on-chain, not on paper
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Register property-backed occupancy agreements, verify legal milestones through
          document hashes, and protect financial amounts with confidential smart contracts.
        </p>

        {/* CTA */}
        <button
          type="button"
          onClick={onLaunchDemo}
          className="hero-cta mt-8 rounded-xl px-8 py-4 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: '#d8fab1', color: '#221a4c' }}
        >
          Launch App
        </button>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {['ERC-7984 Confidential Tokens', 'iExec Nox Encryption', 'Arbitrum Sepolia'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ background: '#6b60f2' }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Floating elements over the city — positioned absolute to section */}
      <div className="pointer-events-none" style={{ position: 'absolute', inset: 0, zIndex: 5 }}>

        {/* Chat thread RIGHT */}
        <div className="chat-threads-right absolute" style={{ right: '4%', bottom: '80px', width: '260px' }}>
          {CHAT_RIGHT.map((wrap, wi) => (
            <div key={wi} className="chat-wrap-item mb-4">
              {wrap.bubbles.map((b, bi) => (
                <div
                  key={bi}
                  className={`cb mb-1.5 rounded-2xl px-3 py-2 text-xs leading-snug ${
                    b.type === 'right' ? 'cb-right ml-auto text-right' : b.type === 'left' ? 'cb-left' : 'cb-icon flex items-center gap-1.5'
                  }`}
                  style={{
                    display: b.type === 'right' || b.type === 'icon' ? 'flex' : 'block',
                    maxWidth: '220px',
                    background: b.type === 'left' ? 'rgba(255,255,255,0.09)'
                      : b.type === 'right' ? '#6b60f2'
                      : 'rgba(216,250,177,0.15)',
                    color: b.type === 'icon' ? '#d8fab1' : '#fff',
                    border: b.type === 'icon' ? '1px solid rgba(216,250,177,0.3)' : 'none',
                    justifyContent: b.type === 'right' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {b.type === 'icon' && (
                    <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {b.text}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Chat thread LEFT */}
        <div className="chat-threads-left absolute" style={{ left: '4%', bottom: '80px', width: '260px' }}>
          {CHAT_LEFT.map((wrap, wi) => (
            <div key={wi} className="chat-wrap-item mb-4">
              {wrap.bubbles.map((b, bi) => (
                <div
                  key={bi}
                  className="cb mb-1.5 rounded-2xl px-3 py-2 text-xs leading-snug"
                  style={{
                    display: b.type === 'icon' ? 'flex' : 'block',
                    maxWidth: '220px',
                    background: b.type === 'left' ? 'rgba(255,255,255,0.09)'
                      : b.type === 'right' ? '#6b60f2'
                      : 'rgba(216,250,177,0.15)',
                    color: b.type === 'icon' ? '#d8fab1' : '#fff',
                    border: b.type === 'icon' ? '1px solid rgba(216,250,177,0.3)' : 'none',
                    alignItems: b.type === 'icon' ? 'center' : undefined,
                    gap: b.type === 'icon' ? '6px' : undefined,
                  }}
                >
                  {b.type === 'icon' && (
                    <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {b.text}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Popovers */}
        {POPOVERS.map((p, i) => (
          <div key={i} className="absolute" style={{ ...POPOVER_POSITIONS[i], zIndex: 6 }}>
            <div
              className="pb-popover rounded-2xl p-4"
              style={{
                minWidth: '200px',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.title}</div>
              {p.content}
            </div>
            <div
              className="pb-hotspot absolute -bottom-2 -right-2"
              style={{ width: '16px', height: '16px' }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: i % 2 === 0 ? '#6b60f2' : '#d8fab1' }}
              />
              <div
                className="hs-ring absolute inset-0 rounded-full"
                style={{ background: i % 2 === 0 ? '#6b60f2' : '#d8fab1', opacity: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}