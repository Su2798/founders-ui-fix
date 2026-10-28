import { AppLink, Icon, PrimaryLink } from "../../site"
import { Localized } from "../../language"
import { founders } from "./DirectoryPage"
import { profileCopy } from "./FounderProfilePage"

const featuredFounders = founders.slice(0, 3)
const featuredBusinesses = founders.slice(0, 4)
const communities = [
  { initials: "YF", name: "Yangon Founders", category: "Local network", members: "428 members", description: "A practical peer network for founders building and operating in Yangon." },
  { initials: "MF", name: "Mandalay Founders", category: "City community", members: "286 members", description: "Conversations, local lessons, and founder connections across Mandalay." },
  { initials: "TF", name: "Myanmar Tech Founders", category: "Industry network", members: "176 members", description: "A focused group discussing technology, teams, and access." },
]

export function HomePage() {
  return <Localized><main className="home-page">
    <section className="hero"><div className="hero-pattern" aria-hidden="true" /><div className="shell hero-grid">
      <div className="hero-copy"><div className="eyebrow"><Icon name="sparkles" className="size-4" />Trusted by Myanmar’s founder community</div>
        <h1>Your source for <span>verified</span> business founders</h1><p>Discover authentic entrepreneurial profiles backed by rigorous verification. Connect with credible business leaders you can trust.</p>
        <div className="hero-actions"><PrimaryLink href="/founder-registration">Become a founder</PrimaryLink><AppLink href="/business-registration" className="text-link">Business registration<Icon name="arrow" /></AppLink></div>
        <div className="trust-row"><div className="avatar-stack" aria-hidden="true"><span>MT</span><span>MH</span><span>NW</span><span>+64</span></div><p><b>67+ verified founders</b>Growing every week across Myanmar</p></div>
      </div>
      <div className="hero-visual" aria-label="Verified founder network"><div className="network-card network-main"><div className="network-icon"><Icon name="shield" /></div><strong>Verified founder network</strong><span>Authentic profiles. Trusted connections.</span><div className="network-stats"><div><b>67+</b><small>Founders</small></div><div><b>4-step</b><small>Verification</small></div></div></div><div className="network-card floating-card top-card"><Icon name="check" /><span><b>Manually reviewed</b><small>For credibility</small></span></div><div className="network-card floating-card bottom-card"><Icon name="building" /><span><b>Real businesses</b><small>Registry checked</small></span></div></div>
    </div></section>

    <section className="home-principles" aria-label="Our approach">
      <div className="shell home-principles-grid">
        <article><span className="home-principle-icon"><Icon name="user" /></span><div><strong>People, not profiles alone</strong><span>Learn how founders work and what they are building.</span></div></article>
        <article><span className="home-principle-icon"><Icon name="building" /></span><div><strong>Local context</strong><span>Explore businesses shaped by real communities.</span></div></article>
        <article><span className="home-principle-icon"><Icon name="shield" /></span><div><strong>Trust with purpose</strong><span>Clear verification without exposing private documents.</span></div></article>
      </div>
    </section>

    <section className="section home-founders">
      <div className="shell">
        <div className="home-section-heading">
          <div><span className="section-label">Meet the people</span><h2>Founders to know</h2><p>Meet people building thoughtful businesses across Myanmar.</p></div>
          <AppLink href="/directory" className="home-section-link">View directory<Icon name="arrow" /></AppLink>
        </div>
        <div className="founder-grid home-founder-grid">
          {featuredFounders.map(founder => {
            const initials = founder.name.split(" ").map(part => part[0]).slice(0, 2).join("")
            return <AppLink key={founder.id} href={`/founder/${founder.id}`} className="founder-card">
              <div className="founder-card-top"><span className="avatar">{initials}</span>{founder.verified && <span className="verified"><Icon name="check" />Verified</span>}</div>
              <div className="founder-card-info"><span className="founder-role">{founder.role}</span><h3>{founder.name}</h3><span className="founder-company"><Icon name="building" />{founder.company}</span></div>
              <p className="home-founder-description">{founder.description}</p>
              <div className="card-meta"><span className="industry-tag">{founder.industry}</span><span className="card-action">View profile<Icon name="arrow" /></span></div>
            </AppLink>
          })}
        </div>
      </div>
    </section>

    <section className="home-businesses">
      <div className="shell">
        <div className="home-section-heading">
          <div><span className="section-label">Made in Myanmar</span><h2>Built by local teams</h2><p>Explore products and services shaped by local teams and local needs.</p></div>
          <AppLink href="/directory" className="home-section-link">Explore businesses<Icon name="arrow" /></AppLink>
        </div>
        <div className="home-business-grid">
          {featuredBusinesses.map((founder, index) => <AppLink key={founder.id} href={`/business/${founder.id}`} className="home-business-card">
            <div className={`home-business-mark tone-${index % 4}`}>{founder.company.split(/\s+/).map(part => part[0]).slice(0, 2).join("")}</div>
            <span className={`home-business-status${founder.verified ? " is-verified" : ""}`}>{founder.verified && <Icon name="check" />}{founder.verified ? "Verified" : "Under review"}</span>
            <h3>{founder.company}</h3>
            <span className="home-business-industry">{founder.industry}</span>
            <p>{profileCopy[founder.id]?.businessDescription ?? founder.description}</p>
            <div className="home-business-footer"><span className="home-business-location"><Icon name="document" />{founder.location}</span><span className="home-business-link">View business<Icon name="arrow" /></span></div>
          </AppLink>)}
        </div>
      </div>
    </section>

    <section className="home-communities">
      <div className="shell">
        <div className="home-section-heading home-community-heading">
          <div><span className="section-label">Find your peers</span><h2>Communities for the work behind the work</h2></div>
          <p>Share useful lessons, ask specific questions, and build relationships with founders who understand the market around you.</p>
        </div>
        <div className="home-community-grid">
          {communities.map((community, index) => <article className="home-community-card" key={community.name}>
            <span className={`home-community-avatar tone-${index}`}>{community.initials}</span>
            <div className="home-community-content"><span className="home-community-category">{community.category}</span><h3>{community.name}</h3><p>{community.description}</p><small><Icon name="user" />{community.members}</small></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="home-verification">
      <div className="shell home-verification-panel">
        <div className="home-verification-copy">
          <span className="home-verification-icon"><Icon name="shield" /></span>
          <span className="home-verification-eyebrow">Verification that respects privacy</span>
          <h2>A clearer signal of founder and business credibility.</h2>
          <p>Verification helps the community know who stands behind a business. Proof documents stay private and are never shown on public profiles.</p>
          <AppLink href="/verification" className="home-verification-link">Learn about verification<Icon name="arrow" /></AppLink>
        </div>
        <ol className="home-verification-steps">
          <li><span>01</span><div><strong>Complete your business profile</strong><small>Give the community enough context to understand what you are building.</small></div></li>
          <li><span>02</span><div><strong>Submit proof privately</strong><small>Share supporting information for review by the Founders team.</small></div></li>
          <li><span>03</span><div><strong>Build with a trusted identity</strong><small>Your profile receives a clear verification badge when approved.</small></div></li>
        </ol>
      </div>
    </section>

    <section className="home-bottom-cta">
      <div className="shell home-bottom-cta-inner">
        <div><h2>Build your founder presence. Find your people.</h2><p>Create a profile, introduce your business, and join conversations that move work forward.</p></div>
        <div><AppLink href="/founder-registration" className="button button-dark">Become a founder<Icon name="arrow" /></AppLink><AppLink href="/business-registration" className="home-preview-link">Business registration</AppLink><AppLink href="/directory" className="home-preview-link">Explore the directory</AppLink></div>
      </div>
    </section>
  </main></Localized>
}
