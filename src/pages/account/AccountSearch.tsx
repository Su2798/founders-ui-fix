import { useEffect, useRef, useState } from "react"
import type { AuthSession } from "../../components"
import { getAccountPath } from "../../accountRoutes"
import { AppLink, Icon, type IconName } from "../../site"
import { Localized } from "../../language"
import { founders } from "../public/DirectoryPage"

const communities = [
  "Yangon Founders",
  "Mandalay Founders",
  "Myanmar Tech Founders",
  "Women Founders Myanmar",
]

type SearchResult = {
  id: string
  icon: IconName
  title: string
  description: string
  href: string
}

export function AccountSearch({ session }: { session: AuthSession }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const quickLinks: { icon: IconName; label: string; href: string }[] = [
    { icon: "user", label: "Browse founder directory", href: "/directory" },
    { icon: "building", label: "Manage businesses", href: getAccountPath(session, "businesses") },
    { icon: "user", label: "Discover communities", href: getAccountPath(session, "communities") },
  ]

  const normalizedQuery = query.trim().toLowerCase()
  const results: SearchResult[] = normalizedQuery ? [
    ...founders.flatMap(founder => {
      const founderMatch = `${founder.name} ${founder.company} ${founder.industry}`.toLowerCase().includes(normalizedQuery)
      const businessMatch = `${founder.company} ${founder.industry}`.toLowerCase().includes(normalizedQuery)
      return [
        ...(founderMatch ? [{
          id: `founder-${founder.id}`,
          icon: "user" as const,
          title: founder.name,
          description: `${founder.company} · ${founder.industry}`,
          href: `/founder/${founder.id}`,
        }] : []),
        ...(businessMatch ? [{
          id: `business-${founder.id}`,
          icon: "building" as const,
          title: founder.company,
          description: `${founder.industry} · Business`,
          href: `/business/${founder.id}`,
        }] : []),
      ]
    }),
    ...communities.flatMap((community, index) => community.toLowerCase().includes(normalizedQuery) ? [{
      id: `community-${index}`,
      icon: "user" as const,
      title: community,
      description: "Founder community",
      href: getAccountPath(session, "communities"),
    }] : []),
  ] : []

  useEffect(() => {
    function handleSearchKeys(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen(true)
      } else if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleSearchKeys)
    return () => window.removeEventListener("keydown", handleSearchKeys)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
    else setQuery("")
  }, [open])

  return <Localized>
  <>
    <button type="button" className="dashboard-search" onClick={() => setOpen(true)} aria-label="Search founders, businesses and communities">
      <Icon name="search" />
      <span>Search founders, businesses, communities...</span>
      <kbd className="dashboard-search-shortcut">⌘ K</kbd>
    </button>
    {open && <div className="dashboard-search-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) setOpen(false)
    }}>
      <section className="dashboard-search-dialog" role="dialog" aria-modal="true" aria-label="Search Founders">
        <div className="dashboard-search-dialog-input">
          <Icon name="search" />
          <input
            ref={inputRef}
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search Founders..."
            aria-label="Search founders, businesses, and communities"
          />
          <button type="button" aria-label="Close search" onClick={() => setOpen(false)}><Icon name="x" /></button>
        </div>
        <div className="dashboard-search-dialog-results">
          {normalizedQuery ? <>
            <span className="dashboard-search-section-label">SEARCH RESULTS</span>
            {results.length ? results.map(result => <AppLink
              key={result.id}
              href={result.href}
              className="dashboard-search-result"
              onClick={() => setOpen(false)}
            >
              <span className="dashboard-search-result-avatar"><Icon name={result.icon} /></span>
              <span><strong>{result.title}</strong><small>{result.description}</small></span>
            </AppLink>) : <p className="dashboard-search-empty">No matching results found.</p>}
          </> : <>
            <span className="dashboard-search-section-label">QUICK NAVIGATION</span>
            {quickLinks.map(link => <AppLink key={link.label} href={link.href} className="dashboard-search-quick-link" onClick={() => setOpen(false)}>
              <Icon name={link.icon} /><span>{link.label}</span>
            </AppLink>)}
          </>}
        </div>
      </section>
    </div>}
  </>
  </Localized>
}
