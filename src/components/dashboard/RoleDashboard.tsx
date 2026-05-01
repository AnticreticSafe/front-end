import type { Agreement } from '../../types/agreement'
import type { UserRole } from '../../hooks/useConnectedRole'
import { useWallet } from '../../hooks/useWallet'
import { AgreementSummaryCard } from './AgreementSummaryCard'
import { DashboardStats } from './DashboardStats'
import { WalletConnectButton } from '../web3/WalletConnectButton'

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
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
        <svg className="h-10 w-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900">Connect your wallet</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Connect your wallet to view your role and manage your real-estate agreements on Arbitrum
        Sepolia.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onConnect}
          disabled={isConnecting}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/50 hover:opacity-95 transition"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  )
}

export function RoleDashboard({ agreements, onViewDetails }: RoleDashboardProps) {
  const wallet = useWallet()

  if (!wallet.isConnected || !wallet.address) {
    return (
      <div>
        <DisconnectedView onConnect={wallet.connectWallet} isConnecting={wallet.isConnecting} />
        {/* Still show all agreements for visitors */}
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Public Agreements
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agreements.map((agreement) => (
              <AgreementSummaryCard
                key={agreement.id}
                agreement={agreement}
                role="VIEWER"
                onViewDetails={onViewDetails}
              />
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
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{header.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{header.subtitle}</p>
        </div>
        <div className="flex-shrink-0">
          <WalletConnectButton
            isConnected={wallet.isConnected}
            address={wallet.address}
            chainName={wallet.chain?.name}
            onConnect={wallet.connectWallet}
            onDisconnect={wallet.disconnectWallet}
            isConnecting={wallet.isConnecting}
          />
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
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Your Agreements
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...ownerAgreements, ...occupantAgreements].map(({ agreement, role }) => (
              <AgreementSummaryCard
                key={agreement.id}
                agreement={agreement}
                role={role}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other agreements (viewer) */}
      {viewerAgreements.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Other Agreements
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {viewerAgreements.map(({ agreement, role }) => (
              <AgreementSummaryCard
                key={agreement.id}
                agreement={agreement}
                role={role}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
