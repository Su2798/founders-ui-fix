import { useState, type FormEvent } from "react"
import type { AuthSession } from "../../components"
import { AppLink, Icon } from "../../site"
import { Localized } from "../../language"
import { founders } from "../public/DirectoryPage"
import { MemberShell } from "./MemberShell"
import { getAccountPath } from "../../accountRoutes"
import { PostComposer } from "./PostComposer"
import { PostDeleteConfirm } from "./PostDeleteConfirm"
import { readStoredPosts, writeStoredPosts, type PostDraft } from "./postsStorage"
import { communities, readJoinedCommunityIds, writeJoinedCommunityIds, type Community } from "./communityStorage"
import { formatCommunityMessageTime, readCommunityMessages, writeCommunityMessages } from "./communityMessagesStorage"

export function CommunitiesPage({ session, onLogout }: { session: AuthSession; onLogout: () => void }) {
  const [query, setQuery] = useState("")
  const [membershipState, setMembershipState] = useState(() => {
    try {
      return { ids: readJoinedCommunityIds(session.accountId), error: "" }
    } catch {
      return { ids: [] as string[], error: "Your community memberships could not be loaded." }
    }
  })
  const visible = communities.filter(item => `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase()))

  function toggleMembership(id: string) {
    const ids = membershipState.ids.includes(id)
      ? membershipState.ids.filter(value => value !== id)
      : [...membershipState.ids, id]
    try {
      writeJoinedCommunityIds(session.accountId, ids)
      setMembershipState({ ids, error: "" })
    } catch {
      setMembershipState(current => ({ ...current, error: "Your community membership could not be saved." }))
    }
  }

  return <MemberShell session={session} onLogout={onLogout} active="Communities"><main className="dashboard-content communities-content">
    <header className="communities-heading"><div><span>Community</span><h1>Founder communities</h1><p>Find focused conversations and trusted peers most relevant to you.</p></div></header>
    {membershipState.error && <p className="community-post-error" role="alert">{membershipState.error}</p>}
    <div className="communities-toolbar"><h2>Your communities</h2><label><Icon name="search" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search communities..." /></label></div>
    <div className="community-card-grid">{visible.filter(item => membershipState.ids.includes(item.id)).map(item => <CommunityCard key={item.id} item={item} joined onToggle={toggleMembership} session={session} />)}</div>
    {visible.some(item => !membershipState.ids.includes(item.id)) && <><div className="communities-toolbar discover-heading"><h2>Discover communities</h2><p>Focused groups across cities, industries, and founder roles.</p></div><div className="community-card-grid">{visible.filter(item => !membershipState.ids.includes(item.id)).map(item => <CommunityCard key={item.id} item={item} joined={false} onToggle={toggleMembership} session={session} />)}</div></>}
  </main></MemberShell>
}

function CommunityCard({ item, joined, onToggle, session }: { item: Community; joined: boolean; onToggle: (id: string) => void; session: AuthSession }) {
  return <Localized><article className="community-card">
    <div className="community-card-image" style={{ backgroundImage: `url(${item.image})` }} />
    <div className="community-card-body">
      <span>{item.category}</span><h3>{item.name}</h3><p>{item.desc}</p>
      <div className="community-card-meta"><span><Icon name="user" />{item.members} members</span><span><Icon name="building" />{item.location}</span></div>
      <div className="community-card-actions">
        {joined ? <AppLink href={`${getAccountPath(session, "communities")}/${item.id}`}>View community</AppLink> : <button type="button" onClick={() => onToggle(item.id)}>Join</button>}
        {joined && <button className="community-joined-button" type="button" aria-pressed="true" onClick={() => onToggle(item.id)}>Joined</button>}
      </div>
    </div>
  </article></Localized>
}

type CommunityComment = { founderId?: string; initials: string; name: string; text: string; time: string }
type CommunityDiscussion = {
  id: string
  founderId?: string
  initials: string
  name: string
  title: string
  excerpt: string
  time: string
  helpful: number
  comments: CommunityComment[]
  liked: boolean
  image: string
  postId?: string
  authorAccountId?: string
}

const discussions = [
  { founderId: "6", initials: "EM", name: "Ei Ei Mon", title: "What our first 10 customers taught us", excerpt: "The best feedback came from watching how people actually used what we built.", time: "2h", helpful: 35, comments: [{ founderId: "8", initials: "SM", name: "Su Myat", text: "This was true for us too. Observation gave us much better answers than surveys.", time: "1h" }] },
  { founderId: "7", initials: "KH", name: "Kaung Htet", title: "How are founders handling logistics outside Yangon?", excerpt: "Would love to hear what has worked for teams serving customers across regions.", time: "4h", helpful: 21, comments: [] },
  { founderId: "5", initials: "KZ", name: "Kyaw Zin Htet", title: "Recommendations for local payment integrations", excerpt: "Looking for reliable options that are easy for small teams to manage.", time: "Yesterday", helpful: 17, comments: [] },
]

const memberFounderIds: Record<string, string[]> = {
  "1": ["1", "5", "6", "7", "8"],
  "2": ["5", "6", "7", "9", "10"],
  "3": ["2", "6", "8", "9", "10"],
  "4": ["1", "4", "5", "7", "9"],
  "5": ["2", "3", "4", "8", "9"],
  "6": ["1", "2", "5", "6", "7"],
}

function getFounderProfileHref(name: string, founderId?: string) {
  const founder = founderId
    ? founders.find(item => item.id === founderId)
    : founders.find(item => item.name === name)
  return founder ? `/founder/${founder.id}` : null
}

export function CommunityDetailPage({ session, onLogout, communityId }: { session: AuthSession; onLogout: () => void; communityId: string }) {
  const community = communities.find(item => item.id === communityId)
  const initials = session.name.split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join("").toUpperCase()
  const [membershipState, setMembershipState] = useState(() => {
    try {
      return { ids: readJoinedCommunityIds(session.accountId), error: "" }
    } catch {
      return { ids: [] as string[], error: "Your community memberships could not be loaded." }
    }
  })
  const joined = Boolean(community && membershipState.ids.includes(community.id))
  const [activeTab, setActiveTab] = useState<"Feed" | "Chat" | "Members" | "About">("Feed")
  const [savedPostState] = useState(() => {
    try {
      return { posts: readStoredPosts(), error: "" }
    } catch {
      return { posts: [] as PostDraft[], error: "Saved community posts could not be loaded." }
    }
  })
  const [discussionItems, setDiscussionItems] = useState<CommunityDiscussion[]>(() => {
    const savedDiscussions = savedPostState.posts
      .filter(post => post.community === community?.name)
      .map((post, index) => ({
        id: post.id ?? `saved-${index}-${post.title}`,
        founderId: founders.find(founder => founder.name === (post.authorName ?? session.name))?.id,
        initials: post.authorInitials ?? initials,
        name: post.authorName ?? session.name,
        title: post.title,
        excerpt: post.body,
        time: "Posted",
        helpful: 0,
        comments: [] as CommunityComment[],
        liked: false,
        image: post.image ?? "",
        postId: post.id,
        authorAccountId: post.authorAccountId,
      }))
    return [...savedDiscussions, ...discussions.map((discussion, index) => ({ ...discussion, id: `discussion-${index}`, liked: false, image: "", postId: undefined, authorAccountId: undefined }))]
  })
  const communityMembers = (memberFounderIds[communityId] ?? []).flatMap(id => {
    const founder = founders.find(item => item.id === id)
    return founder ? [founder] : []
  })
  const [composerOpen, setComposerOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<PostDraft | null>(null)
  const [postMenuOpenId, setPostMenuOpenId] = useState<string | null>(null)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)
  const [postError, setPostError] = useState(savedPostState.error)
  const [commentDraft, setCommentDraft] = useState("")
  const [openComments, setOpenComments] = useState<string | null>(null)
  const [chatDraft, setChatDraft] = useState("")
  const [chatState, setChatState] = useState(() => {
    try {
      return { messages: community ? readCommunityMessages(session.accountId, community.id) : [], error: "" }
    } catch {
      return { messages: [], error: "Community messages could not be loaded." }
    }
  })

  function closeComposer() {
    setComposerOpen(false)
    setEditingPost(null)
  }

  function toggleCommunityMembership() {
    if (!community) return
    const ids = joined
      ? membershipState.ids.filter(id => id !== community.id)
      : [...membershipState.ids, community.id]
    try {
      writeJoinedCommunityIds(session.accountId, ids)
      setMembershipState({ ids, error: "" })
    } catch {
      setMembershipState(current => ({ ...current, error: "Your community membership could not be saved." }))
    }
  }

  function createDiscussion(post: PostDraft) {
    const selectedCommunity = communities.find(item => item.name === post.community)
    if (!selectedCommunity || !membershipState.ids.includes(selectedCommunity.id)) {
      setPostError("Join the selected community before creating a post.")
      return
    }
    const id = `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const savedPost: PostDraft = {
      ...post,
      id,
      authorName: session.name,
      authorInitials: initials,
      authorAccountId: session.accountId,
    }
    try {
      if (!readJoinedCommunityIds(session.accountId).includes(selectedCommunity.id)) {
        setPostError("Join the selected community before creating a post.")
        return
      }
      writeStoredPosts([savedPost, ...readStoredPosts()])
    } catch {
      setPostError("Your post could not be saved. Try removing the image or choosing a smaller one.")
      return
    }
    setPostError("")
    if (post.community === community?.name) setDiscussionItems(current => [{
      id,
      founderId: founders.find(founder => founder.name === session.name)?.id,
      initials,
      name: session.name,
      title: post.title,
      excerpt: post.body,
      time: "Just now",
      helpful: 0,
      comments: [],
      liked: false,
      image: post.image ?? "",
      postId: id,
      authorAccountId: session.accountId,
    }, ...current])
    closeComposer()
  }

  function saveEditedDiscussion(post: PostDraft) {
    if (!editingPost?.id) return
    const selectedCommunity = communities.find(item => item.name === post.community)
    const canKeepPreviousCommunity = editingPost.community === post.community
    try {
      const currentJoinedIds = readJoinedCommunityIds(session.accountId)
      if (!selectedCommunity || (!currentJoinedIds.includes(selectedCommunity.id) && !canKeepPreviousCommunity)) {
        setPostError("Join the selected community before moving this post.")
        return
      }
      const storedPosts = readStoredPosts()
      if (!storedPosts.some(item => item.id === editingPost.id && (item.authorAccountId === session.accountId || (!item.authorAccountId && item.authorName === session.name)))) {
        setPostError("This post could not be found or is not yours to edit.")
        return
      }
      const updatedPost = { ...editingPost, ...post, id: editingPost.id }
      writeStoredPosts(storedPosts.map(item => item.id === editingPost.id ? updatedPost : item))
      if (post.community === community?.name) {
        setDiscussionItems(current => current.map(item => item.postId === editingPost.id
          ? { ...item, title: post.title, excerpt: post.body, image: post.image ?? "" }
          : item))
      } else {
        setDiscussionItems(current => current.filter(item => item.postId !== editingPost.id))
      }
      setPostError("")
      closeComposer()
    } catch {
      setPostError("Your post could not be updated. Try removing the image or choosing a smaller one.")
    }
  }

  function deleteDiscussion() {
    if (!deletePostId) return
    try {
      const storedPosts = readStoredPosts()
      if (!storedPosts.some(item => item.id === deletePostId && (item.authorAccountId === session.accountId || (!item.authorAccountId && item.authorName === session.name)))) {
        setPostError("This post could not be found or is not yours to delete.")
        setDeletePostId(null)
        return
      }
      writeStoredPosts(storedPosts.filter(item => item.id !== deletePostId))
      setDiscussionItems(current => current.filter(item => item.postId !== deletePostId))
      setDeletePostId(null)
      setPostError("")
    } catch {
      setPostError("Your post could not be deleted. Please try again.")
      setDeletePostId(null)
    }
  }

  function toggleHelpful(id: string) {
    setDiscussionItems(current => current.map(item => item.id === id
      ? { ...item, liked: !item.liked, helpful: item.helpful + (item.liked ? -1 : 1) }
      : item))
  }

  function addComment(event: FormEvent<HTMLFormElement>, discussionId: string) {
    event.preventDefault()
    const text = commentDraft.trim()
    if (!text) return
    setDiscussionItems(current => current.map(item => item.id === discussionId
      ? { ...item, comments: [...item.comments, { founderId: founders.find(founder => founder.name === session.name)?.id, initials, name: session.name, text, time: "Just now" }] }
      : item))
    setCommentDraft("")
  }

  function sendCommunityMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = chatDraft.trim()
    if (!text || !community) return

    const message = {
      id: `message-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      accountId: session.accountId,
      authorName: session.name,
      authorInitials: initials,
      text,
      createdAt: new Date().toISOString(),
    }
    try {
      const messages = [...readCommunityMessages(session.accountId, community.id), message]
      writeCommunityMessages(session.accountId, community.id, messages)
      setChatState({ messages, error: "" })
      setChatDraft("")
    } catch {
      setChatState(current => ({ ...current, error: "Your message could not be sent. Please try again." }))
    }
  }

  return <MemberShell session={session} onLogout={onLogout} active="Communities">
    <Localized><main className="dashboard-content community-detail-content">
      {community ? <>
        <AppLink href={getAccountPath(session, "communities")} className="community-detail-back"><Icon name="arrow" />Back to communities</AppLink>
        <div className="community-detail-banner" style={{ backgroundImage: `linear-gradient(100deg, rgba(13,27,42,.28), rgba(13,27,42,.05)), url(${community.image})` }} />
        <section className="community-detail-header">
          <div className="community-detail-profile-row">
            <span className="community-detail-avatar">{community.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase()}</span>
            <div className="community-detail-identity">
              <div className="community-detail-name"><h1>{community.name}</h1><span className="community-detail-category">{community.category}</span></div>
              <p>{community.desc}</p>
              <div className="community-detail-stats"><span><Icon name="user" /><strong>{community.members}</strong> members</span><span><Icon name="building" />{community.location}</span></div>
            </div>
            <button type="button" className={`community-detail-join${joined ? " is-joined" : ""}`} onClick={toggleCommunityMembership}>{joined ? "Joined" : "Join community"}</button>
            {membershipState.error && <p className="community-post-error" role="alert">{membershipState.error}</p>}
          </div>
          <nav className="community-detail-tabs" aria-label="Community sections" role="tablist">
            {(["Feed", "Chat", "Members", "About"] as const).map(tab => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}{tab === "Chat" && <span className="community-chat-count">3</span>}</button>)}
          </nav>
        </section>

        <div className={`community-detail-layout${activeTab !== "Feed" ? " is-secondary-tab" : ""}`}>
          <div className="community-detail-main">
            {activeTab === "Feed" && <section className="community-discussions">
              <header><div><h2>Community feed</h2><p>Share ideas and learn from your community.</p></div></header>
              {joined
                ? <button type="button" className="community-post-trigger" onClick={() => setComposerOpen(true)} aria-label="Share something with the community">
                    <span className="community-discussion-avatar">{initials}</span>
                    <span className="community-post-trigger-copy">Share something with the community...</span>
                    <Icon name="document" className="community-post-trigger-image" />
                    <span className="community-post-trigger-action">Post</span>
                  </button>
                : <p className="community-post-error">Join this community to create a post.</p>}
              {composerOpen && <PostComposer
                initialValues={editingPost ?? { community: community.name, title: "", body: "" }}
                communityOptions={communities.filter(item => membershipState.ids.includes(item.id)).map(item => item.name)}
                allowInitialCommunity={Boolean(editingPost)}
                onSubmit={editingPost ? saveEditedDiscussion : createDiscussion}
                onClose={closeComposer}
              />}
              {postError && <p className="community-post-error" role="alert">{postError}</p>}
              <div className="community-discussion-list">{discussionItems.map(discussion => {
                const isOwnPost = Boolean(discussion.postId && (discussion.authorAccountId === session.accountId || (!discussion.authorAccountId && discussion.name === session.name)))
                const authorHref = getFounderProfileHref(discussion.name, discussion.founderId)
                return <article className="community-discussion" key={discussion.id}>
                {authorHref ? <AppLink href={authorHref} className="community-discussion-profile-link"><span className="community-discussion-avatar">{discussion.initials}</span></AppLink> : <span className="community-discussion-avatar">{discussion.initials}</span>}
                <div className="community-discussion-copy">
                  <div className="community-discussion-topline">
                    <div className="community-discussion-author">{authorHref ? <AppLink href={authorHref}><strong>{discussion.name}</strong></AppLink> : <strong>{discussion.name}</strong>}<span>{discussion.time}</span></div>
                    {isOwnPost && <div className="post-menu-wrap community-discussion-menu">
                      <button type="button" aria-label="Your post actions" aria-expanded={postMenuOpenId === discussion.id} onClick={() => setPostMenuOpenId(current => current === discussion.id ? null : discussion.id)}>•••</button>
                      {postMenuOpenId === discussion.id && <div className="post-menu"><button type="button" onClick={() => {
                        const post = savedPostState.posts.find(item => item.id === discussion.postId)
                        if (post) setEditingPost(post)
                        else {
                          const currentPost = { id: discussion.postId, community: community.name, title: discussion.title, body: discussion.excerpt, image: discussion.image, authorName: discussion.name, authorAccountId: discussion.authorAccountId }
                          setEditingPost(currentPost)
                        }
                        setComposerOpen(true)
                        setPostMenuOpenId(null)
                      }}>Edit</button><button type="button" onClick={() => { setDeletePostId(discussion.postId ?? null); setPostMenuOpenId(null) }}>Delete</button></div>}
                    </div>}
                  </div>
                  <h3>{discussion.title}</h3><p>{discussion.excerpt}</p>
                  {discussion.image && <img className="community-discussion-image" src={discussion.image} alt="Image attached to community post" />}
                  <div className="community-discussion-counts"><span>{discussion.helpful} helpful</span><span>{discussion.comments.length} comments</span></div>
                  <div className="community-discussion-actions">
                    <button type="button" className={discussion.liked ? "is-helpful" : ""} aria-pressed={discussion.liked} onClick={() => toggleHelpful(discussion.id)}><Icon name="heart" />Helpful</button>
                    <button type="button" aria-expanded={openComments === discussion.id} onClick={() => setOpenComments(current => current === discussion.id ? null : discussion.id)}><Icon name="comment" />Comment</button>
                  </div>
                  {openComments === discussion.id && <div className="community-comments">
                    {discussion.comments.map((comment, index) => {
                      const commentHref = getFounderProfileHref(comment.name, comment.founderId)
                      return <div className="community-comment" key={`${comment.name}-${index}`}>{commentHref ? <AppLink href={commentHref} className="community-comment-profile"><span className="community-comment-avatar">{comment.initials}</span></AppLink> : <span className="community-comment-avatar">{comment.initials}</span>}<div><strong>{commentHref ? <AppLink href={commentHref}>{comment.name}</AppLink> : comment.name}</strong><p>{comment.text}</p><small>{comment.time}</small></div></div>
                    })}
                    <form className="community-comment-form" onSubmit={event => addComment(event, discussion.id)}>
                      <span className="community-comment-avatar">{initials}</span>
                      <input aria-label="Add a thoughtful comment" placeholder="Add a thoughtful comment..." value={openComments === discussion.id ? commentDraft : ""} onChange={event => setCommentDraft(event.target.value)} required />
                      <button type="submit" disabled={!commentDraft.trim()}>Reply</button>
                    </form>
                  </div>}
                </div>
              </article>
              })}</div>
              {deletePostId && <PostDeleteConfirm onCancel={() => setDeletePostId(null)} onConfirm={deleteDiscussion} />}
            </section>
            }
            {activeTab === "Chat" && <section className="community-tab-panel community-chat-panel">
              <header><div><span className="community-detail-eyebrow">Member conversations</span><h2>Community chat</h2><p>Quick conversations with founders in this community.</p></div><span className="community-chat-count">3 new</span></header>
              <div className="community-chat-thread"><span className="community-chat-day">Today</span>
                <article><AppLink href="/founder/8" className="community-chat-profile"><span className="community-member-avatar">SM</span></AppLink><div><strong><AppLink href="/founder/8">Su Myat</AppLink></strong><p>Has anyone here built a simple handover checklist for a first sales hire?</p><small>9:14 AM</small></div></article>
                <article><AppLink href="/founder/6" className="community-chat-profile"><span className="community-member-avatar">EM</span></AppLink><div><strong><AppLink href="/founder/6">Ei Ei Mon</AppLink></strong><p>The most useful part was a weekly customer context note, not the pipeline template.</p><small>9:18 AM</small></div></article>
                <article className="community-chat-own"><span className="community-member-avatar">{initials}</span><div><strong>{session.name}</strong><p>We can share a clean version with the group.</p><small>9:23 AM</small></div></article>
                {chatState.messages.map(message => <article className="community-chat-own" key={message.id}><span className="community-member-avatar">{message.authorInitials}</span><div><strong>{message.authorName}</strong><p>{message.text}</p><small>{formatCommunityMessageTime(message.createdAt)}</small></div></article>)}
              </div>
              {chatState.error && <p className="community-post-error" role="alert">{chatState.error}</p>}
              <form className="community-chat-compose" onSubmit={sendCommunityMessage}><input aria-label="Write a message" placeholder="Write a message..." value={chatDraft} onChange={event => setChatDraft(event.target.value)} /><button type="submit" aria-label="Send message" disabled={!chatDraft.trim()}><Icon name="arrow" /></button></form>
            </section>}
            {activeTab === "Members" && <section className="community-tab-panel community-members-panel">
              <header><div><span className="community-detail-eyebrow">Meet your peers</span><h2>Community members</h2><p>Connect with founders building across industries and cities.</p></div><label><Icon name="search" /><input placeholder="Search members..." aria-label="Search members" /></label></header>
              <div className="community-member-table"><div className="community-member-table-head"><span>Founder</span><span>Business &amp; role</span><span>Location</span><span>Industry</span></div>
                {communityMembers.map(founder => <article key={founder.id}><AppLink href={`/founder/${founder.id}`} className="community-table-person"><span className="community-member-avatar">{founder.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("")}</span><strong>{founder.name}</strong></AppLink><span><strong>{founder.company}</strong><small>{founder.role}</small></span><span>{founder.location}</span><span className="community-member-tag">{founder.industry}</span></article>)}
              </div>
            </section>}
            {activeTab === "About" && <section className="community-tab-panel community-about-panel">
              <div><span className="community-about-icon"><Icon name="building" /></span><span className="community-detail-eyebrow">About this community</span><h2>{community.name}</h2><p>{community.desc} Members share useful lessons, ask specific questions, and make thoughtful introductions.</p></div>
              <aside><h3>Community guidelines</h3><ul><li>Share context, not just promotion.</li><li>Respect information shared in confidence.</li><li>Disagree with care and specificity.</li><li>Offer help when you can.</li></ul></aside>
            </section>}
          </div>
          {activeTab === "Feed" && <aside className="community-detail-sidebar">
            <section className="community-detail-guidelines"><h2>Community notes</h2><p>Be specific, generous, and respectful of information shared in confidence.</p><div className="community-topic-list"><strong>Popular topics</strong>{["Hiring", "Operations", "Customer learning", "Payments"].map(topic => <span key={topic}>{topic}</span>)}</div></section>
          </aside>}
        </div>
      </> : <section className="community-detail-not-found"><h1>Community not found</h1><p>This community is unavailable.</p><AppLink href={getAccountPath(session, "communities")}>Back to communities</AppLink></section>}
    </main></Localized>
  </MemberShell>
}
