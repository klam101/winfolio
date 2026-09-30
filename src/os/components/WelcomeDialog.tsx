import { useState } from "react";
import { InfoBubble, User } from "@react95/icons";
import Dialog from "../ui/Dialog";
import { Button, Checkbox } from "../ui/controls";
import { useOpenWindow } from "../store/windows";
import { usePersistence } from "../store/persistence";
import { useShell } from "../store/shell";
import { about } from "../../data/about";
import { WINDOW_IDS } from "../../windows/ids";

const TIPS = [
  "Right-click the desktop and choose Properties to change the wallpaper or color scheme.",
  "Drag icons anywhere, or click and hold on the desktop to select several at once.",
  "Windows can be resized from any edge or corner, just like the real thing.",
  "My resume opens in Word. Use File > Save As PDF to download a copy.",
];

// Shown after every login, and from Start > Help > Welcome
function WelcomeDialog() {
  const openWindow = useOpenWindow();
  const setWelcomeOpen = useShell((s) => s.setWelcomeOpen);
  const { enabled: remember, setEnabled: setRemember } = usePersistence();
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  const close = () => setWelcomeOpen(false);
  const openAndClose = (id: string) => { openWindow(id); close(); };

  return (
    <Dialog title="Welcome" onClose={close} className="w-[min(560px,calc(100vw-16px))]">
      <h2 className="text-[22px] font-bold mb-2">Welcome to Kevin's Portfolio!</h2>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[260px] flex gap-3 p-4 bg-win-tooltip bevel-sunken">
          <User variant="32x32_4" className="shrink-0" />
          <div className="select-text">
            <p className="font-bold mb-2">Hi there...</p>
            <p className="leading-5">{about.welcome}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Button className="w-30" onClick={() => openAndClose(WINDOW_IDS.resume)}>Resume</Button>
          <Button className="w-30" onClick={() => openAndClose(WINDOW_IDS.projects)}>Latest Projects</Button>
          <Button className="w-30" onClick={() => openAndClose(WINDOW_IDS.compose)}>Contact Me</Button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 px-2 py-1.5 bg-win-tooltip border border-win-shadow">
        <InfoBubble variant="32x32_4" width={16} height={16} className="shrink-0" />
        <p><span className="font-bold">Tip:</span> {tip}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-t-win-shadow shadow-[inset_0_1px_var(--color-win-highlight)]">
        <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)}>
          Remember my desktop changes on this computer
        </Checkbox>
        <Button primary className="w-30" autoFocus onClick={close}>Close</Button>
      </div>
    </Dialog>
  );
}

export default WelcomeDialog
