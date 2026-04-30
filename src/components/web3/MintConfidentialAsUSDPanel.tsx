import { useMemo, useState } from 'react'
import { arbitrumSepoliaCustom } from '../../config/chains'
import {
  ANTICRETIC_SAFE_USD_ADDRESS,
  DEFAULT_OCCUPANT_ADDRESS,
  LAST_ASUSD_OPERATION_HASH_KEY,
  TOKEN_OWNER_ADDRESS,
} from '../../config/contracts'
import { useMintConfidentialAsUSD } from '../../hooks/useMintConfidentialAsUSD'
import { useNoxEncrypt } from '../../hooks/useNoxEncrypt'
import { useWallet } from '../../hooks/useWallet'
import { isAddressLike, shortAddress, shortHash, txHashToBytes32 } from '../../utils/bytes'
import { validateAmount } from '../../utils/validation'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { NetworkGuard } from './NetworkGuard'
import { WalletConnectButton } from './WalletConnectButton'

type MintPanelStatus =
  | 'Wallet disconnected'
  | 'Wrong network'
  | 'Connected as token owner'
  | 'Connected but not token owner'
  | 'Encrypting'
  | 'Encrypted'
  | 'Sending mint transaction'
  | 'Mint confirmed'
  | 'Error'

export function MintConfidentialAsUSDPanel() {
  const wallet = useWallet()
  const { isEncrypting, encryptUint256Amount } = useNoxEncrypt()
  const { mintConfidentialAsUSD, isPending, isConfirming, txHash, error } = useMintConfidentialAsUSD()

  const [recipient, setRecipient] = useState<string>(DEFAULT_OCCUPANT_ADDRESS)
  const [amount, setAmount] = useState('20000')
  const [encryptedAmountHandle, setEncryptedAmountHandle] = useState<`0x${string}` | ''>('')
  const [inputProof, setInputProof] = useState<`0x${string}` | ''>('')
  const [panelStatus, setPanelStatus] = useState<MintPanelStatus>('Wallet disconnected')
  const [localError, setLocalError] = useState('')

  const isTokenOwner = useMemo(() => {
    if (!wallet.address) return false
    return wallet.address.toLowerCase() === TOKEN_OWNER_ADDRESS.toLowerCase()
  }, [wallet.address])

  const asUSDOperationHash = txHash ? txHashToBytes32(txHash) : ''
  const recipientError = recipient && !isAddressLike(recipient) ? 'Recipient must be a valid address' : ''
  const amountError = validateAmount(amount)

  const onEncrypt = async () => {
    setLocalError('')
    if (!wallet.isConnected || !wallet.isCorrectNetwork || !!recipientError || !!amountError) {
      setLocalError('Please verify wallet, network and form inputs before encryption.')
      return
    }
    try {
      setPanelStatus('Encrypting')
      const encrypted = await encryptUint256Amount({
        amount: BigInt(amount),
        targetContract: ANTICRETIC_SAFE_USD_ADDRESS,
      })
      setEncryptedAmountHandle(encrypted.encryptedAmountHandle)
      setInputProof(encrypted.inputProof)
      setPanelStatus('Encrypted')
    } catch (encryptionError) {
      console.error(encryptionError)
      setPanelStatus('Error')
      setLocalError(
        'Nox encryption for asUSD failed. Possible reasons: wrong network, wallet rejected signature, Nox gateway unavailable, invalid target contract.',
      )
    }
  }

  const onMint = async () => {
    setLocalError('')
    if (!wallet.isConnected || !wallet.isCorrectNetwork) {
      setLocalError('Please connect wallet and switch to Arbitrum Sepolia.')
      return
    }
    if (!isTokenOwner) {
      setLocalError(`Only the token owner can call mint(). Switch to ${shortAddress(TOKEN_OWNER_ADDRESS)}.`)
      return
    }
    if (recipientError || amountError || !encryptedAmountHandle || !inputProof) {
      setLocalError('Missing valid recipient, amount, encryptedAmountHandle or inputProof.')
      return
    }
    try {
      setPanelStatus('Sending mint transaction')
      const result = await mintConfidentialAsUSD({
        recipient: recipient as `0x${string}`,
        encryptedAmountHandle,
        inputProof,
      })
      const opHash = txHashToBytes32(result.txHash)
      localStorage.setItem(LAST_ASUSD_OPERATION_HASH_KEY, opHash)
      setPanelStatus('Mint confirmed')
    } catch (mintError) {
      console.error(mintError)
      setPanelStatus('Error')
      setLocalError(
        'Mint transaction failed. Possible reasons: connected wallet is not token owner, wrong chain, invalid encryptedAmount/inputProof, insufficient gas.',
      )
    }
  }

  const copyToClipboard = async (value: string) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
  }

  const statusLabel: MintPanelStatus = !wallet.isConnected
    ? 'Wallet disconnected'
    : !wallet.isCorrectNetwork
      ? 'Wrong network'
      : isTokenOwner
        ? 'Connected as token owner'
        : 'Connected but not token owner'

  return (
    <Card>
      <div className="agreement-card-head">
        <h3>Step 1: Mint confidential asUSD to the occupant</h3>
        <span className="status-badge">{isPending || isConfirming ? panelStatus : statusLabel}</span>
      </div>

      <WalletConnectButton
        isConnected={wallet.isConnected}
        address={wallet.address}
        chainName={wallet.chain?.name}
        onConnect={wallet.connectWallet}
        onDisconnect={wallet.disconnectWallet}
        isConnecting={wallet.isConnecting}
      />
      <NetworkGuard chainId={wallet.chainId} isConnected={wallet.isConnected} />

      {!isTokenOwner && wallet.isConnected ? (
        <p className="warn-text">
          Only the token owner can call mint(). Switch to {shortAddress(TOKEN_OWNER_ADDRESS)}.
        </p>
      ) : null}

      <div className="web3-form-grid">
        <label>
          Recipient address
          <input value={recipient} onChange={(event) => setRecipient(event.target.value.trim())} />
        </label>
        <label>
          Confidential amount
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
      </div>

      {recipientError ? <p className="error-text">{recipientError}</p> : null}
      {amountError ? <p className="error-text">{amountError}</p> : null}

      <div className="actions-grid">
        <Button variant="secondary" onClick={onEncrypt}>
          {isEncrypting ? 'Encrypting...' : 'Encrypt Amount for asUSD'}
        </Button>
        <Button onClick={onMint}>
          {isPending ? 'Sending mint transaction...' : isConfirming ? 'Waiting confirmation...' : 'Mint Confidential asUSD'}
        </Button>
        <Button variant="ghost" onClick={() => copyToClipboard(txHash)}>
          Copy Mint Tx Hash
        </Button>
        <Button variant="ghost" onClick={() => copyToClipboard(asUSDOperationHash)}>
          Copy asUSD Operation Hash
        </Button>
      </div>

      <div className="web3-results">
        <p>
          <strong>Token address:</strong> <code>{ANTICRETIC_SAFE_USD_ADDRESS}</code>
        </p>
        <p>
          <strong>Owner expected:</strong> <code>{TOKEN_OWNER_ADDRESS}</code>
        </p>
        <p>
          <strong>Connected wallet:</strong> <code>{wallet.address ?? 'Not connected'}</code>
        </p>
        <p>
          <strong>Target chain:</strong> {arbitrumSepoliaCustom.name} ({arbitrumSepoliaCustom.id})
        </p>
        <p>
          <strong>encryptedAmountHandle:</strong>{' '}
          <code>{encryptedAmountHandle ? shortHash(encryptedAmountHandle) : 'Not generated yet'}</code>
        </p>
        <p>
          <strong>inputProof:</strong> <code>{inputProof ? shortHash(inputProof) : 'Not generated yet'}</code>
        </p>
        <p>
          <strong>mint txHash:</strong> <code>{txHash || 'Not submitted yet'}</code>
        </p>
        <p>
          <strong>asUSDOperationHash:</strong> <code>{asUSDOperationHash || 'Pending mint tx hash'}</code>
        </p>
        {txHash ? (
          <a
            href={`https://sepolia.arbiscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="tx-link"
          >
            View mint transaction on Arbiscan
          </a>
        ) : null}
        {localError ? <p className="error-text">{localError}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </div>
    </Card>
  )
}
