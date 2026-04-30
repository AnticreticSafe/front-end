import { QueryClient } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { arbitrumSepoliaCustom } from './chains'

export const wagmiConfig = createConfig({
  chains: [arbitrumSepoliaCustom],
  connectors: [injected()],
  transports: {
    [arbitrumSepoliaCustom.id]: http(arbitrumSepoliaCustom.rpcUrls.default.http[0]),
  },
})

export const queryClient = new QueryClient()
