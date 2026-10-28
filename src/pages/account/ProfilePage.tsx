import { FormEvent, useState } from "react"
import type { AuthSession } from "../../components"
import { AppLink, Icon } from "../../site"
import { MemberShell } from "./MemberShell"

type ProfileData = {
  name: string
  email: string
  phone: string
  location: string
  title: string
  shortBio: string
  story: string
  linkedin: string
  website: string
  photoFilename: string
}

function readProfile(session: AuthSession) {
  const defaults: ProfileData = {
    name: session.name,
    email: session.email,
    phone: "95 9 421 565 012",
    location: "Yangon",
    title: "Founder & Product Lead",
    shortBio: "Building practical software for growing teams across Myanmar",
    story: "I started in product design and later met a local business owner who had spent thousands of dollars on software nobody could use.",
    linkedin: "linkedin.com/in/thiriaung",
    website: "thiriaung.example",
    photoFilename: "",
  }
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(`founders:profile:${session.accountId}`) ?? "null")
    if (typeof stored !== "object" || stored === null) return { profile: defaults, error: "" }
    const value = stored as Partial<ProfileData>
    return {
      profile: Object.fromEntries(Object.keys(defaults).map(key => [
        key,
        typeof value[key as keyof ProfileData] === "string" ? value[key as keyof ProfileData] : defaults[key as keyof ProfileData],
      ])) as ProfileData,
      error: "",
    }
  } catch {
    return { profile: defaults, error: "Your saved profile could not be loaded." }
  }
}

export function ProfilePage({ session, onLogout }: { session: AuthSession; onLogout: () => void }) {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [initialProfile] = useState(() => readProfile(session))
  const [profile, setProfile] = useState<ProfileData>(initialProfile.profile)
  const [error, setError] = useState(initialProfile.error)
  const initials = profile.name.split(/\s+/).map(word => word[0]).slice(0, 2).join("").toUpperCase()
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const next: ProfileData = {
      ...profile,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      location: String(form.get("location") ?? ""),
      title: String(form.get("title") ?? ""),
      shortBio: String(form.get("shortBio") ?? ""),
      story: String(form.get("story") ?? ""),
      linkedin: String(form.get("linkedin") ?? ""),
      website: String(form.get("website") ?? ""),
    }
    try {
      localStorage.setItem(`founders:profile:${session.accountId}`, JSON.stringify(next))
      setProfile(next)
      setEditing(false)
      setSaved(true)
      setError("")
    } catch {
      setError("Your profile could not be saved. Please try again.")
    }
  }
  const field = (key: keyof typeof profile, label: string) => <label><span>{label}</span>{editing ? <input name={key} defaultValue={profile[key]} required /> : <div className="profile-field-value">{profile[key]}</div>}</label>
  return <MemberShell session={session} onLogout={onLogout} active="My Profile"><main className="dashboard-content profile-content"><header className="profile-heading"><div><h1>My Profile</h1><p>Keep your founder identity clear, current, and visible to the community.</p></div>{!editing && <button type="button" className="dashboard-primary" onClick={() => setEditing(true)}>Edit profile</button>}</header>{saved && <p className="profile-status" role="status">Profile saved.</p>}{error && <p className="community-post-error" role="alert">{error}</p>}<form className="profile-form" onSubmit={save}><aside className="profile-section-nav"><button type="button" className="active">Profile photo</button><button type="button">Personal information</button><button type="button">About</button><button type="button">Social links</button></aside><div className="profile-sections"><section className="profile-panel profile-photo-panel"><header><h2>Profile photo</h2><p>Personalize how you appear across the community.</p></header><div className="profile-photo-row"><span className="dashboard-avatar profile-photo">{initials}</span><div><strong>{profile.name}</strong><button type="button" disabled={!editing}>{profile.photoFilename || "Change photo"}</button></div></div></section><section className="profile-panel"><header><h2>Personal information</h2><p>This information appears throughout the network.</p></header><div className="profile-field-grid">{field("name", "Full name")}{field("email", "Email")}{field("phone", "Phone")}{field("location", "Location")}{field("title", "Job title")}</div></section><section className="profile-panel"><header><h2>About</h2><p>Share what you do and let founders understand your story.</p></header><div className="profile-field-stack">{field("shortBio", "Short bio")}{field("story", "Founder story")}</div></section><section className="profile-panel"><header><h2>Social links</h2><p>Help founders continue from your profile.</p></header><div className="profile-field-grid"><label><span>LinkedIn</span>{editing ? <input name="linkedin" defaultValue={profile.linkedin} /> : <div className="profile-field-value">{profile.linkedin}</div>}</label><label><span>Website</span>{editing ? <input name="website" defaultValue={profile.website} /> : <div className="profile-field-value">{profile.website}</div>}</label></div></section>{editing && <div className="profile-edit-actions"><button type="button" onClick={() => setEditing(false)}>Cancel</button><button type="submit" className="dashboard-primary">Save changes</button></div>}</div></form></main></MemberShell>
}
