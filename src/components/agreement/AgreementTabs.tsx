import { useState } from 'react'
import type { Agreement } from '../../types/agreement'
import type { UserRole } from '../../hooks/useConnectedRole'
import { formatDate } from '../../utils/format'
import { shortAddress } from '../../utils/bytes'
import { DocumentsPanel } from './DocumentsPanel'
import { ConfidentialFinancePanel } from './ConfidentialFinancePanel'
import { ActivityPanel } from './ActivityPanel'

type TabId = 'overview' | 'documents' | 'finance' | 'activity'

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

function TabIcon({ path }: { path: string }) {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  )
}

const TABS: Tab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <TabIcon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <TabIcon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    id: 'finance',
    label: 'Confidential Finance',
    icon: <TabIcon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: <TabIcon path="M13 10V3L4 14h7v7l9-11h-7z" />,
  },
]

interface OverviewPanelProps {
  agreement: Agreement
  role: UserRole
}

function OverviewPanel({ agreement, role }: OverviewPanelProps) {
  const rows = [
    { label: 'Property Owner', value: shortAddress(agreement.propertyOwner) },
    { label: 'Occupant', value: shortAddress(agreement.occupant) },
    { label: 'Status', value: agreement.status },
    { label: 'Start Date', value: formatDate(agreement.startDate) },
    { label: 'End Date', value: formatDate(agreement.endDate) },
    { label: 'Your Role', value: role.replace('_', ' ') },
    {
      label: 'Confidential Amount',
      value: agreement.amountRegistered ? agreement.confidentialAmountLabel : 'Not yet registered',
    },
    {
      label: 'Owner Approved',
      value: agreement.approvals.propertyOwnerApproved ? 'Yes' : 'No',
    },
    {
      label: 'Occupant Approved',
      value: agreement.approvals.occupantApproved ? 'Yes' : 'No',
    },
  ]

  return (
    <div className="grid gap-4">
      <div className="rounded-xl border border-slate-200/70 bg-white/80 overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3">
          <h4 className="text-sm font-semibold text-slate-700">Agreement Details</h4>
        </div>
        <div className="divide-y divide-slate-100">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-500">{row.label}</span>
              <span className="text-sm font-medium text-slate-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Property Hash: </span>
          <code className="break-all text-sky-700">{agreement.propertyHash}</code>
        </p>
      </div>
    </div>
  )
}

interface AgreementTabsProps {
  agreement: Agreement
  role: UserRole
  initialTab?: TabId
}

export function AgreementTabs({ agreement, role, initialTab = 'overview' }: AgreementTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)

  return (
    <div>
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-slate-200 mb-6 gap-1 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewPanel agreement={agreement} role={role} />}
      {activeTab === 'documents' && <DocumentsPanel agreement={agreement} role={role} />}
      {activeTab === 'finance' && <ConfidentialFinancePanel agreement={agreement} role={role} />}
      {activeTab === 'activity' && <ActivityPanel agreement={agreement} />}
    </div>
  )
}

export type { TabId }
