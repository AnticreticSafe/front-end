import type { Agreement } from '../../types/agreement'
import type { UserRole } from '../../hooks/useConnectedRole'
import { useAgreementProgress } from '../../hooks/useAgreementProgress'
import { RoleBadge } from './RoleBadge'
import { ANTICRETIC_SAFE_ADDRESS } from '../../config/contracts'

interface AgreementHeaderProps {
  agreement: Agreement
  role: UserRole
}

const STATUS_COLORS: Record<string, string> = {
  Created: 'border-slate-200 bg-slate-50 text-slate-700',
  TitleReportUploaded: 'border-blue-200 bg-blue-50 text-blue-700',
  ApprovedByParties: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  AgreementContractUploaded: 'border-violet-200 bg-violet-50 text-violet-700',
  PublicRegistryProofUploaded: 'border-purple-200 bg-purple-50 text-purple-700',
  ConfidentialAmountRegistered: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  PossessionDeliveryPending: 'border-amber-200 bg-amber-50 text-amber-700',
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  MoneyReturned: 'border-teal-200 bg-teal-50 text-teal-700',
  PropertyReturned: 'border-green-200 bg-green-50 text-green-700',
  Closed: 'border-slate-300 bg-slate-100 text-slate-600',
  Disputed: 'border-red-200 bg-red-50 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  Created: 'Created',
  TitleReportUploaded: 'Title Report Uploaded',
  ApprovedByParties: 'Approved by Parties',
  AgreementContractUploaded: 'Agreement Contract Uploaded',
  PublicRegistryProofUploaded: 'Public Registry Proof Uploaded',
  ConfidentialAmountRegistered: 'Confidential Amount Registered',
  PossessionDeliveryPending: 'Possession Delivery Pending',
  Active: 'Active',
  MoneyReturned: 'Money Returned',
  PropertyReturned: 'Property Returned',
  Closed: 'Closed',
  Disputed: 'Disputed',
}

const EXPLORER_URL = 'https://sepolia.arbiscan.io/address/'

export function AgreementHeader({ agreement, role }: AgreementHeaderProps) {
  const { progress } = useAgreementProgress(agreement.status)
  const statusColor = STATUS_COLORS[agreement.status] ?? STATUS_COLORS['Created']
  const statusLabel = STATUS_LABELS[agreement.status] ?? agreement.status

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-md">
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
              Agreement
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{agreement.id}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}
            >
              {statusLabel}
            </span>
            <RoleBadge role={role} />
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
              Arbitrum Sepolia
            </span>
          </div>
        </div>

        <a
          href={`${EXPLORER_URL}${ANTICRETIC_SAFE_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View on Explorer
        </a>
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">Agreement Progress</span>
          <span className="text-xs font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
