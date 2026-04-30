interface SectionTitleProps {
  kicker?: string
  title: string
  description?: string
}

export function SectionTitle({ kicker, title, description }: SectionTitleProps) {
  return (
    <header className="section-title">
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  )
}
