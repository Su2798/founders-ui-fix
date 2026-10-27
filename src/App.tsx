import { FormEvent, useEffect, useState } from "react"
import { Footer, Header, navItems, type AuthSession } from "./components"
import { LoginPage, RegisterPage, type RegistrationData } from "./pages/auth/AuthPages"
import { AboutPage } from "./pages/public/AboutPage"
import { ContactPage } from "./pages/public/ContactPage"
import { DirectoryPage } from "./pages/public/DirectoryPage"
import { FounderProfilePage } from "./pages/public/FounderProfilePage"
import { BusinessProfilePage } from "./pages/public/BusinessProfilePage"
import { HomePage } from "./pages/public/HomePage"
import { VerificationPage } from "./pages/public/VerificationPage"
import { AccountVerificationPage } from "./pages/account/AccountVerificationPage"
import { BusinessesPage } from "./pages/account/BusinessesPage"
import { CommunitiesPage } from "./pages/account/CommunitiesPage"
import { DashboardPage } from "./pages/account/DashboardPage"
import { MessagesPage } from "./pages/account/MessagesPage"
import { PostsPage } from "./pages/account/PostsPage"
import { ProfilePage } from "./pages/account/ProfilePage"
import { SettingsPage } from "./pages/account/SettingsPage"
import { accountSections, getAccountPath, getAccountSlug, parseAccountPath } from "./accountRoutes"

const AUTH_ACCOUNTS_KEY = "founders:demo:accounts"
const AUTH_SESSION_KEY = "founders:demo:session"
type DemoAccount = { id: string; name: string; email: string; passwordHash: string; passwordSalt: string }

async function hashPassword(password: string, salt: string) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("")
}
function readAccounts(): DemoAccount[] { try { const value = localStorage.getItem(AUTH_ACCOUNTS_KEY); return value ? JSON.parse(value) as DemoAccount[] : [] } catch { return [] } }
function readSession(): AuthSession | null { try { const value = localStorage.getItem(AUTH_SESSION_KEY); return value ? JSON.parse(value) as AuthSession : null } catch { return null } }

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/home"
  const accountRoute = parseAccountPath(pathname)
  const activePath = navItems.some(([, href]) => href === pathname) ? pathname : "/home"
  const [session, setSession] = useState<AuthSession | null>(readSession)
  const [loginMessage, setLoginMessage] = useState(() => new URLSearchParams(window.location.search).get("registered") === "1" ? "Account created. Sign in to continue." : "")
  const [registerMessage, setRegisterMessage] = useState("")

  async function register(registration: RegistrationData) {
    setRegisterMessage("")
    const name = registration.name.trim()
    const email = registration.email.trim().toLowerCase()
    const password = registration.password
    const accounts = readAccounts()
    if (accounts.some(account => account.email === email)) { setRegisterMessage("An account with this email already exists. Sign in instead."); return }
    const passwordSalt = crypto.getRandomValues(new Uint32Array(4)).join("-")
    const account: DemoAccount = { id: crypto.randomUUID(), name, email, passwordSalt, passwordHash: await hashPassword(password, passwordSalt) }
    localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify([...accounts, account]))
    const profileDraft = {
      role: registration.role,
      location: registration.location,
      shortBio: registration.shortBio,
      businessName: registration.businessName,
      industry: registration.industry,
      foundedYear: registration.foundedYear,
      businessLocation: registration.businessLocation,
      businessDescription: registration.businessDescription,
      proofFilename: registration.proofFilename,
    }
    localStorage.setItem(`founders:onboarding:${account.id}`, JSON.stringify(profileDraft))
    const nextSession = { accountId: account.id, name, email }
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
    window.location.assign(getAccountPath(nextSession, "dashboard"))
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoginMessage("")
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim().toLowerCase()
    const password = String(form.get("password") ?? "")
    const account = readAccounts().find(candidate => candidate.email === email)
    if (!account || await hashPassword(password, account.passwordSalt) !== account.passwordHash) { setLoginMessage("The email or password is incorrect."); return }
    const nextSession = { accountId: account.id, name: account.name, email: account.email }
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession)); setSession(nextSession); window.location.assign(getAccountPath(nextSession, "dashboard"))
  }

  function logout() { localStorage.removeItem(AUTH_SESSION_KEY); setSession(null); window.location.assign("/home") }
  useEffect(() => {
    const legacySection = accountSections.find(section => pathname === `/${section}` && section !== "verification")
    if (legacySection) {
      window.location.replace(session ? getAccountPath(session, legacySection) : "/login")
      return
    }
    if (!accountRoute) return
    if (!session) {
      window.location.replace("/login")
      return
    }
    if (accountRoute.slug !== getAccountSlug(session)) {
      window.location.replace(getAccountPath(session, accountRoute.section))
    }
  }, [accountRoute?.slug, accountRoute?.section, pathname, session])

  let page
  if (accountRoute?.section === "dashboard") page = session ? <DashboardPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "posts") page = session ? <PostsPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "profile") page = session ? <ProfilePage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "businesses") page = session ? <BusinessesPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "communities") page = session ? <CommunitiesPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "messages") page = session ? <MessagesPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "settings") page = session ? <SettingsPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "verification") page = session ? <AccountVerificationPage session={session} onLogout={logout} /> : null
  else if (pathname === "/register") page = <RegisterPage onSubmit={register} message={registerMessage} />
  else if (pathname === "/login") page = <LoginPage onSubmit={login} message={loginMessage} />
  else if (pathname === "/directory") page = <DirectoryPage />
  else if (/^\/founder\/[^/]+$/.test(pathname)) page = <FounderProfilePage founderId={pathname.split("/")[2]} />
  else if (/^\/business\/[^/]+$/.test(pathname)) page = <BusinessProfilePage businessId={pathname.split("/")[2]} />
  else if (pathname === "/contact") page = <ContactPage />
  else if (pathname === "/about") page = <AboutPage />
  else if (pathname === "/verification") page = <VerificationPage />
  else page = <HomePage dashboardHref={session ? getAccountPath(session, "dashboard") : "/login"} />

  if (accountRoute?.section === "dashboard" && session) {
    return <DashboardPage session={session} onLogout={logout} />
  }
  if (accountRoute?.section === "profile" && session) return <ProfilePage session={session} onLogout={logout} />
  if (accountRoute?.section === "businesses" && session) return <BusinessesPage session={session} onLogout={logout} />
  if (accountRoute?.section === "communities" && session) return <CommunitiesPage session={session} onLogout={logout} />
  if (accountRoute?.section === "messages" && session) return <MessagesPage session={session} onLogout={logout} />
  if (accountRoute?.section === "verification" && session) return <AccountVerificationPage session={session} onLogout={logout} />
  if (accountRoute?.section === "posts" && session) {
    return <PostsPage session={session} onLogout={logout} />
  }
  if (accountRoute?.section === "settings" && session) {
    return <SettingsPage session={session} onLogout={logout} />
  }
  if (pathname === "/register") return <RegisterPage onSubmit={register} message={registerMessage} />

  return (
    <div className="app">
      <Header activePath={activePath} session={session} onLogout={logout} />
      <main>{page}</main>
      <Footer />
    </div>
  )
}
