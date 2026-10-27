import type { AuthSession } from "./components"

export const accountSections = [
  "dashboard",
  "profile",
  "businesses",
  "verification",
  "communities",
  "messages",
  "posts",
  "settings",
] as const

export type AccountSection = (typeof accountSections)[number]

export function getAccountSlug(session: AuthSession) {
  const slug = session.name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return slug || session.accountId
}

export function getAccountPath(session: AuthSession, section: AccountSection, query = "") {
  return `/${getAccountSlug(session)}/${section}${query}`
}

export function parseAccountPath(pathname: string): { slug: string; section: AccountSection } | null {
  const match = pathname.match(/^\/([^/]+)\/(dashboard|profile|businesses|verification|communities|messages|posts|settings)$/)
  if (!match) return null
  return { slug: match[1], section: match[2] as AccountSection }
}
