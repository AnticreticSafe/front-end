import { useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionTitle } from '../components/ui/SectionTitle'

interface CreateAgreementPageProps {
  onCreate: () => void
}

export function CreateAgreementPage({ onCreate }: CreateAgreementPageProps) {
  const [occupantWallet, setOccupantWallet] = useState('')
  const [propertyDescription, setPropertyDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!occupantWallet || !propertyDescription || !startDate || !endDate) return
    onCreate()
  }

  return (
    <main className="page">
      <SectionTitle
        kicker="Create Agreement"
        title="Generate a mock agreement"
        description="Visual-only flow for hackathon demos. No wallet or contract calls in this stage."
      />
      <Card className="form-card">
        <form onSubmit={onSubmit}>
          <label>
            Occupant wallet
            <input
              type="text"
              value={occupantWallet}
              onChange={(event) => setOccupantWallet(event.target.value)}
              placeholder="0x..."
            />
          </label>
          <label>
            Property description
            <textarea
              value={propertyDescription}
              onChange={(event) => setPropertyDescription(event.target.value)}
              placeholder="Apartment in..."
              rows={4}
            />
          </label>
          <div className="grid-2">
            <label>
              Start date
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </label>
            <label>
              End date
              <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </label>
          </div>
          <Button type="submit">Generate Mock Agreement</Button>
          <p className="muted">
            In production, the property description is hashed before being sent on-chain.
          </p>
        </form>
      </Card>
    </main>
  )
}
