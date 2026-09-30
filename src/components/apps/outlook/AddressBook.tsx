import { useState } from 'react'
import { Mail } from '@react95/icons'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { Toolbar, ToolbarButton, ToolbarSeparator } from '../../chrome/Toolbar'
import StatusBar from '../../chrome/StatusBar'
import { OWNER } from '../../../data/mail'
import { useOpenWindow } from '../../../os/store/windows'
import { WINDOW_IDS } from '../../../windows/ids'

type Entry = { id: string; icon: React.ReactNode; name: string; address: string; open: () => void };

function AddressBook() {
  const openWindow = useOpenWindow();
  const [selectedId, setSelectedId] = useState("email");

  const entries: Entry[] = [
    { id: "email", icon: <Mail variant="16x16_4"/>, name: OWNER.name, address: OWNER.email, open: () => openWindow(WINDOW_IDS.compose) },
    { id: "github", icon: <FaGithub size={14}/>, name: `${OWNER.name} (GitHub)`, address: "github.com/klam101", open: () => window.open("https://github.com/klam101", "_blank", "noopener") },
    { id: "linkedin", icon: <FaLinkedin size={14}/>, name: `${OWNER.name} (LinkedIn)`, address: "linkedin.com/in/kevinylam", open: () => window.open("https://linkedin.com/in/kevinylam", "_blank", "noopener") },
  ];
  const selected = entries.find((e) => e.id === selectedId);

  return (
    <div className="app">
      <Toolbar>
        <ToolbarButton label="New Contact"/>
        <ToolbarButton label="Properties"/>
        <ToolbarButton label="Delete"/>
        <ToolbarSeparator/>
        <ToolbarButton label={selectedId === "email" ? "Send Mail" : "Open Page"} onClick={selected?.open}/>
      </Toolbar>
      <div className="ab-list sunken">
        <div className="ab-row oe-head"><span>Display Name</span><span>E-Mail Address / Web Page</span></div>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`list-row ab-row${entry.id === selectedId ? ' selected' : ''}`}
            onClick={() => setSelectedId(entry.id)}
            onDoubleClick={entry.open}
          >
            <span className="flex items-center gap-2">{entry.icon}{entry.name}</span>
            <span className="selectable">{entry.address}</span>
          </div>
        ))}
      </div>
      <StatusBar cells={[`${entries.length} item(s). Double-click to open.`]}/>
    </div>
  );
}

export default AddressBook
