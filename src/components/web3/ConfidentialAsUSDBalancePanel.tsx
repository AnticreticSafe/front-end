import { useMemo, useState } from 'react'
import { ANTICRETIC_SAFE_USD_ADDRESS, DEFAULT_OCCUPANT_ADDRESS } from '../../config/contracts'
import { useConfidentialAsUSDBalance } from '../../hooks/useConfidentialAsUSDBalance'
import { useWallet } from '../../hooks/useWallet'
import { isAddressLike, shortHash } from '../../utils/bytes'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { NetworkGuard } from './NetworkGuard'
import { WalletConnectButton } from './WalletConnectButton'

export function ConfidentialAsUSDBalancePanel() {
  const wallet = useWallet()
  const [account, setAccount] = useState<string>(DEFAULT_OCCUPANT_ADDRESS)
  const [panelError, setPanelError] = useState('')
  const [panelStatus, setPanelStatus] = useState('Ready')
  const accountError = account && !isAddressLike(account) ? 'Account must be a valid address' : ''

  const {
    encryptedBalanceHandle,
    decryptedBalance,
    decryptError,
    readError,
    isReading,
    isDecrypting,
    readEncryptedBalance,
    decryptBalance,
  } = useConfidentialAsUSDBalance(account)

  const mayNotBeAuthorized = useMemo(() => {
    if (!wallet.address || !account) return false
    return wallet.address.toLowerCase() !== account.toLowerCase()
  }, [wallet.address, account])

  const onRead = async () => {
    setPanelError('')
    if (!wallet.isConnected) {
      setPanelError('Please connect wallet first.')
      return
    }
    if (!wallet.isCorrectNetwork) {
      setPanelError('Please switch to Arbitrum Sepolia.')
      return
    }
    if (accountError) {
      setPanelError(accountError)
      return
    }
    try {
      setPanelStatus('Reading encrypted balance')
      await readEncryptedBalance()
      setPanelStatus('Encrypted balance loaded')
    } catch {
      setPanelStatus('Error')
      setPanelError('Failed to read encrypted balance handle.')
    }
  }

  const onDecrypt = async () => {
    setPanelError('')
    if (!wallet.isConnected) {
      setPanelError('Please connect wallet first.')
      return
    }
    if (!wallet.isCorrectNetwork) {
      setPanelError('Please switch to Arbitrum Sepolia.')
      return
    }
    if (!encryptedBalanceHandle) {
      setPanelError('Read encrypted balance first.')
      return
    }
    try {
      setPanelStatus('Decrypting balance')
      await decryptBalance()
      setPanelStatus('Balance decrypted')
    } catch {
      setPanelStatus('Error')
    }
  }

  return (
    <Card>
      <div className="agreement-card-head">
        <h3>ConfidentialAsUSDBalancePanel</h3>
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

      <div className="web3-form-grid">
        <label className="web3-full-width">
          Account address
          <input value={account} onChange={(event) => setAccount(event.target.value.trim())} />
        </label>
      </div>

      {mayNotBeAuthorized ? (
        <p className="warn-text">
          This wallet may not be authorized to decrypt the confidential balance.
        </p>
      ) : null}

      <div className="actions-grid">
        <Button variant="secondary" onClick={onRead}>
          {isReading ? 'Reading encrypted balance...' : 'Read encrypted balance'}
        </Button>
        <Button onClick={onDecrypt}>
          {isDecrypting ? 'Decrypting balance...' : 'Decrypt balance'}
        </Button>
      </div>

      <div className="web3-results">
        <p>
          <strong>Token address:</strong> <code>{ANTICRETIC_SAFE_USD_ADDRESS}</code>
        </p>
        <p>
          <strong>encryptedBalanceHandle:</strong>{' '}
          <code>
            {encryptedBalanceHandle ? shortHash(encryptedBalanceHandle) : 'Not loaded yet'}
          </code>
        </p>
        <p>
          <strong>decrypted balance:</strong> <code>{decryptedBalance || 'Not decrypted yet'}</code>
        </p>
        {accountError ? <p className="error-text">{accountError}</p> : null}
        {panelError ? <p className="error-text">{panelError}</p> : null}
        {readError ? <p className="error-text">Failed to read confidential balance.</p> : null}
        {decryptError ? <p className="warn-text">{decryptError}</p> : null}
      </div>
    </Card>
  )
}
