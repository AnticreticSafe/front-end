import type { Agreement } from '../../types/agreement'
import { shortenHash } from '../../utils/format'
import { Card } from '../ui/Card'

interface DocumentHashListProps {
  agreement: Agreement
}

export function DocumentHashList({ agreement }: DocumentHashListProps) {
  const docs = [
    { label: 'Title Report / Alodial', value: agreement.titleReportHash },
    { label: 'Agreement Contract / Minuta', value: agreement.agreementContractHash },
    { label: 'Public Registry Proof / Derechos Reales', value: agreement.publicRegistryProofHash },
    { label: 'Possession Delivery Act / Acta de Entrega', value: agreement.possessionDeliveryHash },
    { label: 'Closure Proof / Cancelacion', value: agreement.closureProofHash },
  ]

  return (
    <Card>
      <h3>Document Hashes</h3>
      <ul className="hash-list">
        {docs.map((doc) => (
          <li key={doc.label}>
            <span>{doc.label}</span>
            <code>{shortenHash(doc.value)}</code>
          </li>
        ))}
      </ul>
    </Card>
  )
}
