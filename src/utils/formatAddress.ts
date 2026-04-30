export const formatAddress = (address: string, head = 6, tail = 4) =>
  `${address.slice(0, head)}...${address.slice(-tail)}`
