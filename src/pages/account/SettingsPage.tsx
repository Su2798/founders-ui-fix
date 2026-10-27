import { FormEvent, useState } from "react"
import type { AuthSession } from "../../components"
import { AppLink, Icon } from "../../site"
import { LanguageSwitch, Localized } from "../../language"
import { getAccountPath } from "../../accountRoutes"

const navigation = [
  ["Personal", [["database", "Overview"], ["user", "My Profile"]]],
  ["Business", [["building", "My Businesses"], ["shield", "Verification"]]],
  ["Community", [["user", "Communities"], ["document", "Messages"]]],
  ["Content", [["document", "My Posts"], ["building", "Settings"]]],
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

type Preferences = { replies: boolean; messages: boolean; verification: boolean; publicProfile: boolean }
const defaults: Preferences = { replies: true, messages: false, verification: true, publicProfile: true }

export function SettingsPage({ session, onLogout }: { session: AuthSession; onLogout: () => void }) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem("founders:preferences") || "{}") } }
    catch { return defaults }
  })
  const [status, setStatus] = useState("")
  const [resetConfirm, setResetConfirm] = useState(false)
  const initials = session.name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase()

  function toggle(key: keyof Preferences) {
    const next = { ...preferences, [key]: !preferences[key] }
    setPreferences(next)
    localStorage.setItem("founders:preferences", JSON.stringify(next))
  }

  function saveEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    if (!email) return
    setStatus("Account settings saved.")
  }

  function resetDemo() {
    ["founders:demo:posts", "founders:profile", "founders:preferences", "founders:communities", "founders:businesses"].forEach(key => localStorage.removeItem(key))
    setPreferences(defaults)
    setResetConfirm(false)
    setStatus("Demo data reset.")
  }

  return <Localized><section className="dashboard settings-dashboard">
    <aside className="dashboard-sidebar" aria-label="Account navigation">
      <AppLink href={getAccountPath(session, "dashboard")} className="dashboard-brand"><span className="dashboard-brand-mark">F</span>Founders</AppLink>
      <nav>{navigation.map(([label, items]) => <div className="dashboard-nav-group" key={label}><span className="dashboard-nav-label">{label}</span>{items.map(([icon, itemLabel]) => {
        const href = getAccountPath(session, accountRouteByLabel[itemLabel])
        return <AppLink key={itemLabel} href={href} className={`dashboard-nav-item${itemLabel === "Settings" ? " active" : ""}`}><Icon name={icon} />{itemLabel}{itemLabel === "Messages" && <b>3</b>}</AppLink>
      })}</div>)}</nav>
      <button type="button" className="dashboard-account" onClick={onLogout}><span className="dashboard-avatar">{initials}</span><span><strong>{session.name}</strong><small>{session.email}</small></span></button>
    </aside>

    <div className="dashboard-main">
      <header className="dashboard-topbar"><button type="button" className="dashboard-menu" aria-label="Open account navigation"><Icon name="menu" /></button><div className="dashboard-search"><Icon name="search" /><input aria-label="Search founders, businesses and communities" placeholder="Search founders, businesses, communities..." /><span className="dashboard-search-shortcut">⌘ K</span></div><div className="dashboard-top-actions"><button type="button" aria-label="Notifications"><Icon name="sparkles" /></button><LanguageSwitch compact /><span className="dashboard-top-avatar">EN</span><span className="dashboard-top-name">Thiri Aung</span><button type="button" className="dashboard-avatar small" aria-label="Open account menu">{initials}</button></div></header>

      <main className="dashboard-content settings-content">
        <header className="settings-heading"><div><span>Account</span><h1>Settings</h1><p>Manage account preferences, privacy, and the local prototype.</p></div></header>
        {status && <p className="settings-status" role="status">{status}</p>}

        <section className="settings-panel"><header><h2>Account</h2><p>The email used for account notices and sign-in.</p></header><form onSubmit={saveEmail}><label htmlFor="settings-email">Account email</label><input id="settings-email" name="email" type="email" defaultValue={session.email} required /></form></section>

        <section className="settings-panel"><header><h2>Notifications</h2><p>Choose what brings you back to Founders.</p></header><div className="settings-options">
          <SettingToggle title="Community replies" description="When someone responds to your posts or comments." checked={preferences.replies} onChange={() => toggle("replies")} />
          <SettingToggle title="New messages" description="Unread messages in a direct community chat." checked={preferences.messages} onChange={() => toggle("messages")} />
          <SettingToggle title="Verification updates" description="Change to the status of your business verification." checked={preferences.verification} onChange={() => toggle("verification")} />
        </div></section>

        <section className="settings-panel"><header><h2>Profile visibility</h2><p>Control whether your founder profile appears in public discovery.</p></header><div className="settings-options"><SettingToggle title="Public founder profile" description="Allow people in the network to find and review your profile." checked={preferences.publicProfile} onChange={() => toggle("publicProfile")} /></div></section>

        <section className="settings-panel settings-prototype"><header><h2>Prototype controls</h2><p>Reset local changes or leave the signed-in demo session.</p></header><div className="settings-actions">{resetConfirm ? <><button type="button" className="confirm-reset" onClick={resetDemo}>Confirm reset</button><button type="button" onClick={() => setResetConfirm(false)}>Cancel</button></> : <button type="button" onClick={() => setResetConfirm(true)}><Icon name="database" />Reset demo data</button>}<button type="button" onClick={onLogout}>Sign out</button></div></section>
      </main>
    </div>
  </section></Localized>
}

function SettingToggle({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: () => void }) {
  return <label className="setting-toggle"><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" checked={checked} onChange={onChange} /><span className="toggle-track" aria-hidden="true" /></label>
}
