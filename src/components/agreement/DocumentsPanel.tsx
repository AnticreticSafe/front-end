import type { Agreement } from '../../types/agreement'
import type { UserRole } from '../../hooks/useConnectedRole'
import { shortenHash } from '../../utils/format'

interface DocumentItem {
  key: keyof Agreement
  label: string
  sublabel: string
  ownerCanUpload: boolean
  occupantCanUpload: boolean
  requiredAtStatus: string
}

const DOCUMENTS: DocumentItem[] = [
  {
    key: 'titleReportHash',
    label: 'Title Report',
    sublabel: 'Informe Alodial',
    ownerCanUpload: true,
    occupantCanUpload: false,
    requiredAtStatus: 'Created',
  },
  {
    key: 'agreementContractHash',
    label: 'Agreement Contract',
    sublabel: 'Minuta / Contrato',
    ownerCanUpload: true,
    occupantCanUpload: false,
    requiredAtStatus: 'ApprovedByParties',
  },
  {
    key: 'publicRegistryProofHash',
    label: 'Public Registry Proof',
    sublabel: 'Derechos Reales',
    ownerCanUpload: true,
    occupantCanUpload: false,
    requiredAtStatus: 'AgreementContractUploaded',
  },
  {
    key: 'possessionDeliveryHash',
    label: 'Possession Delivery Act',
    sublabel: 'Acta de entrega de posesión',
    ownerCanUpload: true,
    occupantCanUpload: true,
    requiredAtStatus: 'ConfidentialAmountRegistered',
  },
  {
    key: 'closureProofHash',
    label: 'Closure Proof',
    sublabel: 'Acta de cierre',
    ownerCanUpload: true,
    occupantCanUpload: true,
    requiredAtStatus: 'PropertyReturned',
  },
]

interface DocumentsPanelProps {
  agreement: Agreement
  role: UserRole
}

export function DocumentsPanel({ agreement, role }: DocumentsPanelProps) {
  return (
    <div className="grid gap-3">
      {DOCUMENTS.map((doc) => {
        const hash = agreement[doc.key] as string
        const isUploaded = !!hash
        const canUpload =
          (role === 'PROPERTY_OWNER' && doc.ownerCanUpload) ||
          (role === 'OCCUPANT' && doc.occupantCanUpload)

        let statusLabel = ''
        let statusClass = ''
        let statusIcon = null

        if (isUploaded) {
          statusLabel = 'Uploaded'
          statusClass = 'bg-emerald-50 border-emerald-200 text-emerald-700'
          statusIcon = (
            <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        } else if (canUpload) {
          statusLabel = 'Action Required'
          statusClass = 'bg-indigo-50 border-indigo-200 text-indigo-700'
          statusIcon = (
            <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )
        } else {
          statusLabel = 'Pending'
          statusClass = 'bg-slate-50 border-slate-200 text-slate-500'
          statusIcon = (
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }

        return (
          <div
            key={doc.key}
            className="flex items-start gap-4 rounded-xl border border-slate-200/70 bg-white/70 p-4 backdrop-blur-sm"
          >
            {/* Document icon */}
            <div className="flex-shrink-0 rounded-lg bg-slate-100 p-2">
              <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{doc.label}</p>
                  <p className="text-xs text-slate-500">{doc.sublabel}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}
                >
                  {statusIcon}
                  {statusLabel}
                </span>
              </div>

              {isUploaded ? (
                <div className="mt-2">
                  <code className="break-all text-xs text-sky-700 bg-sky-50 px-2 py-1 rounded">
                    {shortenHash(hash)}
                  </code>
                </div>
              ) : canUpload ? (
                <div className="mt-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Hash
                    <span className="rounded bg-amber-100 px-1 text-[10px] text-amber-700 font-bold ml-1">
                      Demo
                    </span>
                  </button>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-400">Waiting for property owner to upload.</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
