import { useState } from 'react'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { useWriteContract } from 'wagmi'
import { anticreticSafeAbi } from '../abi/anticreticSafeAbi'
import { wagmiConfig } from '../config/wagmi'
import { ANTICRETIC_SAFE_ADDRESS } from '../config/contracts'

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
      const hash = await writeContractAsync({
        address: ANTICRETIC_SAFE_ADDRESS,
        abi: anticreticSafeAbi,
        functionName: 'registerConfidentialAmount',
        args: [BigInt(agreementId), encryptedAmountHandle, inputProof, asUSDOperationHash],
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
