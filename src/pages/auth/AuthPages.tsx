import { FormEvent, useState } from "react"
import { AppLink, Icon } from "../../site"
import { Localized } from "../../language"

export type RegistrationData = {
  name: string
  email: string
  password: string
  confirmation: string
  role: string
  location: string
  shortBio: string
  businessName: string
  industry: string
  foundedYear: string
  businessLocation: string
  businessDescription: string
  proofFilename: string
}

export function LoginPage({ onSubmit, message }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; message: string }) {
  return <Localized><section className="section login-page"><div className="login-content"><div className="login-heading"><span className="login-heading-icon"><Icon name="login" /></span><span className="section-label">Welcome back</span><h1>Sign in to access your account</h1></div><div className="login-panel"><form className="login-form" onSubmit={onSubmit}>
    <label htmlFor="login-email">Email or phone number <span aria-hidden="true">*</span></label><div className="login-input-wrap"><Icon name="document" /><input id="login-email" name="email" type="text" autoComplete="username" placeholder="Enter your email or phone number" required /></div>
    <label htmlFor="login-password">Password <span aria-hidden="true">*</span></label><div className="login-input-wrap"><Icon name="shield" /><input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required /></div>
    <button className="login-submit" type="submit">Sign in</button>{message && <p className="login-message" role="status">{message}</p>}<p className="login-create">Don’t have an account? <AppLink href="/register">Create account</AppLink></p>
  </form></div><p className="login-security">Your information is encrypted and secure.</p></div></section></Localized>
}

export function RegisterPage({ onSubmit, message }: { onSubmit: (data: RegistrationData) => void; message: string }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<RegistrationData>({
    name: "",
    email: "",
    password: "",
    confirmation: "",
    role: "Founder & CEO",
    location: "Yangon",
    shortBio: "",
    businessName: "",
    industry: "",
    foundedYear: "",
    businessLocation: "Yangon",
    businessDescription: "",
    proofFilename: "",
  })
  const [formMessage, setFormMessage] = useState("")

  function updateForm(event: FormEvent<HTMLFormElement>, nextStep?: number) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values = Object.fromEntries(formData.entries())
    setData(current => ({ ...current, ...values } as RegistrationData))
    setFormMessage("")
    if (nextStep) {
      if (step === 1 && values.password !== values.confirmation) {
        setFormMessage("Passwords do not match.")
        return
      }
      setStep(nextStep)
    }
  }

  function goBack() {
    setFormMessage("")
    setStep(current => Math.max(1, current - 1))
  }

  const stepTitles = ["Account", "Founder profile", "Business", "Verification"]
  const initials = data.name.trim().split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join("").toUpperCase() || "YO"

  return <Localized><section className="register-wizard">
    <aside className="register-story">
      <AppLink href="/home" className="register-back"><Icon name="arrow" />Back to Founders</AppLink>
      <div className="register-story-copy"><span>Create your profile</span><h1>Start with who you are. Build from there.</h1><p>Your draft stays in this browser while you move through the four short steps.</p></div>
      <blockquote><Icon name="sparkles" /><p>“A trusted founder profile makes the first introduction easier.”</p></blockquote>
    </aside>
    <div className="register-workspace">
      <div className="register-content">
        <ol className="register-progress" aria-label="Registration progress">{stepTitles.map((title, index) => <li key={title} className={index + 1 <= step ? "complete" : ""} aria-current={index + 1 === step ? "step" : undefined}><span>{index + 1 < step ? <Icon name="check" /> : index + 1}</span><small>{title}</small></li>)}</ol>
        <div className="register-step-heading"><span>Step {step} of 4 · {stepTitles[step - 1]}</span><h2>{["Create your account", "Tell founders who you are", "Introduce your business", "Build trust through verification"][step - 1]}</h2><p>{["Set up your sign-in details to get started.", "Keep it specific and human. This information will appear on your public profile.", "Add enough context for people to understand what you are building.", "Business proof is reviewed privately. It never appears in the directory or on your public profile."][step - 1]}</p></div>

        {step === 1 && <form className="register-step-form register-account-form" onSubmit={event => updateForm(event, 2)}>
          <label>Full name<input name="name" autoComplete="name" value={data.name} onChange={event => setData(current => ({ ...current, name: event.target.value }))} placeholder="Enter your full name" minLength={2} required /></label>
          <label>Email or phone number<input name="email" type="text" autoComplete="username" value={data.email} onChange={event => setData(current => ({ ...current, email: event.target.value }))} placeholder="Enter your email or phone number" required /></label>
          <label>Password<input name="password" type="password" autoComplete="new-password" value={data.password} onChange={event => setData(current => ({ ...current, password: event.target.value }))} minLength={8} placeholder="At least 8 characters" required /></label>
          <label>Confirm password<input name="confirmation" type="password" autoComplete="new-password" value={data.confirmation} onChange={event => setData(current => ({ ...current, confirmation: event.target.value }))} minLength={8} placeholder="Re-enter your password" required /></label>
          <p className="login-create">Already have an account? <AppLink href="/login">Sign in</AppLink></p>
          <button type="submit" className="register-primary">Save &amp; continue<Icon name="arrow" /></button>
        </form>}

        {step === 2 && <form className="register-step-form" onSubmit={event => updateForm(event, 3)}>
          <div className="register-photo-row"><span className="register-avatar">{initials}</span><label className="register-photo-button">Choose photo<input type="file" accept="image/*" /></label></div>
          <div className="register-field-grid"><label>Full name<input name="name" value={data.name} onChange={event => setData(current => ({ ...current, name: event.target.value }))} required /></label><label>Role<input name="role" value={data.role} onChange={event => setData(current => ({ ...current, role: event.target.value }))} placeholder="Founder & CEO" /></label><label>Location<input name="location" value={data.location} onChange={event => setData(current => ({ ...current, location: event.target.value }))} placeholder="Yangon" /></label><label className="register-field-wide">Short bio<textarea name="shortBio" value={data.shortBio} onChange={event => setData(current => ({ ...current, shortBio: event.target.value }))} rows={4} /></label></div>
          <div className="register-step-actions"><button type="button" className="register-secondary" onClick={goBack}>Back</button><button type="submit" className="register-primary">Save &amp; continue<Icon name="arrow" /></button></div>
        </form>}

        {step === 3 && <form className="register-step-form" onSubmit={event => updateForm(event, 4)}>
          <div className="register-field-grid"><label>Business name<input name="businessName" value={data.businessName} onChange={event => setData(current => ({ ...current, businessName: event.target.value }))} required /></label><label>Industry<input name="industry" value={data.industry} onChange={event => setData(current => ({ ...current, industry: event.target.value }))} required /></label><label>Founded year<input name="foundedYear" type="number" min="1800" max={new Date().getFullYear()} value={data.foundedYear} onChange={event => setData(current => ({ ...current, foundedYear: event.target.value }))} /></label><label>Location<input name="businessLocation" value={data.businessLocation} onChange={event => setData(current => ({ ...current, businessLocation: event.target.value }))} placeholder="Yangon" /></label><label className="register-field-wide">Business description<textarea name="businessDescription" value={data.businessDescription} onChange={event => setData(current => ({ ...current, businessDescription: event.target.value }))} rows={5} /></label></div>
          <div className="register-step-actions"><button type="button" className="register-secondary" onClick={goBack}>Back</button><button type="submit" className="register-primary">Save &amp; continue<Icon name="arrow" /></button></div>
        </form>}

        {step === 4 && <form className="register-step-form" onSubmit={event => { event.preventDefault(); onSubmit(data) }}>
          <label className="register-upload"> <Icon name="document" /><strong>{data.proofFilename || "Choose a business proof document"}</strong><small>PDF, PNG, or JPG · filename stays in this browser</small><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={event => setData(current => ({ ...current, proofFilename: event.target.files?.[0]?.name ?? "" }))} /></label>
          <p className="register-private-note"><Icon name="shield" />No file is actually uploaded in this prototype. Only the filename is shown locally.</p>
          {message && <p className="login-message" role="status">{message}</p>}
          <div className="register-step-actions"><button type="button" className="register-secondary" onClick={goBack}>Back</button><button type="submit" className="register-primary">Create founder profile<Icon name="arrow" /></button></div>
        </form>}
        {formMessage && <p className="login-message" role="alert">{formMessage}</p>}
      </div>
    </div>
  </section></Localized>
}
