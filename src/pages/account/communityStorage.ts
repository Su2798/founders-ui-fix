export type Community = {
  id: string
  category: string
  name: string
  desc: string
  members: number
  location: string
  joined: boolean
  image: string
}

export const communities: Community[] = [
  { id: "1", category: "Cross-industry", name: "Cross-industry", desc: "Exchange practical ideas and examples across industries.", members: 280, location: "Yangon", joined: true, image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80" },
  { id: "2", category: "Technology", name: "Myanmar Tech Founders", desc: "Build products, platforms, and teams in Myanmar's technology ecosystem.", members: 194, location: "Yangon", joined: true, image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80" },
  { id: "3", category: "Leadership", name: "Women Founders Myanmar", desc: "Connections, mentorship, and peer support for women founders.", members: 314, location: "Yangon", joined: true, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80" },
  { id: "4", category: "Operations", name: "Myanmar Startup Operators", desc: "Practical lessons for early-stage operations and growth.", members: 267, location: "Yangon", joined: true, image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80" },
  { id: "5", category: "E-commerce", name: "Myanmar E-commerce Builders", desc: "Strong stores and brands through operations and customer discussions.", members: 129, location: "Yangon", joined: false, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80" },
  { id: "6", category: "Fintech", name: "Fintech", desc: "A focused group for founders in payments and inclusive finance.", members: 76, location: "Yangon", joined: false, image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=900&q=80" },
]

const JOINED_COMMUNITIES_KEY = "founders:demo:joined-communities"

export function readJoinedCommunityIds(accountId: string): string[] {
  const stored = localStorage.getItem(`${JOINED_COMMUNITIES_KEY}:${accountId}`)
  if (stored === null) return communities.filter(community => community.joined).map(community => community.id)

  const ids: unknown = JSON.parse(stored)
  if (!Array.isArray(ids) || !ids.every(id => typeof id === "string" && communities.some(community => community.id === id))) {
    throw new Error("Saved community memberships have an invalid format.")
  }
  return ids
}

export function writeJoinedCommunityIds(accountId: string, ids: string[]) {
  if (!ids.every(id => communities.some(community => community.id === id))) {
    throw new Error("Cannot save an unknown community membership.")
  }
  localStorage.setItem(`${JOINED_COMMUNITIES_KEY}:${accountId}`, JSON.stringify([...new Set(ids)]))
}
