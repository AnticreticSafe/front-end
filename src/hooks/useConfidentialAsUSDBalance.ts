import { createViemHandleClient } from '@iexec-nox/handle'
import { useState } from 'react'
import { useReadContract, useWalletClient } from 'wagmi'
import { anticreticSafeUsdAbi } from '../abi/anticreticSafeUsdAbi'
import { ANTICRETIC_SAFE_USD_ADDRESS } from '../config/contracts'

export function useConfidentialAsUSDBalance(account: string) {
  const { data: walletClient } = useWalletClient()
  const [decryptedBalance, setDecryptedBalance] = useState('')
  const [decryptError, setDecryptError] = useState('')
  const [isDecrypting, setIsDecrypting] = useState(false)

  const {
    data: encryptedBalanceHandle,
    refetch,
    isFetching: isReading,
    error: readError,
  } = useReadContract({
    address: ANTICRETIC_SAFE_USD_ADDRESS,
    abi: anticreticSafeUsdAbi,
    functionName: 'confidentialBalanceOf',
    args: [account as `0x${string}`],
    query: {
      enabled: false,
    },
  })

  const readEncryptedBalance = async () => {
    setDecryptError('')
    setDecryptedBalance('')
    const result = await refetch()
    return result.data as `0x${string}` | undefined
  }

  const decryptBalance = async () => {
    if (!walletClient) {
      throw new Error('Wallet is not connected')
    }
    if (!encryptedBalanceHandle) {
      throw new Error('Encrypted balance handle is missing')
    }

    setIsDecrypting(true)
    setDecryptError('')
    try {
      const handleClient = await createViemHandleClient(walletClient)
      const { value } = await handleClient.decrypt(encryptedBalanceHandle)
      setDecryptedBalance(`${value.toString()} asUSD`)
      return value
    } catch (error) {
      console.error('Balance decryption failed:', error)
      setDecryptError('Only authorized accounts can decrypt this balance')
      throw error
    } finally {
      setIsDecrypting(false)
    }
  }

  return {
    encryptedBalanceHandle,
    decryptedBalance,
    decryptError,
    readError,
    isReading,
    isDecrypting,
    readEncryptedBalance,
    decryptBalance,
  }
}
