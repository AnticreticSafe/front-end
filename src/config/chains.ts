import type { Chain } from 'viem'

export const arbitrumSepoliaCustom: Chain = {
  id: 421614,
  name: 'Arbitrum Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://sepolia.arbiscan.io',
    },
  },
}

export const ARBITRUM_SEPOLIA_CHAIN_ID = arbitrumSepoliaCustom.id
