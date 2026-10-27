import { FormEvent, useState } from "react"
import { AppLink, Icon } from "../../site"
import { Localized } from "../../language"

export function ContactPage() {
  const [message, setMessage] = useState("")
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("This demo contact form isn’t connected yet. Please email support@myanmarfoundermm.com.")
  }
  return <Localized><section className="contact-page"><div className="contact-hero"><div className="shell contact-hero-inner"><span className="section-label">We’re here to help</span><h1>Let’s start a conversation.</h1><p>Have a question about a founder profile, verification, or partnering with us? Reach out to the Founders team.</p></div></div>
    <div className="shell contact-content"><div className="contact-info"><span className="section-label">Get in touch</span><h2>How can we help?</h2><p>Choose the best way to reach us, or send a message using the form.</p><a className="contact-card" href="mailto:support@myanmarfoundermm.com"><span className="contact-card-icon"><Icon name="document" /></span><span><small>Email our team</small><strong>support@myanmarfoundermm.com</strong></span><Icon name="arrow" /></a><div className="contact-note"><span className="verification-icon"><Icon name="shield" /></span><div><h3>Questions about verification?</h3><p>Learn how we review founder identities and businesses.</p><AppLink href="/verification" className="text-link">Explore the process <Icon name="arrow" /></AppLink></div></div></div>
      <div className="contact-form-panel"><h2>Send us a message</h2><p>Fill in the details below and tell us how we can help.</p><form className="contact-form" onSubmit={submit}><div className="contact-form-row"><div className="contact-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="Name" required /></div><div className="contact-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></div></div><div className="contact-field"><label htmlFor="contact-subject">What’s this about?</label><select id="contact-subject" name="subject" defaultValue="" required><option value="" disabled>Select a topic</option><option>Founder profile</option><option>Verification</option><option>Partnership</option><option>Other question</option></select></div><div className="contact-field"><label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" rows={5} placeholder="Tell us a little about how we can help..." required /></div><button className="contact-submit" type="submit">Send message<Icon name="arrow" /></button>{message && <p className="contact-message" role="status">{message}</p>}</form></div>
    </div></section></Localized>
}
