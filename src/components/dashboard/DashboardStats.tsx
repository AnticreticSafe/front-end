interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  accentClass?: string
}

function StatCard({ label, value, icon, accentClass = 'bg-indigo-50 text-indigo-600' }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur-sm">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${accentClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>
    </div>
  )
}

function IconClock() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconHome() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

interface DashboardStatsProps {
  role: 'PROPERTY_OWNER' | 'OCCUPANT' | 'VIEWER'
  awaitingAction: number
  active: number
  closed: number
  total: number
}

export function DashboardStats({ role, awaitingAction, active, closed, total }: DashboardStatsProps) {
  if (role === 'PROPERTY_OWNER') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Awaiting Your Action"
          value={awaitingAction}
          icon={<IconClock />}
          accentClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Active Agreements"
          value={active}
          icon={<IconHome />}
          accentClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Closed Agreements"
          value={closed}
          icon={<IconCheck />}
          accentClass="bg-slate-100 text-slate-500"
        />
        <StatCard
          label="Total Agreements"
          value={total}
          icon={<IconLock />}
          accentClass="bg-indigo-50 text-indigo-600"
        />
      </div>
    )
  }

  if (role === 'OCCUPANT') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Awaiting Your Action"
          value={awaitingAction}
          icon={<IconClock />}
          accentClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Confidential Amounts"
          value={active}
          icon={<IconLock />}
          accentClass="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          label="Active Occupancy"
          value={active}
          icon={<IconHome />}
          accentClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Completed"
          value={closed}
          icon={<IconCheck />}
          accentClass="bg-slate-100 text-slate-500"
        />
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Total Agreements"
        value={total}
        icon={<IconHome />}
        accentClass="bg-indigo-50 text-indigo-600"
      />
      <StatCard
        label="Active"
        value={active}
        icon={<IconCheck />}
        accentClass="bg-emerald-50 text-emerald-600"
      />
      <StatCard
        label="Closed"
        value={closed}
        icon={<IconLock />}
        accentClass="bg-slate-100 text-slate-500"
      />
    </div>
  )
}
