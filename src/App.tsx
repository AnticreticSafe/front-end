import { useMemo, useState } from 'react'
import './App.css'
import { Footer } from './components/layout/Footer'
import { Navbar, type AppView } from './components/layout/Navbar'
import { mockAgreements } from './data/mockAgreements'
import { AgreementDetailPage } from './pages/AgreementDetailPage'
import { CreateAgreementPage } from './pages/CreateAgreementPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'

function App() {
  const [view, setView] = useState<AppView>('landing')
  const [selectedAgreementId, setSelectedAgreementId] = useState(mockAgreements[0]?.id ?? '')

  const selectedAgreement = useMemo(
    () =>
      mockAgreements.find((agreement) => agreement.id === selectedAgreementId) ?? mockAgreements[0],
    [selectedAgreementId],
  )

  // TODO: integrate wallet connection flow with wagmi/viem.
  // TODO: load AnticreticSafe ABI and AnticreticSafeUSD ABI for real calls.
  // TODO: integrate @iexec-nox/handle for encryptedAmountHandle and inputProof.

  return (
    <div className="app-shell">
      <Navbar activeView={view} onNavigate={setView} />

      {view === 'landing' ? <LandingPage onLaunchDemo={() => setView('dashboard')} /> : null}

      {view === 'dashboard' ? (
        <DashboardPage
          agreements={mockAgreements}
          onViewDetails={(id) => {
            setSelectedAgreementId(id)
            setView('detail')
          }}
        />
      ) : null}

      {view === 'create' ? <CreateAgreementPage onCreate={() => setView('dashboard')} /> : null}

      {view === 'detail' && selectedAgreement ? (
        <AgreementDetailPage agreement={selectedAgreement} onBack={() => setView('dashboard')} />
      ) : null}

      <Footer />
    </div>
  )
}

export default App
