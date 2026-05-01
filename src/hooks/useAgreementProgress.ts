import type { AgreementStatus } from '../types/agreement'

export interface AgreementStep {
  status: AgreementStatus
  label: string
  shortLabel: string
}

export const AGREEMENT_STEPS: AgreementStep[] = [
  { status: 'Created', label: 'Agreement Created', shortLabel: 'Created' },
  { status: 'TitleReportUploaded', label: 'Title Report', shortLabel: 'Title Report' },
  { status: 'ApprovedByParties', label: 'Parties Approval', shortLabel: 'Approved' },
  { status: 'AgreementContractUploaded', label: 'Agreement Contract', shortLabel: 'Contract' },
  { status: 'PublicRegistryProofUploaded', label: 'Public Registry Proof', shortLabel: 'Registry' },
  { status: 'ConfidentialAmountRegistered', label: 'Confidential Amount', shortLabel: 'Amount' },
  { status: 'PossessionDeliveryPending', label: 'Possession Delivery', shortLabel: 'Possession' },
  { status: 'Active', label: 'Agreement Active', shortLabel: 'Active' },
  { status: 'MoneyReturned', label: 'Money Returned', shortLabel: 'Money' },
  { status: 'PropertyReturned', label: 'Property Returned', shortLabel: 'Property' },
  { status: 'Closed', label: 'Closed', shortLabel: 'Closed' },
]

export function useAgreementProgress(status: AgreementStatus) {
  const currentIndex = AGREEMENT_STEPS.findIndex((s) => s.status === status)
  const total = AGREEMENT_STEPS.length - 1
  const progress = currentIndex === -1 ? 0 : Math.round((currentIndex / total) * 100)

  return {
    progress,
    currentStepIndex: currentIndex,
    totalSteps: AGREEMENT_STEPS.length,
    steps: AGREEMENT_STEPS,
  }
}
