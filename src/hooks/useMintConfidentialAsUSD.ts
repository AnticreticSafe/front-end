import { useState } from 'react'
import { waitForTransactionReceipt, getBlock } from 'wagmi/actions'
import { useWriteContract } from 'wagmi'
import { anticreticSafeUsdAbi } from '../abi/anticreticSafeUsdAbi'
import { ANTICRETIC_SAFE_USD_ADDRESS } from '../config/contracts'
import { wagmiConfig } from '../config/wagmi'

async function getFees() {
  const block = await getBlock(wagmiConfig, { blockTag: 'latest' })
  const baseFee = block.baseFeePerGas ?? BigInt(1_000_000_000)
  return {
    maxFeePerGas: baseFee * 3n,
    maxPriorityFeePerGas: 0n,
  }
}

interface MintParams {
  recipient: `0x${string}`
  encryptedAmountHandle: `0x${string}`
  inputProof: `0x${string}`
}

export function useMintConfidentialAsUSD() {
  const { writeContractAsync } = useWriteContract()
  const [txHash, setTxHash] = useState<`0x${string}` | ''>('')
  const [receipt, setReceipt] = useState<Awaited<
    ReturnType<typeof waitForTransactionReceipt>
  > | null>(null)
  const [error, setError] = useState<string>('')
  const [isPending, setIsPending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const mintConfidentialAsUSD = async ({
    recipient,
    encryptedAmountHandle,
    inputProof,
  }: MintParams) => {
    setError('')
    setReceipt(null)
    setIsPending(true)
    try {
      const fees = await getFees()
      const hash = await writeContractAsync({
        address: ANTICRETIC_SAFE_USD_ADDRESS,
        abi: anticreticSafeUsdAbi,
        functionName: 'mint',
        args: [recipient, encryptedAmountHandle, inputProof],
        gas: BigInt(8_000_000),
        ...fees,
      })
      setTxHash(hash)
      setIsPending(false)
      setIsConfirming(true)
      const confirmedReceipt = await waitForTransactionReceipt(wagmiConfig, { hash })
      setReceipt(confirmedReceipt)
      return { txHash: hash, receipt: confirmedReceipt }
    } catch (err) {
      console.error('Mint transaction failed:', err)
      setError('Mint transaction failed.')
      throw err
    } finally {
      setIsPending(false)
      setIsConfirming(false)
    }
  }

  return {
    mintConfidentialAsUSD,
    isPending,
    isConfirming,
    txHash,
    receipt,
    error,
  }
}
