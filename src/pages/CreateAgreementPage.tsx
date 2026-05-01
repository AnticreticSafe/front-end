import React, { useState, type FormEvent } from 'react'
import { keccak256, toBytes, isAddress } from 'viem'
import { useWallet } from '../hooks/useWallet'
import { useAgreementWriter } from '../hooks/useAgreementWriter'

interface CreateAgreementPageProps {
  onCreate: () => void
}

const inp: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(107,96,242,0.3)',
  borderRadius: '10px',
  padding: '11px 14px',
  color: '#ffffff',
  fontSize: '0.88rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const lbl: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.45)',
  letterSpacing: '0.05em',
  marginBottom: '6px',
  display: 'block',
}

export function CreateAgreementPage({ onCreate }: CreateAgreementPageProps) {
  const wallet = useWallet()
  const writer = useAgreementWriter()

  const [occupantWallet, setOccupantWallet] = useState('')
  const [propertyDescription, setPropertyDescription] = useState('')
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState('')
  const [txHash, setTxHash] = useState('')
  const [formErr, setFormErr] = useState('')

  const addressErr = occupantWallet && !isAddress(occupantWallet) ? 'Not a valid EVM address' : ''
  const dateErr = startDate && endDate && new Date(startDate) >= new Date(endDate) ? 'Start date must be before end date' : ''
  const canSubmit = wallet.isConnected && isAddress(occupantWallet) && propertyDescription.trim() && startDate && endDate && !dateErr && !writer.isPending

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormErr('')
    if (!canSubmit) return
    try {
      const propertyHash = keccak256(toBytes(propertyDescription.trim()))
      const startUnix = Math.floor(new Date(startDate).getTime() / 1000)
      const endUnix = Math.floor(new Date(endDate).getTime() / 1000)
      const res = await writer.createAgreement(
        occupantWallet as `0x${string}`,
        propertyHash,
        startUnix,
        endUnix,
      )
      if (res?.txHash) setTxHash(res.txHash)
    } catch (e) {
      setFormErr(e instanceof Error ? e.message.slice(0, 160) : 'Transaction failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#221a4c', paddingTop: '96px', paddingBottom: '64px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b60f2', marginBottom: '8px' }}>
            New Agreement
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, color: '#ffffff', fontFamily: 'Brockmann, Syne, sans-serif', lineHeight: 1.15, margin: 0 }}>
            Create an Anticrético Agreement
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px', lineHeight: 1.6 }}>
            The property description is hashed with keccak256 before being stored on Arbitrum Sepolia — no sensitive data is exposed on-chain.
          </p>
        </div>

        {/* Flow info strip */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '28px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(107,96,242,0.18)' }}>
          {['Create', 'Title Report', 'Both Approve', 'Contract', 'Registry', 'Finance', 'Possession', 'Active', 'Close'].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: '10px 4px', background: i === 0 ? 'rgba(107,96,242,0.25)' : 'rgba(255,255,255,0.03)', borderRight: i < 8 ? '1px solid rgba(107,96,242,0.1)' : 'none', textAlign: 'center' }}>
              <p style={{ fontSize: '0.58rem', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#a5b4fc' : 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</p>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(107,96,242,0.22)', borderRadius: '20px', padding: '28px' }}>
          {!wallet.isConnected && (
            <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '0.82rem', color: '#fbbf24' }}>⚠ Connect your wallet to submit the agreement on-chain.</p>
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Occupant address */}
            <div>
              <label style={lbl}>Occupant Wallet Address *</label>
              <input
                style={{ ...inp, border: addressErr ? '1px solid rgba(239,68,68,0.5)' : inp.border }}
                type="text"
                value={occupantWallet}
                onChange={e => setOccupantWallet(e.target.value)}
                placeholder="0x… (the person who will occupy the property)"
              />
              {addressErr && <p style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '5px' }}>{addressErr}</p>}
            </div>

            {/* Property description */}
            <div>
              <label style={lbl}>Property Description *</label>
              <textarea
                style={{ ...inp, resize: 'vertical', minHeight: '90px', fontFamily: 'sans-serif' }}
                value={propertyDescription}
                onChange={e => setPropertyDescription(e.target.value)}
                placeholder="e.g. Apartment 3B, Calle Comercio 456, La Paz, Bolivia — 85m², 2 bedrooms..."
                rows={3}
              />
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
                This text will be hashed (keccak256) — it never leaves your browser as plaintext.
              </p>
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lbl}>Start Date *</label>
                <input style={inp} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>End Date *</label>
                <input
                  style={{ ...inp, border: dateErr ? '1px solid rgba(239,68,68,0.5)' : inp.border }}
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>
            {dateErr && <p style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '-12px' }}>{dateErr}</p>}

            {/* Preview hash */}
            {propertyDescription.trim() && (
              <div style={{ background: 'rgba(107,96,242,0.08)', border: '1px solid rgba(107,96,242,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>Property hash (keccak256 preview)</p>
                <p style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#a5b4fc', wordBreak: 'break-all' }}>
                  {keccak256(toBytes(propertyDescription.trim()))}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                borderRadius: '12px', padding: '14px 24px',
                fontSize: '0.9rem', fontWeight: 700,
                background: canSubmit ? '#d8fab1' : 'rgba(255,255,255,0.08)',
                color: canSubmit ? '#221a4c' : 'rgba(255,255,255,0.25)',
                border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {writer.isPending ? 'Creating Agreement…' : 'Create Agreement On-Chain'}
            </button>

            {(formErr || writer.error) && (
              <p style={{ fontSize: '0.78rem', color: '#fca5a5' }}>{formErr || writer.error}</p>
            )}

            {txHash && (
              <div style={{ background: 'rgba(216,250,177,0.08)', border: '1px solid rgba(216,250,177,0.2)', borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d8fab1', marginBottom: '8px' }}>
                  ✓ Agreement created successfully!
                </p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>Transaction hash</p>
                <p style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#a5b4fc', wordBreak: 'break-all', marginBottom: '16px' }}>{txHash}</p>
                <button
                  type="button"
                  onClick={onCreate}
                  style={{ borderRadius: '10px', padding: '10px 20px', fontSize: '0.82rem', fontWeight: 600, background: '#6b60f2', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Go to Dashboard →
                </button>
              </div>
            )}
          </form>
        </div>

        {/* What happens next */}
        <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '12px' }}>What happens after creation?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { step: '01', text: 'You upload the property title report hash' },
              { step: '02', text: 'Both parties sign their approval' },
              { step: '03', text: 'Legal documents are hashed and stored' },
              { step: '04', text: 'Confidential anticrético amount is minted as asUSD (private)' },
              { step: '05', text: 'Possession is delivered and confirmed by both parties' },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b60f2', fontFamily: 'monospace', flexShrink: 0 }}>{step}</span>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

