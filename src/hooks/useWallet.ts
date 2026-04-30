import { useMemo } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ARBITRUM_SEPOLIA_CHAIN_ID } from '../config/chains'

export function useWallet() {
  const account = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  const injectedConnector = useMemo(
    () => connectors.find((connector) => connector.type === 'injected') ?? connectors[0],
    [connectors],
  )

  const connectWallet = () => {
    if (!injectedConnector) return
    connect({ connector: injectedConnector })
  }

  const isCorrectNetwork = account.chainId === ARBITRUM_SEPOLIA_CHAIN_ID

  return {
    ...account,
    connectWallet,
    disconnectWallet: disconnect,
    isConnecting,
    isCorrectNetwork,
  }
}
