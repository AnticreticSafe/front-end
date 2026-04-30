import type { AgreementStatus } from '../../types/agreement'

const timelineStatuses: AgreementStatus[] = [
  'Created',
  'TitleReportUploaded',
  'ApprovedByParties',
  'AgreementContractUploaded',
  'PublicRegistryProofUploaded',
  'ConfidentialAmountRegistered',
  'PossessionDeliveryPending',
  'Active',
  'MoneyReturned',
  'PropertyReturned',
  'Closed',
]

interface AgreementTimelineProps {
  currentStatus: AgreementStatus
}

export function AgreementTimeline({ currentStatus }: AgreementTimelineProps) {
  const activeIndex = timelineStatuses.indexOf(currentStatus)
  return (
    <ol className="timeline">
      {timelineStatuses.map((status, index) => (
        <li key={status} className={index <= activeIndex ? 'done' : ''}>
          <span>{status}</span>
        </li>
      ))}
    </ol>
  )
}
