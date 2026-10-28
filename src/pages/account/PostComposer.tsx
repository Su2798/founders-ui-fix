import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Icon } from "../../site"
import type { PostDraft } from "./postsStorage"

export function PostComposer({
  initialValues,
  communityOptions,
  allowInitialCommunity = false,
  onSubmit,
  onClose,
  submitLabel = "Post",
}: {
  initialValues?: PostDraft
  communityOptions: string[]
  allowInitialCommunity?: boolean
  onSubmit: (draft: PostDraft) => void
  onClose: () => void
  submitLabel?: string
}) {
  const [draft, setDraft] = useState<PostDraft>(() => ({
    community: initialValues?.community && communityOptions.includes(initialValues.community)
      ? initialValues.community
      : communityOptions[0] ?? "",
    title: initialValues?.title ?? "",
    body: initialValues?.body ?? "",
    image: initialValues?.image ?? "",
  }))
  const [attachmentError, setAttachmentError] = useState("")
  const imageInputRef = useRef<HTMLInputElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleInputRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setAttachmentError("Please choose an image file.")
      event.currentTarget.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const image = reader.result
      if (typeof image === "string") {
        setDraft(current => ({ ...current, image }))
        setAttachmentError("")
      }
    }
    reader.onerror = () => setAttachmentError("The image could not be loaded. Please try another file.")
    reader.readAsDataURL(file)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draft.title.trim()
    const body = draft.body.trim()
    if (!title || !body || !options.includes(draft.community)) return
    onSubmit({ ...draft, title, body })
  }

  const options = allowInitialCommunity && initialValues?.community && !communityOptions.includes(initialValues.community)
    ? [initialValues.community, ...communityOptions]
    : communityOptions
  const communityIsUnjoined = Boolean(initialValues?.community && !communityOptions.includes(initialValues.community))

  return <div className="community-post-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="community-post-modal" role="dialog" aria-modal="true" aria-labelledby="post-composer-title">
      <header>
        <div><h2 id="post-composer-title">Share with the community</h2><p>Keep it specific, useful, and grounded in your experience.</p></div>
        <button type="button" aria-label="Close" onClick={onClose}><Icon name="x" /></button>
      </header>
      <form onSubmit={submit}>
        <div className="community-post-modal-fields">
          <label className="community-post-modal-field" htmlFor="post-composer-community">
            <span>Community</span>
            <select id="post-composer-community" value={draft.community} disabled={!options.length || (allowInitialCommunity && communityIsUnjoined)} onChange={event => setDraft(current => ({ ...current, community: event.target.value }))}>
              {!options.length && <option value="">Join a community before posting</option>}
              {options.map(community => <option key={community} value={community}>{community}</option>)}
            </select>
            {allowInitialCommunity && communityIsUnjoined && <small className="post-composer-note">This post is in a community you have left. Rejoin it to change its community.</small>}
          </label>
          <label className="community-post-modal-field" htmlFor="post-composer-title">
            <span>Title</span>
            <input ref={titleInputRef} id="post-composer-title" value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} maxLength={100} placeholder="What did you learn?" required />
          </label>
          <label className="community-post-modal-field" htmlFor="post-composer-content">
            <span>Content</span>
            <textarea id="post-composer-content" value={draft.body} onChange={event => setDraft(current => ({ ...current, body: event.target.value }))} placeholder="Share something with the community..." required rows={7} />
          </label>
        </div>
        {draft.image && <div className="community-post-image-preview"><img src={draft.image} alt="Selected post image preview" /><button type="button" onClick={() => { setDraft(current => ({ ...current, image: "" })); if (imageInputRef.current) imageInputRef.current.value = "" }}>Remove image</button></div>}
        {attachmentError && <p className="community-attachment-error" role="alert">{attachmentError}</p>}
        <input ref={imageInputRef} className="community-post-file" type="file" accept="image/*" aria-label="Add an image" onChange={selectImage} />
        <div className="community-post-modal-footer">
          <button type="button" className={`community-post-attach${draft.image ? " has-image" : ""}`} onClick={() => imageInputRef.current?.click()}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0L7 9m5-5 5 5" /><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></svg>
            {draft.image ? "Change image" : "Add image"}
          </button>
          <div><button type="button" className="community-post-cancel" onClick={onClose}>Cancel</button><button type="submit" disabled={!options.length || !options.includes(draft.community) || !draft.title.trim() || !draft.body.trim()}>{submitLabel}</button></div>
        </div>
      </form>
    </section>
  </div>
}
