import { FormEvent, useState } from "react"
import type { AuthSession } from "../../components"
import { AppLink, Icon } from "../../site"
import { Localized } from "../../language"

export type RegistrationData = {
  name: string
  email: string
  password: string
  confirmation: string
}

export type FounderProfileDraft = {
  role: string
  location: string
  shortBio: string
  photoFilename: string
}

export type FounderBusinessDraft = {
  name: string
  industry: string
  foundedYear: string
  location: string
  description: string
  proofFilename: string
}

type FounderDraft = { profile: FounderProfileDraft; business: FounderBusinessDraft }
function getFounderDraftKey(accountId: string) {
  return `founders:demo:founder-registration-draft:${accountId}`
}

function readFounderDraft(accountId: string): FounderDraft {
  const empty: FounderDraft = {
    profile: { role: "", location: "", shortBio: "", photoFilename: "" },
    business: { name: "", industry: "", foundedYear: "", location: "", description: "", proofFilename: "" },
  }
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(getFounderDraftKey(accountId)) ?? "null")
    if (typeof saved !== "object" || saved === null) return empty
    const value = saved as Partial<FounderDraft>
    return {
      profile: { ...empty.profile, ...value.profile },
      business: { ...empty.business, ...value.business },
    }
  } catch {
    return empty
  }
}

export function LoginPage({ onSubmit, message }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; message: string }) {
  return <Localized><section className="section login-page"><div className="login-content"><div className="login-heading"><span className="login-heading-icon"><Icon name="login" /></span><span className="section-label">Welcome back</span><h1>Sign in to access your account</h1></div><div className="login-panel"><form className="login-form" onSubmit={onSubmit}>
    <label htmlFor="login-email">Email or phone number <span aria-hidden="true">*</span></label><div className="login-input-wrap"><Icon name="document" /><input id="login-email" name="email" type="text" autoComplete="username" placeholder="Enter your email or phone number" required /></div>
    <label htmlFor="login-password">Password <span aria-hidden="true">*</span></label><div className="login-input-wrap"><Icon name="shield" /><input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required /></div>
    <button className="login-submit" type="submit">Sign in</button>{message && <p className="login-message" role="status">{message}</p>}<p className="login-create">Don’t have an account? <AppLink href="/register">Create account</AppLink></p>
  </form></div><p className="login-security">Your information is encrypted and secure.</p></div></section></Localized>
}

export function RegisterPage({ onSubmit }: { onSubmit: (data: RegistrationData) => Promise<string | null> }) {
  const [formMessage, setFormMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const data = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      confirmation: String(form.get("confirmation") ?? ""),
    }
    if (data.password !== data.confirmation) {
      setFormMessage("Passwords do not match.")
      return
    }
    setSubmitting(true)
    setFormMessage("")
    try {
      const error = await onSubmit(data)
      if (error) setFormMessage(error)
    } catch {
      setFormMessage("Your account could not be created. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return <Localized><section className="section login-page"><div className="login-content">
    <div className="login-heading"><span className="login-heading-icon"><Icon name="user" /></span><span className="section-label">Create an account</span><h1>Explore the founder community</h1><p>Sign up to browse the site. Founder tools are available after founder registration.</p></div>
    <div className="login-panel"><form className="login-form" onSubmit={submitRegistration}>
      <label htmlFor="register-name">Full name <span aria-hidden="true">*</span></label><div className="login-input-wrap"><Icon name="user" /><input id="register-name" name="name" autoComplete="name" placeholder="Enter your full name" minLength={2} required /></div>
      <label htmlFor="register-email">Email address <span aria-hidden="true">*</span></label><div className="login-input-wrap"><Icon name="document" /><input id="register-email" name="email" type="email" autoComplete="email" placeholder="Enter your email address" required /></div>
      <label htmlFor="register-password">Password <span aria-hidden="true">*</span></label><div className="login-input-wrap"><Icon name="shield" /><input id="register-password" name="password" type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required /></div>
      <label htmlFor="register-confirmation">Confirm password <span aria-hidden="true">*</span></label><div className="login-input-wrap"><Icon name="shield" /><input id="register-confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={8} placeholder="Re-enter your password" required /></div>
      {formMessage && <p className="login-message" role="alert">{formMessage}</p>}
      <button className="login-submit" type="submit" disabled={submitting}>{submitting ? "Creating account..." : "Create account"}</button>
      <p className="login-create">Already have an account? <AppLink href="/login">Sign in</AppLink></p>
      <p className="login-create">Want to participate as a founder? <AppLink href="/founder-registration">Complete founder registration</AppLink></p>
    </form></div>
  </div></section></Localized>
}

export function FounderRegistrationPage({ session, onSubmit }: {
  session: AuthSession
  onSubmit: (profile: FounderProfileDraft, business: FounderBusinessDraft) => Promise<string | null>
}) {
  const [draft] = useState(() => readFounderDraft(session.accountId))
  const [profile, setProfile] = useState(draft.profile)
  const [business, setBusiness] = useState(draft.business)
  const [step, setStep] = useState(1)
  const [formMessage, setFormMessage] = useState("")
  const [draftWarning, setDraftWarning] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function persistDraft(nextProfile = profile, nextBusiness = business) {
    try {
      sessionStorage.setItem(getFounderDraftKey(session.accountId), JSON.stringify({ profile: nextProfile, business: nextBusiness }))
      setDraftWarning("")
    } catch {
      setDraftWarning("Your details could not be saved in this browser. Keep this page open while you complete the steps.")
    }
  }

  function updateProfile(field: keyof FounderProfileDraft, value: string) {
    const next = { ...profile, [field]: value }
    setProfile(next)
    persistDraft(next)
  }

  function updateBusiness(field: keyof FounderBusinessDraft, value: string) {
    const next = { ...business, [field]: value }
    setBusiness(next)
    persistDraft(profile, next)
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage("")
    if (step < 4) {
      setStep(current => current + 1)
      return
    }
    setSubmitting(true)
    try {
      const error = await onSubmit(profile, business)
      if (error) setFormMessage(error)
    } catch {
      setFormMessage("Your founder registration could not be saved. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const steps = ["Account", "Founder profile", "Business", "Verification"]
  const initials = session.name.trim().split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join("").toUpperCase() || "F"

  return <Localized><section className="register-wizard">
    <aside className="register-story">
      <AppLink href="/home" className="register-back"><Icon name="arrow" />Back to Founders</AppLink>
      <div className="register-story-copy"><span>Founder registration</span><h1>Turn your account into a founder profile.</h1><p>Complete your profile, business details, and verification information to participate in the founder community.</p></div>
      <blockquote><Icon name="sparkles" /><p>“A trusted founder profile makes the first introduction easier.”</p></blockquote>
    </aside>
    <div className="register-workspace">
      <div className="register-content">
        <ol className="register-progress" aria-label="Founder registration progress">
          {steps.map((title, index) => <li key={title} className={index + 1 <= step ? "complete" : ""} aria-current={index + 1 === step ? "step" : undefined}><span>{index + 1}</span><small>{title}</small></li>)}
        </ol>
        <header className="register-step-heading">
          <span>Step {step} of 4 · {steps[step - 1]}</span>
          <h2>{["Your account", "Tell founders who you are", "Introduce your business", "Build trust through verification"][step - 1]}</h2>
          <p>{[
            "You’re signed in as " + session.name + "  (" + session.email + "). Continue to create your founder profile.",
            "Keep it specific and human. This information will appear on your founder profile.",
            "Add enough context for people to understand what you are building.",
            "Business proof is kept private. The prototype only records the selected filename.",
          ][step - 1]}</p>
        </header>
        <form className="register-step-form register-account-form" onSubmit={submitRegistration}>
          {step === 1 && <div className="register-step-account"><span className="register-avatar">{initials}</span><div>
            <strong>{session.name}</strong><br /><small>{session.email}</small></div></div>}
          {step === 2 && <>
            <div className="register-photo-row"><span className="register-avatar">{initials}</span><label className="register-photo-button">{profile.photoFilename || "Choose photo"}<input type="file" accept="image/*" onChange={event => updateProfile("photoFilename", event.target.files?.[0]?.name ?? "")} /></label></div>
            <div className="register-field-grid">
              <label>Full name<input value={session.name} readOnly /></label>
              <label>Role<input value={profile.role} onChange={event => updateProfile("role", event.target.value)} placeholder="Founder" required /></label>
              <label>Location<input value={profile.location} onChange={event => updateProfile("location", event.target.value)} placeholder="Yangon" required /></label>
              <label className="register-field-wide">Short bio<textarea value={profile.shortBio} onChange={event => updateProfile("shortBio", event.target.value)} rows={3} required /></label>
            </div>
          </>}
          {step === 3 && <div className="register-field-grid">
            <label>Business name<input value={business.name} onChange={event => updateBusiness("name", event.target.value)} required /></label>
            <label>Industry<input value={business.industry} onChange={event => updateBusiness("industry", event.target.value)} required /></label>
            <label>Founded year<input type="number" min="1800" max={new Date().getFullYear()} value={business.foundedYear} onChange={event => updateBusiness("foundedYear", event.target.value)} /></label>
            <label>Location<input value={business.location} onChange={event => updateBusiness("location", event.target.value)} required /></label>
            <label className="register-field-wide">Business description<textarea value={business.description} onChange={event => updateBusiness("description", event.target.value)} rows={4} required /></label>
          </div>}
          {step === 4 && <>
            <label className="register-upload">
              <Icon name="document" />
              <strong>{business.proofFilename || "Choose a business proof document"}</strong>
              <small>PDF, PNG, or JPG · prototype records the filename only</small>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" required={!business.proofFilename} onChange={event => updateBusiness("proofFilename", event.target.files?.[0]?.name ?? "")} />
            </label>
            <p className="register-private-note"><Icon name="shield" />No file is uploaded in this prototype. Only the filename is saved locally.</p>
          </>}
          {draftWarning && <p className="login-message" role="status">{draftWarning}</p>}
          {formMessage && <p className="login-message" role="alert">{formMessage}</p>}
          <div className="register-step-actions">
            {step > 1 ? <button type="button" className="register-secondary" onClick={() => { setFormMessage(""); setStep(current => current - 1) }}>Back</button> : <span />}
            <span>Step {step} of 4</span>
            <button type="submit" className="register-primary" disabled={submitting}>{submitting ? "Saving profile..." : step === 4 ? "Complete founder registration" : "Save & continue"}<Icon name="arrow" /></button>
          </div>
        </form>
      </div>
    </div>
  </section></Localized>
}
