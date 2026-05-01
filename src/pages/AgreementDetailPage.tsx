import React, { useState, useEffect } from 'react'
import type { Agreement, AgreementStatus } from '../types/agreement'
import { useConnectedRole } from '../hooks/useConnectedRole'
import { useWallet } from '../hooks/useWallet'
import { useAgreementWriter } from '../hooks/useAgreementWriter'
import { useNoxEncrypt } from '../hooks/useNoxEncrypt'
import { useMintConfidentialAsUSD } from '../hooks/useMintConfidentialAsUSD'
import { useRegisterConfidentialAmount } from '../hooks/useRegisterConfidentialAmount'
import { formatAddress } from '../utils/formatAddress'
import {
  ANTICRETIC_SAFE_ADDRESS,
  ANTICRETIC_SAFE_USD_ADDRESS,
  LAST_ASUSD_OPERATION_HASH_KEY,
} from '../config/contracts'

interface AgreementDetailPageProps {
  agreement: Agreement
  onBack?: () => void
  onRefresh?: () => void
}

// ── Status → index of the currently active step (0-9) ──────────────────
const STATUS_ACTIVE: Record<AgreementStatus, number> = {
  Created: 1,
  TitleReportUploaded: 2,
  ApprovedByParties: 3,
  AgreementContractUploaded: 4,
  PublicRegistryProofUploaded: 5,
  ConfidentialAmountRegistered: 6,
  PossessionDeliveryPending: 6,
  Active: 7,
  MoneyReturned: 8,
  PropertyReturned: 9,
  Closed: 10,
  Disputed: -1,
}

// ── Flow steps ──────────────────────────────────────────────────────────
interface FlowStep {
  index: number
  title: string
  ownerTag: string
  occupantTag: string
  icon: string
}

const FLOW_STEPS: FlowStep[] = [
  { index: 0, title: 'Agreement Created',     ownerTag: 'You created this agreement',          occupantTag: 'Agreement initiated by the Owner',        icon: '📄' },
  { index: 1, title: 'Title Report',          ownerTag: 'Upload title/alodial document hash',  occupantTag: 'Upload title/alodial document hash',       icon: '🏛️' },
  { index: 2, title: 'Both Parties Approve',  ownerTag: 'Sign to approve the terms',           occupantTag: 'Sign to approve the terms',                icon: '✍️' },
  { index: 3, title: 'Agreement Contract',    ownerTag: 'Upload signed contract (minuta) hash',occupantTag: 'Upload signed contract (minuta) hash',     icon: '📃' },
  { index: 4, title: 'Public Registry Proof', ownerTag: 'Upload Derechos Reales / Folio hash', occupantTag: 'Upload Derechos Reales / Folio hash',      icon: '🏢' },
  { index: 5, title: 'Confidential Finance',  ownerTag: 'Mint asUSD tokens to Occupant',       occupantTag: 'Register confidential amount in contract', icon: '🔐' },
  { index: 6, title: 'Possession Delivery',   ownerTag: 'Upload delivery act hash + confirm',  occupantTag: 'Confirm you received the property',        icon: '🔑' },
  { index: 7, title: 'Money Return',          ownerTag: 'Waiting for Occupant to confirm',     occupantTag: 'Confirm anticrético money was returned',   icon: '💸' },
  { index: 8, title: 'Property Return',       ownerTag: 'Confirm property was returned to you',occupantTag: 'Waiting for Owner to confirm',             icon: '🏠' },
  { index: 9, title: 'Close Agreement',       ownerTag: 'Upload closure proof and close',      occupantTag: 'Upload closure proof and close',           icon: '🔒' },
]

// ── Style helpers ───────────────────────────────────────────────────────
const S = {
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(107,96,242,0.22)',
    borderRadius: '16px',
    padding: '20px',
  } as React.CSSProperties,
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(107,96,242,0.3)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'monospace',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  btn: (color: 'violet' | 'lime' | 'amber' | 'danger'): React.CSSProperties => ({
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '0.82rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    background: color === 'violet' ? '#6b60f2' : color === 'lime' ? '#d8fab1' : color === 'amber' ? '#fbbf24' : '#ef4444',
    color: color === 'violet' ? '#fff' : '#221a4c',
  }),
  label: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', display: 'block' } as React.CSSProperties,
  txbox: {
    background: 'rgba(107,96,242,0.1)',
    border: '1px solid rgba(107,96,242,0.25)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '0.72rem',
    color: '#a5b4fc',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  } as React.CSSProperties,
}

// ── Contract error decoder ──────────────────────────────────────────────
const CONTRACT_ERRORS: Record<string, string> = {
  InvalidStatus:   'This action is not allowed at the current agreement stage',
  NotParticipant:  'Your wallet is not a participant in this agreement',
  OnlyPropertyOwner: 'Only the Property Owner can perform this action',
  OnlyOccupant:    'Only the Occupant can perform this action',
  AgreementDoesNotExist: 'Agreement ID not found on-chain',
  InvalidHash:     'Invalid document hash — file may be empty',
  InvalidAddress:  'Invalid wallet address',
  InvalidDates:    'Invalid start/end dates',
  AmountNotRegistered: 'Confidential amount has not been registered yet',
  ViewerAlreadyGranted: 'Viewer access already granted',
}

function parseContractError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  // viem encodes custom errors as "Error: ErrorName()" or "reverted with ... ErrorName"
  const match = raw.match(/\b(InvalidStatus|NotParticipant|OnlyPropertyOwner|OnlyOccupant|AgreementDoesNotExist|InvalidHash|InvalidAddress|InvalidDates|AmountNotRegistered|ViewerAlreadyGranted)\b/)
  if (match) return CONTRACT_ERRORS[match[1]] ?? match[1]
  if (raw.includes('User rejected') || raw.includes('user rejected')) return 'Transaction cancelled by user'
  if (raw.includes('execution reverted')) return 'Transaction reverted — check the agreement status and your role'
  return raw.slice(0, 150)
}

// ── Primitives ──────────────────────────────────────────────────────────
function TxSuccess({ hash }: { hash: string }) {
  return (
    <div style={{ marginTop: '12px' }}>
      <p style={{ fontSize: '0.7rem', color: '#d8fab1', marginBottom: '4px' }}>✓ Transaction confirmed</p>
      <div style={S.txbox}>{hash}</div>
    </div>
  )
}
function ErrorMsg({ msg }: { msg: string }) {
  return <p style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '8px' }}>{msg}</p>
}
function WaitAction({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.65 }}>
      <span style={{ fontSize: '20px' }}>⏳</span>
      <p style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.55)' }}>{message}</p>
    </div>
  )
}
function DoneAction({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '20px', color: '#d8fab1' }}>✓</span>
      <p style={{ fontSize: '0.87rem', color: '#d8fab1' }}>{message}</p>
    </div>
  )
}

// ── File hash action — upload a document, hash is computed automatically ─
function HashInputAction({ label, buttonLabel, isPending, onSubmit, onSuccess }: {
  label: string; placeholder?: string; buttonLabel: string; isPending: boolean;
  onSubmit: (hash: `0x${string}`) => Promise<{ txHash: string } | undefined>;
  onSuccess?: () => void;
}) {
  const [fileName, setFileName] = useState('')
  const [computedHash, setComputedHash] = useState<`0x${string}` | ''>('')
  const [isHashing, setIsHashing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [err, setErr] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const computeHash = async (file: File) => {
    setErr('')
    setComputedHash('')
    setIsHashing(true)
    setFileName(file.name)
    try {
      const buffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
      const hex = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      setComputedHash(`0x${hex}`)
    } catch {
      setErr('Failed to compute hash — try a different file')
    } finally {
      setIsHashing(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) computeHash(file)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) computeHash(file)
  }

  const handle = async () => {
    setErr('')
    if (!computedHash) return
    try {
      const res = await onSubmit(computedHash)
      if (res) { setTxHash(res.txHash); onSuccess?.() }
    } catch (e) {
      setErr(parseContractError(e))
    }
  }

  const dropZoneStyle: React.CSSProperties = {
    border: `2px dashed ${dragging ? '#6b60f2' : 'rgba(107,96,242,0.35)'}`,
    borderRadius: '12px',
    padding: '28px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    background: dragging ? 'rgba(107,96,242,0.08)' : 'rgba(255,255,255,0.03)',
    transition: 'all 0.2s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={S.label}>{label}</label>

      {/* Drop zone */}
      <div
        style={dropZoneStyle}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
        {isHashing ? (
          <p style={{ color: '#a5b4fc', fontSize: '0.82rem' }}>⏳ Computing SHA-256…</p>
        ) : fileName ? (
          <div>
            <p style={{ color: '#d8fab1', fontSize: '0.82rem', marginBottom: '4px' }}>📄 {fileName}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>Click or drag to replace</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>📂</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginBottom: '4px' }}>Click to select or drag & drop</p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>PDF, Word, image or text — hash is computed locally</p>
          </div>
        )}
      </div>

      {/* Computed hash display */}
      {computedHash && (
        <div style={{ ...S.txbox, background: 'rgba(216,250,177,0.06)', borderColor: 'rgba(216,250,177,0.2)' }}>
          <p style={{ fontSize: '0.65rem', color: 'rgba(216,250,177,0.5)', marginBottom: '4px' }}>SHA-256 hash (computed locally)</p>
          <p style={{ color: '#d8fab1', wordBreak: 'break-all', fontSize: '0.72rem' }}>{computedHash}</p>
        </div>
      )}

      <button
        type="button"
        style={S.btn('violet')}
        disabled={isPending || !computedHash || isHashing}
        onClick={handle}
      >
        {isPending ? 'Submitting…' : buttonLabel}
      </button>

      {err && <ErrorMsg msg={err} />}
      {txHash && <TxSuccess hash={txHash} />}
    </div>
  )
}

// ── Simple sign action ──────────────────────────────────────────────────
function SignAction({ label, sublabel, buttonLabel, isPending, onSubmit, onSuccess }: {
  label: string; sublabel?: string; buttonLabel: string; isPending: boolean;
  onSubmit: () => Promise<{ txHash: string } | undefined>;
  onSuccess?: () => void;
}) {
  const [txHash, setTxHash] = useState('')
  const [err, setErr] = useState('')

  const handle = async () => {
    setErr('')
    try {
      const res = await onSubmit()
      if (res) { setTxHash(res.txHash); onSuccess?.() }
    } catch (e) {
      setErr(parseContractError(e))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.75)' }}>{label}</p>
      {sublabel && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{sublabel}</p>}
      <button type="button" style={S.btn('lime')} disabled={isPending} onClick={handle}>
        {isPending ? 'Signing…' : buttonLabel}
      </button>
      {err && <ErrorMsg msg={err} />}
      {txHash && <TxSuccess hash={txHash} />}
    </div>
  )
}

// ── Step 5 — Owner: Mint asUSD ──────────────────────────────────────────
function NoxMintAction({ agreement, onSuccess }: { agreement: Agreement; onSuccess?: () => void }) {
  const { isEncrypting, encryptUint256Amount } = useNoxEncrypt()
  const { mintConfidentialAsUSD, isPending, isConfirming, txHash, error } = useMintConfidentialAsUSD()
  const [amount, setAmount] = useState('20000')
  const [recipient, setRecipient] = useState(agreement.occupant)
  const [handle, setHandle] = useState<`0x${string}` | ''>('')
  const [proof, setProof] = useState<`0x${string}` | ''>('')
  const [localErr, setLocalErr] = useState('')

  const onEncrypt = async () => {
    setLocalErr('')
    try {
      const enc = await encryptUint256Amount({ amount: BigInt(amount), targetContract: ANTICRETIC_SAFE_USD_ADDRESS })
      setHandle(enc.encryptedAmountHandle)
      setProof(enc.inputProof)
    } catch (e) { setLocalErr('Nox encryption failed: ' + parseContractError(e)) }
  }

  const onMint = async () => {
    setLocalErr('')
    if (!handle || !proof) { setLocalErr('Encrypt the amount first'); return }
    try {
      const res = await mintConfidentialAsUSD({ recipient: recipient as `0x${string}`, encryptedAmountHandle: handle, inputProof: proof })
      if (res?.txHash) { localStorage.setItem(LAST_ASUSD_OPERATION_HASH_KEY, res.txHash); onSuccess?.() }
    } catch (e) { setLocalErr(parseContractError(e)) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
        Mint confidential asUSD tokens to the occupant. The amount will be encrypted with Nox so only the parties can see it.
      </p>
      <div>
        <label style={S.label}>Amount (USD)</label>
        <input style={S.input} type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <div>
        <label style={S.label}>Recipient — Occupant address</label>
        <input style={S.input} value={recipient} onChange={e => setRecipient(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button type="button" style={S.btn('amber')} disabled={isEncrypting} onClick={onEncrypt}>
          {isEncrypting ? 'Encrypting…' : '1. Encrypt Amount (Nox)'}
        </button>
        <button type="button" style={S.btn('violet')} disabled={!handle || isPending || isConfirming} onClick={onMint}>
          {isPending || isConfirming ? 'Minting…' : '2. Mint asUSD'}
        </button>
      </div>
      {handle && <div style={S.txbox}>Encrypted handle: {handle.slice(0, 34)}…</div>}
      {(localErr || error) && <ErrorMsg msg={localErr || error} />}
      {txHash && (
        <div>
          <TxSuccess hash={txHash} />
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
            Operation hash saved — Occupant can now register the amount in the agreement.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Step 5 — Occupant: Register amount ─────────────────────────────────
function NoxRegisterAction({ agreement, onSuccess }: { agreement: Agreement; onSuccess?: () => void }) {
  const { isEncrypting, encryptUint256Amount } = useNoxEncrypt()
  const { isSubmitting, register } = useRegisterConfidentialAmount()
  const [amount, setAmount] = useState('20000')
  const [opHash, setOpHash] = useState(localStorage.getItem(LAST_ASUSD_OPERATION_HASH_KEY) ?? '')
  const [handle, setHandle] = useState<`0x${string}` | ''>('')
  const [proof, setProof] = useState<`0x${string}` | ''>('')
  const [txHash, setTxHash] = useState('')
  const [err, setErr] = useState('')

  const onEncrypt = async () => {
    setErr('')
    try {
      const enc = await encryptUint256Amount({ amount: BigInt(amount), targetContract: ANTICRETIC_SAFE_ADDRESS })
      setHandle(enc.encryptedAmountHandle)
      setProof(enc.inputProof)
    } catch (e) { setErr('Nox encryption failed: ' + parseContractError(e)) }
  }

  const onRegister = async () => {
    setErr('')
    if (!handle || !proof || !opHash) { setErr('Complete all fields and encrypt first'); return }
    try {
      const numericId = agreement.id.replace(/\D/g, '')
      const res = await register({ agreementId: numericId, encryptedAmountHandle: handle, inputProof: proof, asUSDOperationHash: opHash as `0x${string}` })
      if (res?.txHash) { setTxHash(res.txHash); onSuccess?.() }
    } catch (e) { setErr(parseContractError(e)) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
        Register the confidential anticrético amount in the smart contract. The amount is encrypted — only you and the Owner can see it.
      </p>
      <div>
        <label style={S.label}>Amount (must match what the Owner minted)</label>
        <input style={S.input} type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <div>
        <label style={S.label}>asUSD Operation Hash (from Owner's mint transaction)</label>
        <input style={{ ...S.input, fontSize: '0.72rem' }} placeholder="0x… (Owner's mint tx hash)" value={opHash} onChange={e => setOpHash(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button type="button" style={S.btn('amber')} disabled={isEncrypting} onClick={onEncrypt}>
          {isEncrypting ? 'Encrypting…' : '1. Encrypt Amount (Nox)'}
        </button>
        <button type="button" style={S.btn('violet')} disabled={!handle || isSubmitting} onClick={onRegister}>
          {isSubmitting ? 'Registering…' : '2. Register in Agreement'}
        </button>
      </div>
      {handle && <div style={S.txbox}>Encrypted handle: {handle.slice(0, 34)}…</div>}
      {err && <ErrorMsg msg={err} />}
      {txHash && <TxSuccess hash={txHash} />}
    </div>
  )
}

// ── Step 7 — Occupant: Confirm money returned + countdown ───────────────
function useCountdown(endDateStr: string) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isOverdue, setIsOverdue] = useState(false)

  useEffect(() => {
    // endDateStr format: "DD/MM/YYYY" from tsToDate in useMyAgreements
    const parts = endDateStr.split('/')
    let endMs = NaN
    if (parts.length === 3) {
      // DD/MM/YYYY → new Date(YYYY, MM-1, DD)
      endMs = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime()
    }
    if (isNaN(endMs)) { setTimeLeft('—'); return }

    const tick = () => {
      const diff = endMs - Date.now()
      if (diff <= 0) {
        setIsOverdue(true)
        setTimeLeft('0d 0h 0m 0s')
        return
      }
      const d = Math.floor(diff / 86_400_000)
      const h = Math.floor((diff % 86_400_000) / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endDateStr])

  return { timeLeft, isOverdue }
}

function MoneyReturnAction({ agreement, writer, numericId, onSuccess }: {
  agreement: Agreement
  writer: ReturnType<typeof useAgreementWriter>
  numericId: string
  onSuccess?: () => void
}) {
  const { timeLeft, isOverdue } = useCountdown(agreement.endDate)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Countdown card */}
      <div style={{
        background: isOverdue ? 'rgba(239,68,68,0.08)' : 'rgba(107,96,242,0.08)',
        border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.3)' : 'rgba(107,96,242,0.25)'}`,
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        alignItems: 'center',
      }}>
        <div>
          <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '4px' }}>
            Agreement end date
          </p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#d8fab1', fontFamily: 'Brockmann, Syne, sans-serif' }}>
            {agreement.endDate}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '4px' }}>
            {isOverdue ? '⚠ Overdue by' : 'Time remaining'}
          </p>
          <p style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', color: isOverdue ? '#fca5a5' : '#a5b4fc' }}>
            {timeLeft}
          </p>
        </div>
      </div>

      <SignAction
        label="Confirm that the anticrético capital has been returned to you."
        sublabel="Only confirm once you have actually received the money back."
        buttonLabel="Confirm Money Returned"
        isPending={writer.isPending}
        onSuccess={onSuccess}
        onSubmit={() => writer.confirmMoneyReturned(numericId)}
      />
    </div>
  )
}

// ── Step action panel — dispatches per step + role ──────────────────────
function StepActionPanel({ step, agreement, role, writer, onRefresh }: {
  step: FlowStep
  agreement: Agreement
  role: string
  writer: ReturnType<typeof useAgreementWriter>
  onRefresh?: () => void
}) {
  const numericId = agreement.id.replace(/\D/g, '')
  const isOwner = role === 'PROPERTY_OWNER'
  const isOccupant = role === 'OCCUPANT'

  if (step.index === 0) {
    return isOwner
      ? <DoneAction message="You created this agreement successfully." />
      : <DoneAction message="Agreement was created by the Property Owner." />
  }

  if (step.index === 1) {
    if (!isOwner) return <WaitAction message="Waiting for the Property Owner to upload the title report document." />
    return (
      <HashInputAction
        label="Upload the Title Report / Alodial document — the SHA-256 hash is computed automatically"
        buttonLabel="Upload Title Report Hash"
        isPending={writer.isPending}
        onSuccess={onRefresh}
        onSubmit={hash => writer.uploadTitleReport(numericId, hash)}
      />
    )
  }

  if (step.index === 2) {
    const ownerApproved = agreement.approvals?.propertyOwnerApproved
    const occupantApproved = agreement.approvals?.occupantApproved

    // Inline helper — shows which wallet needs to switch
    function WaitingForOther({ pending, addr }: { pending: string; addr: string }) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px', color: '#d8fab1' }}>✓</span>
            <p style={{ fontSize: '0.87rem', color: '#d8fab1' }}>You already signed. Waiting for {pending} to approve.</p>
          </div>
          <div style={{ background: 'rgba(107,96,242,0.12)', border: '1px solid rgba(107,96,242,0.3)', borderRadius: '10px', padding: '12px 16px' }}>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              👉 Switch MetaMask to the {pending} wallet
            </p>
            <p style={{ fontSize: '0.78rem', color: '#a5b4fc', fontFamily: 'monospace', wordBreak: 'break-all' }}>{addr}</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
              Then come back and refresh — the Approve button will appear.
            </p>
          </div>
        </div>
      )
    }

    if (isOwner) {
      return ownerApproved
        ? <WaitingForOther pending="Occupant" addr={agreement.occupant} />
        : <SignAction label="Review the agreement terms and sign your approval on-chain." sublabel="Both parties must approve before the next step." buttonLabel="Approve Agreement" isPending={writer.isPending} onSuccess={onRefresh} onSubmit={() => writer.approveAgreement(numericId)} />
    }
    if (isOccupant) {
      return occupantApproved
        ? <WaitingForOther pending="Property Owner" addr={agreement.propertyOwner} />
        : <SignAction label="Review the agreement terms and sign your approval on-chain." sublabel="Both parties must approve before the next step." buttonLabel="Approve Agreement" isPending={writer.isPending} onSuccess={onRefresh} onSubmit={() => writer.approveAgreement(numericId)} />
    }
    return <WaitAction message="Waiting for both parties to sign their approval." />
  }

  if (step.index === 3) {
    if (!isOwner) return <WaitAction message="Waiting for the Property Owner to upload the signed contract (Minuta)." />
    return (
      <HashInputAction
        label="Upload the signed contract (Minuta / Contrato de Anticrético) — SHA-256 hash is computed automatically"
        buttonLabel="Upload Contract Hash"
        isPending={writer.isPending}
        onSuccess={onRefresh}
        onSubmit={hash => writer.uploadAgreementContract(numericId, hash)}
      />
    )
  }

  if (step.index === 4) {
    if (!isOwner) return <WaitAction message="Waiting for the Property Owner to upload the Public Registry / Folio Real proof." />
    return (
      <HashInputAction
        label="Upload the Derechos Reales / Folio Real document — SHA-256 hash is computed automatically"
        buttonLabel="Upload Registry Proof Hash"
        isPending={writer.isPending}
        onSuccess={onRefresh}
        onSubmit={hash => writer.uploadPublicRegistry(numericId, hash)}
      />
    )
  }

  if (step.index === 5) {
    if (isOwner) return <NoxMintAction agreement={agreement} onSuccess={onRefresh} />
    if (isOccupant) return <NoxRegisterAction agreement={agreement} onSuccess={onRefresh} />
    return <WaitAction message="Confidential finance step — participants only." />
  }

  if (step.index === 6) {
    if (isOwner) {
      return (
        <HashInputAction
          label="Upload the Possession Delivery Act (Acta de Entrega) — SHA-256 hash is computed automatically"
          buttonLabel="Confirm Delivery + Upload Hash"
          isPending={writer.isPending}
          onSuccess={onRefresh}
          onSubmit={hash => writer.confirmPossessionDelivery(numericId, hash)}
        />
      )
    }
    if (isOccupant) {
      return (
        <SignAction
          label="Confirm that you physically received the property keys and possession."
          sublabel="Status becomes Active once both parties confirm."
          buttonLabel="Confirm Possession Received"
          isPending={writer.isPending}
          onSuccess={onRefresh}
          onSubmit={() => writer.confirmPossessionReceived(numericId)}
        />
      )
    }
    return <WaitAction message="Waiting for both parties to confirm possession." />
  }

  if (step.index === 7) {
    if (isOccupant) {
      return <MoneyReturnAction agreement={agreement} writer={writer} numericId={numericId} onSuccess={onRefresh} />
    }
    return <WaitAction message="Waiting for Occupant to confirm money was returned." />
  }

  if (step.index === 8) {
    if (isOwner) {
      return (
        <SignAction
          label="Confirm that the property has been returned and you have full possession again."
          buttonLabel="Confirm Property Returned"
          isPending={writer.isPending}
          onSuccess={onRefresh}
          onSubmit={() => writer.confirmPropertyReturned(numericId)}
        />
      )
    }
    return <WaitAction message="Waiting for Owner to confirm the property was returned." />
  }

  if (step.index === 9) {
    if (!isOwner) return <WaitAction message="Waiting for the Property Owner to upload the closure proof and close the agreement." />
    return (
      <HashInputAction
        label="Upload the cancellation / closure proof document (Cancelación) — SHA-256 hash is computed automatically"
        buttonLabel="Close Agreement"
        isPending={writer.isPending}
        onSuccess={onRefresh}
        onSubmit={hash => writer.closeAgreement(numericId, hash)}
      />
    )
  }

  return <DoneAction message="This step has been completed." />
}

// ── Flow Timeline (left column) ─────────────────────────────────────────
function FlowTimeline({ steps, doneUpTo, activeIndex, selectedIndex, onSelect, isDisputed }: {
  steps: FlowStep[]
  doneUpTo: number
  activeIndex: number
  selectedIndex: number
  onSelect: (i: number) => void
  isDisputed: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {steps.map((step, i) => {
        const isDone = !isDisputed && i <= doneUpTo
        const isCurrent = !isDisputed && i === activeIndex
        const isSelected = i === selectedIndex

        return (
          <div key={step.index} style={{ display: 'flex', gap: '0', position: 'relative' }}>
            {/* Circle + connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: isDone ? '#d8fab1' : isCurrent ? '#6b60f2' : 'rgba(255,255,255,0.10)',
                  border: isCurrent ? '2px solid #6b60f2' : isDone ? '2px solid #d8fab1' : '2px solid rgba(255,255,255,0.12)',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(107,96,242,0.2)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: isDone ? '#221a4c' : isCurrent ? '#fff' : 'rgba(255,255,255,0.2)',
                  fontSize: '11px', fontWeight: 700, transition: 'all 0.2s',
                }}
              >
                {isDone ? '✓' : step.index + 1}
              </button>
              {i < steps.length - 1 && (
                <div style={{ width: '2px', flex: 1, minHeight: '24px', background: isDone ? 'rgba(216,250,177,0.35)' : 'rgba(255,255,255,0.07)', margin: '3px 0' }} />
              )}
            </div>
            {/* Label */}
            <button
              type="button"
              onClick={() => onSelect(i)}
              style={{
                flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 10px 24px',
                borderLeft: isSelected ? '2px solid rgba(107,96,242,0.5)' : '2px solid transparent',
                marginLeft: '4px',
              }}
            >
              <p style={{
                fontSize: '0.78rem',
                fontWeight: isCurrent || isSelected ? 700 : 400,
                color: isDone ? '#d8fab1' : isCurrent ? '#ffffff' : 'rgba(255,255,255,0.3)',
                transition: 'color 0.2s',
              }}>
                {step.title}
              </p>
              {isCurrent && (
                <p style={{ fontSize: '0.65rem', color: '#6b60f2', marginTop: '2px' }}>← active now</p>
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────
export function AgreementDetailPage({ agreement, onBack, onRefresh }: AgreementDetailPageProps) {
  const role = useConnectedRole(agreement)
  const wallet = useWallet()
  const writer = useAgreementWriter()

  const isDisputed = agreement.status === 'Disputed'
  const isClosed = agreement.status === 'Closed'
  const activeStepIndex = isDisputed ? -1 : STATUS_ACTIVE[agreement.status] ?? 0
  const doneUpTo = isClosed ? 9 : Math.max(activeStepIndex - 1, 0)
  const [selectedIndex, setSelectedIndex] = useState(isClosed ? 9 : Math.max(activeStepIndex, 0))

  // Auto-advance when agreement status changes (after refetch)
  useEffect(() => {
    if (!isClosed) setSelectedIndex(Math.max(activeStepIndex, 0))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreement.status])

  const selectedStep = FLOW_STEPS[selectedIndex]!

  const roleLabel =
    role === 'PROPERTY_OWNER' ? '🏠 Property Owner'
    : role === 'OCCUPANT'    ? '💰 Occupant'
    : role === 'DISCONNECTED' ? 'Not connected'
    : 'Viewer'

  const roleTag =
    role === 'PROPERTY_OWNER' ? selectedStep.ownerTag
    : role === 'OCCUPANT'    ? selectedStep.occupantTag
    : 'View-only — connect your wallet to interact'

  return (
    <div style={{ minHeight: '100vh', background: '#221a4c', paddingTop: '88px', paddingBottom: '64px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Back */}
        {onBack && (
          <button type="button" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '24px' }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        )}

        {/* Agreement header card */}
        <div style={{ ...S.card, marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b60f2', marginBottom: '4px' }}>Agreement</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', fontFamily: 'Brockmann, Syne, sans-serif', margin: '0 0 10px' }}>{agreement.id}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', background: 'rgba(107,96,242,0.2)', color: '#a5b4fc', borderRadius: '99px', padding: '3px 10px' }}>{agreement.status}</span>
              <span style={{ fontSize: '0.72rem', background: role === 'PROPERTY_OWNER' ? 'rgba(216,250,177,0.15)' : role === 'OCCUPANT' ? 'rgba(107,96,242,0.2)' : 'rgba(255,255,255,0.07)', color: role === 'PROPERTY_OWNER' ? '#d8fab1' : role === 'OCCUPANT' ? '#a5b4fc' : 'rgba(255,255,255,0.35)', borderRadius: '99px', padding: '3px 10px' }}>{roleLabel}</span>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.8, textAlign: 'right' }}>
            <div>Owner: <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{formatAddress(agreement.propertyOwner)}</span></div>
            <div>Occupant: <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{formatAddress(agreement.occupant)}</span></div>
            <div>{agreement.startDate} → {agreement.endDate}</div>
          </div>
        </div>

        {/* Dispute banner */}
        {isDisputed && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px' }}>
            <p style={{ color: '#fca5a5', fontWeight: 700, marginBottom: '4px' }}>⚠ Agreement Disputed</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>This agreement is under dispute. No further on-chain actions are available through this interface.</p>
          </div>
        )}

        {/* Main two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(190px, 260px) 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Left: Timeline */}
          <div style={{ ...S.card, position: 'sticky', top: '100px' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '16px' }}>Progress</p>
            <FlowTimeline
              steps={FLOW_STEPS}
              doneUpTo={doneUpTo}
              activeIndex={isClosed ? 10 : (isDisputed ? -1 : activeStepIndex)}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              isDisputed={isDisputed}
            />
          </div>

          {/* Right: Step detail + action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Step header + action */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '26px', lineHeight: 1 }}>{selectedStep.icon}</span>
                <div>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', fontFamily: 'Brockmann, Syne, sans-serif', margin: 0 }}>
                    Step {selectedStep.index + 1} — {selectedStep.title}
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>{roleTag}</p>
                </div>
              </div>

              {/* Role-specific action panel */}
              {!wallet.isConnected ? (
                <WaitAction message="Connect your wallet to interact with this step." />
              ) : selectedIndex < (isClosed ? 10 : activeStepIndex) ? (
                <DoneAction message="This step has already been completed on-chain." />
              ) : !isClosed && selectedIndex > activeStepIndex ? (
                <WaitAction message="This step is not yet available. Complete the active step first." />
              ) : (
                <StepActionPanel step={selectedStep} agreement={agreement} role={role} writer={writer} onRefresh={onRefresh} />
              )}
            </div>

            {/* Both roles summary card */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ background: 'rgba(216,250,177,0.05)', border: '1px solid rgba(216,250,177,0.15)', borderRadius: '12px', padding: '14px' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d8fab1', marginBottom: '8px' }}>🏠 Property Owner</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{selectedStep.ownerTag}</p>
              </div>
              <div style={{ background: 'rgba(107,96,242,0.07)', border: '1px solid rgba(107,96,242,0.2)', borderRadius: '12px', padding: '14px' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: '8px' }}>💰 Occupant</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{selectedStep.occupantTag}</p>
              </div>
            </div>

            {/* Dispute button */}
            {!isClosed && !isDisputed && role !== 'VIEWER' && role !== 'DISCONNECTED' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={{ ...S.btn('danger'), fontSize: '0.72rem', padding: '7px 16px', opacity: 0.65 }}
                  disabled={writer.isPending}
                  onClick={async () => {
                    const numericId = agreement.id.replace(/\D/g, '')
                    const reasonHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}` as `0x${string}`
                    try { await writer.openDispute(numericId, reasonHash) } catch { /* handled by writer.error */ }
                  }}
                >
                  Open Dispute
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

