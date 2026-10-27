import { useEffect, useMemo, useRef, useState } from "react"
import { AppLink, Icon } from "../../site"
import { Localized } from "../../language"

function DirectoryFilterSelect({ label, placeholder, options, value, onChange }: {
  label: string
  placeholder: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = `directory-filter-${label.toLowerCase().replace(/\s+/g, "-")}`

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  function focusOption(index: number) {
    const buttons = rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')
    if (buttons?.length) buttons[Math.max(0, Math.min(index, buttons.length - 1))].focus()
  }

  return <Localized><div className={`directory-filter-select${open ? " is-open" : ""}`} ref={rootRef}>
    <button
      ref={triggerRef}
      type="button"
      className="directory-filter-select-trigger"
      aria-label={`Select ${label.toLowerCase()}`}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={menuId}
      onClick={() => setOpen(current => !current)}
      onKeyDown={event => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault()
          setOpen(true)
          requestAnimationFrame(() => focusOption(event.key === "ArrowDown" ? 0 : options.length))
        }
      }}
    >
      <span>{options.find(option => option === value) ?? placeholder}</span>
      <span className="directory-filter-select-chevron" aria-hidden="true" />
    </button>
    {open && <div className="directory-filter-select-menu" id={menuId} role="listbox" aria-label="Filter options">
      {[{ value: "", label: placeholder }, ...options.map(option => ({ value: option, label: option }))].map((option, index) =>
        <button
          key={option.value || "all"}
          type="button"
          role="option"
          aria-selected={value === option.value}
          className={value === option.value ? "selected" : ""}
          onClick={() => { onChange(option.value); setOpen(false); triggerRef.current?.focus() }}
          onKeyDown={event => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              focusOption(index + (event.key === "ArrowDown" ? 1 : -1))
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault()
              focusOption(event.key === "Home" ? 0 : options.length)
            }
          }}
        >{option.label}</button>
      )}
    </div>}
  </div></Localized>
}

export const founders = [
  { id: "1", name: "Myat Thinzar Soe", company: "Golden TLH Co, Ltd.", industry: "Retail", role: "Founder & Product Lead", location: "Yangon", foundedYear: "2021", verified: true, description: "Building practical software for growing teams across Myanmar." },
  { id: "2", name: "May Hnin Zaw", company: "May Rose Wedding Service & Makeup Academy", industry: "Beauty & Personal Care", role: "Co-founder", location: "Yangon", foundedYear: "2020", verified: true, description: "Helping independent Myanmar brands reach customers beyond their home city." },
  { id: "3", name: "Ngu War Shein", company: "Sagawar Diamond Gold & Jewelry", industry: "Retail", role: "Founder", location: "Mandalay", foundedYear: "2019", verified: true, description: "Making high-quality jewelry more accessible to local customers." },
  { id: "4", name: "Aung Gyi", company: "Second-Hand Mobile Phone Sales & Purchase", industry: "Retail", role: "Founder", location: "Yangon", foundedYear: "2022", verified: true, description: "Connecting customers with dependable devices and helpful service." },
  { id: "5", name: "Kyaw Zin Htet", company: "NextGen Tech Solutions", industry: "Technology", role: "Co-founder", location: "Yangon", foundedYear: "2023", verified: true, description: "Building useful digital tools for businesses and their customers." },
  { id: "6", name: "Ei Ei Mon", company: "Thazin Learning", industry: "Education", role: "Founder", location: "Taunggyi", foundedYear: "2021", verified: true, description: "Making job-ready learning more accessible to young people outside major cities." },
  { id: "7", name: "Kaung Htet", company: "Myaung Logistics", industry: "Logistics", role: "Founder & CEO", location: "Yangon", foundedYear: "2022", verified: false, description: "Building dependable regional delivery networks for small businesses." },
  { id: "8", name: "Su Myat", company: "Nadi Handmade", industry: "Arts & Crafts", role: "Co-founder", location: "Yangon", foundedYear: "2020", verified: true, description: "Connecting Myanmar makers with customers who value thoughtful craft." },
  { id: "9", name: "Nay Lin", company: "Shwe Green Foods", industry: "Food & Beverage", role: "Founder", location: "Mandalay", foundedYear: "2019", verified: true, description: "Growing nutritious local food products with sustainable sourcing." },
  { id: "10", name: "Htet Htet", company: "Mandalay Makers", industry: "Manufacturing", role: "Founder", location: "Mandalay", foundedYear: "2023", verified: false, description: "Supporting small-batch makers with shared production and market access." },
]

export function DirectoryPage() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("q") ?? "")
  const [tab, setTab] = useState<"founders" | "businesses">("founders")
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [foundedYear, setFoundedYear] = useState("")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 8
  const industries = useMemo(() => [...new Set(founders.map(item => item.industry))].sort(), [])
  const locations = useMemo(() => [...new Set(founders.map(item => item.location))].sort(), [])
  const years = useMemo(() => [...new Set(founders.map(item => item.foundedYear))].sort((a, b) => Number(b) - Number(a)), [])
  const visible = founders.filter(item => {
    const text = tab === "founders" ? `${item.name} ${item.company} ${item.industry} ${item.role} ${item.location}` : `${item.company} ${item.name} ${item.industry} ${item.location}`
    return text.toLowerCase().includes(query.trim().toLowerCase())
      && (!industry || item.industry === industry)
      && (!location || item.location === location)
      && (!foundedYear || item.foundedYear === foundedYear)
      && (!verifiedOnly || item.verified)
  })
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageItems = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const hasFilters = Boolean(query || industry || location || foundedYear || verifiedOnly)

  function clearFilters() {
    setQuery("")
    setIndustry("")
    setLocation("")
    setFoundedYear("")
    setVerifiedOnly(false)
    setPage(1)
  }

  return <Localized><section className="directory-page">
    <div className="shell">
      <header className="directory-heading">
        <span className="directory-eyebrow">Founder ecosystem</span>
        <h1>Discover who’s building in Myanmar</h1>
        <p>Search people and businesses by what they build, where they work, and the communities they serve.</p>
      </header>

      <div className="directory-toolbar">
        <div className="directory-tabs" role="tablist" aria-label="Directory type">
          <button type="button" role="tab" aria-selected={tab === "founders"} className={tab === "founders" ? "active" : ""} onClick={() => { setTab("founders"); setPage(1) }}>Founders <span>{founders.length}</span></button>
          <button type="button" role="tab" aria-selected={tab === "businesses"} className={tab === "businesses" ? "active" : ""} onClick={() => { setTab("businesses"); setPage(1) }}>Businesses <span>{founders.length}</span></button>
        </div>
        <label className="directory-top-search"><Icon name="search" /><input value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder={tab === "founders" ? "Search founders..." : "Search businesses..."} aria-label={tab === "founders" ? "Search founders" : "Search businesses"} /></label>
      </div>

      <div className="directory-results-layout">
        <aside className="directory-filter-panel">
          <div className="directory-filter-heading"><strong>Filter directory</strong>{hasFilters && <button type="button" onClick={clearFilters}>Clear</button>}</div>
          <div className="directory-filter-field"><span>Industry</span><DirectoryFilterSelect label="Industry" placeholder="All industries" options={industries} value={industry} onChange={value => { setIndustry(value); setPage(1) }} /></div>
          <div className="directory-filter-field"><span>Location</span><DirectoryFilterSelect label="Location" placeholder="All locations" options={locations} value={location} onChange={value => { setLocation(value); setPage(1) }} /></div>
          <div className="directory-filter-field"><span>Founded year</span><DirectoryFilterSelect label="Founded year" placeholder="Any year" options={years} value={foundedYear} onChange={value => { setFoundedYear(value); setPage(1) }} /></div>
          <label className="directory-verified-toggle"><input type="checkbox" checked={verifiedOnly} onChange={event => { setVerifiedOnly(event.target.checked); setPage(1) }} /><span><strong>Verified only</strong><small>Show profiles reviewed by Founders</small></span></label>
          {hasFilters && <button type="button" className="directory-clear-link" onClick={clearFilters}>Clear filters</button>}
        </aside>

        <div className="directory-results">
          <div className="directory-results-meta"><span>{visible.length} <Localized>results</Localized></span><small>Fictional profiles for prototype use</small></div>
          {pageItems.length ? <div className="directory-profile-grid">{pageItems.map(founder => {
            const initials = founder.name.split(" ").map(part => part[0]).slice(0, 2).join("")
            const href = tab === "founders" ? `/founder/${founder.id}` : `/business/${founder.id}`
            const title = tab === "founders" ? founder.name : founder.company
            const category = founder.industry
            return <AppLink key={founder.id} href={href} className="directory-profile-card">
              <div className="directory-profile-cover">
                <div className="directory-profile-avatar">{initials}</div>
                {founder.verified && <span className="directory-profile-verified"><Icon name="check" /><Localized>Verified</Localized></span>}
              </div>
              <div className="directory-profile-content">
                <span className="directory-profile-label">{tab === "founders" ? "Founder profile" : "Business profile"}</span>
                <h2>{title}</h2>
                <span className="directory-profile-company"><Icon name="building" />{tab === "founders" ? founder.company : founder.name}</span>
                <span className="directory-profile-location"><Icon name="document" />{founder.location}</span>
              </div>
              <div className="directory-profile-footer">
                <span className="directory-profile-category">{category}</span>
                <span className="directory-profile-action">{tab === "founders" ? "View profile" : "View business"}<span className="directory-profile-arrow"><Icon name="arrow" /></span></span>
              </div>
            </AppLink>
          })}</div> : <div className="directory-empty-state"><span><Icon name="search" /></span><h2>No results found</h2><p>Try changing your search or clearing one or more filters.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}

          {visible.length > 0 && <nav className="directory-pagination" aria-label="Directory pages">
            <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><Icon name="arrow" />Previous</button>
            <span><Localized>Page</Localized> {currentPage} <Localized>of</Localized> {pageCount}</span>
            <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<Icon name="arrow" /></button>
          </nav>}
        </div>
      </div>
    </div>
  </section></Localized>
}
