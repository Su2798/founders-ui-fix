import { AnchorHTMLAttributes, ReactNode } from "react"

export type IconName = "arrow" | "building" | "check" | "comment" | "database" | "document" | "heart" | "login" | "menu" | "search" | "shield" | "sparkles" | "user" | "x"

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    building: <><path d="M3 21h18" /><path d="M6 21V5l6-2v18" /><path d="M18 21V9l-6-2" /><path d="M9 9h.01M9 13h.01M9 17h.01M15 13h.01M15 17h.01" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    comment: <><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 9.2 9.2 0 0 1-4-.9L3 21l1.9-4.8a9.2 9.2 0 0 1-.9-4A8.4 8.4 0 0 1 12.5 3.7a8.4 8.4 0 0 1 8.5 7.8Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.8" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    document: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13l2 2 4-4" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    login: <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>,
    shield: <><path d="M12 3 4.5 6v5.6c0 4.5 3.2 7.7 7.5 9.4 4.3-1.7 7.5-4.9 7.5-9.4V6z" /><path d="m8.8 12 2.1 2.1 4.4-4.4" /></>,
    sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2z" /><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7zM5 14l.6 1.7 1.7.6-1.7.6L5 19l-.6-2.1-1.7-.6z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

export type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string }
export function AppLink({ href, children, className = "", ...props }: AppLinkProps) {
  return <a className={className} href={href} {...props}>{children}</a>
}
export function PrimaryLink({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  return <AppLink href={href} className={`button ${dark ? "button-dark" : "button-primary"}`}>{children}<Icon name="arrow" /></AppLink>
}
