import type { AgreementApprovals, AgreementStatus } from '../types/agreement'
import type { UserRole } from './useConnectedRole'

export type ActionType =
  | 'upload_title_report'
  | 'approve'
  | 'upload_contract'
  | 'upload_registry'
  | 'go_to_finance'
  | 'confirm_possession'
  | 'confirm_money'
  | 'confirm_property'
  | 'close'
  | 'none'

export interface NextAction {
  title: string
  description: string
  actionLabel?: string
  actionType?: ActionType
  enabled: boolean
  reasonDisabled?: string
  isWaiting?: boolean
  isCompleted?: boolean
}

export function useNextAction(
  status: AgreementStatus,
  role: UserRole,
  approvals: AgreementApprovals,
  asUSDOperationHash: string,
): NextAction {
  if (role === 'DISCONNECTED') {
    return {
      title: 'Connect Your Wallet',
      description: 'Connect your wallet to view your role and available actions in this agreement.',
      enabled: false,
    }
  }

  if (role === 'VIEWER') {
    return {
      title: 'Read-Only View',
      description:
        'You are viewing this agreement as a public auditor. Connect as a party to take actions.',
      enabled: false,
    }
  }

  switch (status) {
    case 'Created':
      if (role === 'PROPERTY_OWNER') {
        return {
          title: 'Upload Title Report',
          description:
            'Upload the hash of the property title report (Informe Alodial) to begin the verification process.',
          actionLabel: 'Upload Title Report Hash',
          actionType: 'upload_title_report',
          enabled: true,
        }
      }
      return {
        title: 'Waiting for Title Report',
        description:
          'The property owner must upload the title report before you can take action.',
        enabled: false,
        isWaiting: true,
      }

    case 'TitleReportUploaded':
      if (role === 'PROPERTY_OWNER') {
        if (approvals.propertyOwnerApproved) {
          return {
            title: 'Waiting for Occupant Approval',
            description:
              'You have already approved the agreement. Waiting for the occupant to approve.',
            enabled: false,
            isWaiting: true,
          }
        }
        return {
          title: 'Approve Agreement',
          description: 'Review and approve the agreement terms to proceed to the next stage.',
          actionLabel: 'Approve Agreement',
          actionType: 'approve',
          enabled: true,
        }
      }
      if (approvals.occupantApproved) {
        return {
          title: 'Waiting for Owner Approval',
          description: 'You have already approved. Waiting for the property owner to approve.',
          enabled: false,
          isWaiting: true,
        }
      }
      return {
        title: 'Approve Agreement',
        description: 'Review and approve the agreement terms to proceed to the next stage.',
        actionLabel: 'Approve Agreement',
        actionType: 'approve',
        enabled: true,
      }

    case 'ApprovedByParties':
      if (role === 'PROPERTY_OWNER') {
        return {
          title: 'Upload Agreement Contract',
          description:
            'Upload the hash of the signed agreement contract (Minuta) to continue the process.',
          actionLabel: 'Upload Agreement Contract Hash',
          actionType: 'upload_contract',
          enabled: true,
        }
      }
      return {
        title: 'Agreement Contract Pending',
        description:
          'Both parties have approved. Waiting for the property owner to upload the signed agreement contract.',
        enabled: false,
        isWaiting: true,
      }

    case 'AgreementContractUploaded':
      if (role === 'PROPERTY_OWNER') {
        return {
          title: 'Upload Public Registry Proof',
          description:
            'Upload the hash of the public registry proof (Derechos Reales) to proceed.',
          actionLabel: 'Upload Public Registry Proof Hash',
          actionType: 'upload_registry',
          enabled: true,
        }
      }
      return {
        title: 'Public Registry Proof Pending',
        description:
          'Waiting for the property owner to upload the public registry proof (Derechos Reales).',
        enabled: false,
        isWaiting: true,
      }

    case 'PublicRegistryProofUploaded':
      if (role === 'PROPERTY_OWNER') {
        return {
          title: 'Mint Confidential asUSD',
          description:
            'Mint confidential asUSD tokens to the occupant before the amount can be registered on-chain.',
          actionLabel: 'Go to Confidential Finance',
          actionType: 'go_to_finance',
          enabled: true,
        }
      }
      return {
        title: asUSDOperationHash ? 'Register Confidential Amount' : 'Waiting for Mint',
        description: asUSDOperationHash
          ? 'Use the asUSD operation hash and Nox encryption to register the confidential amount on-chain.'
          : 'Waiting for the property owner to mint confidential asUSD before you can register.',
        actionLabel: asUSDOperationHash ? 'Go to Confidential Finance' : undefined,
        actionType: asUSDOperationHash ? 'go_to_finance' : 'none',
        enabled: !!asUSDOperationHash,
        isWaiting: !asUSDOperationHash,
        reasonDisabled: !asUSDOperationHash
          ? 'Waiting for property owner to mint asUSD first'
          : undefined,
      }

    case 'ConfidentialAmountRegistered':
      if (role === 'PROPERTY_OWNER') {
        return {
          title: 'Confirm Possession Delivery',
          description:
            'Confirm that you have delivered physical possession of the property to the occupant.',
          actionLabel: 'Confirm Possession Delivery',
          actionType: 'confirm_possession',
          enabled: true,
        }
      }
      return {
        title: 'Confirm Possession Received',
        description:
          'Confirm that you have received physical possession of the property from the owner.',
        actionLabel: 'Confirm Possession Received',
        actionType: 'confirm_possession',
        enabled: true,
      }

    case 'PossessionDeliveryPending':
      return {
        title: 'Possession Delivery In Progress',
        description:
          'Possession transfer is in progress. Confirm when the physical delivery is complete.',
        actionLabel: 'Confirm Possession Complete',
        actionType: 'confirm_possession',
        enabled: true,
      }

    case 'Active':
      if (role === 'OCCUPANT') {
        return {
          title: 'Return Money When Ready',
          description:
            'When the agreement term ends, confirm that the confidential amount has been returned to the owner.',
          actionLabel: 'Confirm Money Returned',
          actionType: 'confirm_money',
          enabled: true,
        }
      }
      return {
        title: 'Agreement is Active',
        description:
          'The agreement is currently active. The occupant will confirm money return when the term ends.',
        enabled: false,
        isWaiting: true,
      }

    case 'MoneyReturned':
      if (role === 'PROPERTY_OWNER') {
        return {
          title: 'Confirm Property Return',
          description:
            'Confirm that the property has been returned by the occupant in agreed condition.',
          actionLabel: 'Confirm Property Returned',
          actionType: 'confirm_property',
          enabled: true,
        }
      }
      return {
        title: 'Waiting for Property Return Confirmation',
        description:
          'Money returned confirmed. Waiting for the property owner to confirm property return.',
        enabled: false,
        isWaiting: true,
      }

    case 'PropertyReturned':
      return {
        title: 'Close Agreement',
        description:
          'Both parties have fulfilled their obligations. Either party can now close the agreement.',
        actionLabel: 'Close Agreement',
        actionType: 'close',
        enabled: true,
      }

    case 'Closed':
      return {
        title: 'Agreement Closed',
        description: 'This agreement has successfully completed its full lifecycle.',
        enabled: false,
        isCompleted: true,
      }

    case 'Disputed':
      return {
        title: 'Agreement Disputed',
        description:
          'This agreement is under dispute. Please contact the other party or a mediator to resolve.',
        enabled: false,
      }

    default:
      return {
        title: 'Unknown Status',
        description: 'Unable to determine the next action for the current agreement status.',
        enabled: false,
      }
  }
}
