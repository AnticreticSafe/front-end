import type { AgreementStatus } from '../../types/agreement'
import { AGREEMENT_STEPS } from '../../hooks/useAgreementProgress'

interface AgreementProgressStepperProps {
  currentStatus: AgreementStatus
}

type StepState = 'completed' | 'current' | 'pending'

function getStepState(stepIndex: number, currentIndex: number): StepState {
  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'current'
  return 'pending'
}

export function AgreementProgressStepper({ currentStatus }: AgreementProgressStepperProps) {
  const currentIndex = AGREEMENT_STEPS.findIndex((s) => s.status === currentStatus)

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex min-w-max items-start gap-0">
        {AGREEMENT_STEPS.map((step, index) => {
          const state = getStepState(index, currentIndex)
          const isLast = index === AGREEMENT_STEPS.length - 1

          return (
            <div key={step.status} className="flex items-start">
              {/* Step item */}
              <div className="flex flex-col items-center" style={{ minWidth: '72px' }}>
                {/* Circle */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                    state === 'completed'
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : state === 'current'
                        ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-200'
                        : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {state === 'completed' ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {/* Label */}
                <span
                  className={`mt-2 text-center text-[10px] font-medium leading-tight ${
                    state === 'completed'
                      ? 'text-emerald-600'
                      : state === 'current'
                        ? 'text-indigo-600 font-semibold'
                        : 'text-slate-400'
                  }`}
                  style={{ maxWidth: '66px' }}
                >
                  {step.shortLabel}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="mt-4 h-0.5 flex-1" style={{ minWidth: '12px' }}>
                  <div
                    className={`h-full transition-all ${
                      index < currentIndex ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
