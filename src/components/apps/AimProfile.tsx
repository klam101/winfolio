import { useRef, useState } from 'react'
import { Button } from '../../os/ui/controls'
import MenuBar, { type Menu } from '../chrome/MenuBar'
import StatusBar from '../chrome/StatusBar'
import MessageBox from '../chrome/MessageBox'
import Rich from '../Rich'
import selfImg from '../../assets/bio/self.png'
import { about } from '../../data/about'
import { resume } from '../../data/resume'
import { useOpenWindow, useWindows } from '../../os/store/windows'
import { WINDOW_IDS } from '../../windows/ids'

type Buddy = { label: string; onClick: () => void };
type BuddyGroup = { name: string; buddies: Buddy[] };

const openLink = (url: string) => window.open(url, "_blank", "noopener");

function AimProfile() {
  const openWindow = useOpenWindow();
  const closeWindow = useWindows((s) => s.closeWindow);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [selectedBuddy, setSelectedBuddy] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState(resume.experience[0].id);
  const [away, setAway] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const jobRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Picking a co-worker in the buddy list expands that job and scrolls it into view (after it renders)
  function showJob(id: string) {
    setExpandedJob(id);
    requestAnimationFrame(() => jobRefs.current[id]?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  }

  const current = resume.experience[0];

  const groups: BuddyGroup[] = [
    { name: "Buddies", buddies: [
      { label: "GitHub", onClick: () => openLink("https://github.com/klam101") },
      { label: "LinkedIn", onClick: () => openLink("https://linkedin.com/in/kevinylam") },
    ]},
    { name: "Co-Workers", buddies: resume.experience.map((job) => ({
      label: job.short,
      onClick: () => showJob(job.id),
    }))},
    { name: "Kevin's Stuff", buddies: [
      { label: "Resume.doc", onClick: () => openWindow(WINDOW_IDS.resume) },
      { label: "Projects", onClick: () => openWindow(WINDOW_IDS.projects) },
      { label: "Mail Kevin", onClick: () => openWindow(WINDOW_IDS.compose) },
    ]},
  ];

  const menus: Menu[] = [
    { label: "My AIM", items: [{ label: away ? "I'm Back" : "Away Message", onClick: () => setAway(!away) }, { divider: true }, { label: "Close", onClick: () => closeWindow(WINDOW_IDS.about) }] },
    { label: "People", items: [
      { label: "Send Instant Message", onClick: () => openWindow(WINDOW_IDS.compose) },
      { label: "Get Buddy Info", onClick: () => profileRef.current?.scrollTo({ top: 0, behavior: "smooth" }) },
      { label: "Add Buddy..." },
    ]},
    { label: "Help", items: [{ label: "About AIM", onClick: () => setShowAbout(true) }] },
  ];

  return (
    <div className="app aim">
      <MenuBar menus={menus}/>
      <div className="aim-banner">
        <span className="aim-logo">AIM</span>
        <span>Buddy Info: <strong>{about.screenName}</strong></span>
      </div>
      <div className="aim-body">
        <div className="aim-side">
          <div className="aim-buddylist sunken">
            {groups.map((group) => {
              const isCollapsed = collapsed[group.name];
              return (
                <div key={group.name}>
                  <div className="aim-group" onClick={() => setCollapsed({ ...collapsed, [group.name]: !isCollapsed })}>
                    {isCollapsed ? "▸" : "▾"} {group.name} ({group.buddies.length}/{group.buddies.length})
                  </div>
                  {!isCollapsed && group.buddies.map((buddy) => (
                    <div
                      key={buddy.label}
                      className={`list-row aim-buddy${selectedBuddy === buddy.label ? ' selected' : ''}`}
                      onClick={() => { setSelectedBuddy(buddy.label); buddy.onClick(); }}
                    >
                      {buddy.label}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="aim-actions">
            <Button onClick={() => openWindow(WINDOW_IDS.compose)}>IM</Button>
            <Button onClick={() => profileRef.current?.scrollTo({ top: 0, behavior: "smooth" })}>Info</Button>
            <Button onClick={() => setAway(!away)}>{away ? "Back" : "Away"}</Button>
          </div>
        </div>

        <div className="aim-profile sunken" ref={profileRef}>
          <div className="aim-card">
            <img src={selfImg} alt="Kevin Lam" className="aim-photo"/>
            <table className="aim-facts">
              <tbody>
                <tr><th>Screen Name:</th><td>{about.screenName}</td></tr>
                <tr><th>Status:</th><td>{away ? "Away" : "Online"}</td></tr>
                <tr><th>Currently:</th><td>{current.role}, {current.short}</td></tr>
                <tr><th>School:</th><td>{resume.education[0].school}</td></tr>
                <tr><th>Warning Level:</th><td>0%</td></tr>
              </tbody>
            </table>
          </div>

          {away && (
            <div className="aim-away">
              <strong>Away message</strong> <span className="dim">(Auto-response)</span>
              <p>{about.awayMessage}</p>
            </div>
          )}

          <h2>{about.headline}</h2>
          <p className="aim-tagline">{about.tagline}</p>
          {about.profile.map((p) => <p key={p}>{p}</p>)}

          <h3>Experience</h3>
          {resume.experience.map((job) => {
            const open = expandedJob === job.id;
            return (
              <div key={job.id} className="aim-job" ref={(el) => { jobRefs.current[job.id] = el; }}>
                <div className="aim-job-head" onClick={() => setExpandedJob(open ? "" : job.id)}>
                  {open ? "▾" : "▸"} <strong>{job.role}</strong>, {job.org} <span className="dim">({job.date})</span>
                </div>
                {open && <ul>{job.bullets.map((b) => <li key={b}><Rich text={b}/></li>)}</ul>}
              </div>
            );
          })}

          <h3>Education</h3>
          {resume.education.map((e) => <p key={e.school}><strong>{e.school}</strong>, {e.degree} ({e.date}, {e.gpa})</p>)}

          <h3>Skills</h3>
          <ul>{resume.skills.map((s) => <li key={s.group}><strong>{s.group}:</strong> {s.items}</li>)}</ul>

          <h3>Involvement</h3>
          {about.involvement.map((l) => (
            <div key={l.org}>
              <p><strong>{l.role}</strong>, {l.org} <span className="dim">({l.date})</span></p>
              <ul>{l.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </div>
          ))}

          <h3>Interests</h3>
          <ul>{about.interests.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      </div>
      <StatusBar cells={[`${about.screenName} is ${away ? "away" : "online"}`, "Warning level: 0%"]}/>
      {showAbout && (
        <MessageBox
          title="About AIM"
          message="Kevin's buddy info. Click a co-worker in the Buddy List to see that job, or IM to send a message."
          buttons={[{ value: "OK", onClick: () => setShowAbout(false) }]}
          onClose={() => setShowAbout(false)}
        />
      )}
    </div>
  );
}

export default AimProfile
