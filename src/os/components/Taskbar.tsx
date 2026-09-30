import { useEffect, useRef, useState } from "react";
import { Logo } from "@react95/icons";
import StartMenu from "./StartMenu";
import Shutdown from "../../components/Shutdown";
import { cx } from "../ui/cx";
import { TASKBAR_HEIGHT, useWindows } from "../store/windows";
import { getWindowDef } from "../../windows/registry";

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="h-5.5 flex items-center px-2.5 bevel-status whitespace-nowrap" title={now.toLocaleDateString(undefined, { dateStyle: "full" })}>
      {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
    </div>
  );
}

function Taskbar() {
  const { openWindows, activeId, focusWindow, minimizeWindow, openWindow } = useWindows();
  const [startOpen, setStartOpen] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const startButton = useRef<HTMLButtonElement>(null);
  const startMenu = useRef<HTMLDivElement>(null);

  // Close the Start menu on any click outside it (the Start button toggles it itself)
  useEffect(() => {
    if (!startOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!startMenu.current?.contains(target) && !startButton.current?.contains(target)) setStartOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setStartOpen(false); };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [startOpen]);

  function onWindowButton(id: string, minimized: boolean) {
    if (id === activeId && !minimized) minimizeWindow(id);
    else if (minimized) openWindow(id);
    else focusWindow(id);
  }

  return (
    <>
      <div
        className="fixed bottom-0 inset-x-0 z-900 flex items-center gap-1 px-0.5 bg-win-face shadow-[inset_0_1px_var(--color-win-light),inset_0_2px_var(--color-win-highlight)]"
        style={{ height: TASKBAR_HEIGHT }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <button
          ref={startButton}
          type="button"
          aria-expanded={startOpen}
          onClick={() => setStartOpen((open) => !open)}
          className={cx("h-5.5 flex items-center gap-0.75 px-1 font-bold bg-win-face shrink-0", startOpen ? "bevel-pressed" : "bevel-button")}
        >
          <Logo variant="32x32_4" width={20} height={20} />
          Start
        </button>

        <div className="flex-1 min-w-0 flex gap-0.75">
          {openWindows.map(({ id, minimized }) => {
            const def = getWindowDef(id);
            if (!def) return null;
            const pressed = id === activeId && !minimized;
            return (
              <button
                key={id}
                type="button"
                data-taskbar-button={id}
                title={def.title}
                onClick={() => onWindowButton(id, minimized)}
                className={cx(
                  "h-5.5 flex-1 min-w-0 max-w-40 flex items-center gap-1 px-1 text-left",
                  pressed ? "bevel-pressed bg-dither font-bold" : "bevel-button bg-win-face",
                )}
              >
                <span className="shrink-0 flex">{def.titleIcon}</span>
                <span className="truncate">{def.title}</span>
              </button>
            );
          })}
        </div>

        <Clock />
      </div>

      {startOpen && (
        <StartMenu
          ref={startMenu}
          onClose={() => setStartOpen(false)}
          onShutdown={() => setShowShutdown(true)}
        />
      )}
      {showShutdown && <Shutdown close={() => setShowShutdown(false)} />}
    </>
  );
}

export default Taskbar
