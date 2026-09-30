import Window from '../os/components/Window'
import { cx } from '../os/ui/cx'
import { TASKBAR_HEIGHT, useWindows, type WindowState } from '../os/store/windows'
import { getWindowDef, type WindowDef } from '../windows/registry'

// Above the desktop; the taskbar, Start menu and dialogs stack above all windows
const WINDOW_Z_BASE = 10;

// For apps that draw their own windows (Winamp): a screen-sized layer that lets clicks through to the
// desktop except on the app's own elements (.winamp-layer rules in apps.css). It hides rather than
// unmounts when minimized, so music keeps playing.
function FramelessWindow({ state, def, zIndex }: { state: WindowState; def: WindowDef; zIndex: number }) {
  const focusWindow = useWindows((s) => s.focusWindow);
  return (
    <div
      data-window={state.id}
      aria-label={def.title}
      className={cx("fixed inset-x-0 top-0 pointer-events-none", state.minimized && "hidden")}
      style={{ bottom: TASKBAR_HEIGHT, zIndex }}
      onPointerDownCapture={() => focusWindow(state.id)}
    >
      {def.render()}
    </div>
  );
}

function WindowManager() {
  const openWindows = useWindows((s) => s.openWindows);
  const zOrder = useWindows((s) => s.zOrder);
  const activeId = useWindows((s) => s.activeId);

  return openWindows.map((state) => {
    const def = getWindowDef(state.id);
    if (!def) return null;
    const zIndex = WINDOW_Z_BASE + zOrder.indexOf(state.id);
    if (def.frameless) return <FramelessWindow key={state.id} state={state} def={def} zIndex={zIndex} />;
    return (
      <Window
        key={state.id}
        state={state}
        def={def}
        zIndex={zIndex}
        active={state.id === activeId}
      />
    );
  });
}

export default WindowManager
