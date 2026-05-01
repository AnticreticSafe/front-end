import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { getBlock, waitForTransactionReceipt } from 'wagmi/actions'
import { anticreticSafeAbi } from '../abi/anticreticSafeAbi'
import { wagmiConfig } from '../config/wagmi'
import { ANTICRETIC_SAFE_ADDRESS } from '../config/contracts'

async function getFees() {
  const block = await getBlock(wagmiConfig, { blockTag: 'latest' })
  const baseFee = block.baseFeePerGas ?? BigInt(1_000_000_000)
  return {
    maxFeePerGas: baseFee * 3n,
    maxPriorityFeePerGas: 0n, // Arbitrum L2 — no tip needed
  }
}

export function useAgreementWriter() {
  const { writeContractAsync } = useWriteContract()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const call = async (functionName: string, args: unknown[]) => {
    setError('')
    setIsPending(true)
    try {
      const fees = await getFees()
      const hash = await writeContractAsync({
        address: ANTICRETIC_SAFE_ADDRESS,
        abi: anticreticSafeAbi,
        functionName,
        args,
        gas: BigInt(8_000_000),
        ...fees,
      } as Parameters<typeof writeContractAsync>[0])
      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash })
      return { txHash: hash, receipt }
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err)
      // Preserve the full message so the UI can parse custom contract errors
      setError(raw.slice(0, 400))
      throw err
    } finally {
      setIsPending(false)
    }
  }

  return {
    isPending,
    error,
    clearError: () => setError(''),
    createAgreement: (occupant: `0x${string}`, propertyHash: `0x${string}`, startDate: number, endDate: number) =>
      call('createAgreement', [occupant, propertyHash, BigInt(startDate), BigInt(endDate)]),
    uploadTitleReport: (id: string, hash: `0x${string}`) =>
      call('uploadTitleReportHash', [BigInt(id), hash]),
    approveAgreement: (id: string) =>
      call('approveAgreement', [BigInt(id)]),
    uploadAgreementContract: (id: string, hash: `0x${string}`) =>
      call('uploadAgreementContractHash', [BigInt(id), hash]),
    uploadPublicRegistry: (id: string, hash: `0x${string}`) =>
      call('uploadPublicRegistryProofHash', [BigInt(id), hash]),
    confirmPossessionDelivery: (id: string, hash: `0x${string}`) =>
      call('propertyOwnerConfirmPossessionDelivery', [BigInt(id), hash]),
    confirmPossessionReceived: (id: string) =>
      call('occupantConfirmPossessionReceived', [BigInt(id)]),
    confirmMoneyReturned: (id: string) =>
      call('occupantConfirmMoneyReturned', [BigInt(id)]),
    confirmPropertyReturned: (id: string) =>
      call('propertyOwnerConfirmPropertyReturned', [BigInt(id)]),
    closeAgreement: (id: string, hash: `0x${string}`) =>
      call('closeAgreement', [BigInt(id), hash]),
    openDispute: (id: string, reasonHash: `0x${string}`) =>
      call('openDispute', [BigInt(id), reasonHash]),
  }
}
