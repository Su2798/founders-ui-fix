import { FormEvent, useEffect, useState } from "react"
import { Footer, Header, navItems, type AuthSession } from "./components"
import { FounderRegistrationPage, LoginPage, RegisterPage, type FounderBusinessDraft, type FounderProfileDraft, type RegistrationData } from "./pages/auth/AuthPages"
import { BusinessRegistrationPage, type BusinessApplicationData } from "./pages/public/BusinessRegistrationPage"
import { AboutPage } from "./pages/public/AboutPage"
import { ContactPage } from "./pages/public/ContactPage"
import { DirectoryPage } from "./pages/public/DirectoryPage"
import { FounderProfilePage } from "./pages/public/FounderProfilePage"
import { BusinessProfilePage } from "./pages/public/BusinessProfilePage"
import { HomePage } from "./pages/public/HomePage"
import { VerificationPage } from "./pages/public/VerificationPage"
import { AccountVerificationPage } from "./pages/account/AccountVerificationPage"
import { BusinessesPage } from "./pages/account/BusinessesPage"
import { CommunitiesPage, CommunityDetailPage } from "./pages/account/CommunitiesPage"
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
function hasFounderAccess(session: AuthSession | null) {
  if (!session) return false
  try {
    return localStorage.getItem(`founders:account-type:${session.accountId}`) === "founder"
      || localStorage.getItem(`founders:profile:${session.accountId}`) !== null
  } catch {
    return false
  }
}

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/home"
  const accountRoute = parseAccountPath(pathname)
  const communityDetailRoute = pathname.match(/^\/([^/]+)\/communities\/([^/]+)$/)
  const activePath = navItems.some(([, href]) => href === pathname) ? pathname : "/home"
  const [session, setSession] = useState<AuthSession | null>(readSession)
  const isFounder = hasFounderAccess(session)
  const [loginMessage, setLoginMessage] = useState(() => new URLSearchParams(window.location.search).get("registered") === "1" ? "Account created. Sign in to continue." : "")

  async function createAccount(registration: RegistrationData) {
    const name = registration.name.trim()
    const email = registration.email.trim().toLowerCase()
    const password = registration.password
    const accounts = readAccounts()
    if (accounts.some(account => account.email === email)) return { error: "An account with this email already exists." }
    const passwordSalt = crypto.getRandomValues(new Uint32Array(4)).join("-")
    const account: DemoAccount = { id: crypto.randomUUID(), name, email, passwordSalt, passwordHash: await hashPassword(password, passwordSalt) }
    localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify([...accounts, account]))
    const nextSession = { accountId: account.id, name, email }
    return { session: nextSession }
  }

  async function register(registration: RegistrationData) {
    const result = await createAccount(registration)
    if (result.error || !result.session) return result.error ?? "Your account could not be created."
    try {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.session))
    } catch {
      return "Your account was created, but this browser could not sign you in. Please sign in to continue."
    }
    setSession(result.session)
    window.location.assign("/home")
    return null
  }

  async function completeFounderRegistration(profile: FounderProfileDraft, business: FounderBusinessDraft) {
    if (!session) return "Sign in before completing founder registration."
    const applicationKey = "founders:demo:business-applications"
    const profileKey = `founders:profile:${session.accountId}`
    const accountTypeKey = `founders:account-type:${session.accountId}`
    let existingApplications: Array<Record<string, unknown>>
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(applicationKey) ?? "[]")
      if (!Array.isArray(saved) || !saved.every(item => typeof item === "object" && item !== null)) {
        return "Saved application data is invalid. Please contact support before trying again."
      }
      existingApplications = saved as Array<Record<string, unknown>>
    } catch {
      return "Saved application data could not be read. Please contact support before trying again."
    }

    const profileData = {
      name: session.name,
      email: session.email,
      phone: "",
      location: profile.location,
      title: profile.role,
      shortBio: profile.shortBio,
      story: "",
      photoFilename: profile.photoFilename,
    }
    const application = {
      businessName: business.name,
      industry: business.industry,
      foundedYear: business.foundedYear,
      location: business.location,
      description: business.description,
      proofFilename: business.proofFilename,
      accountId: session.accountId,
      applicantName: session.name,
      applicantEmail: session.email,
      submittedAt: new Date().toISOString(),
      status: "Submitted in prototype",
    }
    const previousProfile = localStorage.getItem(profileKey)
    const previousAccountType = localStorage.getItem(accountTypeKey)
    try {
      localStorage.setItem(profileKey, JSON.stringify(profileData))
      localStorage.setItem(applicationKey, JSON.stringify([...existingApplications, application]))
      localStorage.setItem(accountTypeKey, "founder")
      sessionStorage.removeItem(`founders:demo:founder-registration-draft:${session.accountId}`)
    } catch {
      try {
        if (previousProfile === null) localStorage.removeItem(profileKey)
        else localStorage.setItem(profileKey, previousProfile)
        if (previousAccountType === null) localStorage.removeItem(accountTypeKey)
        else localStorage.setItem(accountTypeKey, previousAccountType)
        localStorage.setItem(applicationKey, JSON.stringify(existingApplications))
      } catch {
        return "Founder registration may be incomplete. Please sign in again and check your profile before retrying."
      }
      return "Founder registration could not be saved. Please try again."
    }
    window.location.assign(getAccountPath(session, "dashboard"))
    return null
  }

  async function submitBusinessApplication(application: BusinessApplicationData, registration?: RegistrationData) {
    let applicant = session
    let newlyCreatedAccount = false
    if (!applicant && registration) {
      const result = await createAccount(registration)
      if (result.error || !result.session) return result.error ?? "Your account could not be created."
      applicant = result.session
      newlyCreatedAccount = true
    }
    if (!applicant) return "Sign in or create an account to submit your business application."

    const key = "founders:demo:business-applications"
    let existing: Array<Record<string, unknown>>
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown
      if (!Array.isArray(saved)) return "Saved application data is invalid. Please contact support before trying again."
      existing = saved as Array<Record<string, unknown>>
    } catch {
      return "Saved application data could not be read. Please contact support before trying again."
    }
    try {
      localStorage.setItem(key, JSON.stringify([...existing, {
        ...application,
        accountId: applicant.accountId,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
        submittedAt: new Date().toISOString(),
        status: "Submitted in prototype",
      }]))
      if (newlyCreatedAccount) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(applicant))
    } catch {
      return "Your application could not be saved in this browser. If you just created an account, sign in and try again."
    }
    if (newlyCreatedAccount) setSession(applicant)
    return null
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoginMessage("")
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "").trim().toLowerCase()
    const password = String(form.get("password") ?? "")
    const account = readAccounts().find(candidate => candidate.email === email)
    if (!account || await hashPassword(password, account.passwordSalt) !== account.passwordHash) { setLoginMessage("The email or password is incorrect."); return }
    const nextSession = { accountId: account.id, name: account.name, email: account.email }
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession)); setSession(nextSession)
    const next = new URLSearchParams(window.location.search).get("next")
    window.location.assign(next === "/business-registration" || next === "/founder-registration"
      ? next
      : hasFounderAccess(nextSession) ? getAccountPath(nextSession, "dashboard") : "/home")
  }

  function logout() { localStorage.removeItem(AUTH_SESSION_KEY); setSession(null); window.location.assign("/home") }
  useEffect(() => {
    if (pathname === "/founder-registration") {
      if (!session) {
        window.location.replace("/login?next=%2Ffounder-registration")
        return
      }
      if (isFounder) {
        window.location.replace(getAccountPath(session, "dashboard"))
        return
      }
    }
    if (communityDetailRoute) {
      if (!session) {
        window.location.replace("/login")
        return
      }
      if (!isFounder) {
        window.location.replace("/founder-registration")
        return
      }
      if (communityDetailRoute[1] !== getAccountSlug(session)) {
        window.location.replace(`${getAccountPath(session, "communities")}/${communityDetailRoute[2]}`)
      }
      return
    }
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
    if (!isFounder) {
      window.location.replace("/founder-registration")
      return
    }
    if (accountRoute.slug !== getAccountSlug(session)) {
      window.location.replace(getAccountPath(session, accountRoute.section))
    }
  }, [accountRoute?.slug, accountRoute?.section, communityDetailRoute?.[1], communityDetailRoute?.[2], isFounder, pathname, session])

  let page
  if (accountRoute?.section === "dashboard") page = session && isFounder ? <DashboardPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "posts") page = session && isFounder ? <PostsPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "profile") page = session && isFounder ? <ProfilePage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "businesses") page = session && isFounder ? <BusinessesPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "communities") page = session && isFounder ? <CommunitiesPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "messages") page = session && isFounder ? <MessagesPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "settings") page = session && isFounder ? <SettingsPage session={session} onLogout={logout} /> : null
  else if (accountRoute?.section === "verification") page = session && isFounder ? <AccountVerificationPage session={session} onLogout={logout} /> : null
  else if (pathname === "/register") page = <RegisterPage onSubmit={register} />
  else if (pathname === "/business-registration") page = <BusinessRegistrationPage session={session} onSubmit={submitBusinessApplication} />
  else if (pathname === "/login") page = <LoginPage onSubmit={login} message={loginMessage} />
  else if (pathname === "/directory") page = <DirectoryPage />
  else if (/^\/founder\/[^/]+$/.test(pathname)) page = <FounderProfilePage founderId={pathname.split("/")[2]} canParticipate={isFounder} />
  else if (/^\/business\/[^/]+$/.test(pathname)) page = <BusinessProfilePage businessId={pathname.split("/")[2]} />
  else if (pathname === "/contact") page = <ContactPage />
  else if (pathname === "/about") page = <AboutPage />
  else if (pathname === "/verification") page = <VerificationPage />
  else page = <HomePage />

  if (accountRoute?.section === "dashboard" && session && isFounder) {
    return <DashboardPage session={session} onLogout={logout} />
  }
  if (accountRoute?.section === "profile" && session && isFounder) return <ProfilePage session={session} onLogout={logout} />
  if (accountRoute?.section === "businesses" && session && isFounder) return <BusinessesPage session={session} onLogout={logout} />
  if (accountRoute?.section === "communities" && session && isFounder) return <CommunitiesPage session={session} onLogout={logout} />
  if (accountRoute?.section === "messages" && session && isFounder) return <MessagesPage session={session} onLogout={logout} />
  if (accountRoute?.section === "verification" && session && isFounder) return <AccountVerificationPage session={session} onLogout={logout} />
  if (accountRoute?.section === "posts" && session && isFounder) {
    return <PostsPage session={session} onLogout={logout} />
  }
  if (accountRoute?.section === "settings" && session && isFounder) {
    return <SettingsPage session={session} onLogout={logout} />
  }
  if (communityDetailRoute && session && isFounder) {
    return <CommunityDetailPage session={session} onLogout={logout} communityId={communityDetailRoute[2]} />
  }
  if (pathname === "/register") return <RegisterPage onSubmit={register} />
  if (pathname === "/founder-registration" && session && !isFounder) {
    return <FounderRegistrationPage session={session} onSubmit={completeFounderRegistration} />
  }

  return (
    <div className="app">
      <Header activePath={activePath} session={session} onLogout={logout} isFounder={isFounder} />
      <main>{page}</main>
      <Footer />
    </div>
  )
}
