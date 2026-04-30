import { useSwitchChain } from 'wagmi'
import { ARBITRUM_SEPOLIA_CHAIN_ID, arbitrumSepoliaCustom } from '../../config/chains'
import { Button } from '../ui/Button'

interface NetworkGuardProps {
  chainId?: number
  isConnected: boolean
}

export function NetworkGuard({ chainId, isConnected }: NetworkGuardProps) {
  const { switchChainAsync, isPending } = useSwitchChain()
  const isCorrect = chainId === ARBITRUM_SEPOLIA_CHAIN_ID

  if (!isConnected || isCorrect) return null

  const addOrSwitchNetwork = async () => {
    try {
      await switchChainAsync({ chainId: ARBITRUM_SEPOLIA_CHAIN_ID })
    } catch {
      const ethereum = window.ethereum as
        | {
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
          }
        | undefined
      if (!ethereum) return
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${ARBITRUM_SEPOLIA_CHAIN_ID.toString(16)}`,
            chainName: arbitrumSepoliaCustom.name,
            nativeCurrency: arbitrumSepoliaCustom.nativeCurrency,
            rpcUrls: arbitrumSepoliaCustom.rpcUrls.default.http,
            blockExplorerUrls: [arbitrumSepoliaCustom.blockExplorers?.default.url],
          },
        ],
      })
    }
  }

  return (
    <div className="network-guard">
      <p>Please switch to Arbitrum Sepolia</p>
      <Button variant="secondary" onClick={addOrSwitchNetwork}>
        {isPending ? 'Switching...' : 'Switch Network'}
      </Button>
    </div>
  )
}
