import { useMemo, useState } from 'react'
import { arbitrumSepoliaCustom } from '../../config/chains'
import { ANTICRETIC_SAFE_ADDRESS, LAST_ASUSD_OPERATION_HASH_KEY } from '../../config/contracts'
import { useNoxEncrypt } from '../../hooks/useNoxEncrypt'
import { useRegisterConfidentialAmount } from '../../hooks/useRegisterConfidentialAmount'
import { useWallet } from '../../hooks/useWallet'
import { isBytes32, normalizeBytes32, stringToMockBytes32 } from '../../utils/bytes'
import { formatAddress } from '../../utils/formatAddress'
import {
  validateAgreementId,
  validateAmount,
  validateOperationHash,
} from '../../utils/validation'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { NetworkGuard } from './NetworkGuard'
import { WalletConnectButton } from './WalletConnectButton'

const EXPECTED_OCCUPANT_ID_1 = '0xafff83452c867c80371898e62fa9a78c5a2cdde7'

type PanelStatus =
  | 'Wallet disconnected'
  | 'Wrong network'
  | 'Ready'
  | 'Encrypting amount'
  | 'Amount encrypted'
  | 'Sending transaction'
  | 'Transaction confirmed'
  | 'Error'

export function RegisterConfidentialAmountPanel() {
  const [agreementId, setAgreementId] = useState('1')
  const [amount, setAmount] = useState('20000')
  const [asUSDOperationHash, setAsUSDOperationHash] = useState('')
  const [encryptedAmountHandle, setEncryptedAmountHandle] = useState<`0x${string}` | ''>('')
  const [inputProof, setInputProof] = useState<`0x${string}` | ''>('')
  const [txHash, setTxHash] = useState<`0x${string}` | ''>('')
  const [panelStatus, setPanelStatus] = useState<PanelStatus>('Wallet disconnected')
  const [errorMessage, setErrorMessage] = useState('')

  const wallet = useWallet()
  const { isEncrypting, encryptUint256Amount } = useNoxEncrypt()
  const { isSubmitting, register } = useRegisterConfidentialAmount()

  const isId1OccupantMismatch = useMemo(() => {
    if (agreementId !== '1' || !wallet.address) return false
    return wallet.address.toLowerCase() !== EXPECTED_OCCUPANT_ID_1
  }, [agreementId, wallet.address])

  const agreementIdError = validateAgreementId(agreementId)
  const amountError = validateAmount(amount)
  const operationHashError = validateOperationHash(asUSDOperationHash)
  const canEncrypt =
    !agreementIdError && !amountError && wallet.isConnected && wallet.isCorrectNetwork && !isEncrypting
  const canSubmit =
    canEncrypt &&
    !isSubmitting &&
    !!encryptedAmountHandle &&
    !!inputProof &&
    !!asUSDOperationHash &&
    isBytes32(asUSDOperationHash)

  const setReadyState = () => {
    if (!wallet.isConnected) {
      setPanelStatus('Wallet disconnected')
      return
    }
    if (!wallet.isCorrectNetwork) {
      setPanelStatus('Wrong network')
      return
    }
    setPanelStatus('Ready')
  }

  const onGenerateHash = () => {
    const generated = stringToMockBytes32(`${agreementId}-${amount}-${Date.now()}`)
    setAsUSDOperationHash(generated)
    setErrorMessage('')
    setReadyState()
  }

  const onEncrypt = async () => {
    setErrorMessage('')
    if (!canEncrypt) {
      setErrorMessage('Please fix the form inputs and network/wallet state first.')
      return
    }
    try {
      setPanelStatus('Encrypting amount')
      const encrypted = await encryptUint256Amount({
        amount: BigInt(amount),
        targetContract: ANTICRETIC_SAFE_ADDRESS,
      })
      setEncryptedAmountHandle(encrypted.encryptedAmountHandle)
      setInputProof(encrypted.inputProof)
      setPanelStatus('Amount encrypted')
    } catch {
      setPanelStatus('Error')
      setErrorMessage('Nox encryption failed')
    }
  }

  const onLoadLastAsUSDOperationHash = () => {
    const lastHash = localStorage.getItem(LAST_ASUSD_OPERATION_HASH_KEY)
    if (!lastHash) {
      setErrorMessage('No saved asUSD operation hash found from mint yet.')
      return
    }
    setAsUSDOperationHash(lastHash)
    setErrorMessage('')
    setReadyState()
  }

  const onRegister = async () => {
    setErrorMessage('')
    if (!canSubmit) {
      setErrorMessage('Missing valid encrypted input, proof or bytes32 operation hash.')
      return
    }
    try {
      setPanelStatus('Sending transaction')
      const normalizedHash = normalizeBytes32(asUSDOperationHash)
      const { txHash: hash } = await register({
        agreementId,
        encryptedAmountHandle: normalizeBytes32(encryptedAmountHandle),
        inputProof,
        asUSDOperationHash: normalizedHash,
      })
      setTxHash(hash)
      setPanelStatus('Transaction confirmed')
    } catch {
      setPanelStatus('Error')
      setErrorMessage(
        'Transaction failed. Possible reasons: wrong network, connected wallet is not the occupant, agreement status is not PublicRegistryProofUploaded, invalid inputProof, invalid bytes32 operation hash.',
      )
    }
  }

  return (
    <Card>
      <div className="agreement-card-head">
        <h3>Register Confidential Amount (Live)</h3>
        <span className="status-badge">{panelStatus}</span>
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

      <div className="form-card">
        <div className="web3-form-grid">
          <label>
            Agreement ID
            <input
              type="number"
              min={1}
              value={agreementId}
              onChange={(event) => setAgreementId(event.target.value)}
            />
          </label>

          <label>
            Confidential Amount
            <input
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>

          <label className="web3-full-width">
            asUSD Operation Hash (bytes32)
            <input
              type="text"
              value={asUSDOperationHash}
              onChange={(event) => setAsUSDOperationHash(event.target.value.trim())}
              placeholder="0x..."
            />
          </label>
        </div>

        {agreementIdError ? <p className="error-text">{agreementIdError}</p> : null}
        {amountError ? <p className="error-text">{amountError}</p> : null}
        {operationHashError ? <p className="error-text">{operationHashError}</p> : null}

        {isId1OccupantMismatch ? (
          <p className="warn-text">
            Only the occupant can call registerConfidentialAmount for this agreement. Expected
            occupant for agreement 1: {formatAddress(EXPECTED_OCCUPANT_ID_1)}.
          </p>
        ) : null}

        <div className="actions-grid">
          <Button variant="secondary" onClick={onGenerateHash}>
            Generate Mock Operation Hash
          </Button>
          <Button variant="secondary" onClick={onLoadLastAsUSDOperationHash}>
            Load last asUSD operation hash
          </Button>
          <Button variant="secondary" onClick={onEncrypt}>
            {isEncrypting ? 'Encrypting amount...' : 'Encrypt Amount with Nox'}
          </Button>
          <Button onClick={onRegister}>
            {isSubmitting ? 'Sending transaction...' : 'Register Confidential Amount'}
          </Button>
        </div>
      </div>

      <div className="web3-results">
        <p>
          <strong>Target chain:</strong> {arbitrumSepoliaCustom.name} ({arbitrumSepoliaCustom.id})
        </p>
        <p>
          <strong>encryptedAmountHandle:</strong>{' '}
          <code>{encryptedAmountHandle || 'Not generated yet'}</code>
        </p>
        <p>
          <strong>inputProof:</strong>{' '}
          <code>{inputProof ? `${inputProof.slice(0, 18)}...${inputProof.slice(-10)}` : 'Not generated yet'}</code>
        </p>
        <p>
          <strong>txHash:</strong> <code>{txHash || 'Not submitted yet'}</code>
        </p>
        {txHash ? (
          <a
            href={`https://sepolia.arbiscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="tx-link"
          >
            View transaction on Arbiscan
          </a>
        ) : null}
        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
      </div>
    </Card>
  )
}
