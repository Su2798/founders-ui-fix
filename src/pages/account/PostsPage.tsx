import { FormEvent, useState } from "react"
import type { AuthSession } from "../../components"
import { AppLink, Icon } from "../../site"
import { LanguageSwitch, Localized } from "../../language"
import { getAccountPath } from "../../accountRoutes"

const DEFAULT_POST = {
  community: "Yangon Founders",
  title: "What our first 10 customers taught us",
  body: "The strongest lesson was to watch how the work actually happens, not just ask what feature people want. Three of our early assumptions disappeared after sitting with operations teams for an afternoon.",
}

const navigation = [
  ["Personal", [["database", "Overview"], ["user", "My Profile"]]],
  ["Business", [["building", "My Businesses"], ["shield", "Verification"]]],
  ["Community", [["user", "Communities"], ["document", "Messages"]]],
  ["Content", [["document", "My Posts"], ["building", "Settings"]]],
] as const
const accountRouteByLabel = {
  Overview: "dashboard",
  "My Profile": "profile",
  "My Businesses": "businesses",
  Verification: "verification",
  Communities: "communities",
  Messages: "messages",
  "My Posts": "posts",
  Settings: "settings",
} as const

export function PostsPage({ session, onLogout }: { session: AuthSession; onLogout: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [composerOpen, setComposerOpen] = useState(new URLSearchParams(window.location.search).get("compose") === "1")
  const [message, setMessage] = useState("")
  const [posts, setPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("founders:demo:posts") || "null") ?? [DEFAULT_POST] }
    catch { return [DEFAULT_POST] }
  })
  const initials = session.name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase()

  function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get("title") ?? "").trim()
    const body = String(form.get("body") ?? "").trim()
    const community = String(form.get("community") ?? "").trim()
    if (!title || !body) return
    const next = [{ community, title, body }, ...posts]
    setPosts(next)
    localStorage.setItem("founders:demo:posts", JSON.stringify(next))
    setComposerOpen(false)
    setMessage("Post created.")
  }

  return <Localized><section className="dashboard posts-dashboard">
    <aside className="dashboard-sidebar" aria-label="Account navigation">
      <AppLink href={getAccountPath(session, "dashboard")} className="dashboard-brand"><span className="dashboard-brand-mark">F</span>Founders</AppLink>
      <nav>{navigation.map(([label, items]) => <div className="dashboard-nav-group" key={label}><span className="dashboard-nav-label">{label}</span>{items.map(([icon, itemLabel]) => {
        const href = getAccountPath(session, accountRouteByLabel[itemLabel])
        return <AppLink key={itemLabel} href={href} className={`dashboard-nav-item${itemLabel === "My Posts" ? " active" : ""}`}><Icon name={icon} />{itemLabel}{itemLabel === "Messages" && <b>3</b>}</AppLink>
      })}</div>)}</nav>
      <button type="button" className="dashboard-account" onClick={onLogout}><span className="dashboard-avatar">{initials}</span><span><strong>{session.name}</strong><small>{session.email}</small></span></button>
    </aside>

    <div className="dashboard-main">
      <header className="dashboard-topbar">
        <button type="button" className="dashboard-menu" aria-label="Open account navigation"><Icon name="menu" /></button>
        <div className="dashboard-search"><Icon name="search" /><input aria-label="Search founders, businesses and communities" placeholder="Search founders, businesses, communities..." /><span className="dashboard-search-shortcut">⌘ K</span></div>
        <div className="dashboard-top-actions"><button type="button" aria-label="Notifications"><Icon name="sparkles" /></button><LanguageSwitch compact /><span className="dashboard-top-avatar">{initials.slice(0, 1)}M</span><span className="dashboard-top-name">{session.name.split(" ")[0]}</span><button type="button" className="dashboard-avatar small" aria-label="Open account menu">{initials}</button></div>
      </header>

      <main className="dashboard-content posts-content">
        <header className="posts-heading"><div><span>Content</span><h1>My Posts</h1><p>Manage the knowledge and questions you have shared with founder communities.</p></div><button type="button" className="dashboard-primary" onClick={() => setComposerOpen(true)}><span>+</span> Create post</button></header>
        {message && <p className="posts-status" role="status">{message}</p>}
        <div className="posts-stats"><div><strong>{posts.length}</strong><span>posts</span></div><div><strong>34</strong><span>helpful reactions</span></div><div><strong>{posts.length}</strong><span>comments</span></div></div>
        <div className="post-list">{posts.map((post: typeof DEFAULT_POST, index: number) => <article className="post-card" key={`${post.title}-${index}`}>
          <div className="post-card-header"><div className="post-author"><span className="dashboard-avatar">{initials}</span><div><strong>{session.name}</strong><small>{post.community} · 2h</small></div></div><div className="post-menu-wrap"><button type="button" aria-label="Post actions" onClick={() => setMenuOpen(menuOpen === index ? false : index)}>•••</button>{menuOpen === index && <div className="post-menu"><button type="button" onClick={() => setComposerOpen(true)}>Edit</button><button type="button" onClick={() => { const next = posts.filter((_, itemIndex) => itemIndex !== index); setPosts(next); localStorage.setItem("founders:demo:posts", JSON.stringify(next)); setMenuOpen(false) }}>Delete</button></div>}</div></div>
          <span className="post-community">{post.community}</span><h2>{post.title}</h2><p>{post.body}</p>
          <div className="post-helpful"><span><b>{index === 0 ? 34 : 6}</b> helpful</span><span>{index === 0 ? 1 : 0} comments</span></div>
          <div className="post-actions"><button type="button"><Icon name="sparkles" />Helpful</button><button type="button"><Icon name="document" />Comment</button></div>
        </article>)}</div>
      </main>
    </div>

    {composerOpen && <div className="post-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setComposerOpen(false) }}><section className="post-modal" role="dialog" aria-modal="true" aria-labelledby="create-post-title"><header><div><span>Community post</span><h2 id="create-post-title">Create post</h2></div><button type="button" aria-label="Close" onClick={() => setComposerOpen(false)}><Icon name="x" /></button></header><form onSubmit={savePost}><label htmlFor="post-community">Community</label><select id="post-community" name="community" defaultValue="Yangon Founders"><option>Yangon Founders</option><option>Myanmar Tech Founders</option><option>Women Founders Myanmar</option></select><label htmlFor="post-title">Title</label><input id="post-title" name="title" required maxLength={100} placeholder="What would you like to discuss?" /><label htmlFor="post-body">Post</label><textarea id="post-body" name="body" required rows={7} placeholder="Share an insight, question, or experience..." /><div className="post-modal-actions"><button type="button" onClick={() => setComposerOpen(false)}>Cancel</button><button type="submit" className="dashboard-primary">Publish post</button></div></form></section></div>}
  </section></Localized>
}
