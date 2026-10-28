import { FormEvent, useState } from "react"
import type { AuthSession } from "../../components"
import { Localized } from "../../language"
import { AppLink, Icon } from "../../site"
import { getAccountPath } from "../../accountRoutes"
import type { RegistrationData } from "../auth/AuthPages"

export type BusinessApplicationData = {
  businessName: string
  industry: string
  foundedYear: string
  location: string
  description: string
  proofFilename: string
}

type Props = {
  session: AuthSession | null
  onSubmit: (application: BusinessApplicationData, registration?: RegistrationData) => Promise<string | null>
}

const draftKey = "founders:demo:business-application-draft"
const draftStepKey = "founders:demo:business-application-step"
const initialApplication: BusinessApplicationData = {
  businessName: "",
  industry: "",
  foundedYear: "",
  location: "",
  description: "",
  proofFilename: "",
}

function readDraft(): BusinessApplicationData {
  try {
    const saved = sessionStorage.getItem(draftKey)
    return saved ? { ...initialApplication, ...JSON.parse(saved) as Partial<BusinessApplicationData> } : initialApplication
  } catch {
    return initialApplication
  }
}

function readStep(session: AuthSession | null) {
  try {
    const savedStep = Number(sessionStorage.getItem(draftStepKey))
    if (!Number.isInteger(savedStep) || savedStep < 1 || savedStep > 3) return 1
    return session ? Math.min(savedStep, 2) : savedStep
  } catch {
    return 1
  }
}

export function BusinessRegistrationPage({ session, onSubmit }: Props) {
  const [application, setApplication] = useState<BusinessApplicationData>(readDraft)
  const [account, setAccount] = useState({ name: session?.name ?? "", email: session?.email ?? "", password: "", confirmation: "" })
  const [step, setStep] = useState(() => readStep(session))
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cleanupWarning, setCleanupWarning] = useState(false)
  const stepCount = session ? 2 : 3

  function updateApplication(field: keyof BusinessApplicationData, value: string) {
    const updated = { ...application, [field]: value }
    setApplication(updated)
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(updated))
    } catch {
      setMessage("Your draft could not be saved in this browser. Keep this page open while you complete the application.")
      return
    }
    setMessage("")
  }

  function updateAccount(field: keyof typeof account, value: string) {
    setAccount(current => ({ ...current, [field]: value }))
    setMessage("")
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    const registration = session ? undefined : {
      ...account,
      email: account.email.trim(),
    }
    if (registration && registration.password !== registration.confirmation) {
      setMessage("Passwords do not match.")
      return
    }
    setSubmitting(true)
    try {
      const error = await onSubmit(application, registration)
      if (error) {
        setMessage(error)
        return
      }
      try {
        sessionStorage.removeItem(draftKey)
        sessionStorage.removeItem(draftStepKey)
      } catch {
        setCleanupWarning(true)
      }
      setSubmitted(true)
    } catch {
      setMessage("We could not save your application in this browser. Please try again or sign in to continue.")
    } finally {
      setSubmitting(false)
    }
  }

  const headings = session
    ? ["Business profile", "Documents & submit"]
    : ["Business profile", "Documents", "Account & submit"]

  function goToStep(nextStep: number) {
    setStep(nextStep)
    try {
      sessionStorage.setItem(draftStepKey, String(nextStep))
    } catch {
      setMessage("Your progress could not be saved in this browser. Keep this page open while you continue.")
    }
  }

  return <Localized><section className="section business-registration-page">
    <div className="business-registration-content">
      {submitted ? <div className="business-application-success" role="status">
        <span><Icon name="check" /></span>
        <p className="section-label">Application prepared</p>
        <h1>Thank you, {session?.name ?? account.name}.</h1>
        <p>Your business application is saved in this browser prototype. No documents or application details have been sent to a review team.</p>
        {cleanupWarning && <p role="status">Your application is prepared, but this browser could not clear the saved draft.</p>}
        {session && <AppLink href={getAccountPath(session, "dashboard")} className="business-registration-back">Go to your account<Icon name="arrow" /></AppLink>}
      </div> : <>
        <AppLink href="/home" className="business-registration-back"><Icon name="arrow" />Back to Founders</AppLink>
        <header className="business-registration-heading">
          <span className="section-label">Business registration</span>
          <h1>Apply to verify your business</h1>
          <p>Share your business details and choose a supporting document. Your application is private.</p>
        </header>
        <ol className="business-registration-progress" aria-label="Business application progress" style={{ gridTemplateColumns: `repeat(${headings.length}, minmax(0, 1fr))` }}>
          {headings.map((title, index) => <li key={title} className={index + 1 <= step ? "complete" : ""} aria-current={index + 1 === step ? "step" : undefined}><span>{index + 1}</span><small>{title}</small></li>)}
        </ol>
        {step === 1 && <form className="business-registration-form" onSubmit={event => { event.preventDefault(); goToStep(2) }}>
          <div className="register-field-grid">
            <label>Business name<input value={application.businessName} onChange={event => updateApplication("businessName", event.target.value)} required /></label>
            <label>Industry<input value={application.industry} onChange={event => updateApplication("industry", event.target.value)} required /></label>
            <label>Founded year<input type="number" min="1800" max={new Date().getFullYear()} value={application.foundedYear} onChange={event => updateApplication("foundedYear", event.target.value)} /></label>
            <label>Business location<input value={application.location} onChange={event => updateApplication("location", event.target.value)} placeholder="Yangon" required /></label>
            <label className="register-field-wide">Business description<textarea value={application.description} onChange={event => updateApplication("description", event.target.value)} rows={4} required /></label>
          </div>
          <div className="business-registration-actions"><span>Step 1 of {stepCount}</span><button type="submit" className="register-primary">Continue<Icon name="arrow" /></button></div>
        </form>}
        {step === 2 && <form className="business-registration-form" onSubmit={session ? submit : event => { event.preventDefault(); goToStep(3) }}>
          <label className="register-upload">
            <Icon name="document" />
            <strong>{application.proofFilename || "Choose a business proof document"}</strong>
            <small>PDF, PNG, or JPG · prototype records the filename only</small>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" required={!application.proofFilename} onChange={event => updateApplication("proofFilename", event.target.files?.[0]?.name ?? "")} />
          </label>
          <p className="register-private-note"><Icon name="shield" />This prototype only records the selected filename. It does not upload documents or send an application.</p>
          {message && <p className="login-message" role="alert">{message}</p>}
          <div className="business-registration-actions"><button type="button" className="register-secondary" onClick={() => goToStep(1)}>Back</button><span>Step 2 of {stepCount}</span><button type="submit" className="register-primary">{session ? "Submit application" : "Continue"}<Icon name="arrow" /></button></div>
        </form>}
        {!session && step === 3 && <form className="business-registration-form" onSubmit={submit}>
          <p className="business-registration-account-note">Create an account to save this application. Already registered? <AppLink href="/login?next=%2Fbusiness-registration">Sign in and continue</AppLink>.</p>
          <div className="register-field-grid">
            <label>Full name<input autoComplete="name" value={account.name} onChange={event => updateAccount("name", event.target.value)} minLength={2} required /></label>
            <label>Email address<input type="email" autoComplete="email" value={account.email} onChange={event => updateAccount("email", event.target.value)} required /></label>
            <label>Password<input type="password" autoComplete="new-password" value={account.password} onChange={event => updateAccount("password", event.target.value)} minLength={8} required /></label>
            <label>Confirm password<input type="password" autoComplete="new-password" value={account.confirmation} onChange={event => updateAccount("confirmation", event.target.value)} minLength={8} required /></label>
          </div>
          {message && <p className="login-message" role="alert">{message}{message.includes("already exists") && <> <AppLink href="/login?next=%2Fbusiness-registration">Sign in to continue</AppLink></>}</p>}
          <div className="business-registration-actions"><button type="button" className="register-secondary" onClick={() => goToStep(2)}>Back</button><span>Step 3 of {stepCount}</span><button type="submit" className="register-primary" disabled={submitting}>{submitting ? "Submitting…" : "Create account & submit"}<Icon name="arrow" /></button></div>
        </form>}
      </>}
    </div>
  </section></Localized>
}
