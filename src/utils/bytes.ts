import { isAddress, isHex, keccak256, toBytes } from 'viem'

export const isBytes32 = (value: string): value is `0x${string}` =>
  isHex(value, { strict: true }) && value.length === 66

export const normalizeBytes32 = (value: string): `0x${string}` => {
  if (!value) return '0x0000000000000000000000000000000000000000000000000000000000000000'
  const sanitized = value.startsWith('0x') ? value : `0x${value}`
  if (!isHex(sanitized, { strict: true })) {
    throw new Error('Value is not valid hex')
  }
  if (sanitized.length > 66) {
    throw new Error('Value exceeds bytes32 length')
  }
  return (`0x${sanitized.slice(2).padStart(64, '0')}`) as `0x${string}`
}

export const txHashToBytes32 = (txHash: string): `0x${string}` => {
  if (!isBytes32(txHash)) {
    throw new Error('Invalid transaction hash. Expected bytes32 hash.')
  }
  return txHash
}

export const stringToMockBytes32 = (value: string): `0x${string}` => keccak256(toBytes(value))

export const shortHash = (hash: string, head = 10, tail = 8) =>
  hash ? `${hash.slice(0, head)}...${hash.slice(-tail)}` : ''

export const shortAddress = (address: string, head = 6, tail = 4) =>
  `${address.slice(0, head)}...${address.slice(-tail)}`

export const isAddressLike = (value: string) => isAddress(value)
