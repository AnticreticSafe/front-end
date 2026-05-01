import type { Agreement } from '../../types/agreement'
import type { UserRole } from '../../hooks/useConnectedRole'
import { MintConfidentialAsUSDPanel } from '../web3/MintConfidentialAsUSDPanel'
import { ConfidentialAsUSDBalancePanel } from '../web3/ConfidentialAsUSDBalancePanel'
import { RegisterConfidentialAmountPanel } from '../web3/RegisterConfidentialAmountPanel'

interface ConfidentialFinancePanelProps {
  agreement: Agreement
  role: UserRole
}

interface StepWrapperProps {
  stepNumber: number
  title: string
  description: string
  state: 'active' | 'waiting' | 'locked'
  children?: React.ReactNode
}

function StepWrapper({ stepNumber, title, description, state, children }: StepWrapperProps) {
  const stateConfig = {
    active: {
      border: 'border-indigo-200',
      bg: 'bg-white',
      circle: 'bg-indigo-500 text-white border-indigo-500',
      label: 'Your Action',
      labelClass: 'bg-indigo-100 text-indigo-700',
    },
    waiting: {
      border: 'border-amber-200',
      bg: 'bg-amber-50/30',
      circle: 'bg-amber-100 text-amber-600 border-amber-200',
      label: 'Waiting',
      labelClass: 'bg-amber-100 text-amber-700',
    },
    locked: {
      border: 'border-slate-200',
      bg: 'bg-slate-50/50',
      circle: 'bg-slate-100 text-slate-400 border-slate-200',
      label: 'Locked',
      labelClass: 'bg-slate-100 text-slate-500',
    },
  }

  const cfg = stateConfig[state]

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      <div className="flex items-center gap-3 p-4 border-b border-slate-100">
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${cfg.circle}`}
        >
          {stepNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.labelClass}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children && state !== 'locked' ? (
        <div className="p-4">{children}</div>
      ) : state === 'locked' ? (
        <div className="p-4">
          <p className="text-xs text-slate-400 italic">
            Locked until previous steps are completed.
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function ConfidentialFinancePanel({ agreement, role }: ConfidentialFinancePanelProps) {
  const hasMintHash = !!agreement.asUSDOperationHash

  // Determine step states based on role and agreement status
  const mintState: StepWrapperProps['state'] =
    role === 'PROPERTY_OWNER' ? 'active' : hasMintHash ? 'waiting' : 'waiting'

  const balanceState: StepWrapperProps['state'] =
    role === 'OCCUPANT' ? 'active' : 'waiting'

  const registerState: StepWrapperProps['state'] =
    role === 'OCCUPANT' && hasMintHash
      ? 'active'
      : !hasMintHash
        ? 'locked'
        : 'waiting'

  return (
    <div className="grid gap-4">
      {/* Overview card */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-lg bg-indigo-100 p-2">
            <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Confidential Finance Flow</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Uses ERC-7984 confidential transfers with Nox encryption. Amounts are never exposed
              on-chain in plaintext.
            </p>
          </div>
        </div>
        {hasMintHash && (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <p className="text-xs font-semibold text-emerald-700">asUSD Operation Hash</p>
            <code className="mt-1 block break-all text-xs text-emerald-800">
              {agreement.asUSDOperationHash}
            </code>
          </div>
        )}
      </div>

      {/* Step 1: Mint */}
      <StepWrapper
        stepNumber={1}
        title="Mint Confidential asUSD"
        description={
          role === 'PROPERTY_OWNER'
            ? 'Mint encrypted asUSD tokens to the occupant wallet.'
            : hasMintHash
              ? 'Property owner has minted confidential asUSD.'
              : 'Waiting for property owner to mint confidential asUSD.'
        }
        state={mintState}
      >
        <MintConfidentialAsUSDPanel />
      </StepWrapper>

      {/* Step 2: Verify Balance */}
      <StepWrapper
        stepNumber={2}
        title="Verify Confidential Balance"
        description={
          role === 'OCCUPANT'
            ? 'Read and decrypt your confidential asUSD balance on Arbitrum Sepolia.'
            : 'Occupant can verify their encrypted asUSD balance.'
        }
        state={balanceState}
      >
        <ConfidentialAsUSDBalancePanel />
      </StepWrapper>

      {/* Step 3: Register */}
      <StepWrapper
        stepNumber={3}
        title="Register Confidential Amount"
        description={
          role === 'OCCUPANT' && hasMintHash
            ? 'Use the asUSD operation hash and Nox to register the encrypted amount on-chain.'
            : role === 'OCCUPANT'
              ? 'Waiting for property owner to mint asUSD first.'
              : 'Occupant will register the confidential amount on-chain.'
        }
        state={registerState}
      >
        <RegisterConfidentialAmountPanel />
      </StepWrapper>
    </div>
  )
}
