import { useRef, useState } from 'react'
import { Select } from '../../os/ui/controls'
import { Copy, Cut, FileText, FolderOpen, Paste, Print, Save, Spellchk, Undo } from '@react95/icons'
import MenuBar, { type Menu } from '../chrome/MenuBar'
import { Toolbar, ToolbarButton, ToolbarSeparator } from '../chrome/Toolbar'
import StatusBar from '../chrome/StatusBar'
import MessageBox from '../chrome/MessageBox'
import Rich from '../Rich'
import { resume } from '../../data/resume'
import { useWindows } from '../../os/store/windows'
import { useElementWidth } from '../../hooks/useElementWidth'
import { downloadResumePdf, openResumePdf } from '../../utils/resumePdf'
import { WINDOW_IDS } from '../../windows/ids'

const PAGE_WIDTH = 816; // 8.5in at 96dpi
const ZOOM_OPTIONS = ["Page Width", "75%", "100%", "125%", "150%"];

type Box = { title: string; message: string; type?: 'info' | 'warning' | 'error' | 'question' };

function ResumePage() {
  return (
    <>
      <h1>{resume.name}</h1>
      <p className="contact">
        {resume.contact.map((c, i) => (
          <span key={c.url}>{i > 0 && " | "}<a href={c.url} target="_blank" rel="noreferrer">{c.label}</a></span>
        ))}
      </p>

      <h2>EDUCATION</h2>
      {resume.education.map((e) => (
        <div key={e.school}>
          <div className="entry-head"><strong>{e.school}</strong><em>{e.date}</em></div>
          <div className="entry-head"><span className="small-caps">{e.degree}</span><em>{e.gpa}</em></div>
          <ul><li><strong>Coursework</strong> - {e.coursework}</li></ul>
        </div>
      ))}

      <h2>EXPERIENCE</h2>
      {resume.experience.map((job) => (
        <div key={job.id}>
          <div className="entry-head"><strong>{job.org}</strong><em>{job.location}</em></div>
          <div className="entry-head"><span className="small-caps">{job.role}</span><em>{job.date}</em></div>
          <ul>{job.bullets.map((b) => <li key={b}><Rich text={b}/></li>)}</ul>
        </div>
      ))}

      <h2>PROJECTS</h2>
      {resume.projects.map((p) => (
        <div key={p.name}>
          <div className="entry-head">
            <strong>{p.name}</strong>
            <a href={p.link.url} target="_blank" rel="noreferrer"><em>{p.link.label}</em></a>
          </div>
          <span className="small-caps">{p.subtitle}</span>
          <ul>{p.bullets.map((b) => <li key={b}><Rich text={b}/></li>)}</ul>
        </div>
      ))}

      <h2>SKILLS</h2>
      <table className="skills-table">
        <tbody>
          {resume.skills.map((s) => <tr key={s.group}><th>{s.group}</th><td>{s.items}</td></tr>)}
        </tbody>
      </table>
    </>
  );
}

function Ruler({ zoom }: { zoom: number }) {
  const inch = 96 * zoom;
  return (
    <div className="word-ruler-row">
      <div
        className="word-ruler"
        style={{
          width: PAGE_WIDTH * zoom,
          backgroundImage: `repeating-linear-gradient(to right, #000 0 1px, transparent 1px ${inch / 8}px)`,
          backgroundSize: '100% 3px',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#fff',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <span key={n} style={{ left: n * inch }}>{n}</span>)}
      </div>
    </div>
  );
}

function WordResume() {
  const closeWindow = useWindows((s) => s.closeWindow);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const workspaceWidth = useElementWidth(workspaceRef);
  const [zoomChoice, setZoomChoice] = useState("Page Width");
  const [box, setBox] = useState<Box | null>(null);

  const fitZoom = workspaceWidth ? Math.min(1.5, Math.max(0.3, (workspaceWidth - 36) / PAGE_WIDTH)) : 1;
  const zoom = zoomChoice === "Page Width" ? fitZoom : parseInt(zoomChoice) / 100;
  const compact = workspaceWidth > 0 && workspaceWidth < 560;

  function selectAll() {
    if (pageRef.current) window.getSelection()?.selectAllChildren(pageRef.current);
  }

  function wordCount() {
    const words = pageRef.current?.innerText.split(/\s+/).filter(Boolean).length ?? 0;
    setBox({ title: "Word Count", message: `Pages: 1   Words: ${words}` });
  }

  const spellCheck = () => setBox({ title: "Microsoft Word", message: "The spelling check is complete." });

  const menus: Menu[] = [
    { label: "File", items: [
      { label: "New..." }, { label: "Open..." }, { label: "Close", onClick: () => closeWindow(WINDOW_IDS.resume) },
      { divider: true },
      { label: "Save As PDF...", onClick: downloadResumePdf },
      { divider: true },
      { label: "Print...", onClick: openResumePdf },
      { divider: true },
      { label: "Exit", onClick: () => closeWindow(WINDOW_IDS.resume) },
    ]},
    { label: "Edit", items: [
      { label: "Undo" }, { divider: true }, { label: "Cut" }, { label: "Copy" }, { label: "Paste" },
      { divider: true }, { label: "Select All", onClick: selectAll }, { label: "Find..." },
    ]},
    { label: "View", items: [
      { label: "Normal" }, { label: "Page Layout" }, { divider: true },
      ...ZOOM_OPTIONS.map((z) => ({ label: `Zoom ${z}`, onClick: () => setZoomChoice(z) })),
    ]},
    { label: "Insert", items: [{ label: "Break..." }, { label: "Page Numbers..." }, { label: "Picture..." }] },
    { label: "Format", items: [{ label: "Font..." }, { label: "Paragraph..." }, { label: "Bullets and Numbering..." }] },
    { label: "Tools", items: [{ label: "Spelling...", onClick: spellCheck }, { label: "Word Count...", onClick: wordCount }, { label: "Options..." }] },
    { label: "Table", items: [{ label: "Insert Table..." }, { label: "Gridlines" }] },
    { label: "Window", items: [{ label: "New Window" }, { label: "Arrange All" }, { divider: true }, { label: "1 Resume.doc", onClick: () => {} }] },
    { label: "Help", items: [{ label: "About Microsoft Word", onClick: () => setBox({
      title: "About Microsoft Word",
      message: "Resume.doc by Kevin Lam. This is the web version of my resume: use File > Save As PDF to download a copy.",
    }) }] },
  ];

  return (
    <div className="app">
      <MenuBar menus={menus}/>
      <Toolbar>
        <ToolbarButton title="New" icon={<FileText variant="16x16_4"/>}/>
        <ToolbarButton title="Open" icon={<FolderOpen variant="16x16_4"/>}/>
        <ToolbarButton title="Save as PDF" icon={<Save variant="16x16_4"/>} onClick={downloadResumePdf}/>
        <ToolbarSeparator/>
        <ToolbarButton title="Print (opens the PDF)" icon={<Print variant="16x16_4"/>} onClick={openResumePdf}/>
        <ToolbarButton title="Spelling" icon={<Spellchk variant="16x16_4"/>} onClick={spellCheck}/>
        <ToolbarSeparator/>
        <ToolbarButton title="Cut" icon={<Cut variant="16x16_4"/>}/>
        <ToolbarButton title="Copy" icon={<Copy variant="16x16_4"/>}/>
        <ToolbarButton title="Paste" icon={<Paste variant="16x16_4"/>}/>
        <ToolbarButton title="Undo" icon={<Undo variant="16x16_4"/>}/>
        <ToolbarSeparator/>
        <Select
          className="word-zoom"
          aria-label="Zoom"
          options={ZOOM_OPTIONS}
          value={zoomChoice}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setZoomChoice(e.target.value)}
        />
      </Toolbar>
      {!compact && (
        <Toolbar>
          <span className="word-fake-select sunken" style={{ width: 90 }}>Normal</span>
          <span className="word-fake-select sunken" style={{ width: 140 }}>Times New Roman</span>
          <span className="word-fake-select sunken" style={{ width: 30 }}>12</span>
          <ToolbarSeparator/>
          <span className="tb-btn"><b>B</b></span>
          <span className="tb-btn"><i style={{ fontFamily: 'serif' }}>I</i></span>
          <span className="tb-btn"><u>U</u></span>
          <ToolbarSeparator/>
          <span className="tb-btn">≡</span>
        </Toolbar>
      )}
      {!compact && <Ruler zoom={zoom}/>}
      <div className="word-workspace" ref={workspaceRef}>
        <div className="word-page" ref={pageRef} style={{ zoom }}>
          <ResumePage/>
        </div>
      </div>
      <StatusBar cells={[
        <>Page 1 &nbsp; Sec 1 &nbsp; 1/1</>,
        'At 1"',
        'Ln 1   Col 1',
        <span className="dim">REC TRK EXT OVR</span>,
      ]}/>
      {box && (
        <MessageBox
          title={box.title}
          message={box.message}
          type={box.type}
          buttons={[{ value: "OK", onClick: () => setBox(null) }]}
          onClose={() => setBox(null)}
        />
      )}
    </div>
  );
}

export default WordResume
