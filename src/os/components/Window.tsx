import { useRef, type CSSProperties, type PointerEvent } from "react";
import { TitleBar, TitleButton } from "../ui/TitleBar";
import { cx } from "../ui/cx";
import { TASKBAR_HEIGHT, useWindows, type Rect, type WindowState } from "../store/windows";
import type { WindowDef } from "../../windows/registry";

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
const EDGES: Edge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

// Invisible grips: 4px along each edge, 12px squares at the corners
const GRIP_CLASS: Record<Edge, string> = {
  n: "top-0 left-3 right-3 h-1 cursor-ns-resize",
  s: "bottom-0 left-3 right-3 h-1 cursor-ns-resize",
  e: "right-0 top-3 bottom-3 w-1 cursor-ew-resize",
  w: "left-0 top-3 bottom-3 w-1 cursor-ew-resize",
  nw: "top-0 left-0 w-3 h-3 cursor-nwse-resize",
  se: "bottom-0 right-0 w-3 h-3 cursor-nwse-resize",
  ne: "top-0 right-0 w-3 h-3 cursor-nesw-resize",
  sw: "bottom-0 left-0 w-3 h-3 cursor-nesw-resize",
};

// How much of a dragged window must stay on screen so it can always be grabbed again
const KEEP_VISIBLE = 64;

function moveRect(start: Rect, dx: number, dy: number): Rect {
  const maxY = window.innerHeight - TASKBAR_HEIGHT - 18;
  return {
    ...start,
    x: Math.min(Math.max(start.x + dx, KEEP_VISIBLE - start.width), window.innerWidth - KEEP_VISIBLE),
    y: Math.min(Math.max(start.y + dy, 0), maxY),
  };
}

// Computed from the rect at pointer-down rather than accumulated, so the window can't drift.
// West and north grips move the origin too, keeping the opposite edge still.
function resizeRect(start: Rect, edge: Edge, dx: number, dy: number, minW: number, minH: number): Rect {
  let { x, y, width, height } = start;
  const right = start.x + start.width;
  const bottom = start.y + start.height;

  if (edge.includes("e")) width = Math.min(start.width + dx, window.innerWidth - start.x);
  if (edge.includes("s")) height = Math.min(start.height + dy, window.innerHeight - TASKBAR_HEIGHT - start.y);
  if (edge.includes("w")) {
    x = Math.max(0, Math.min(start.x + dx, right - minW));
    width = right - x;
  }
  if (edge.includes("n")) {
    y = Math.max(0, Math.min(start.y + dy, bottom - minH));
    height = bottom - y;
  }
  return { x, y, width: Math.max(width, minW), height: Math.max(height, minH) };
}

type Gesture = { kind: "move" | Edge; px: number; py: number; rect: Rect };

interface WindowProps {
  state: WindowState;
  def: WindowDef;
  zIndex: number;
  active: boolean;
}

function Window({ state, def, zIndex, active }: WindowProps) {
  const { id, x, y, width, height, minimized, maximized } = state;
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, setRect } = useWindows();
  const gesture = useRef<Gesture | null>(null);

  const resizable = def.resizable !== false;
  const minW = def.minWidth ?? 240;
  const minH = def.minHeight ?? 140;

  function begin(kind: Gesture["kind"], e: PointerEvent<HTMLElement>) {
    if (maximized || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { kind, px: e.clientX, py: e.clientY, rect: { x, y, width, height } };
    document.body.classList.add("os-interacting");
  }

  function onMove(e: PointerEvent<HTMLElement>) {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.px;
    const dy = e.clientY - g.py;
    setRect(id, g.kind === "move" ? moveRect(g.rect, dx, dy) : resizeRect(g.rect, g.kind, dx, dy, minW, minH));
  }

  function end() {
    gesture.current = null;
    document.body.classList.remove("os-interacting");
  }

  const dragHandlers = (kind: Gesture["kind"]) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => begin(kind, e),
    onPointerMove: onMove,
    onPointerUp: end,
    onPointerCancel: end,
  });

  const style: CSSProperties = maximized
    ? { left: 0, top: 0, right: 0, bottom: TASKBAR_HEIGHT, zIndex }
    : { left: x, top: y, width, height, zIndex };

  return (
    <div
      role="dialog"
      aria-label={def.title}
      data-window={id}
      // Minimized windows stay mounted so videos, iframes and drafts keep their state
      className={cx("fixed flex flex-col bg-win-face bevel-raised p-0.75 text-win-text", minimized && "hidden")}
      style={style}
      onPointerDownCapture={() => { if (!active) focusWindow(id); }}
    >
      <TitleBar
        title={def.title}
        icon={def.titleIcon}
        active={active}
        onDoubleClick={() => { if (resizable) toggleMaximize(id); }}
        {...dragHandlers("move")}
        buttons={
          <>
            <TitleButton glyph="minimize" label="Minimize" onClick={() => minimizeWindow(id)} />
            <TitleButton
              glyph={maximized ? "restore" : "maximize"}
              label={maximized ? "Restore" : "Maximize"}
              disabled={!resizable}
              onClick={() => toggleMaximize(id)}
            />
            <TitleButton glyph="close" label="Close" onClick={() => closeWindow(id)} />
          </>
        }
      />
      <div
        className={cx(
          "window-body flex-1 min-h-0 mt-0.5",
          def.chromeless ? "flex flex-col overflow-hidden" : "overflow-auto bg-win-face bevel-sunken p-0.5",
        )}
      >
        {def.render()}
      </div>
      {resizable && !maximized && EDGES.map((edge) => (
        <div key={edge} data-grip={edge} aria-hidden className={cx("absolute z-10 touch-none", GRIP_CLASS[edge])} {...dragHandlers(edge)} />
      ))}
    </div>
  );
}

export default Window
