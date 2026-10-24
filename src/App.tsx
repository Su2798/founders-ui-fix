import { AnchorHTMLAttributes, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react"

type IconName = "arrow" | "building" | "check" | "database" | "document" | "login" | "menu" | "search" | "shield" | "sparkles" | "user" | "x"

function Icon({
  name,
  className = "size-5",
}: {
  name: IconName
  className?: string
}) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    building: (
      <>
        <path d="M3 21h18" />
        <path d="M6 21V5l6-2v18" />
        <path d="M18 21V9l-6-2" />
        <path d="M9 9h.01M9 13h.01M9 17h.01M15 13h.01M15 17h.01" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </>
    ),
    document: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5M9 13l2 2 4-4" />
      </>
    ),
    login: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4.5 6v5.6c0 4.5 3.2 7.7 7.5 9.4 4.3-1.7 7.5-4.9 7.5-9.4V6z" />
        <path d="m8.8 12 2.1 2.1 4.4-4.4" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2z" />
        <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7zM5 14l.6 1.7 1.7.6-1.7.6L5 19l-.6-2.1-1.7-.6 1.7-.6z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

const navItems = [
  ["Home", "/home"],
  ["Directory", "/directory"],
  ["About", "/about"],
  ["Verification", "/verification"],
  ["Contact", "/contact"],
]

const founders = [
  {
    id: "6a6c3341af4ca336e6aef518",
    name: "Myat Thinzar Soe",
    company: "Golden TLH Co, Ltd.",
    industry: "Retail",
  },
  {
    id: "6a6c3341af4ca336e6aef51e",
    name: "May Hnin Zaw",
    company: "May Rose Wedding Service & Makeup Academy",
    industry: "Beauty & Personal Care",
  },
  {
    id: "6a6c3342af4ca336e6aef524",
    name: "Ngu War Shein",
    company: "Sagawar Diamond Gold & Jewelry",
    industry: "Retail",
  },
  {
    id: "6a6c3342af4ca336e6aef52a",
    name: "Aung Gyi",
    company: "Second-Hand Mobile Phone Sales & Purchase",
    industry: "Retail",
  },
  {
    id: "6a6c3342af4ca336e6aef530",
    name: "Kyaw Zin Htet",
    company: "NextGen Tech Solutions",
    industry: "Technology",
  },
  {
    id: "6a6c3342af4ca336e6aef536",
    name: "Thandar Aung",
    company: "Mandalay Heritage Crafts",
    industry: "Arts & Crafts",
  },
  {
    id: "6a6c3342af4ca336e6aef53c",
    name: "Zaw Min Oo",
    company: "Yangon Express Logistics",
    industry: "Transportation",
  },
  {
    id: "6a6c3342af4ca336e6aef542",
    name: "Hnin Pwint Phyoe",
    company: "Lotus Wellness & Spa",
    industry: "Health & Wellness",
  },
  {
    id: "6a6c3342af4ca336e6aef548",
    name: "Aung Kyaw Myint",
    company: "Shwe Taung Agriculture",
    industry: "Agriculture",
  },
  {
    id: "6a6c3342af4ca336e6aef54e",
    name: "Su Myat Noe",
    company: "Emerald Fashion House",
    industry: "Apparel",
  },
  {
    id: "6a6c3342af4ca336e6aef554",
    name: "Ye Yint Aung",
    company: "Apex Digital Marketing",
    industry: "Marketing",
  },
  {
    id: "6a6c3342af4ca336e6aef55a",
    name: "Phyu Phyu Win",
    company: "Irrawaddy Fresh Seafoods",
    industry: "Food & Beverage",
  },
  {
    id: "6a6c3342af4ca336e6aef560",
    name: "Zin Min Htet",
    company: "Golden Land Real Estate",
    industry: "Real Estate",
  },
  {
    id: "6a6c3342af4ca336e6aef566",
    name: "Khin Yadana",
    company: "Bagan Historical Tours",
    industry: "Tourism",
  },
  {
    id: "6a6c3342af4ca336e6aef56c",
    name: "Sai Sithu",
    company: "Green Energy Myanmar",
    industry: "Renewable Energy",
  },
  {
    id: "6a6c3342af4ca336e6aef572",
    name: "Aye Myat Mon",
    company: "Ruby Gems & Jewellery",
    industry: "Retail",
  },
  {
    id: "6a6c3342af4ca336e6aef578",
    name: "Naing Lin Aung",
    company: "Zay Yar Manufacturing",
    industry: "Manufacturing",
  },
  {
    id: "6a6c3342af4ca336e6aef57e",
    name: "May Thu Zar",
    company: "Royal Myanmar Travel",
    industry: "Tourism",
  },
  {
    id: "6a6c3342af4ca336e6aef584",
    name: "Thiha Zaw",
    company: "Blue Sky IT Innovations",
    industry: "Technology",
  },
];

const verificationSteps = [
  {
    icon: "shield" as const,
    title: "Identity Confirmation",
    text: "We verify every founder through government-issued documents and background checks.",
  },
  {
    icon: "document" as const,
    title: "Business Registry",
    text: "Companies are cross-referenced with official business registries and legal databases.",
  },
  {
    icon: "database" as const,
    title: "Ownership Validation",
    text: "We confirm legitimate ownership through corporate filings and shareholder documentation.",
  },
  {
    icon: "check" as const,
    title: "Manual Review",
    text: "Our expert team conducts thorough manual reviews to ensure authenticity and credibility.",
  },
]

const aboutVerificationSteps = [
  {
    icon: "shield" as const,
    title: "Identity Confirmation",
    text: "We verify personal identity using government-issued documents, biometric verification, and background checks.",
  },
  {
    icon: "document" as const,
    title: "Business Registry Check",
    text: "We cross-reference official business registries, incorporation documents, and legal databases.",
  },
  {
    icon: "database" as const,
    title: "Ownership Validation",
    text: "We confirm legitimate ownership through corporate filings, shareholder records, and direct verification.",
  },
  {
    icon: "check" as const,
    title: "Manual Authenticity Review",
    text: "Our team reviews public records, media coverage, and professional history to ensure authenticity.",
  },
]

const verificationDetails = [
  {
    ...aboutVerificationSteps[0],
    checks: [
      "Government-issued photo ID verification",
      "Biometric facial match with live verification",
      "Background checks against public records and watchlists",
      "Address verification through utility bills or official correspondence",
    ],
  },
  {
    ...aboutVerificationSteps[1],
    checks: [
      "Cross-reference with government business registries",
      "Verification of registration number and incorporation date",
      "Confirmation of active business status and good standing",
      "Review of business licenses and permits relevant to the industry",
    ],
  },
  {
    ...aboutVerificationSteps[2],
    checks: [
      "Review of corporate filings and articles of incorporation",
      "Verification of shareholder records and equity documentation",
      "Confirmation of executive role through official company documents",
      "Direct verification with company representatives when applicable",
    ],
  },
  {
    ...aboutVerificationSteps[3],
    checks: [
      "Cross-reference public records and media coverage",
      "Review of professional history, achievements, and business milestones",
      "Verification of social media profiles and online presence",
      "Final quality assurance by senior verification specialists",
    ],
  },
]

const verificationFaqs = [
  {
    question: "How long does the verification process take?",
    answer:
      "Most reviews are completed within 5–10 business days. Timelines may vary if additional documentation or clarification is needed.",
  },
  {
    question: "What documents do I need to provide?",
    answer:
      "You may be asked for a government-issued photo ID, proof of address, business registration details, and documents confirming your role or ownership.",
  },
  {
    question: "Is my personal information kept confidential?",
    answer:
      "Documents provided for verification are used only for the review process and are not displayed on your public founder profile.",
  },
  {
    question: "What if my verification is rejected?",
    answer:
      "We’ll explain the reason for the decision and let you know whether additional information or a corrected application can be submitted.",
  },
  {
    question: "Can I verify multiple businesses?",
    answer:
      "Yes. Each business needs its own review so we can confirm the relevant registration and your relationship to it.",
  },
  {
    question: "Is there a fee for verification?",
    answer:
      "Contact our team for current information about verification availability and any applicable fees.",
  },
  {
    question: "How do I maintain my verified status?",
    answer:
      "Keep your profile and business information up to date, and let us know when key details change so they can be reviewed.",
  },
  {
    question: "What happens after I’m verified?",
    answer:
      "Your profile can display its verified status in the founder directory, helping others discover and connect with your business.",
  },
]

const aboutJourney = [
  {
    year: "2020",
    title: "Platform Concept",
    text: "Identified the need for verified founder profiles in the startup ecosystem.",
  },
  {
    year: "2021",
    title: "Development Phase",
    text: "Built a comprehensive verification framework with legal and technical experts.",
  },
  {
    year: "2022",
    title: "Official Launch",
    text: "Launched with 100 verified profiles across 20 industries.",
  },
  {
    year: "2023",
    title: "Rapid Growth",
    text: "Reached 1,000+ verified founders and established partnerships with major organizations.",
  },
  {
    year: "2024",
    title: "Global Expansion",
    text: "Expanded verification services internationally with 2,500+ verified profiles.",
  },
]

const aboutValues = [
  {
    icon: "sparkles" as const,
    title: "Excellence",
    text: "We maintain the highest standards in our verification process, ensuring every profile meets rigorous authenticity requirements.",
  },
  {
    icon: "shield" as const,
    title: "Trust",
    text: "Building trust through transparency and accountability is at the heart of our mission and operations.",
  },
  {
    icon: "arrow" as const,
    title: "Impact",
    text: "We create positive impact by connecting credible founders with opportunities and partners worldwide.",
  },
]

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string
}

function AppLink({ href, children, className = "", ...props }: AppLinkProps) {
  return (
    <a className={className} href={href} {...props}>
      {children}
    </a>
  )
}

function PrimaryLink({
  href,
  children,
  dark = false,
}: {
  href: string
  children: ReactNode
  dark?: boolean
}) {
  return (
    <AppLink
      href={href}
      className={`button ${dark ? "button-dark" : "button-primary"}`}
    >
      {children}
      <Icon name="arrow" />
    </AppLink>
  )
}

function Header({ activePath }: { activePath: string }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    function updateScrollState() {
      setScrolled(window.scrollY > 24)
    }
    function updateViewport() {
      setDesktop(window.innerWidth >= 768)
    }

    updateScrollState()
    updateViewport()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateViewport)
    return () => {
      window.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateViewport)
    }
  }, [])

  return (
    <header
      className={`site-header${scrolled ? " is-scrolled" : ""}`}
      style={scrolled ? {
        padding: desktop ? "6px 0 20px" : "4px 0 16px",
        backgroundColor: "#fff",
        boxShadow: "0 8px 20px rgba(13, 27, 42, .08)",
      } : undefined}
    >
      <div
        className="shell header-inner"
        style={scrolled ? {
          height: desktop ? 54 : 52,
          backgroundColor: "#fff",
          boxShadow: "none",
        } : undefined}
      >
        <AppLink href="/home" className="wordmark" aria-label="Founders home">
          <span>founders</span>
        </AppLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <AppLink
              key={href}
              href={href}
              className={href === activePath ? "active" : ""}
              style={scrolled ? { minHeight: 36 } : undefined}
            >
              {label}
            </AppLink>
          ))}
        </nav>
        <AppLink
          href="/login"
          className="login-button"
          style={scrolled ? { minHeight: 40 } : undefined}
        >
          Login
        </AppLink>
        <button
          className="menu-button"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "x" : "menu"} className="size-6" />
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([label, href]) => (
            <AppLink
              key={href}
              href={href}
              className={href === activePath ? "active" : ""}
            >
              {label}
            </AppLink>
          ))}
          <AppLink href="/login" className="button button-primary">
            Login
            <Icon name="arrow" />
          </AppLink>
        </nav>
      )}
    </header>
  )
}

function FounderCard({ founder }: { founder: typeof founders[number] }) {
  const initials = founder.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
  return (
    <AppLink href={`/founder/${founder.id}`} className="founder-card">
      <div className="founder-card-top">
        <div className="avatar">{initials}</div>
        <span className="verified">
          <Icon name="check" className="size-4" />
          Verified
        </span>
      </div>
      <div className="founder-card-info">
        <span className="founder-role">Founder profile</span>
        <h3>{founder.name}</h3>
        <p className="founder-company">
          <Icon name="building" className="size-4" />
          {founder.company}
        </p>
      </div>
      <div className="card-meta">
        <span className="industry-tag">{founder.industry}</span>
        <span className="card-action">
          View profile
          <Icon name="arrow" />
        </span>
      </div>
    </AppLink>
  )
}

function IndustryFilter({
  industries,
  value,
  onChange,
}: {
  industries: string[]
  value: string
  onChange: (industry: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const options = ["", ...industries]
  const selectedIndex = Math.max(options.indexOf(value), 0)

  useEffect(() => {
    if (!open) return

    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    optionRefs.current[activeIndex]?.focus()
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [activeIndex, open])

  function moveActiveOption(index: number) {
    const nextIndex = (index + options.length) % options.length
    setActiveIndex(nextIndex)
    optionRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={`industry-filter${open ? " is-open" : ""}`} ref={rootRef}>
      <label id="industry-filter-label" htmlFor="industry-filter-button">
        Industry
      </label>
      <button
        ref={triggerRef}
        id="industry-filter-button"
        className="industry-select"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="industry-filter-label industry-filter-value"
        aria-controls="industry-filter-options"
        onClick={() => {
          if (!open) setActiveIndex(selectedIndex)
          setOpen(!open)
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            if (!open) {
              setActiveIndex(selectedIndex)
              setOpen(true)
            }
          }
        }}
      >
        <span id="industry-filter-value">{value || "All industries"}</span>
        <span className="industry-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div
          className="industry-options"
          id="industry-filter-options"
          role="listbox"
          aria-labelledby="industry-filter-label"
        >
          {options.map((industry, index) => (
            <button
              key={industry || "all"}
              ref={(element) => {
                optionRefs.current[index] = element
              }}
              className={`industry-option${value === industry ? " is-selected" : ""}`}
              type="button"
              role="option"
              aria-selected={value === industry}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => {
                onChange(industry)
                setOpen(false)
                triggerRef.current?.focus()
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault()
                  moveActiveOption(index + 1)
                } else if (event.key === "ArrowUp") {
                  event.preventDefault()
                  moveActiveOption(index - 1)
                } else if (event.key === "Home") {
                  event.preventDefault()
                  moveActiveOption(0)
                } else if (event.key === "End") {
                  event.preventDefault()
                  moveActiveOption(options.length - 1)
                }
              }}
            >
              {industry || "All industries"}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/home"
  const activePath = navItems.some(([, href]) => href === pathname)
    ? pathname
    : "/home"
  const isHome = pathname !== "/login" && pathname !== "/register" && activePath === "/home"
  const isDirectory = activePath === "/directory"
  const isAbout = activePath === "/about"
  const isVerification = activePath === "/verification"
  const isContact = activePath === "/contact"
  const isLogin = pathname === "/login"
  const isRegister = pathname === "/register"
  const [loginMessage, setLoginMessage] = useState("")
  const [registerMessage, setRegisterMessage] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [query, setQuery] = useState("")
  const [submittedQuery, setSubmittedQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("")
  const industries = useMemo(
    () => [...new Set(founders.map((founder) => founder.industry))].sort(),
    [],
  )
  const visibleFounders = useMemo(
    () =>
      founders.filter((founder) =>
        `${founder.name} ${founder.company} ${founder.industry}`
          .toLowerCase()
          .includes(submittedQuery.toLowerCase()) &&
        (!selectedIndustry || founder.industry === selectedIndustry),
      ),
    [submittedQuery, selectedIndustry],
  )
  const hasActiveFilters = Boolean(submittedQuery || selectedIndustry)

  function submitSearch(event: FormEvent) {
    event.preventDefault()
    setSubmittedQuery(query.trim())
    document
      .querySelector("#featured")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="app">
      <Header activePath={activePath} />
      <main>
        {isHome && <section className="hero">
          <div className="hero-pattern" aria-hidden="true" />
          <div className="shell hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <Icon name="sparkles" className="size-4" />
                Trusted by Myanmar’s founder community
              </div>
              <h1>
                Your source for <span>verified</span> business founders
              </h1>
              <p>
                Discover authentic entrepreneurial profiles backed by rigorous
                verification. Connect with credible business leaders you can
                trust.
              </p>
              {/* <form
                className="search-form"
                role="search"
                onSubmit={submitSearch}
              >
                <Icon name="search" className="search-icon" />
                <label className="sr-only" htmlFor="founder-search">
                  Search founders
                </label>
                <input
                  id="founder-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search founders or companies"
                />
                <button type="submit">Search</button>
              </form> */}
              <div className="hero-actions">
                <PrimaryLink href="/directory">Browse directory</PrimaryLink>
                <AppLink href="/verification" className="text-link">
                  How verification works <Icon name="arrow" />
                </AppLink>
              </div>
              <div className="trust-row">
                <div className="avatar-stack" aria-hidden="true">
                  <span>MT</span>
                  <span>MH</span>
                  <span>NW</span>
                  <span>+64</span>
                </div>
                <p>
                  <b>67+ verified founders</b>Growing every week across Myanmar
                </p>
              </div>
            </div>
            <div className="hero-visual" aria-label="Verified founder network">
              <div className="network-card network-main">
                <div className="network-icon">
                  <Icon name="shield" />
                </div>
                <strong>Verified founder network</strong>
                <span>Authentic profiles. Trusted connections.</span>
                <div className="network-stats">
                  <div>
                    <b>67+</b>
                    <small>Founders</small>
                  </div>
                  <div>
                    <b>4-step</b>
                    <small>Verification</small>
                  </div>
                </div>
              </div>
              <div className="network-card floating-card top-card">
                <Icon name="check" />
                <span>
                  <b>Manually reviewed</b>
                  <small>For credibility</small>
                </span>
              </div>
              <div className="network-card floating-card bottom-card">
                <Icon name="building" />
                <span>
                  <b>Real businesses</b>
                  <small>Registry checked</small>
                </span>
              </div>
            </div>
          </div>
        </section>}

        {(isHome || isDirectory) && <section className="section" id="featured">
          <div className="shell">
            <div className="section-heading row-heading">
              <div>
                <span className="section-label">Founder directory</span>
                <h2>
                  {isDirectory
                    ? "Find a verified founder"
                    : hasActiveFilters
                    ? "Search results"
                    : "Featured verified founders"}
                </h2>
                <p>
                  {isDirectory && !hasActiveFilters
                    ? "Explore trusted founders by name, company, or industry."
                    : hasActiveFilters
                    ? `${visibleFounders.length} founder${
                        visibleFounders.length === 1 ? "" : "s"
                      } found`
                    : "Meet credible business leaders who have completed our verification process."}
                </p>
              </div>
              <AppLink href="/directory" className="text-link desktop-only">
                View all founders <Icon name="arrow" />
              </AppLink>
            </div>
            <div className="directory-filters" role="search">
              <div className="directory-search">
                <Icon name="search" className="size-5" />
                <label className="sr-only" htmlFor="directory-search">
                  Search founders, companies, and industries
                </label>
                <input
                  id="directory-search"
                  type="search"
                  value={query}
                  onChange={(event) => {
                    const nextQuery = event.target.value
                    setQuery(nextQuery)
                    setSubmittedQuery(nextQuery.trim())
                  }}
                  placeholder="Search founders, companies, industries..."
                />
              </div>
              <IndustryFilter
                industries={industries}
                value={selectedIndustry}
                onChange={setSelectedIndustry}
              />
            </div>
            {visibleFounders.length > 0 ? (
              <div className="founder-grid">
                {visibleFounders.map((founder) => (
                  <FounderCard key={founder.id} founder={founder} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Icon name="search" />
                <h3>No founders found</h3>
                <p>Try another name, business, or industry.</p>
                <button
                  onClick={() => {
                    setQuery("")
                    setSubmittedQuery("")
                    setSelectedIndustry("")
                  }}
                >
                  Clear search
                </button>
              </div>
            )}
            <div className="mobile-only mobile-all">
              <PrimaryLink href="/directory" dark>
                Browse all founders
              </PrimaryLink>
            </div>
          </div>
        </section>}

        {isAbout && <>
          <section className="about-mission">
            <div className="shell about-mission-inner">
              <span className="section-label">Our mission</span>
              <h1>Trust is the foundation of every great business connection.</h1>
              <p>
                At VerifiedFounders, we’re committed to building trust in the
                entrepreneurial ecosystem by providing a reliable platform where
                business founders can establish their credibility through rigorous
                verification. We believe transparency and authenticity are the
                foundations of meaningful business relationships.
              </p>
            </div>
          </section>

          <section className="section about-framework">
            <div className="shell">
              <div className="section-heading centered">
                <span className="section-label">Built on trust</span>
                <h2>Our verification framework</h2>
                <p>
                  Every founder profile undergoes a comprehensive four-step
                  verification process to ensure complete authenticity and
                  credibility.
                </p>
              </div>
              <div className="verification-grid">
                {aboutVerificationSteps.map((step, index) => (
                  <article className="verification-item" key={step.title}>
                    <span className="step-number">0{index + 1}</span>
                    <div className="verification-icon">
                      <Icon name={step.icon} />
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section about-journey">
            <div className="shell">
              <div className="section-heading centered">
                <span className="section-label">Our journey</span>
                <h2>From a simple idea to a trusted network</h2>
                <p>A growing community built one verified profile at a time.</p>
              </div>
              <ol className="journey-timeline">
                {aboutJourney.map((milestone, index) => (
                  <li
                    className={`journey-item ${index % 2 === 0 ? "journey-left" : "journey-right"}`}
                    key={milestone.year}
                  >
                    <span className="journey-year">{milestone.year}</span>
                    <div className="journey-card">
                      <h3>{milestone.title}</h3>
                      <p>{milestone.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="section about-values">
            <div className="shell">
              <div className="section-heading centered">
                <span className="section-label">What guides us</span>
                <h2>Our core values</h2>
                <p>The principles that guide everything we do.</p>
              </div>
              <div className="values-grid">
                {aboutValues.map((value) => (
                  <article className="value-card" key={value.title}>
                    <span className="value-icon"><Icon name={value.icon} /></span>
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section about-partners">
            <div className="shell">
              <div className="section-heading centered">
                <span className="section-label">Growing together</span>
                <h2>Trusted by leading organizations</h2>
              </div>
              <div className="partner-grid" aria-label="Partner organizations">
                {[1, 2, 3, 4].map((partner) => (
                  <div className="partner-card" key={partner}>
                    Partner logo {partner}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>}

        {(isHome || isVerification) && (
          isVerification ? (
            <>
              <section className="verification-intro">
                <div className="shell">
                  <span className="section-label">Trust, verified</span>
                  <h1>Our verification process</h1>
                  <p>
                    Trust is earned through transparency. Our comprehensive
                    four-step verification process helps ensure every founder
                    profile on our platform is authentic and credible.
                  </p>
                </div>
              </section>

              <section className="verification-details">
                <div className="shell">
                  <ol className="verification-timeline">
                    {verificationDetails.map((step, index) => (
                      <li className="verification-detail" key={step.title}>
                        <span className="verification-detail-number">
                          0{index + 1}
                        </span>
                        <article className="verification-detail-card">
                          <div className="verification-detail-title">
                            <Icon name={step.icon} />
                            <h2>{step.title}</h2>
                          </div>
                          <p>{step.text}</p>
                          <ul>
                            {step.checks.map((check) => (
                              <li key={check}>{check}</li>
                            ))}
                          </ul>
                        </article>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              <section className="section verification-faq">
                <div className="shell">
                  <div className="section-heading centered">
                    <span className="section-label">Need to know</span>
                    <h2>Frequently asked questions</h2>
                    <p>Answers to common questions about verification.</p>
                  </div>
                  <div className="faq-list">
                    {verificationFaqs.map((faq) => (
                      <details className="faq-item" key={faq.question}>
                        <summary>
                          <span>{faq.question}</span>
                          <Icon name="arrow" />
                        </summary>
                        <p>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>

              <section className="verification-commitment">
                <div className="shell">
                  <div className="commitment-card">
                    <span className="section-label orange-label">
                      Our commitment
                    </span>
                    <h2>Transparency at every step</h2>
                    <p>
                      Every verification follows the same rigorous standards.
                      We continuously improve our process to protect the
                      credibility of every founder in our network.
                    </p>
                    <div className="hero-actions">
                      <PrimaryLink href="/submit">Start verification</PrimaryLink>
                      <AppLink href="/contact" className="button button-light">
                        Contact us
                      </AppLink>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="section verification">
              <div className="shell">
                <div className="section-heading centered">
                  <span className="section-label">Built on trust</span>
                  <h2>Why verification matters</h2>
                  <p>
                    Our comprehensive process ensures authenticity and builds
                    trust in Myanmar’s entrepreneurial ecosystem.
                  </p>
                </div>
                <div className="verification-grid">
                  {verificationSteps.map((step, index) => (
                    <article className="verification-item" key={step.title}>
                      <span className="step-number">0{index + 1}</span>
                      <div className="verification-icon">
                        <Icon name={step.icon} />
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )
        )}

        {isHome && <section className="cta-section">
          <div className="shell cta-inner">
            <div>
              <span className="section-label orange-label">
                Join the community
              </span>
              <h2>Build credibility with a verified profile</h2>
              <p>
                Are you a business founder looking to establish credibility?
                Submit your profile for verification and join our trusted
                network.
              </p>
            </div>
            <div className="cta-actions">
              <PrimaryLink href="/submit">Submit a founder</PrimaryLink>
              <AppLink href="/directory" className="button button-light">
                Browse all founders
                <Icon name="arrow" />
              </AppLink>
            </div>
          </div>
        </section>}

        {isContact && <section className="contact-page">
          <div className="contact-hero">
            <div className="shell contact-hero-inner">
              <span className="section-label">We’re here to help</span>
              <h1>Let’s start a conversation.</h1>
              <p>
                Have a question about a founder profile, verification, or
                partnering with us? Reach out to the Founders team.
              </p>
            </div>
          </div>
          <div className="shell contact-content">
            <div className="contact-info">
              <span className="section-label">Get in touch</span>
              <h2>How can we help?</h2>
              <p>
                Choose the best way to reach us, or send a message using the
                form. We’ll be glad to hear from you.
              </p>
              <a className="contact-card" href="mailto:support@myanmarfoundermm.com">
                <span className="contact-card-icon"><Icon name="document" /></span>
                <span>
                  <small>Email our team</small>
                  <strong>support@myanmarfoundermm.com</strong>
                </span>
                <Icon name="arrow" />
              </a>
              <div className="contact-note">
                <span className="verification-icon"><Icon name="shield" /></span>
                <div>
                  <h3>Questions about verification?</h3>
                  <p>Learn how we review founder identities and businesses.</p>
                  <AppLink href="/verification" className="text-link">
                    Explore the process <Icon name="arrow" />
                  </AppLink>
                </div>
              </div>
            </div>
            <div className="contact-form-panel">
              <h2>Send us a message</h2>
              <p>Fill in the details below and tell us how we can help.</p>
              <form
                className="contact-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  setContactMessage("This demo contact form isn’t connected yet. Please email support@myanmarfoundermm.com.")
                }}
              >
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label htmlFor="contact-name">Your name</label>
                    <input id="contact-name" name="name" autoComplete="name" placeholder="Name" required />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="contact-email">Email address</label>
                    <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-subject">What’s this about?</label>
                  <select id="contact-subject" name="subject" defaultValue="" required>
                    <option value="" disabled>Select a topic</option>
                    <option>Founder profile</option>
                    <option>Verification</option>
                    <option>Partnership</option>
                    <option>Other question</option>
                  </select>
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-message">Your message</label>
                  <textarea id="contact-message" name="message" rows={5} placeholder="Tell us a little about how we can help..." required />
                </div>
                <button className="contact-submit" type="submit">Send message<Icon name="arrow" /></button>
                {contactMessage && <p className="contact-message" role="status">{contactMessage}</p>}
              </form>
            </div>
          </div>
          <section className="contact-shortcuts">
            <div className="shell">
              <div className="section-heading centered">
                <span className="section-label">Explore more</span>
                <h2>Need quick answers?</h2>
                <p>
                  Check out our frequently asked questions or explore our
                  resources.
                </p>
              </div>
              <div className="contact-shortcut-grid">
                <AppLink className="contact-shortcut-card" href="/verification">
                  <span className="contact-shortcut-icon"><Icon name="check" /></span>
                  <h3>Verification process</h3>
                  <p>Learn about our comprehensive four-step verification process.</p>
                  <span className="contact-shortcut-link">Explore verification<Icon name="arrow" /></span>
                </AppLink>
                <AppLink className="contact-shortcut-card" href="/submit">
                  <span className="contact-shortcut-icon"><Icon name="arrow" /></span>
                  <h3>Submit your profile</h3>
                  <p>Start the verification process and join our founder network.</p>
                  <span className="contact-shortcut-link">Get started<Icon name="arrow" /></span>
                </AppLink>
                <AppLink className="contact-shortcut-card" href="/about">
                  <span className="contact-shortcut-icon"><Icon name="document" /></span>
                  <h3>About us</h3>
                  <p>Learn more about our mission, journey, and core values.</p>
                  <span className="contact-shortcut-link">Meet Founders<Icon name="arrow" /></span>
                </AppLink>
              </div>
            </div>
          </section>
        </section>}

        {isRegister && <section className="section login-page">
          <div className="login-content">
            <div className="login-heading">
              <span className="login-heading-icon"><Icon name="user" /></span>
              <span className="section-label">Create your account</span>
              <h1>Join our trusted network of verified founders</h1>
            </div>
            <div className="login-panel">
              <form
                className="login-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  setRegisterMessage("Account registration is not connected to an account service yet.")
                }}
              >
                <label htmlFor="register-email">Email or phone number <span aria-hidden="true">*</span></label>
                <div className="login-input-wrap">
                  <Icon name="document" />
                  <input
                    id="register-email"
                    name="email"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your email or phone number"
                    required
                  />
                </div>
                <label htmlFor="register-password">Password <span aria-hidden="true">*</span></label>
                <div className="login-input-wrap">
                  <Icon name="shield" />
                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="Create a password (at least 8 characters)"
                    required
                  />
                </div>
                <button className="login-submit" type="submit">Register</button>
                {registerMessage && <p className="login-message" role="status">{registerMessage}</p>}
                <p className="login-create">Already have an account? <AppLink href="/login">Sign in</AppLink></p>
              </form>
            </div>
            <p className="login-security">Your information is encrypted and secure.</p>
          </div>
        </section>}

        {isLogin && <section className="section login-page">
          <div className="login-content">
            <div className="login-heading">
              <span className="login-heading-icon"><Icon name="login" /></span>
              <span className="section-label">Welcome back</span>
              <h1>Sign in to access your account</h1>
            </div>
            <div className="login-panel">
              <form
                className="login-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  setLoginMessage("Sign-in is not connected to an account service yet.")
                }}
              >
                <label htmlFor="login-email">Email or phone number <span aria-hidden="true">*</span></label>
                <div className="login-input-wrap">
                  <Icon name="document" />
                  <input
                    id="login-email"
                    name="email"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your email or phone number"
                    required
                  />
                </div>
                <label htmlFor="login-password">Password <span aria-hidden="true">*</span></label>
                <div className="login-input-wrap">
                  <Icon name="shield" />
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button className="login-submit" type="submit">Sign in</button>
                {loginMessage && <p className="login-message" role="status">{loginMessage}</p>}
                <p className="login-create">Don’t have an account? <AppLink href="/register">Create account</AppLink></p>
              </form>
            </div>
            <p className="login-security">Your information is encrypted and secure.</p>
          </div>
        </section>}
      </main>

      <footer>
        <div className="shell footer-grid">
          <div className="footer-brand">
            <AppLink href="/home" className="wordmark wordmark-footer">
              <span>founders</span>
            </AppLink>
            <p>
              Your trusted source for verified business founders and authentic
              entrepreneurial profiles.
            </p>
          </div>
          <div>
            <h3>Quick links</h3>
            <AppLink href="/home">Home</AppLink>
            <AppLink href="/directory">Directory</AppLink>
            <AppLink href="/about">About us</AppLink>
          </div>
          <div>
            <h3>Resources</h3>
            <AppLink href="/verification">Verification process</AppLink>
            <AppLink href="/submit">Submit a founder</AppLink>
            <AppLink href="/contact">Contact us</AppLink>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:support@myanmarfoundermm.com">
              support@myanmarfoundermm.com
            </a>
            <a href="https://www.facebook.com/MyanmarOnlineEntrepreneur">
              Facebook
            </a>
            <a href="https://www.tiktok.com/@myanmaronlinentrepreneur">
              TikTok
            </a>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© 2025 Founders. All rights reserved.</span>
          <span>Verified founders. Stronger connections.</span>
        </div>
      </footer>
    </div>
  )
}
