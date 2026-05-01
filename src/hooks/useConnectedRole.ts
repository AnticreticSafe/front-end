import { useWallet } from './useWallet'
import type { Agreement } from '../types/agreement'

export type UserRole = 'PROPERTY_OWNER' | 'OCCUPANT' | 'VIEWER' | 'DISCONNECTED'

export function useConnectedRole(agreement?: Agreement | null): UserRole {
  const { address, isConnected } = useWallet()
  if (!isConnected || !address) return 'DISCONNECTED'
  if (!agreement) return 'VIEWER'
  if (address.toLowerCase() === agreement.propertyOwner.toLowerCase()) return 'PROPERTY_OWNER'
  if (address.toLowerCase() === agreement.occupant.toLowerCase()) return 'OCCUPANT'
  return 'VIEWER'
}
