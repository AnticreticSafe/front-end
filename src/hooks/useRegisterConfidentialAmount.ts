import { useState } from 'react'
import { waitForTransactionReceipt, getBlock } from 'wagmi/actions'
import { useWriteContract } from 'wagmi'
import { anticreticSafeAbi } from '../abi/anticreticSafeAbi'
import { wagmiConfig } from '../config/wagmi'
import { ANTICRETIC_SAFE_ADDRESS } from '../config/contracts'

async function getFees() {
  const block = await getBlock(wagmiConfig, { blockTag: 'latest' })
  const baseFee = block.baseFeePerGas ?? BigInt(1_000_000_000)
  return {
    maxFeePerGas: baseFee * 3n,
    maxPriorityFeePerGas: 0n,
  }
}

interface RegisterParams {
  agreementId: string
  encryptedAmountHandle: `0x${string}`
  inputProof: `0x${string}`
  asUSDOperationHash: `0x${string}`
}

export function useRegisterConfidentialAmount() {
  const { writeContractAsync } = useWriteContract()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const register = async ({
    agreementId,
    encryptedAmountHandle,
    inputProof,
    asUSDOperationHash,
  }: RegisterParams) => {
    setIsSubmitting(true)
    try {
      const fees = await getFees()
      const hash = await writeContractAsync({
        address: ANTICRETIC_SAFE_ADDRESS,
        abi: anticreticSafeAbi,
        functionName: 'registerConfidentialAmount',
        args: [BigInt(agreementId), encryptedAmountHandle, inputProof, asUSDOperationHash],
        gas: BigInt(8_000_000),
        ...fees,
      })
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash,
      })
      return {
        txHash: hash,
        receipt,
      }
    } catch (error) {
      console.error('Transaction failed:', error)
      throw new Error('Transaction failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    register,
  }
}
