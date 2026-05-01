import { useMemo, useState } from 'react'
import './App.css'
import { Footer } from './components/layout/Footer'
import { Navbar, type AppView } from './components/layout/Navbar'
import { useMyAgreements } from './hooks/useMyAgreements'
import { AgreementDetailPage } from './pages/AgreementDetailPage'
import { CreateAgreementPage } from './pages/CreateAgreementPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'

function App() {
  const [view, setView] = useState<AppView>('landing')
  const [selectedAgreementId, setSelectedAgreementId] = useState('')

  const { agreements, isLoading, refetch } = useMyAgreements()

  const selectedAgreement = useMemo(
    () => agreements.find((a) => a.id === selectedAgreementId),
    [selectedAgreementId, agreements],
  )

  return (
    <div className="app-shell">
      <Navbar activeView={view} onNavigate={setView} />

      {view === 'landing' ? <LandingPage onLaunchDemo={() => setView('dashboard')} /> : null}

      {view === 'dashboard' ? (
        <DashboardPage
          agreements={agreements}
          isLoading={isLoading}
          onViewDetails={(id) => {
            setSelectedAgreementId(id)
            setView('detail')
          }}
        />
      ) : null}

      {view === 'create' ? <CreateAgreementPage onCreate={() => setView('dashboard')} /> : null}

      {view === 'detail' && selectedAgreement ? (
        <AgreementDetailPage agreement={selectedAgreement} onBack={() => setView('dashboard')} onRefresh={refetch} />
      ) : null}

      {view === 'detail' && !selectedAgreement && !isLoading ? (
        <div style={{ minHeight: '100vh', background: '#221a4c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Agreement not found.</p>
            <button type="button" onClick={() => setView('dashboard')} style={{ background: '#6b60f2', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer' }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  )
}

export default App
