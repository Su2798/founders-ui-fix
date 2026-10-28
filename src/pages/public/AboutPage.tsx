import { Icon } from "../../site"
import { Localized } from "../../language"

export function AboutPage() {
  return <Localized><><section className="about-mission"><div className="shell about-mission-inner"><span className="section-label">Our mission</span><h1>Trust is the foundation of every great business connection.</h1><p>At VerifiedFounders, we’re committed to building trust in the entrepreneurial ecosystem by providing a reliable platform where business founders can establish credibility through rigorous verification.</p></div></section>
  <section className="section about-framework"><div className="shell"><div className="section-heading centered"><span className="section-label">Built on trust</span><h2>Our verification framework</h2><p>Every founder profile undergoes a comprehensive four-step verification process.</p></div><div className="verification-grid">{[
    ["document", "Identity review", "We verify the founder’s identity through secure and reliable documents."],
    ["building", "Business validation", "We confirm that the represented business is registered and active."],
    ["database", "Registry check", "Relevant public and official records are reviewed for consistency."],
    ["shield", "Final approval", "Our team conducts a final review before publishing a verified profile."],
  ].map(([icon, title, text]) => <article className="verification-item" key={title}><span className="step-number">Verified</span><div className="verification-icon"><Icon name={icon as "document"} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
  <section className="section about-partners"><div className="shell"><div className="section-heading centered"><span className="section-label">Growing together</span><h2>Trusted by leading organizations</h2></div><div className="partner-grid">
    <div className="partner-card"><img src="/partner-logos/best-deal-partnership.png" alt="Best Deal Partnership" /></div>
    <div className="partner-card"><img src="/partner-logos/usd-partners.png" alt="USD Partners" /></div>
    <div className="partner-card"><img src="/partner-logos/antin-infrastructure-partners.png" alt="Antin Infrastructure Partners" /></div>
  </div></div></section></></Localized>
}
