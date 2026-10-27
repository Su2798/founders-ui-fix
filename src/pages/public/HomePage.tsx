import { AppLink, Icon, PrimaryLink } from "../../site"
import { Localized } from "../../language"

export function HomePage() {
  return <Localized><><section className="hero"><div className="hero-pattern" aria-hidden="true" /><div className="shell hero-grid">
    <div className="hero-copy"><div className="eyebrow"><Icon name="sparkles" className="size-4" />Trusted by Myanmar’s founder community</div>
      <h1>Your source for <span>verified</span> business founders</h1><p>Discover authentic entrepreneurial profiles backed by rigorous verification. Connect with credible business leaders you can trust.</p>
      <div className="hero-actions"><PrimaryLink href="/directory">Browse directory</PrimaryLink><AppLink href="/verification" className="text-link">How verification works <Icon name="arrow" /></AppLink></div>
      <div className="trust-row"><div className="avatar-stack" aria-hidden="true"><span>MT</span><span>MH</span><span>NW</span><span>+64</span></div><p><b>67+ verified founders</b>Growing every week across Myanmar</p></div>
    </div>
    <div className="hero-visual" aria-label="Verified founder network"><div className="network-card network-main"><div className="network-icon"><Icon name="shield" /></div><strong>Verified founder network</strong><span>Authentic profiles. Trusted connections.</span><div className="network-stats"><div><b>67+</b><small>Founders</small></div><div><b>4-step</b><small>Verification</small></div></div></div><div className="network-card floating-card top-card"><Icon name="check" /><span><b>Manually reviewed</b><small>For credibility</small></span></div><div className="network-card floating-card bottom-card"><Icon name="building" /><span><b>Real businesses</b><small>Registry checked</small></span></div></div>
  </div></section>
  <section className="section verification"><div className="shell"><div className="section-heading centered"><span className="section-label">Built on trust</span><h2>Why verification matters</h2><p>Our comprehensive process ensures authenticity and builds trust in Myanmar’s entrepreneurial ecosystem.</p></div></div></section>
  <section className="cta-section"><div className="shell cta-inner"><div><span className="section-label orange-label">Join the community</span><h2>Build credibility with a verified profile</h2><p>Are you a business founder looking to establish credibility? Submit your profile for verification and join our trusted network.</p></div><div className="cta-actions"><PrimaryLink href="/login">Submit a founder</PrimaryLink><AppLink href="/directory" className="button button-light">Browse all founders<Icon name="arrow" /></AppLink></div></div></section></></Localized>
}
