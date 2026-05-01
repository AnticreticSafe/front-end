import type { NextAction } from '../../hooks/useNextAction'
import { Button } from '../ui/Button'

interface NextActionCardProps {
  action: NextAction
  onAction?: () => void
}

export function NextActionCard({ action, onAction }: NextActionCardProps) {
  const isWaiting = action.isWaiting
  const isCompleted = action.isCompleted
  const isDisabled = !action.enabled

  let borderColor = 'border-indigo-200'
  let bgColor = 'bg-gradient-to-br from-indigo-50 to-purple-50'
  let iconBg = 'bg-indigo-100'
  let iconColor = 'text-indigo-600'
  let badgeText = 'Your Action Required'
  let badgeClass = 'bg-indigo-100 text-indigo-700'

  if (isWaiting) {
    borderColor = 'border-amber-200'
    bgColor = 'bg-gradient-to-br from-amber-50 to-orange-50'
    iconBg = 'bg-amber-100'
    iconColor = 'text-amber-600'
    badgeText = 'Waiting for Other Party'
    badgeClass = 'bg-amber-100 text-amber-700'
  } else if (isCompleted) {
    borderColor = 'border-emerald-200'
    bgColor = 'bg-gradient-to-br from-emerald-50 to-teal-50'
    iconBg = 'bg-emerald-100'
    iconColor = 'text-emerald-600'
    badgeText = 'Completed'
    badgeClass = 'bg-emerald-100 text-emerald-700'
  } else if (isDisabled && !isWaiting) {
    borderColor = 'border-slate-200'
    bgColor = 'bg-gradient-to-br from-slate-50 to-slate-100'
    iconBg = 'bg-slate-100'
    iconColor = 'text-slate-500'
    badgeText = 'Locked'
    badgeClass = 'bg-slate-100 text-slate-600'
  }

  return (
    <div className={`rounded-2xl border-2 ${borderColor} ${bgColor} p-5`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 rounded-xl ${iconBg} p-2.5`}>
          {isWaiting ? (
            <svg className={`h-5 w-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : isCompleted ? (
            <svg className={`h-5 w-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : action.enabled ? (
            <svg className={`h-5 w-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ) : (
            <svg className={`h-5 w-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}>
              {badgeText}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">{action.title}</h3>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{action.description}</p>
          {action.reasonDisabled && (
            <p className="mt-1 text-xs text-amber-600 font-medium">{action.reasonDisabled}</p>
          )}

          {action.actionLabel && action.enabled && onAction ? (
            <div className="mt-3">
              <Button variant="primary" onClick={onAction}>
                {action.actionLabel}
              </Button>
            </div>
          ) : action.actionLabel && action.enabled ? (
            <div className="mt-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                {action.actionLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
