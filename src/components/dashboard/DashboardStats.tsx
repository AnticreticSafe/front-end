import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  accent?: 'violet' | 'lime' | 'amber' | 'muted'
}

function StatCard({ label, value, icon, accent = 'violet' }: StatCardProps) {
  const accentStyles: Record<string, { bg: string; color: string; valueColor: string }> = {
    violet: { bg: 'rgba(107,96,242,0.18)', color: '#6b60f2',              valueColor: '#ffffff' },
    lime:   { bg: 'rgba(216,250,177,0.15)', color: '#d8fab1',             valueColor: '#d8fab1' },
    amber:  { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24',             valueColor: '#fbbf24' },
    muted:  { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', valueColor: 'rgba(255,255,255,0.7)' },
  }
  const s = accentStyles[accent]
  return (
    <div style={{
      borderRadius: '16px', padding: '20px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(107,96,242,0.18)',
      display: 'flex', alignItems: 'center', gap: '16px',
    }}>
      <div style={{
        width: '44px', height: '44px', flexShrink: 0, borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: s.bg, color: s.color,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '1.6rem', fontWeight: 700, color: s.valueColor, lineHeight: 1.1, fontFamily: 'Brockmann, Syne, sans-serif' }}>
          {value}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{label}</p>
      </div>
    </div>
  )
}

function IconClock() {
  return <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
function IconCheck() {
  return <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
function IconHome() {
  return <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
}
function IconLock() {
  return <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
}

interface DashboardStatsProps {
  role: 'PROPERTY_OWNER' | 'OCCUPANT' | 'VIEWER'
  awaitingAction: number
  active: number
  closed: number
  total: number
}

export function DashboardStats({ role, awaitingAction, active, closed, total }: DashboardStatsProps) {
  const grid: React.CSSProperties = { display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }
  if (role === 'PROPERTY_OWNER') return (
    <div style={grid}>
      <StatCard label="Awaiting Your Action" value={awaitingAction} icon={<IconClock />} accent="amber" />
      <StatCard label="Active Agreements"    value={active}         icon={<IconHome />}  accent="lime" />
      <StatCard label="Closed Agreements"    value={closed}         icon={<IconCheck />} accent="muted" />
      <StatCard label="Total Agreements"     value={total}          icon={<IconLock />}  accent="violet" />
    </div>
  )
  if (role === 'OCCUPANT') return (
    <div style={grid}>
      <StatCard label="Awaiting Your Action" value={awaitingAction} icon={<IconClock />} accent="amber" />
      <StatCard label="Confidential Amounts" value={active}         icon={<IconLock />}  accent="lime" />
      <StatCard label="Active Occupancy"     value={active}         icon={<IconHome />}  accent="violet" />
      <StatCard label="Completed"            value={closed}         icon={<IconCheck />} accent="muted" />
    </div>
  )
  return (
    <div style={grid}>
      <StatCard label="Total Agreements" value={total}  icon={<IconHome />}  accent="violet" />
      <StatCard label="Active"           value={active} icon={<IconCheck />} accent="lime" />
      <StatCard label="Closed"           value={closed} icon={<IconLock />}  accent="muted" />
    </div>
  )
}