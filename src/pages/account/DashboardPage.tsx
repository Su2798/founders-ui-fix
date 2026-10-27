import { useState } from "react"
import { AppLink, Icon } from "../../site"
import { LanguageSwitch, Localized } from "../../language"
import type { AuthSession } from "../../components"
import { getAccountPath } from "../../accountRoutes"
import { AccountSearch } from "./AccountSearch"

const navigation = [
  ["Personal", [
    ["database", "Overview", true],
    ["user", "My Profile", false],
  ]],
  ["Business", [
    ["building", "My Businesses", false],
    ["shield", "Verification", false],
  ]],
  ["Community", [
    ["user", "Communities", false],
    ["document", "Messages", false],
  ]],
  ["Content", [
    ["document", "My Posts", false],
    ["building", "Settings", false],
  ]],
] as const
const accountRouteByLabel = {
  Overview: "dashboard",
  "My Profile": "profile",
  "My Businesses": "businesses",
  Verification: "verification",
  Communities: "communities",
  Messages: "messages",
  "My Posts": "posts",
  Settings: "settings",
} as const

export function DashboardPage({ session, onLogout }: { session: AuthSession; onLogout: () => void }) {
  const initials = session.name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase()
  const firstName = session.name.split(" ")[0]

  return (
    <Localized><section className="dashboard">
      <aside className="dashboard-sidebar" aria-label="Account navigation">
        <AppLink href='/home' className="dashboard-brand"><span className="dashboard-brand-mark">F</span>Founders</AppLink>
        <nav>
          {navigation.map(([label, items]) => (
            <div className="dashboard-nav-group" key={label}>
              <span className="dashboard-nav-label">{label}</span>
              {items.map(([icon, itemLabel, active]) => (
                <AppLink key={itemLabel} href={getAccountPath(session, accountRouteByLabel[itemLabel])} className={`dashboard-nav-item${active ? " active" : ""}`}>
                  <Icon name={icon} />{itemLabel}{itemLabel === "Messages" && <b>3</b>}
                </AppLink>
              ))}
            </div>
          ))}
        </nav>
        <button type="button" className="dashboard-account" onClick={onLogout}>
          <span className="dashboard-avatar">{initials}</span>
          <span><strong>{session.name}</strong><small>{session.email}</small></span>
        </button>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button type="button" className="dashboard-menu" aria-label="Open account navigation"><Icon name="menu" /></button>
          <AccountSearch session={session} />
          <div className="dashboard-top-actions">
            <LanguageSwitch compact />
            <button type="button" aria-label="Notifications"><Icon name="sparkles" /></button>
            <span className="dashboard-top-avatar">{initials.slice(0, 1)}M</span>
            <span className="dashboard-top-name">{firstName}</span>
            <button type="button" className="dashboard-avatar small" aria-label="Open account menu">{initials}</button>
          </div>
        </header>

        <main className="dashboard-content">
          <header className="dashboard-heading">
            <div><span>Tuesday, 17 June</span><h1>Good morning, {firstName}</h1><p>Here is what needs your attention and what is happening in your founder network.</p></div>
            <AppLink href={getAccountPath(session, "posts", "?compose=1")} className="dashboard-primary"><span aria-hidden="true">+</span> Create post</AppLink>
          </header>

          <div className="dashboard-grid top-grid">
            <article className="dashboard-panel profile-panel">
              <span className="dashboard-label">Your founder profile</span>
              <div className="dashboard-profile"><span className="dashboard-avatar">{initials}</span><div><strong>{session.name}</strong><p>Founder &amp; Product Lead, Yangon</p><button type="button">View public profile</button><button type="button">Edit profile</button></div></div>
            </article>
            <article className="dashboard-panel completion-panel">
              <span className="dashboard-label">Profile completion</span>
              <div className="completion-ring"><span>84%</span></div><div className="completion-copy"><strong>Add just your founder story</strong><p>Profile with a founder story is more likely to attract the right connections.</p><button type="button">Complete profile <Icon name="arrow" /></button></div>
            </article>
          </div>

          <div className="dashboard-grid status-grid">
            <article className="dashboard-panel"><span className="dashboard-status-icon"><Icon name="shield" /></span><div><strong>Verification</strong><p>Thiri Aung is already verified</p></div><button type="button">View status</button></article>
            <article className="dashboard-panel"><span className="dashboard-status-icon warning"><Icon name="building" /></span><div><strong>Business status</strong><p>Pending workspace validation review</p></div><button type="button">Manage businesses</button></article>
          </div>

          <section className="dashboard-next">
            <header><h2>Useful next steps</h2><p>Keep your presence active and your network close.</p></header>
            <div className="dashboard-next-grid">{[
              ["user", "Complete profile", "Add your founder story"],
              ["building", "Add business", "Show what you are building"],
              ["user", "Join a community", "Find relevant founder circles"],
              ["document", "View messages", "See conversations that need your reply"],
            ].map(([icon, title, text]) => <button type="button" key={title}><span className="dashboard-status-icon"><Icon name={icon as "user"} /></span><span><strong>{title}</strong><small>{text}</small></span><Icon name="arrow" /></button>)}</div>
          </section>

          <section className="dashboard-community">
            <div className="community-feed">
              <header><h2>From your communities</h2><button type="button">View all</button></header>
              <div className="community-post-list">
                {[
                  ["TA", "What our first 10 customers taught us", "Thiri Aung · 2h", "24"],
                  ["KH", "How are founders handling logistics outside Yangon?", "Kaung Htet · 2h", "21"],
                  ["HH", "Recommendations for local payment integrations", "Hnin Htet · Yesterday", "17"],
                ].map(([avatar, title, author, replies]) => (
                  <article className="community-post" key={title}><span className="dashboard-avatar">{avatar}</span><div><strong>{title}</strong><small>{author}</small></div><span>{replies}</span></article>
                ))}
              </div>
            </div>
            <div className="dashboard-network">
              <header><h2>Your network</h2><button type="button" aria-label="More network options">•••</button></header>
              <div className="network-counts"><div><strong>4</strong><small>Communities</small></div><div><strong>1</strong><small>Events followed</small></div><div><strong>3</strong><small>Upcoming</small></div></div>
              <div className="network-people">
                {["YF Yangon Founders", "MY Myanmar Tech Founders", "WF Women Founders Myanmar"].map(person => <button type="button" key={person}><span>{person.slice(0, 2)}</span><strong>{person.slice(3)}</strong><Icon name="arrow" /></button>)}
              </div>
            </div>
          </section>
        </main>
      </div>
    </section></Localized>
  )
}
