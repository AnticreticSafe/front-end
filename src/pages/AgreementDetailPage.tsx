import { useState } from 'react'
import type { Agreement } from '../types/agreement'
import { useConnectedRole } from '../hooks/useConnectedRole'
import { useNextAction } from '../hooks/useNextAction'
import { AgreementHeader } from '../components/agreement/AgreementHeader'
import { AgreementProgressStepper } from '../components/agreement/AgreementProgressStepper'
import { NextActionCard } from '../components/agreement/NextActionCard'
import { AgreementTabs } from '../components/agreement/AgreementTabs'
import type { TabId } from '../components/agreement/AgreementTabs'

interface AgreementDetailPageProps {
  agreement: Agreement
  onBack?: () => void
}

export function AgreementDetailPage({ agreement, onBack }: AgreementDetailPageProps) {
  const role = useConnectedRole(agreement)
  const nextAction = useNextAction(
    agreement.status,
    role,
    agreement.approvals,
    agreement.asUSDOperationHash,
  )

  const [pendingTab, setPendingTab] = useState<TabId | undefined>(undefined)

  const handleNextAction = () => {
    if (nextAction.actionType === 'go_to_finance') {
      setPendingTab('finance')
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 grid gap-6">
      {/* Back button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      )}

      {/* Agreement Header */}
      <AgreementHeader agreement={agreement} role={role} />

      {/* Progress Stepper */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 backdrop-blur-md shadow-sm overflow-hidden">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Agreement Progress
        </h2>
        <AgreementProgressStepper currentStatus={agreement.status} />
      </div>

      {/* Next Action Card */}
      <NextActionCard action={nextAction} onAction={handleNextAction} />

      {/* Tabs */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 backdrop-blur-md shadow-sm">
        <AgreementTabs
          agreement={agreement}
          role={role}
          initialTab={pendingTab}
        />
      </div>
    </main>
  )
}
