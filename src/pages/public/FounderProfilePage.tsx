import { useState } from "react"
import { AppLink, Icon } from "../../site"
import { Localized } from "../../language"
import { founders } from "./DirectoryPage"

export const profileCopy: Record<string, { role: string; location: string; story: string; businessDescription: string; post: string; postExcerpt: string; community: string }> = {
  "1": {
    role: "Founder",
    location: "Yangon",
    story: "Building a practical business with a focus on understanding local customers and creating long-term value.",
    businessDescription: "A founder-led business helping customers find trusted products and services.",
    post: "What building for local customers has taught me",
    postExcerpt: "Listening closely to customers and learning from their day-to-day challenges has shaped how we build and improve our business.",
    community: "Yangon Founders",
  },
  "2": {
    role: "Founder & Creative Lead",
    location: "Yangon",
    story: "Growing a customer-focused business through thoughtful service, local insight, and a commitment to quality.",
    businessDescription: "A local service business focused on helping customers feel confident and well supported.",
    post: "A small founder breakfast next Friday",
    postExcerpt: "It is always valuable to make time for honest conversations with other founders about the work, the lessons, and what comes next.",
    community: "Women Founders Myanmar",
  },
  "3": {
    role: "Founder",
    location: "Mandalay",
    story: "Bringing a deep appreciation for craft and quality to a business serving customers across the region.",
    businessDescription: "An independent local business built around quality products and trusted customer relationships.",
    post: "Keeping customer trust at the heart of the business",
    postExcerpt: "Clear communication, reliable service, and care for the details make a real difference in earning long-term customer trust.",
    community: "Mandalay Founders",
  },
  "4": {
    role: "Founder",
    location: "Yangon",
    story: "Building a reliable local service by combining practical experience with a better customer experience.",
    businessDescription: "A local retail business connecting customers with dependable devices and helpful service.",
    post: "What customers value when buying a device",
    postExcerpt: "The best conversations start by understanding how someone plans to use a device, then helping them find the right option.",
    community: "Yangon Founders",
  },
  "5": {
    role: "Co-founder",
    location: "Yangon",
    story: "Working with a local team to create useful technology and solve practical problems for growing businesses.",
    businessDescription: "A technology team building useful digital tools for businesses and their customers.",
    post: "Building useful technology, one customer at a time",
    postExcerpt: "The strongest product ideas come from spending time with the people who use them and making room for what we learn.",
    community: "Myanmar Tech Founders",
  },
  "6": {
    role: "Founder",
    location: "Taunggyi",
    story: "Creating practical learning opportunities that help young people build skills and prepare for new careers.",
    businessDescription: "Making job-ready learning more accessible to young people outside major cities.",
    post: "Making useful learning easier to reach",
    postExcerpt: "Learning can open new opportunities when people can access relevant skills close to home and at a pace that works for them.",
    community: "Myanmar Tech Founders",
  },
  "7": {
    role: "Founder & CEO",
    location: "Yangon",
    story: "Building more dependable ways for local businesses to move products between cities and reach new customers.",
    businessDescription: "Building dependable regional delivery networks for small businesses.",
    post: "What small businesses need from regional delivery",
    postExcerpt: "Predictable delivery, clear updates, and reliable support make it easier for small businesses to serve customers beyond their city.",
    community: "Yangon Founders",
  },
  "8": {
    role: "Co-founder",
    location: "Yangon",
    story: "Supporting local makers and thoughtful craft by creating stronger links between independent creators and customers.",
    businessDescription: "Connecting Myanmar makers with customers who value thoughtful craft.",
    post: "Creating more room for local makers",
    postExcerpt: "When makers can share the stories behind their work, customers discover the care, skill, and community that go into every piece.",
    community: "Women Founders Myanmar",
  },
  "9": {
    role: "Founder",
    location: "Mandalay",
    story: "Growing a food business around locally sourced ingredients, thoughtful production, and better everyday choices.",
    businessDescription: "Growing nutritious local food products with sustainable sourcing.",
    post: "Building a stronger local food supply",
    postExcerpt: "Working closely with local producers helps create dependable supply, support livelihoods, and bring good products to more customers.",
    community: "Mandalay Founders",
  },
  "10": {
    role: "Founder",
    location: "Mandalay",
    story: "Helping independent makers access the tools, production support, and market connections needed to grow.",
    businessDescription: "Supporting small-batch makers with shared production and market access.",
    post: "A more connected home for small-batch makers",
    postExcerpt: "Shared resources and practical connections can help small makers focus on their craft while reaching more customers.",
    community: "Mandalay Founders",
  },
}

export function FounderProfilePage({ founderId }: { founderId: string }) {
  const founder = founders.find(item => item.id === founderId)
  const [connected, setConnected] = useState(false)
  const [helpful, setHelpful] = useState(false)

  return <Localized><section className="founder-public-page"><div className="shell">
    {founder ? (() => {
      const profile = profileCopy[founder.id]
      const initials = founder.name.split(" ").map(part => part[0]).slice(0, 2).join("")
      return <>
        <AppLink href="/directory" className="public-profile-back"><Icon name="arrow" />Back to directory</AppLink>
        <header className="public-founder-header">
          <div className="public-founder-identity">
            <span className="public-founder-avatar">{initials}</span>
            <div className="public-founder-heading">
              <span className="public-founder-eyebrow">Founder profile</span>
              <div className="public-founder-name-row"><h1>{founder.name}</h1><span className="public-founder-verified"><Icon name="check" />Verified</span></div>
              <p>{profile.role} <span>at</span> <strong>{founder.company}</strong></p>
              <p className="public-founder-bio">{profile.businessDescription}</p>
              <div className="public-founder-meta"><span><Icon name="building" />{profile.location}</span><span><Icon name="document" />{founder.industry}</span></div>
            </div>
          </div>
          <button type="button" className={`public-founder-connect${connected ? " is-connected" : ""}`} onClick={() => setConnected(value => !value)}>
            {connected && <Icon name="check" />}{connected ? "Connected" : "Connect"}
          </button>
        </header>

        <div className="public-founder-layout">
          <div className="public-founder-main">
            <section className="public-founder-section">
              <h2>Founder story</h2>
              <p>{profile.story}</p>
            </section>
            <section className="public-founder-section">
              <h2>Building</h2>
              <article className="public-founder-business">
                <div className="public-founder-business-top"><span className="public-founder-business-avatar">{founder.company.split(/\s+/).map(part => part[0]).slice(0, 2).join("")}</span><span className="public-founder-business-status"><Icon name="check" />Founder-led</span></div>
                <div className="public-founder-business-content"><h3>{founder.company}</h3><span>{founder.industry} · <span>Local business</span></span><p>{profile.businessDescription}</p><small><Icon name="building" />{profile.location}</small></div>
                <AppLink href={`/business/${founder.id}`} className="public-founder-business-link">View business <Icon name="arrow" /></AppLink>
              </article>
            </section>
            <section className="public-founder-section public-founder-posts">
              <h2>Recent posts</h2>
              <article className="public-founder-post">
                <header><span className="public-founder-post-avatar">{initials}</span><span><strong>{founder.name}</strong><small>{founder.company} · <span>Founder</span></small></span></header>
                <h3>{profile.post}</h3>
                <p>{profile.postExcerpt}</p>
                <footer><span>Shared with the founder community</span><span>Public post</span></footer>
                <div className="public-founder-post-actions"><button type="button" className={helpful ? "is-helpful" : ""} onClick={() => setHelpful(value => !value)}><Icon name="check" />{helpful ? "Marked helpful" : "Helpful"}</button><a href="/login"><Icon name="document" />Comment</a></div>
              </article>
            </section>
          </div>

          <aside className="public-founder-community">
            <span className="public-founder-side-label">Community</span>
            <strong><b>3</b><span>Communities joined</span></strong>
            <ul><li><span>YF</span>Yangon Founders</li><li><span>MF</span>Mandalay Founders</li><li><span>TF</span>Myanmar Tech Founders</li></ul>
            <p>Communities are shown as a profile preview.</p>
            <AppLink href="/directory">Explore founders <Icon name="arrow" /></AppLink>
          </aside>
        </div>
      </>
    })() : <div className="founder-profile-card founder-profile-not-found">
      <h1>Founder not found</h1>
      <p>This founder profile is unavailable.</p>
      <AppLink href="/directory" className="button button-primary">Back to directory</AppLink>
    </div>}
  </div></section></Localized>
}
