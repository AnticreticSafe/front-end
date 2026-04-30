import { formatAddress } from '../../utils/formatAddress'
import { Button } from '../ui/Button'

interface WalletConnectButtonProps {
  isConnected: boolean
  address?: `0x${string}`
  chainName?: string
  onConnect: () => void
  onDisconnect: () => void
  isConnecting: boolean
}

export function WalletConnectButton({
  isConnected,
  address,
  chainName,
  onConnect,
  onDisconnect,
  isConnecting,
}: WalletConnectButtonProps) {
  if (!isConnected) {
    return (
      <Button variant="primary" onClick={onConnect}>
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    )
  }

  return (
    <div className="wallet-box">
      <div>
        <p className="muted">Connected</p>
        <p className="wallet-address">{address ? formatAddress(address) : 'Unknown'}</p>
        <p className="muted">Chain: {chainName ?? 'Unknown'}</p>
      </div>
      <Button variant="ghost" onClick={onDisconnect}>
        Disconnect
      </Button>
    </div>
  )
}
