import type { Agreement } from '../../types/agreement'
import type { UserRole } from '../../hooks/useConnectedRole'
import { useAgreementProgress } from '../../hooks/useAgreementProgress'
import { RoleBadge } from '../agreement/RoleBadge'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Created:                        { bg: 'rgba(255,255,255,0.08)',    color: 'rgba(255,255,255,0.6)' },
  TitleReportUploaded:            { bg: 'rgba(107,96,242,0.2)',      color: '#a5b4fc' },
  ApprovedByParties:              { bg: 'rgba(107,96,242,0.3)',      color: '#818cf8' },
  AgreementContractUploaded:      { bg: 'rgba(139,92,246,0.2)',      color: '#c4b5fd' },
  PublicRegistryProofUploaded:    { bg: 'rgba(168,85,247,0.2)',      color: '#d8b4fe' },
  ConfidentialAmountRegistered:   { bg: 'rgba(216,250,177,0.15)',    color: '#d8fab1' },
  PossessionDeliveryPending:      { bg: 'rgba(251,191,36,0.15)',     color: '#fbbf24' },
  Active:                         { bg: 'rgba(216,250,177,0.2)',     color: '#86efac' },
  MoneyReturned:                  { bg: 'rgba(20,184,166,0.15)',     color: '#5eead4' },
  PropertyReturned:               { bg: 'rgba(34,197,94,0.15)',      color: '#86efac' },
  Closed:                         { bg: 'rgba(255,255,255,0.06)',    color: 'rgba(255,255,255,0.35)' },
  Disputed:                       { bg: 'rgba(239,68,68,0.15)',      color: '#fca5a5' },
}

const NEXT_ACTION_LABEL: Record<string, Record<string, string>> = {
  PROPERTY_OWNER: {
    Created: 'Upload Title Report',
    TitleReportUploaded: 'Approve Agreement',
    ApprovedByParties: 'Upload Agreement Contract',
    AgreementContractUploaded: 'Upload Registry Proof',
    PublicRegistryProofUploaded: 'Mint asUSD',
    ConfidentialAmountRegistered: 'Confirm Possession Delivery',
    PossessionDeliveryPending: 'Confirm Possession',
    Active: 'Waiting for occupant',
    MoneyReturned: 'Confirm Property Return',
    PropertyReturned: 'Close Agreement',
    Closed: 'Completed',
    Disputed: 'Disputed',
  },
  OCCUPANT: {
    Created: 'Waiting for title report',
    TitleReportUploaded: 'Approve Agreement',
    ApprovedByParties: 'Waiting for contract',
    AgreementContractUploaded: 'Waiting for registry proof',
    PublicRegistryProofUploaded: 'Register Confidential Amount',
    ConfidentialAmountRegistered: 'Confirm Possession',
    PossessionDeliveryPending: 'Confirm Possession',
    Active: 'Confirm Money Returned',
    MoneyReturned: 'Waiting for owner',
    PropertyReturned: 'Close Agreement',
    Closed: 'Completed',
    Disputed: 'Disputed',
  },
  VIEWER: {
    Created: 'View only',
    TitleReportUploaded: 'View only',
    ApprovedByParties: 'View only',
    AgreementContractUploaded: 'View only',
    PublicRegistryProofUploaded: 'View only',
    ConfidentialAmountRegistered: 'View only',
    PossessionDeliveryPending: 'View only',
    Active: 'View only',
    MoneyReturned: 'View only',
    PropertyReturned: 'View only',
    Closed: 'Completed',
    Disputed: 'Disputed',
  },
}

interface AgreementSummaryCardProps {
  agreement: Agreement
  role: UserRole
  onViewDetails: (id: string) => void
}

export function AgreementSummaryCard({ agreement, role, onViewDetails }: AgreementSummaryCardProps) {
  const { progress } = useAgreementProgress(agreement.status)
  const statusStyle = STATUS_COLORS[agreement.status] ?? STATUS_COLORS['Created']
  const nextAction =
    NEXT_ACTION_LABEL[role]?.[agreement.status] ??
    NEXT_ACTION_LABEL['VIEWER']?.[agreement.status] ??
    'View'

  const isClosed = agreement.status === 'Closed'
  const isDisputed = agreement.status === 'Disputed'

  return (
    <div
      style={{
        borderRadius: '20px',
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${isDisputed ? 'rgba(239,68,68,0.3)' : isClosed ? 'rgba(255,255,255,0.08)' : 'rgba(107,96,242,0.2)'}`,
        opacity: isClosed ? 0.7 : 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', fontFamily: 'Brockmann, Syne, sans-serif' }}>
            {agreement.id}
          </h3>
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center',
                borderRadius: '9999px', padding: '3px 10px',
                fontSize: '0.7rem', fontWeight: 600,
                background: statusStyle.bg, color: statusStyle.color,
              }}
            >
              {agreement.status}
            </span>
            <RoleBadge role={role} />
          </div>
        </div>
        {isClosed && (
          <div style={{ flexShrink: 0, borderRadius: '50%', padding: '6px', background: 'rgba(255,255,255,0.06)' }}>
            <svg style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.35)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>Progress</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isClosed ? 'rgba(255,255,255,0.4)' : '#d8fab1' }}>{progress}%</span>
        </div>
        <div style={{ height: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%', borderRadius: '9999px',
              width: `${progress}%`,
              background: isClosed
                ? 'rgba(255,255,255,0.2)'
                : isDisputed
                  ? '#ef4444'
                  : 'linear-gradient(90deg, #6b60f2, #d8fab1)',
              transition: 'width 0.5s',
            }}
          />
        </div>
      </div>

      {/* Next action */}
      {!isClosed && (
        <div style={{
          borderRadius: '10px', padding: '10px 14px',
          background: 'rgba(107,96,242,0.12)',
          border: '1px solid rgba(107,96,242,0.2)',
        }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b60f2', marginBottom: '3px' }}>
            Next action
          </p>
          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{nextAction}</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
          {agreement.startDate} → {agreement.endDate}
        </p>
        <button
          type="button"
          onClick={() => onViewDetails(agreement.id)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            borderRadius: '10px', padding: '7px 14px',
            fontSize: '0.75rem', fontWeight: 600,
            background: '#6b60f2', color: '#ffffff',
            border: 'none', cursor: 'pointer',
          }}
        >
          View
          <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
