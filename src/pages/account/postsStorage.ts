export type PostDraft = {
  id?: string
  community: string
  title: string
  body: string
  image?: string
  authorName?: string
  authorInitials?: string
  authorAccountId?: string
}

export const POSTS_STORAGE_KEY = "founders:demo:posts"

export function readStoredPosts(): PostDraft[] {
  const stored = localStorage.getItem(POSTS_STORAGE_KEY)
  if (!stored) return []

  const posts: unknown = JSON.parse(stored)
  if (!Array.isArray(posts) || !posts.every(isPostDraft)) {
    throw new Error("Saved posts have an invalid format.")
  }
  const normalizedPosts = posts.map((post, index) => post.id ? post : {
    ...post,
    id: `legacy-post-${index}-${encodeURIComponent(post.community)}-${encodeURIComponent(post.title)}`,
  })
  if (normalizedPosts.some((post, index) => post.id !== posts[index].id)) {
    writeStoredPosts(normalizedPosts)
  }
  return normalizedPosts
}

export function writeStoredPosts(posts: PostDraft[]) {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts))
}

function isPostDraft(value: unknown): value is PostDraft {
  if (typeof value !== "object" || value === null) return false
  const post = value as Record<string, unknown>
  return typeof post.community === "string"
    && typeof post.title === "string"
    && typeof post.body === "string"
    && (post.image === undefined || typeof post.image === "string")
    && (post.id === undefined || typeof post.id === "string")
    && (post.authorName === undefined || typeof post.authorName === "string")
    && (post.authorInitials === undefined || typeof post.authorInitials === "string")
    && (post.authorAccountId === undefined || typeof post.authorAccountId === "string")
}
