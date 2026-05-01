import type { UserRole } from '../../hooks/useConnectedRole'

interface RoleBadgeProps {
  role: UserRole
}

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  PROPERTY_OWNER: {
    label: 'Property Owner',
    className:
      'inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700',
  },
  OCCUPANT: {
    label: 'Occupant',
    className:
      'inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700',
  },
  VIEWER: {
    label: 'Viewer',
    className:
      'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600',
  },
  DISCONNECTED: {
    label: 'Not Connected',
    className:
      'inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700',
  },
}

const ROLE_ICON: Record<UserRole, string> = {
  PROPERTY_OWNER: '🏠',
  OCCUPANT: '👤',
  VIEWER: '👁',
  DISCONNECTED: '🔌',
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role]
  return (
    <span className={config.className}>
      <span>{ROLE_ICON[role]}</span>
      {config.label}
    </span>
  )
}
