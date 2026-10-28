export type CommunityChatMessage = {
  id: string
  accountId: string
  authorName: string
  authorInitials: string
  text: string
  createdAt: string
}

function getStorageKey(accountId: string, communityId: string) {
  return `founders:demo:community-messages:${accountId}:${communityId}`
}

function isCommunityChatMessage(message: unknown): message is CommunityChatMessage {
  return typeof message === "object" &&
    message !== null &&
    "id" in message && typeof message.id === "string" &&
    "accountId" in message && typeof message.accountId === "string" &&
    "authorName" in message && typeof message.authorName === "string" &&
    "authorInitials" in message && typeof message.authorInitials === "string" &&
    "text" in message && typeof message.text === "string" &&
    "createdAt" in message && typeof message.createdAt === "string" &&
    !Number.isNaN(Date.parse(message.createdAt))
}

export function readCommunityMessages(accountId: string, communityId: string): CommunityChatMessage[] {
  const stored = localStorage.getItem(getStorageKey(accountId, communityId))
  if (stored === null) return []

  const messages: unknown = JSON.parse(stored)
  if (!Array.isArray(messages) || !messages.every(isCommunityChatMessage) || messages.some(message => message.accountId !== accountId)) {
    throw new Error("Saved community messages have an invalid format.")
  }
  return messages
}

export function writeCommunityMessages(accountId: string, communityId: string, messages: CommunityChatMessage[]) {
  localStorage.setItem(getStorageKey(accountId, communityId), JSON.stringify(messages))
}

export function formatCommunityMessageTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}
