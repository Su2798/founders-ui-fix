import { AppLink, Icon } from "../../site"
import { Localized } from "../../language"
import { founders } from "./DirectoryPage"
import { profileCopy } from "./FounderProfilePage"

const businessDetails: Record<string, { founded: string; status: string }> = {
  "1": { founded: "Founded 2021", status: "Verified" },
  "2": { founded: "Founded 2020", status: "Under review" },
  "3": { founded: "Founded 2019", status: "Verified" },
  "4": { founded: "Founded 2022", status: "Under review" },
  "5": { founded: "Founded 2023", status: "Verified" },
  "6": { founded: "Founded 2021", status: "Verified" },
  "7": { founded: "Founded 2022", status: "Under review" },
  "8": { founded: "Founded 2020", status: "Verified" },
  "9": { founded: "Founded 2019", status: "Verified" },
  "10": { founded: "Founded 2023", status: "Under review" },
}

export function BusinessProfilePage({ businessId }: { businessId: string }) {
  const founder = founders.find(item => item.id === businessId)

  return <Localized><section className="public-business-page"><div className="shell">
    {founder ? (() => {
      const profile = profileCopy[founder.id]
      const details = businessDetails[founder.id]
      const initials = founder.company.split(/\s+/).map(part => part[0]).slice(0, 2).join("")
      const founderInitials = founder.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("")
      return <>
        <header className="public-business-header">
          <span className="public-business-avatar">{initials}</span>
          <div className="public-business-heading">
            <span className="public-business-eyebrow">Business profile</span>
            <div className="public-business-name-row"><h1>{founder.company}</h1><span className={`public-business-status-tag${details.status === "Verified" ? " verified" : ""}`}>{details.status === "Verified" && <Icon name="check" />}{details.status}</span></div>
            <p>{profile.businessDescription}</p>
            <div className="public-business-meta"><span><Icon name="document" />{founder.industry}</span><span><Icon name="building" />{profile.location}</span><span>{details.founded}</span></div>
          </div>
        </header>

        <div className="public-business-layout">
          <div className="public-business-main">
            <section className="public-business-section">
              <h2>About the business</h2>
              <p>{profile.businessDescription}</p>
              <p>The team focuses on practical service, clear communication, and building with the needs of local customers in mind.</p>
            </section>
            <section className="public-business-section">
              <h2>Founder</h2>
              <article className="public-business-founder-card">
                <header><span className="public-business-founder-avatar">{founderInitials}</span><span className="public-business-founder-verified"><Icon name="check" /></span></header>
                <h3>{founder.name}</h3>
                <span className="public-business-founder-role">{profile.role}</span>
                <p>{profile.businessDescription}</p>
                <div className="public-business-founder-meta"><span><Icon name="building" />{founder.company}</span><span><Icon name="document" />{profile.location}</span></div>
                <AppLink href={`/founder/${founder.id}`} className="public-business-founder-link">View profile</AppLink>
              </article>
            </section>
          </div>

          <aside className="public-business-details">
            <h2>Business details</h2>
            <dl><div><dt>Industry</dt><dd>{founder.industry}</dd></div><div><dt>Location</dt><dd>{profile.location}</dd></div><div><dt>Founded</dt><dd>{details.founded.replace("Founded ", "")}</dd></div></dl>
            <p>Business information is shown as a profile preview.</p>
          </aside>
        </div>
      </>
    })() : <div className="founder-profile-card founder-profile-not-found"><h1>Business not found</h1><p>This business profile is unavailable.</p><AppLink href="/directory" className="button button-primary">Back to directory</AppLink></div>}
  </div></section></Localized>
}
