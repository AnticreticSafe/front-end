import type { Agreement } from '../../types/agreement'
import type { UserRole } from '../../hooks/useConnectedRole'
import { useWallet } from '../../hooks/useWallet'
import { AgreementSummaryCard } from './AgreementSummaryCard'
import { DashboardStats } from './DashboardStats'
interface RoleDashboardProps {
  agreements: Agreement[]
  onViewDetails: (id: string) => void
}

const OWNER_ACTION_STATUSES = new Set([
  'Created',
  'ApprovedByParties',
  'AgreementContractUploaded',
  'PublicRegistryProofUploaded',
  'ConfidentialAmountRegistered',
  'PossessionDeliveryPending',
  'MoneyReturned',
  'PropertyReturned',
])

const OCCUPANT_ACTION_STATUSES = new Set([
  'TitleReportUploaded',
  'ConfidentialAmountRegistered',
  'PossessionDeliveryPending',
  'Active',
  'PropertyReturned',
  'PublicRegistryProofUploaded',
])

function getRoleForAgreement(address: string, agreement: Agreement): UserRole {
  if (address.toLowerCase() === agreement.propertyOwner.toLowerCase()) return 'PROPERTY_OWNER'
  if (address.toLowerCase() === agreement.occupant.toLowerCase()) return 'OCCUPANT'
  return 'VIEWER'
}

function DisconnectedView({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 24px', textAlign: 'center' }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%', marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(107,96,242,0.3), rgba(216,250,177,0.15))',
        border: '1px solid rgba(107,96,242,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg style={{ width: '36px', height: '36px', color: '#6b60f2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', fontFamily: 'Brockmann, Syne, sans-serif', marginBottom: '8px' }}>
        Connect your wallet
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', maxWidth: '360px', lineHeight: 1.6, marginBottom: '28px' }}>
        Connect your wallet to view your role and manage your real-estate agreements on Arbitrum Sepolia.
      </p>
      <button
        type="button"
        onClick={onConnect}
        disabled={isConnecting}
        style={{
          borderRadius: '12px', padding: '12px 28px',
          fontSize: '0.9rem', fontWeight: 600,
          background: '#d8fab1', color: '#221a4c',
          border: 'none', cursor: 'pointer', opacity: isConnecting ? 0.6 : 1,
        }}
      >
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    </div>
  )
}

export function RoleDashboard({ agreements, onViewDetails }: RoleDashboardProps) {
  const wallet = useWallet()

  if (!wallet.isConnected || !wallet.address) {
    return (
      <div>
        <DisconnectedView onConnect={wallet.connectWallet} isConnecting={wallet.isConnecting} />
        <div style={{ marginTop: '32px' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
            Public Agreements
          </p>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {agreements.map((agreement) => (
              <AgreementSummaryCard key={agreement.id} agreement={agreement} role="VIEWER" onViewDetails={onViewDetails} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const address = wallet.address

  // Determine dominant role (if any agreement has a specific role, show that)
  const agreementsWithRoles = agreements.map((a) => ({
    agreement: a,
    role: getRoleForAgreement(address, a) as UserRole,
  }))

  const ownerAgreements = agreementsWithRoles.filter((a) => a.role === 'PROPERTY_OWNER')
  const occupantAgreements = agreementsWithRoles.filter((a) => a.role === 'OCCUPANT')
  const viewerAgreements = agreementsWithRoles.filter((a) => a.role === 'VIEWER')

  const dominantRole: 'PROPERTY_OWNER' | 'OCCUPANT' | 'VIEWER' =
    ownerAgreements.length > 0
      ? 'PROPERTY_OWNER'
      : occupantAgreements.length > 0
        ? 'OCCUPANT'
        : 'VIEWER'

  // Compute stats
  const myAgreements =
    dominantRole === 'PROPERTY_OWNER'
      ? ownerAgreements
      : dominantRole === 'OCCUPANT'
        ? occupantAgreements
        : agreementsWithRoles

  const awaitingAction = myAgreements.filter(({ agreement, role }) => {
    if (role === 'PROPERTY_OWNER') return OWNER_ACTION_STATUSES.has(agreement.status)
    if (role === 'OCCUPANT') return OCCUPANT_ACTION_STATUSES.has(agreement.status)
    return false
  }).length

  const active = myAgreements.filter(({ agreement }) => agreement.status === 'Active').length
  const closed = myAgreements.filter(({ agreement }) => agreement.status === 'Closed').length

  const ROLE_HEADER: Record<string, { title: string; subtitle: string }> = {
    PROPERTY_OWNER: {
      title: 'Property Owner Dashboard',
      subtitle: 'Manage agreements where you provide the property.',
    },
    OCCUPANT: {
      title: 'Occupant Dashboard',
      subtitle: 'Manage agreements where you provide the confidential amount.',
    },
    VIEWER: {
      title: 'Public Agreement Viewer',
      subtitle: 'View public agreement status and document hashes.',
    },
  }

  const header = ROLE_HEADER[dominantRole]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b60f2', marginBottom: '6px' }}>
            Dashboard
          </p>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, color: '#ffffff', fontFamily: 'Brockmann, Syne, sans-serif', lineHeight: 1.2 }}>
            {header.title}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>{header.subtitle}</p>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats
        role={dominantRole}
        awaitingAction={awaitingAction}
        active={active}
        closed={closed}
        total={myAgreements.length}
      />

      {/* My agreements */}
      {(ownerAgreements.length > 0 || occupantAgreements.length > 0) && (
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
            Your Agreements
          </p>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {[...ownerAgreements, ...occupantAgreements].map(({ agreement, role }) => (
              <AgreementSummaryCard key={agreement.id} agreement={agreement} role={role} onViewDetails={onViewDetails} />
            ))}
          </div>
        </div>
      )}

      {/* Other agreements (viewer) */}
      {viewerAgreements.length > 0 && (
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
            Other Agreements
          </p>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {viewerAgreements.map(({ agreement, role }) => (
              <AgreementSummaryCard key={agreement.id} agreement={agreement} role={role} onViewDetails={onViewDetails} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
