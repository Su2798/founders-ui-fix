import { AppLink, Icon, PrimaryLink } from "../../site"
import { Localized } from "../../language"

export function VerificationPage() {
  const steps = [
    ["Complete your profile", "Add your founder and business information so we understand the context."],
    ["Submit business proof", "Provide supporting business documents through the private verification flow."],
    ["Review", "Our review team checks the information and may ask for a clearer document."],
    ["Verified", "A clear badge appears on your eligible founder and business profiles."],
  ]
  return <Localized><><section className="verification-intro"><div className="shell verification-hero-content">
      <span className="verification-hero-icon"><Icon name="shield" /></span>
      <span className="verification-hero-badge">Founder verification</span>
      <h1>Build trust without putting private documents on display.</h1>
      <p>Verification confirms that a founder is connected to the business shown on their profile. Supporting documents are reviewed privately and never published.</p>
      <div className="verification-hero-actions"><PrimaryLink href="/register">Start your profile</PrimaryLink><AppLink href="/contact" className="verification-contact-link">Questions? Contact us<Icon name="arrow" /></AppLink></div>
    </div></section>
    <section className="verification-details"><div className="shell verification-steps-layout">
      <header className="verification-steps-heading"><span className="section-label">How it works</span><h2>Clear steps, visible progress</h2><p>Know what to expect as your founder and business details are reviewed.</p></header>
      <ol className="verification-steps-list">{steps.map(([title, text], index) => <li className="verification-step" key={title}><span className="verification-step-number">{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Icon name="arrow" /></li>)}</ol>
    </div></section>
    <section className="verification-privacy"><div className="shell"><div className="verification-privacy-note"><span className="verification-privacy-icon"><Icon name="shield" /></span><div><h2>Your documents stay private</h2><p>Proof documents are not part of the public directory, founder profile, or business profile. In this prototype, no file is uploaded; only a local filename is displayed.</p></div></div></div></section></></Localized>
}
