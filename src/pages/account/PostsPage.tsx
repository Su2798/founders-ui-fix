import { useState } from "react"
import type { AuthSession } from "../../components"
import { AppLink, Icon } from "../../site"
import { LanguageSwitch, Localized } from "../../language"
import { getAccountPath } from "../../accountRoutes"
import { PostComposer } from "./PostComposer"
import { PostDeleteConfirm } from "./PostDeleteConfirm"
import { POSTS_STORAGE_KEY, readStoredPosts, writeStoredPosts, type PostDraft } from "./postsStorage"
import { communities, readJoinedCommunityIds } from "./communityStorage"

const DEFAULT_POST: PostDraft = {
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
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [composerOpen, setComposerOpen] = useState(new URLSearchParams(window.location.search).get("compose") === "1")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [joinedCommunityState] = useState(() => {
    try {
      return { ids: readJoinedCommunityIds(session.accountId), error: "" }
    } catch {
      return { ids: [] as string[], error: "Joined communities could not be loaded. Please reload and try again." }
    }
  })
  const [initialPostState] = useState(() => {
    try {
      return {
        posts: localStorage.getItem(POSTS_STORAGE_KEY) === null
          ? [{ ...DEFAULT_POST, id: "demo-default-post", authorName: session.name, authorInitials: session.name.slice(0, 1).toUpperCase(), authorAccountId: session.accountId }]
          : readStoredPosts(),
        error: "",
      }
    }
    catch {
      return { posts: [DEFAULT_POST], error: "Saved posts could not be loaded." }
    }
  })
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [message, setMessage] = useState(initialPostState.error)
  const [posts, setPosts] = useState<PostDraft[]>(initialPostState.posts)
  const joinedCommunityNames = communities.filter(community => joinedCommunityState.ids.includes(community.id)).map(community => community.name)
  const initials = session.name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase()

  function savePost(draft: PostDraft) {
    const isEditingSameCommunity = editingIndex !== null && posts[editingIndex]?.community === draft.community
    try {
      const currentJoinedIds = readJoinedCommunityIds(session.accountId)
      const selectedCommunity = communities.find(community => community.name === draft.community)
      if (!selectedCommunity || (!currentJoinedIds.includes(selectedCommunity.id) && !isEditingSameCommunity)) {
        setMessage("Join the selected community before creating a post.")
        return
      }
    } catch {
      setMessage("Joined communities could not be verified. Please reload and try again.")
      return
    }

    const savedDraft = editingIndex === null
      ? { ...draft, id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, authorName: session.name, authorInitials: initials, authorAccountId: session.accountId }
      : { ...posts[editingIndex], ...draft }
    const next = editingIndex === null
      ? [savedDraft, ...posts]
      : posts.map((post, index) => index === editingIndex ? savedDraft : post)
    try {
      writeStoredPosts(next)
    } catch {
      setMessage("Post could not be saved. Try removing the image or choosing a smaller one.")
      return
    }
    setPosts(next)
    setComposerOpen(false)
    setEditingIndex(null)
    setMenuOpen(null)
    setMessage(editingIndex === null ? "Post created." : "Post updated.")
  }

  function deletePost() {
    if (deleteIndex === null) return
    const next = posts.filter((_, index) => index !== deleteIndex)
    try {
      writeStoredPosts(next)
    } catch {
      setMessage("Post could not be deleted. Please try again.")
      setDeleteIndex(null)
      return
    }
    setPosts(next)
    setDeleteIndex(null)
    setMessage("Post deleted.")
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
    {mobileNavOpen && <>
      <button type="button" className="dashboard-mobile-menu-backdrop" aria-label="Close account navigation" onClick={() => setMobileNavOpen(false)} />
      <div id="posts-mobile-navigation" className="dashboard-mobile-menu" role="dialog" aria-modal="true" aria-label="Account navigation">
        <header><AppLink href={getAccountPath(session, "dashboard")} className="dashboard-brand"><span className="dashboard-brand-mark">F</span><span>Founders</span></AppLink><button type="button" aria-label="Close account navigation" onClick={() => setMobileNavOpen(false)}><Icon name="x" /></button></header>
        <nav className="dashboard-mobile-nav" aria-label="Account navigation">{navigation.map(([label, items]) => <div className="dashboard-nav-group" key={label}><span className="dashboard-nav-label">{label}</span>{items.map(([icon, itemLabel]) => <AppLink href={getAccountPath(session, accountRouteByLabel[itemLabel])} key={itemLabel} className={`dashboard-nav-item${itemLabel === "My Posts" ? " active" : ""}`} onClick={() => setMobileNavOpen(false)}><Icon name={icon} /><span>{itemLabel}</span>{itemLabel === "Messages" && <b>3</b>}</AppLink>)}</div>)}</nav>
        <button type="button" className="dashboard-mobile-signout" onClick={onLogout}>Sign out</button>
      </div>
    </>}

    <div className="dashboard-main">
      <header className="dashboard-topbar">
        <button type="button" className="dashboard-menu" aria-label="Open account navigation" aria-expanded={mobileNavOpen} aria-controls="posts-mobile-navigation" onClick={() => setMobileNavOpen(true)}><Icon name="menu" /></button>
        <div className="dashboard-search"><Icon name="search" /><input aria-label="Search founders, businesses and communities" placeholder="Search founders, businesses, communities..." /><span className="dashboard-search-shortcut">⌘ K</span></div>
        <div className="dashboard-top-actions"><button type="button" aria-label="Notifications"><Icon name="sparkles" /></button><LanguageSwitch compact /><span className="dashboard-top-avatar">{initials.slice(0, 1)}M</span><span className="dashboard-top-name">{session.name.split(" ")[0]}</span><button type="button" className="dashboard-avatar small" aria-label="Open account menu">{initials}</button></div>
      </header>

      <main className="dashboard-content posts-content">
        <header className="posts-heading"><div><span>Content</span><h1>My Posts</h1><p>Manage the knowledge and questions you have shared with founder communities.</p></div><button type="button" className="dashboard-primary" aria-label="Create post" disabled={!joinedCommunityNames.length} onClick={() => { setEditingIndex(null); setComposerOpen(true) }}><span aria-hidden="true">+</span><span className="dashboard-primary-label">Create post</span></button></header>
        {(message || joinedCommunityState.error) && <p className="posts-status" role={joinedCommunityState.error ? "alert" : "status"}>{joinedCommunityState.error || message}</p>}
        {!joinedCommunityNames.length && !joinedCommunityState.error && <p className="posts-status">Join a community before creating a post.</p>}
        <div className="posts-stats"><div><strong>{posts.length}</strong><span>posts</span></div><div><strong>34</strong><span>helpful reactions</span></div><div><strong>{posts.length}</strong><span>comments</span></div></div>
        <div className="post-list">{posts.map((post, index) => <article className="post-card" key={`${post.title}-${index}`}>
          <div className="post-card-header"><div className="post-author"><span className="dashboard-avatar">{post.authorInitials ?? initials}</span><div><strong>{post.authorName ?? session.name}</strong><small>{post.community} · 2h</small></div></div><div className="post-menu-wrap"><button type="button" aria-label="Post actions" onClick={() => setMenuOpen(menuOpen === index ? null : index)}>•••</button>{menuOpen === index && <div className="post-menu"><button type="button" onClick={() => { setEditingIndex(index); setComposerOpen(true); setMenuOpen(null) }}>Edit</button><button type="button" onClick={() => { setDeleteIndex(index); setMenuOpen(null) }}>Delete</button></div>}</div></div>
          <span className="post-community">{post.community}</span><h2>{post.title}</h2><p>{post.body}</p>
          {post.image && <img className="post-card-image" src={post.image} alt="Image attached to post" />}
          <div className="post-helpful"><span><b>{index === 0 ? 34 : 6}</b> helpful</span><span>{index === 0 ? 1 : 0} comments</span></div>
          <div className="post-actions"><button type="button"><Icon name="heart" />Helpful</button><button type="button"><Icon name="comment" />Comment</button></div>
        </article>)}</div>
      </main>
    </div>

    {composerOpen && <PostComposer
      key={editingIndex === null ? "new-post" : `edit-post-${editingIndex}`}
      initialValues={editingIndex === null ? undefined : posts[editingIndex]}
      communityOptions={joinedCommunityNames}
      allowInitialCommunity={editingIndex !== null}
      onSubmit={savePost}
      onClose={() => { setComposerOpen(false); setEditingIndex(null) }}
      submitLabel={editingIndex === null ? "Post" : "Save changes"}
    />}
    {deleteIndex !== null && <PostDeleteConfirm onCancel={() => setDeleteIndex(null)} onConfirm={deletePost} />}
  </section></Localized>
}
