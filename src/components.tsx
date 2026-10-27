import { useEffect, useState } from "react"
import { AppLink, Icon } from "./site"
import { LanguageSwitch, Localized } from "./language"

export type AuthSession = { accountId: string; name: string; email: string }
export const navItems = [["Home", "/home"], ["Directory", "/directory"], ["About", "/about"], ["Verification", "/verification"], ["Contact", "/contact"]]

export function Header({ activePath, session, onLogout }: { activePath: string; session: AuthSession | null; onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24)
    const resize = () => setDesktop(window.innerWidth >= 768)
    scroll(); resize()
    window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", resize)
    return () => { window.removeEventListener("scroll", scroll); window.removeEventListener("resize", resize) }
  }, [])
  return <Localized><header className={`site-header${scrolled ? " is-scrolled" : ""}`} style={scrolled ? { padding: desktop ? "6px 0 20px" : "4px 0 16px", backgroundColor: "#fff", boxShadow: "0 8px 20px rgba(13,27,42,.08)" } : undefined}>
    <div className="shell header-inner" style={scrolled ? { height: desktop ? 54 : 52, backgroundColor: "#fff", boxShadow: "none" } : undefined}>
      <AppLink href="/home" className="wordmark" aria-label="Founders home"><span>founders</span></AppLink>
      <nav className="desktop-nav" aria-label="Primary navigation">{navItems.map(([label, href]) => <AppLink key={href} href={href} className={href === activePath ? "active" : ""}>{label}</AppLink>)}</nav>
      <LanguageSwitch compact />
      {session ? <button type="button" className="login-button account-button" onClick={onLogout} title={`Sign out ${session.name}`}><Icon name="user" className="size-4" />Join founders</button> : <AppLink href="/login" className="login-button">Login</AppLink>}
      <button className="menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? "x" : "menu"} className="size-6" /></button>
    </div>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(([label, href]) => <AppLink key={href} href={href} className={href === activePath ? "active" : ""}>{label}</AppLink>)}{session ? <button type="button" className="button button-primary" onClick={onLogout}>Sign out<Icon name="arrow" /></button> : <AppLink href="/login" className="button button-primary">Login<Icon name="arrow" /></AppLink>}</nav>}
  </header></Localized>
}

export function Footer() {
  return <Localized><footer><div className="shell footer-grid">
    <div className="footer-brand"><AppLink href="/home" className="wordmark wordmark-footer"><span>founders</span></AppLink><p>Your trusted source for verified business founders and authentic entrepreneurial profiles.</p></div>
    <div><h3>Quick links</h3><AppLink href="/home">Home</AppLink><AppLink href="/directory">Directory</AppLink><AppLink href="/about">About us</AppLink></div>
    <div><h3>Resources</h3><AppLink href="/verification">Verification process</AppLink><AppLink href="/login">Submit a founder</AppLink><AppLink href="/contact">Contact us</AppLink></div>
    <div><h3>Contact</h3><a href="mailto:support@myanmarfoundermm.com">support@myanmarfoundermm.com</a><a href="https://www.facebook.com/MyanmarOnlineEntrepreneur">Facebook</a><a href="https://www.tiktok.com/@myanmaronlinentrepreneur">TikTok</a></div>
  </div><div className="shell footer-bottom"><span>© 2025 Founders. All rights reserved.</span><span>Verified founders. Stronger connections.</span></div></footer></Localized>
}
