import { createViemHandleClient } from '@iexec-nox/handle'
import { useState } from 'react'
import { useWalletClient } from 'wagmi'

interface EncryptResult {
  encryptedAmountHandle: `0x${string}`
  inputProof: `0x${string}`
}

export function useNoxEncrypt() {
  const { data: walletClient } = useWalletClient()
  const [isEncrypting, setIsEncrypting] = useState(false)

  const encryptUint256Amount = async ({
    amount,
    targetContract,
  }: {
    amount: bigint
    targetContract: `0x${string}`
  }): Promise<EncryptResult> => {
    if (!walletClient) {
      throw new Error('Wallet client is not available')
    }
    setIsEncrypting(true)
    try {
      const handleClient = await createViemHandleClient(walletClient)
      const { handle, handleProof } = await handleClient.encryptInput(
        amount,
        'uint256',
        targetContract,
      )
      return {
        encryptedAmountHandle: handle as `0x${string}`,
        inputProof: handleProof as `0x${string}`,
      }
    } catch (error) {
      console.error('Nox encryption failed:', error)
      throw new Error('Nox encryption failed')
    } finally {
      setIsEncrypting(false)
    }
  }

  return {
    isEncrypting,
    encryptUint256Amount,
  }
}
