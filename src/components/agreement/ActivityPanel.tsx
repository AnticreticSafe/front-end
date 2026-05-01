import type { Agreement } from '../../types/agreement'
import { formatDate } from '../../utils/format'

interface ActivityEvent {
  id: string
  label: string
  timestamp?: string
  hash?: string
  actor?: string
  isDone: boolean
}

function buildActivityEvents(agreement: Agreement): ActivityEvent[] {
  return [
    {
      id: 'created',
      label: 'Agreement created',
      timestamp: agreement.startDate,
      isDone: true,
    },
    {
      id: 'title_report',
      label: 'Title report uploaded',
      hash: agreement.titleReportHash,
      isDone: !!agreement.titleReportHash,
    },
    {
      id: 'owner_approved',
      label: 'Property owner approved',
      isDone: agreement.approvals.propertyOwnerApproved,
    },
    {
      id: 'occupant_approved',
      label: 'Occupant approved',
      isDone: agreement.approvals.occupantApproved,
    },
    {
      id: 'contract_uploaded',
      label: 'Agreement contract uploaded',
      hash: agreement.agreementContractHash,
      isDone: !!agreement.agreementContractHash,
    },
    {
      id: 'registry_uploaded',
      label: 'Public registry proof uploaded',
      hash: agreement.publicRegistryProofHash,
      isDone: !!agreement.publicRegistryProofHash,
    },
    {
      id: 'asusd_minted',
      label: 'Confidential asUSD minted',
      hash: agreement.asUSDOperationHash,
      isDone: !!agreement.asUSDOperationHash,
    },
    {
      id: 'amount_registered',
      label: 'Confidential amount registered on-chain',
      isDone: agreement.amountRegistered,
    },
    {
      id: 'possession_delivered',
      label: 'Possession delivery confirmed',
      hash: agreement.possessionDeliveryHash,
      isDone: !!agreement.possessionDeliveryHash,
    },
    {
      id: 'closed',
      label: 'Agreement closed',
      hash: agreement.closureProofHash,
      isDone: !!agreement.closureProofHash,
    },
  ]
}

interface ActivityPanelProps {
  agreement: Agreement
}

export function ActivityPanel({ agreement }: ActivityPanelProps) {
  const events = buildActivityEvents(agreement)
  const doneEvents = events.filter((e) => e.isDone)
  const pendingEvents = events.filter((e) => !e.isDone)

  return (
    <div className="grid gap-6">
      {/* Header note */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        Activity is currently derived from agreement state and document hashes.{' '}
        <span className="font-semibold text-indigo-600">TODO:</span> Replace with on-chain event
        logs once contract event indexing is integrated.
      </div>

      {/* Completed events */}
      {doneEvents.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Completed
          </h4>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-emerald-200" />
            <div className="grid gap-3">
              {doneEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 pl-1">
                  <div className="relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 mt-0.5">
                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 rounded-xl border border-emerald-100 bg-white/80 p-3">
                    <p className="text-sm font-semibold text-slate-800">{event.label}</p>
                    {event.timestamp && (
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(event.timestamp)}</p>
                    )}
                    {event.hash && (
                      <code className="mt-1 block break-all text-xs text-sky-700">
                        {event.hash.slice(0, 20)}...{event.hash.slice(-8)}
                      </code>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending events */}
      {pendingEvents.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Pending
          </h4>
          <div className="grid gap-2">
            {pendingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-slate-300 bg-white" />
                <p className="text-sm text-slate-500">{event.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
