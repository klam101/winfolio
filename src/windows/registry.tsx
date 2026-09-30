import { type ComponentType, type ReactElement, type ReactNode } from "react";
import { Desk100, Inetcpl1313, Mailnews12, Mplayer10, Sendmail2001, User, Wab321011, Wordpad } from "@react95/icons";
import WordResume from "../components/apps/WordResume";
import MediaPlayer from "../components/apps/MediaPlayer";
import AimProfile from "../components/apps/AimProfile";
import OutlookExpress from "../components/apps/outlook/OutlookExpress";
import Compose from "../components/apps/outlook/Compose";
import AddressBook from "../components/apps/outlook/AddressBook";
import Winamp from "../components/apps/Winamp";
import WinampIcon from "../os/icons/WinampIcon";
import DisplayProperties from "../os/apps/DisplayProperties";
import { setDefaultWindowSize } from "../os/store/windows";
import { WINDOW_IDS } from "./ids";

export { WINDOW_IDS };

type IconComponent = ComponentType<{ variant?: "32x32_4" | "16x16_4" }>;

export type WindowDef = {
  title: string;
  // Label under the desktop icon, when it differs from the window title
  label?: string;
  // File type shown by "Arrange Icons > by Type"
  type: string;
  Icon: IconComponent;
  // Built once so the title bar and taskbar don't re-create it every render
  titleIcon: ReactElement;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  // Fixed-size dialogs (e.g. Display Properties) can't be resized or maximized
  resizable?: boolean;
  // Apps that draw their own menu bar, toolbar and status bar edge to edge
  chromeless?: boolean;
  // Apps that draw their own windows (Winamp) get a pass-through layer instead of a window frame
  frameless?: boolean;
  render: () => ReactNode;
};

function defineWindow(def: Omit<WindowDef, "titleIcon">): WindowDef {
  return { ...def, titleIcon: <def.Icon variant="16x16_4" /> };
}

const windows: Record<string, WindowDef> = {
  [WINDOW_IDS.about]: defineWindow({
    title: "Buddy Info: KevinLam", label: "About Me", type: "Application", Icon: User,
    width: 700, height: 560, minWidth: 380, minHeight: 320, chromeless: true,
    render: () => <AimProfile />,
  }),
  [WINDOW_IDS.resume]: defineWindow({
    title: "Microsoft Word - Resume.doc", label: "Resume.doc", type: "Microsoft Word Document", Icon: Wordpad,
    width: 860, height: 640, minWidth: 360, minHeight: 300, chromeless: true,
    render: () => <WordResume />,
  }),
  [WINDOW_IDS.projects]: defineWindow({
    title: "Media Player - Projects", label: "Projects", type: "Application", Icon: Mplayer10,
    width: 820, height: 580, minWidth: 360, minHeight: 360, chromeless: true,
    render: () => <MediaPlayer />,
  }),
  [WINDOW_IDS.contact]: defineWindow({
    title: "Inbox - Outlook Express", label: "Mail", type: "Application", Icon: Mailnews12,
    width: 820, height: 560, minWidth: 420, minHeight: 340, chromeless: true,
    render: () => <OutlookExpress />,
  }),
  [WINDOW_IDS.compose]: defineWindow({
    title: "New Message", type: "Application", Icon: Sendmail2001,
    width: 560, height: 440, minWidth: 340, minHeight: 300, chromeless: true,
    render: () => <Compose />,
  }),
  [WINDOW_IDS.addressBook]: defineWindow({
    title: "Address Book", type: "Application", Icon: Wab321011,
    width: 500, height: 260, minWidth: 320, minHeight: 180, chromeless: true,
    render: () => <AddressBook />,
  }),
  [WINDOW_IDS.display]: defineWindow({
    title: "Display Properties", type: "Control Panel", Icon: Desk100,
    width: 404, height: 454, resizable: false, chromeless: true,
    render: () => <DisplayProperties />,
  }),
  [WINDOW_IDS.winamp]: defineWindow({
    title: "Winamp", type: "Application", Icon: WinampIcon,
    width: 275, height: 348, frameless: true,
    render: () => <Winamp />,
  }),
  [WINDOW_IDS.browser]: defineWindow({
    title: "Browser", type: "Application", Icon: Inetcpl1313,
    width: 820, height: 520,
    render: () => <iframe title="browser" src="https://swisscows.com" className="block w-full h-full border-0 bg-white" />,
  }),
};

setDefaultWindowSize((id) => windows[id] ?? { width: 480, height: 360 });

export function getWindowDef(id: string): WindowDef | undefined {
  return windows[id];
}

// Shortcuts on the desktop, in their default order
export const DESKTOP_IDS = [
  WINDOW_IDS.about,
  WINDOW_IDS.resume,
  WINDOW_IDS.projects,
  WINDOW_IDS.contact,
  WINDOW_IDS.winamp,
  WINDOW_IDS.browser,
];

// Everything listed under Start > Programs
export const PROGRAM_IDS = [
  WINDOW_IDS.about,
  WINDOW_IDS.projects,
  WINDOW_IDS.contact,
  WINDOW_IDS.addressBook,
  WINDOW_IDS.winamp,
  WINDOW_IDS.browser,
];
