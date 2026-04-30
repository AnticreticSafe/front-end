import { isBytes32 } from './bytes'

export const validateAgreementId = (agreementId: string) => {
  const parsed = Number(agreementId)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 'Agreement ID must be greater than 0'
  }
  return ''
}

export const validateAmount = (amount: string) => {
  const parsed = Number(amount)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 'Amount must be a positive integer'
  }
  return ''
}

export const validateOperationHash = (value: string) => {
  if (!value) return ''
  if (!isBytes32(value)) return 'asUSD Operation Hash must be a valid bytes32'
  return ''
}
