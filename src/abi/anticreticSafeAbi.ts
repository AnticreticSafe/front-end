export const anticreticSafeAbi = [
  {
    type: 'function',
    name: 'registerConfidentialAmount',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'agreementId', type: 'uint256' },
      { name: 'encryptedAmountHandle', type: 'bytes32' },
      { name: 'inputProof', type: 'bytes' },
      { name: 'asUSDOperationHash', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getAgreementCore',
    stateMutability: 'view',
    inputs: [{ name: 'agreementId', type: 'uint256' }],
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'propertyOwner', type: 'address' },
      { name: 'occupant', type: 'address' },
      { name: 'propertyHash', type: 'bytes32' },
      { name: 'startDate', type: 'uint256' },
      { name: 'endDate', type: 'uint256' },
      { name: 'status', type: 'uint8' },
    ],
  },
  {
    type: 'function',
    name: 'getAgreementHashes',
    stateMutability: 'view',
    inputs: [{ name: 'agreementId', type: 'uint256' }],
    outputs: [
      { name: 'titleReportHash', type: 'bytes32' },
      { name: 'agreementContractHash', type: 'bytes32' },
      { name: 'publicRegistryProofHash', type: 'bytes32' },
      { name: 'possessionDeliveryHash', type: 'bytes32' },
      { name: 'closureProofHash', type: 'bytes32' },
      { name: 'asUSDOperationHash', type: 'bytes32' },
    ],
  },
  {
    type: 'function',
    name: 'getAgreementApprovals',
    stateMutability: 'view',
    inputs: [{ name: 'agreementId', type: 'uint256' }],
    outputs: [
      { name: 'propertyOwnerApproved', type: 'bool' },
      { name: 'occupantApproved', type: 'bool' },
    ],
  },
] as const
