import { useMemo } from 'react'
import { useReadContract, useReadContracts } from 'wagmi'
import { useWallet } from './useWallet'
import { anticreticSafeAbi } from '../abi/anticreticSafeAbi'
import { ANTICRETIC_SAFE_ADDRESS } from '../config/contracts'
import type { Agreement, AgreementStatus } from '../types/agreement'

const STATUS_MAP: Record<number, AgreementStatus> = {
  0: 'Created',
  1: 'TitleReportUploaded',
  2: 'ApprovedByParties',
  3: 'AgreementContractUploaded',
  4: 'PublicRegistryProofUploaded',
  5: 'ConfidentialAmountRegistered',
  6: 'PossessionDeliveryPending',
  7: 'Active',
  8: 'MoneyReturned',
  9: 'PropertyReturned',
  10: 'Closed',
  11: 'Disputed',
}

const ZERO_BYTES32 = '0x' + '0'.repeat(64)

function hex32(h: string): string {
  return h === ZERO_BYTES32 ? '' : h
}

function tsToDate(ts: bigint): string {
  if (ts === 0n) return '—'
  const d = new Date(Number(ts) * 1000)
  return d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function useMyAgreements() {
  const { address, isConnected } = useWallet()

  // 1. Total agreement count
  const { data: counterData, isLoading: counterLoading } = useReadContract({
    address: ANTICRETIC_SAFE_ADDRESS,
    abi: anticreticSafeAbi,
    functionName: 'agreementCounter',
    query: { enabled: isConnected, staleTime: 0 },
  })
  const count = Number(counterData ?? 0n)

  // 2. Batch-read all agreement cores
  const coreContracts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        address: ANTICRETIC_SAFE_ADDRESS,
        abi: anticreticSafeAbi,
        functionName: 'getAgreementCore' as const,
        args: [BigInt(i)] as const,
      })),
    [count],
  )
  const { data: coresRaw, isLoading: coresLoading } = useReadContracts({
    contracts: coreContracts,
    query: { enabled: count > 0, staleTime: 0 },
  })

  // 3. Filter IDs where the connected wallet is a participant
  const myIds = useMemo(() => {
    if (!coresRaw || !address) return []
    return coresRaw.reduce<number[]>((acc, result, i) => {
      if (result.status !== 'success') return acc
      const [, propertyOwner, occupant] = result.result as [
        bigint, `0x${string}`, `0x${string}`, `0x${string}`, bigint, bigint, boolean, number,
      ]
      const lo = address.toLowerCase()
      if (propertyOwner.toLowerCase() === lo || occupant.toLowerCase() === lo) acc.push(i)
      return acc
    }, [])
  }, [coresRaw, address])

  // 4. Batch-read hashes + approvals for my agreements
  const hashContracts = useMemo(
    () =>
      myIds.map(id => ({
        address: ANTICRETIC_SAFE_ADDRESS,
        abi: anticreticSafeAbi,
        functionName: 'getAgreementHashes' as const,
        args: [BigInt(id)] as const,
      })),
    [myIds],
  )
  const approvalContracts = useMemo(
    () =>
      myIds.map(id => ({
        address: ANTICRETIC_SAFE_ADDRESS,
        abi: anticreticSafeAbi,
        functionName: 'getAgreementApprovals' as const,
        args: [BigInt(id)] as const,
      })),
    [myIds],
  )

  const { data: hashesRaw, isLoading: hashesLoading } = useReadContracts({
    contracts: hashContracts,
    query: { enabled: myIds.length > 0, staleTime: 0 },
  })
  const { data: approvalsRaw, isLoading: approvalsLoading } = useReadContracts({
    contracts: approvalContracts,
    query: { enabled: myIds.length > 0, staleTime: 0 },
  })

  // 5. Assemble Agreement objects
  const agreements = useMemo<Agreement[]>(() => {
    if (myIds.length === 0) return []
    if (!coresRaw || !hashesRaw || !approvalsRaw) return []

    return myIds.reduce<Agreement[]>((acc, id, idx) => {
      const core = coresRaw[id]
      const hashes = hashesRaw[idx]
      const approvals = approvalsRaw[idx]
      if (
        core?.status !== 'success' ||
        hashes?.status !== 'success' ||
        approvals?.status !== 'success'
      )
        return acc

      const [, propertyOwner, occupant, , startDate, endDate, amountRegistered, status] =
        core.result as [
          bigint, `0x${string}`, `0x${string}`, `0x${string}`,
          bigint, bigint, boolean, number,
        ]
      const [
        propertyHash, titleReportHash, agreementContractHash,
        publicRegistryProofHash, possessionDeliveryHash, closureProofHash, asUSDOperationHash,
      ] = hashes.result as [
        `0x${string}`, `0x${string}`, `0x${string}`,
        `0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`,
      ]
      const [propertyOwnerApproved, occupantApproved] = approvals.result as [
        boolean, boolean, boolean, boolean, boolean, boolean,
      ]

      acc.push({
        id: String(id),
        propertyOwner,
        occupant,
        propertyHash: hex32(propertyHash),
        titleReportHash: hex32(titleReportHash),
        agreementContractHash: hex32(agreementContractHash),
        publicRegistryProofHash: hex32(publicRegistryProofHash),
        possessionDeliveryHash: hex32(possessionDeliveryHash),
        closureProofHash: hex32(closureProofHash),
        asUSDOperationHash: hex32(asUSDOperationHash),
        amountRegistered,
        confidentialAmountLabel: amountRegistered ? 'Registered' : '—',
        startDate: tsToDate(startDate),
        endDate: tsToDate(endDate),
        status: STATUS_MAP[status] ?? 'Created',
        approvals: { propertyOwnerApproved, occupantApproved },
      })
      return acc
    }, [])
  }, [coresRaw, hashesRaw, approvalsRaw, myIds])

  const isLoading =
    counterLoading ||
    coresLoading ||
    (myIds.length > 0 && (hashesLoading || approvalsLoading))

  return { agreements, isLoading }
}
