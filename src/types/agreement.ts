export type AgreementStatus =
  | 'Created'
  | 'TitleReportUploaded'
  | 'ApprovedByParties'
  | 'AgreementContractUploaded'
  | 'PublicRegistryProofUploaded'
  | 'ConfidentialAmountRegistered'
  | 'PossessionDeliveryPending'
  | 'Active'
  | 'MoneyReturned'
  | 'PropertyReturned'
  | 'Closed'
  | 'Disputed'

export interface AgreementApprovals {
  propertyOwnerApproved: boolean
  occupantApproved: boolean
}

export interface Agreement {
  id: string
  propertyOwner: string
  occupant: string
  propertyHash: string
  titleReportHash: string
  agreementContractHash: string
  publicRegistryProofHash: string
  possessionDeliveryHash: string
  closureProofHash: string
  asUSDOperationHash: string
  amountRegistered: boolean
  confidentialAmountLabel: string
  startDate: string
  endDate: string
  status: AgreementStatus
  approvals: AgreementApprovals
}
