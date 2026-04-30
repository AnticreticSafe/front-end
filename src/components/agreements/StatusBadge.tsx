import type { AgreementStatus } from '../../types/agreement'

interface StatusBadgeProps {
  status: AgreementStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{status}</span>
}
