import { useState, type ReactNode } from "react"
import type { AuthSession } from "../../components"
import { AppLink, Icon } from "../../site"
import { LanguageSwitch, Localized } from "../../language"
import { getAccountPath } from "../../accountRoutes"
import { AccountSearch } from "./AccountSearch"

const items = [
  ["Personal", [["Overview", "database", "dashboard"], ["My Profile", "user", "profile"]]],
  ["Business", [["My Businesses", "building", "businesses"], ["Verification", "shield", "verification"]]],
  ["Community", [["Communities", "user", "communities"], ["Messages", "document", "messages"]]],
  ["Content", [["My Posts", "document", "posts"], ["Settings", "building", "settings"]]],
] as const

export function MemberShell({ session, onLogout, active, children }: { session: AuthSession; onLogout: () => void; active: string; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const initials = session.name.split(/\s+/).filter(Boolean).map(word => word[0]).slice(0, 2).join("").toUpperCase()
  const navigation = (mobile = false) => <nav className={mobile ? "dashboard-mobile-nav" : undefined} aria-label="Account navigation">
    {items.map(([label, links]) => <div className="dashboard-nav-group" key={label}><span className="dashboard-nav-label">{label}</span>{links.map(([name, icon, section]) => <AppLink href={getAccountPath(session, section)} key={name} className={`dashboard-nav-item${active === name ? " active" : ""}`}><Icon name={icon} /><span>{name}</span>{name === "Messages" && <b>3</b>}</AppLink>)}</div>)}
  </nav>

  return <Localized><section className={`dashboard member-dashboard${menuOpen ? " menu-open" : ""}`}>
    <aside className="dashboard-sidebar" aria-label="Account navigation">
      <AppLink href={getAccountPath(session, "dashboard")} className="dashboard-brand"><span className="dashboard-brand-mark">F</span><span>Founders</span></AppLink>
      {navigation()}
      <button type="button" className="dashboard-account" onClick={onLogout}><span className="dashboard-avatar">{initials}</span><span><strong>{session.name}</strong><small>{session.email}</small></span><Icon name="arrow" /></button>
    </aside>
    {menuOpen && <div className="dashboard-mobile-menu"><header><AppLink href={getAccountPath(session, "dashboard")} className="dashboard-brand"><span className="dashboard-brand-mark">F</span><span>Founders</span></AppLink><button type="button" aria-label="Close account navigation" onClick={() => setMenuOpen(false)}><Icon name="x" /></button></header>{navigation(true)}<button type="button" className="dashboard-mobile-signout" onClick={onLogout}>Sign out</button></div>}
    <div className="dashboard-main">
      <header className="dashboard-topbar">
        <button type="button" className="dashboard-menu" aria-label="Open account navigation" onClick={() => setMenuOpen(true)}><Icon name="menu" /></button>
        <AccountSearch session={session} />
        <div className="dashboard-top-actions"><button type="button" className="dashboard-icon-button" aria-label="Notifications"><Icon name="sparkles" /><span /></button><LanguageSwitch /><div className="dashboard-user-chip"><span className="dashboard-avatar small">{initials}</span><span><strong>{session.name}</strong><small>{session.email}</small></span></div></div>
      </header>
      {children}
    </div>
  </section></Localized>
}
