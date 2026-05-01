import type { Agreement } from '../../types/agreement'
import type { UserRole } from '../../hooks/useConnectedRole'
import { useAgreementProgress } from '../../hooks/useAgreementProgress'
import { RoleBadge } from '../agreement/RoleBadge'

const STATUS_COLORS: Record<string, string> = {
  Created: 'text-slate-600 bg-slate-100',
  TitleReportUploaded: 'text-blue-600 bg-blue-50',
  ApprovedByParties: 'text-indigo-600 bg-indigo-50',
  AgreementContractUploaded: 'text-violet-600 bg-violet-50',
  PublicRegistryProofUploaded: 'text-purple-600 bg-purple-50',
  ConfidentialAmountRegistered: 'text-cyan-600 bg-cyan-50',
  PossessionDeliveryPending: 'text-amber-600 bg-amber-50',
  Active: 'text-emerald-600 bg-emerald-50',
  MoneyReturned: 'text-teal-600 bg-teal-50',
  PropertyReturned: 'text-green-600 bg-green-50',
  Closed: 'text-slate-500 bg-slate-100',
  Disputed: 'text-red-600 bg-red-50',
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
  const statusColor = STATUS_COLORS[agreement.status] ?? STATUS_COLORS['Created']
  const nextAction =
    NEXT_ACTION_LABEL[role]?.[agreement.status] ??
    NEXT_ACTION_LABEL['VIEWER']?.[agreement.status] ??
    'View'

  const isClosed = agreement.status === 'Closed'
  const isDisputed = agreement.status === 'Disputed'

  return (
    <div
      className={`rounded-2xl border bg-white/80 p-5 backdrop-blur-sm shadow-sm transition hover:shadow-md ${
        isClosed ? 'border-slate-200 opacity-75' : isDisputed ? 'border-red-200' : 'border-slate-200/70'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">{agreement.id}</h3>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}
            >
              {agreement.status}
            </span>
            <RoleBadge role={role} />
          </div>
        </div>
        {isClosed && (
          <div className="flex-shrink-0 rounded-full bg-slate-100 p-1.5">
            <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs font-bold text-slate-600">{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isClosed
                ? 'bg-slate-400'
                : isDisputed
                  ? 'bg-red-400'
                  : 'bg-gradient-to-r from-indigo-400 to-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Next action */}
      {!isClosed && (
        <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-400">
            Next action
          </p>
          <p className="text-sm font-medium text-indigo-800 mt-0.5">{nextAction}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {agreement.startDate} → {agreement.endDate}
        </p>
        <button
          type="button"
          onClick={() => onViewDetails(agreement.id)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
        >
          Continue
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
