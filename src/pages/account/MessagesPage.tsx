import { useState, type FormEvent } from "react"
import type { AuthSession } from "../../components"
import { Icon } from "../../site"
import { MemberShell } from "./MemberShell"
import { formatCommunityMessageTime, readCommunityMessages, writeCommunityMessages } from "./communityMessagesStorage"

type Conversation = {
  id: string
  name: string
  initials: string
  preview: string
  time: string
  unread: number
  communityId?: string
}

const conversations: Conversation[] = [
  { id: "1", name: "Yangon Founders", initials: "Y", preview: "That would be useful. The promises-already-made sections the part most templates miss.", time: "9:26 AM", unread: 1 },
  { id: "2", name: "Myanmar Tech Founders", initials: "M", preview: "Our next product review is Thursday. Happy to compare notes after.", time: "4:32 PM", unread: 2, communityId: "2" },
  { id: "3", name: "Women Founders Myanmar", initials: "W", preview: "No messages yet. Start the conversation.", time: "", unread: 0, communityId: "3" },
  { id: "4", name: "Myanmar Startup Operators", initials: "S", preview: "No messages yet. Start the conversation.", time: "", unread: 0, communityId: "4" },
]

function readConversations(accountId: string) {
  let error = ""
  const items = conversations.map(conversation => {
    if (!conversation.communityId) return conversation
    try {
      const messages = readCommunityMessages(accountId, conversation.communityId)
      const latest = messages[messages.length - 1]
      return latest
        ? { ...conversation, preview: latest.text, time: formatCommunityMessageTime(latest.createdAt), unread: 0 }
        : conversation
    } catch {
      error = "Some community messages could not be loaded."
      return conversation
    }
  })
  return { items, error }
}

export function MessagesPage({ session, onLogout }: { session: AuthSession; onLogout: () => void }) {
  const [conversationState, setConversationState] = useState(() => readConversations(session.accountId))
  const [selected, setSelected] = useState(conversationState.items[0])
  const [draft, setDraft] = useState("")
  const [sent, setSent] = useState<string[]>([])
  const [threadState, setThreadState] = useState(() => {
    try {
      return { messages: selected.communityId ? readCommunityMessages(session.accountId, selected.communityId) : [], error: "" }
    } catch {
      return { messages: [], error: "This community conversation could not be loaded." }
    }
  })

  function selectConversation(conversation: Conversation) {
    setSelected(conversation)
    setSent([])
    try {
      setThreadState({
        messages: conversation.communityId ? readCommunityMessages(session.accountId, conversation.communityId) : [],
        error: "",
      })
    } catch {
      setThreadState({ messages: [], error: "This community conversation could not be loaded." })
    }
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    if (!selected.communityId) {
      setSent(current => [...current, text])
      setDraft("")
      return
    }

    const message = {
      id: `message-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      accountId: session.accountId,
      authorName: session.name,
      authorInitials: session.name.split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join("").toUpperCase(),
      text,
      createdAt: new Date().toISOString(),
    }
    try {
      const messages = [...readCommunityMessages(session.accountId, selected.communityId), message]
      writeCommunityMessages(session.accountId, selected.communityId, messages)
      setThreadState({ messages, error: "" })
      const updated = { ...selected, preview: text, time: formatCommunityMessageTime(message.createdAt), unread: 0 }
      setSelected(updated)
      setConversationState(current => ({
        ...current,
        items: current.items.map(item => item.id === updated.id ? updated : item),
      }))
      setDraft("")
    } catch {
      setThreadState(current => ({ ...current, error: "Your message could not be sent. Please try again." }))
    }
  }

  return <MemberShell session={session} onLogout={onLogout} active="Messages">
    <main className="dashboard-content messages-content">
      <header className="member-page-heading"><div><span>Community</span><h1>Messages</h1><p>Keep up with focused conversations from your founder communities.</p></div></header>
      {conversationState.error && <p className="community-post-error" role="alert">{conversationState.error}</p>}
      <div className="messages-layout">
        <aside className="conversation-list">{conversationState.items.map(item => <button type="button" key={item.id} className={selected.id === item.id ? "active" : ""} onClick={() => selectConversation(item)}><span className="conversation-avatar">{item.initials}</span><span><strong>{item.name}</strong><small>{item.preview}</small></span><span className="conversation-meta"><small>{item.time}</small>{item.unread > 0 && <b>{item.unread}</b>}</span></button>)}</aside>
        <section className="conversation-pane">
          <header><span className="conversation-avatar">{selected.initials}</span><div><strong>{selected.name}</strong><small>Community conversation</small></div></header>
          <div className="conversation-thread">
            <p className="incoming-message">{conversations.find(item => item.id === selected.id)?.preview ?? selected.preview}</p>
            {threadState.messages.map(message => <p className="sent-message" key={message.id}><span>{message.text}</span><small>{formatCommunityMessageTime(message.createdAt)}</small></p>)}
            {sent.map((text, index) => <p className="sent-message" key={`local-${index}`}>{text}</p>)}
          </div>
          {threadState.error && <p className="community-post-error" role="alert">{threadState.error}</p>}
          <form onSubmit={sendMessage}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Write a message..." aria-label="Message" /><button type="submit" aria-label="Send"><Icon name="arrow" /></button></form>
        </section>
      </div>
    </main>
  </MemberShell>
}
