import { forwardRef } from "react";
import { Computer3, Desk100, FileText, FolderOpen, Help, HelpBook, Mailnews12, Mplayer10, Sendmail2001, Settings, User, Wordpad } from "@react95/icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import MenuList, { type MenuItem } from "./MenuList";
import { useOpenWindow } from "../store/windows";
import { useShell } from "../store/shell";
import { getWindowDef, PROGRAM_IDS, WINDOW_IDS } from "../../windows/registry";

interface StartMenuProps {
  onClose: () => void;
  onShutdown: () => void;
}

const openLink = (url: string) => window.open(url, "_blank", "noopener");

// Win95 Start menu: the vertical banner on the left and a large-icon menu, with submenus
const StartMenu = forwardRef<HTMLDivElement, StartMenuProps>(function StartMenu({ onClose, onShutdown }, ref) {
  const openWindow = useOpenWindow();
  const setWelcomeOpen = useShell((s) => s.setWelcomeOpen);

  const small = (id: string) => {
    const { Icon, title, label } = getWindowDef(id)!;
    return { label: label ?? title, icon: <Icon variant="16x16_4" />, onClick: () => openWindow(id) };
  };

  const items: MenuItem[] = [
    { label: "Projects", icon: <Mplayer10 variant="32x32_4" />, onClick: () => openWindow(WINDOW_IDS.projects) },
    { label: "Resume", icon: <Wordpad variant="32x32_4" />, onClick: () => openWindow(WINDOW_IDS.resume) },
    { label: "About Me", icon: <User variant="32x32_4" />, onClick: () => openWindow(WINDOW_IDS.about) },
    { label: "Contact", icon: <Mailnews12 variant="32x32_4" />, items: [
      { label: "Outlook Express", icon: <Mailnews12 variant="16x16_4" />, onClick: () => openWindow(WINDOW_IDS.contact) },
      { label: "New Message...", icon: <Sendmail2001 variant="16x16_4" />, onClick: () => openWindow(WINDOW_IDS.compose) },
      { divider: true },
      { label: "GitHub", icon: <FaGithub size={14} />, onClick: () => openLink("https://github.com/klam101") },
      { label: "LinkedIn", icon: <FaLinkedin size={14} />, onClick: () => openLink("https://linkedin.com/in/kevinylam") },
    ]},
    { divider: true },
    { label: "Programs", icon: <FolderOpen variant="32x32_4" />, items: PROGRAM_IDS.map(small) },
    { label: "Documents", icon: <FileText variant="32x32_4" />, items: [small(WINDOW_IDS.resume)] },
    { label: "Settings", icon: <Settings variant="32x32_4" />, items: [
      { label: "Display Properties", icon: <Desk100 variant="16x16_4" />, onClick: () => openWindow(WINDOW_IDS.display) },
    ]},
    { label: "Help", icon: <HelpBook variant="32x32_4" />, items: [
      { label: "Welcome...", icon: <Help variant="16x16_4" />, onClick: () => setWelcomeOpen(true) },
    ]},
    { divider: true },
    { label: "Shut Down...", icon: <Computer3 variant="32x32_4" />, onClick: onShutdown },
  ];

  return (
    <div ref={ref} className="fixed left-0.5 bottom-6.5 z-950 flex bg-win-face bevel-raised p-0.75">
      <div className="w-5.5 flex items-end justify-center bg-linear-to-t from-win-title to-win-shadow">
        <span className="[writing-mode:vertical-rl] rotate-180 py-1.5 text-[18px] font-bold text-win-face tracking-wide">
          Win<span className="text-white">folio</span>
        </span>
      </div>
      <MenuList large flat items={items} onDone={onClose} />
    </div>
  );
});

export default StartMenu
