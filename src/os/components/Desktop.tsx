import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import DesktopIcon from "../../components/DesktopIcon";
import { useOpenWindow } from "../store/windows";
import { useContextMenu } from "../store/contextMenu";
import { useDisplaySettings } from "../store/settings";
import { CELL_H, CELL_W, cellToPx, gridSize, useDesktop } from "../store/desktop";
import { wallpaperStyle } from "../wallpapers";
import type { MenuItem } from "./MenuList";
import { DESKTOP_IDS, getWindowDef, WINDOW_IDS } from "../../windows/registry";

const labelOf = (id: string) => { const def = getWindowDef(id)!; return def.label ?? def.title; };

// How far the pointer must move before a press on an icon becomes a drag (so double-click still works)
const DRAG_THRESHOLD = 4;
// The part of a cell an icon occupies, for rubber-band hit testing
const ICON_BOX = { w: CELL_W - 4, h: CELL_H - 6 };

type Gesture =
  | { kind: "icon"; id: string; group: string[]; x: number; y: number; moved: boolean }
  | { kind: "band"; x: number; y: number; base: string[] };

type Band = { x0: number; y0: number; x1: number; y1: number };

function Desktop() {
  const openWindow = useOpenWindow();
  const openContextMenu = useContextMenu((s) => s.openContextMenu);
  const display = useDisplaySettings();
  const { positions, selected, syncIcons, layout, moveIcons, select, toggleSelected, clearSelection } = useDesktop();
  const gesture = useRef<Gesture | null>(null);
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const [band, setBand] = useState<Band | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [, setViewport] = useState(0);

  // Before first paint, reconcile the (possibly saved) layout with today's icons:
  // new icons get a spot, removed ones stop reserving theirs
  useLayoutEffect(() => syncIcons(DESKTOP_IDS), [syncIcons]);

  // When the screen shrinks, icons past the new edge move to the nearest free cell
  useEffect(() => {
    const onResize = () => {
      syncIcons(DESKTOP_IDS);
      setViewport((n) => n + 1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncIcons]);

  const { cols, rows } = gridSize();
  const placeOf = (id: string) => {
    const cell = positions[id];
    return cell && cellToPx({ col: Math.min(cell.col, cols - 1), row: Math.min(cell.row, rows - 1) });
  };

  const openAll = (ids: string[]) => ids.forEach((id) => openWindow(id));

  function arrange(by: "name" | "type") {
    const key = (id: string) => (by === "name" ? labelOf(id) : `${getWindowDef(id)!.type} ${labelOf(id)}`);
    layout([...DESKTOP_IDS].sort((a, b) => key(a).localeCompare(key(b))));
  }

  // Close up the gaps, keeping the current reading order
  function lineUp() {
    layout([...DESKTOP_IDS].sort((a, b) => (positions[a].col - positions[b].col) || (positions[a].row - positions[b].row)));
  }

  // Win95's Refresh redrew the desktop, which showed as a quick blink of the icons
  function refresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 120);
  }

  // --- Icons: select, then drag the selection ---

  function onIconPointerDown(id: string, e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    if (e.ctrlKey || e.metaKey) { toggleSelected(id); return; }
    const group = selected.includes(id) ? selected : [id];
    if (!selected.includes(id)) select([id]);
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { kind: "icon", id, group, x: e.clientX, y: e.clientY, moved: false };
  }

  function onIconPointerMove(e: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (g?.kind !== "icon") return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (!g.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    g.moved = true;
    setDrag({ dx, dy });
  }

  function onIconPointerUp(e: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (g?.kind !== "icon") return;
    if (g.moved) moveIcons(g.group, e.clientX - g.x, e.clientY - g.y);
    // A plain click on one icon of a group selects just that icon
    else if (g.group.length > 1) select([g.id]);
    gesture.current = null;
    setDrag(null);
  }

  // --- Empty desktop: click clears the selection, click-and-hold draws a rubber band ---

  function onDesktopPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || (e.target as Element).closest(".desktop-icon")) return;
    const additive = e.ctrlKey || e.metaKey;
    if (!additive) clearSelection();
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { kind: "band", x: e.clientX, y: e.clientY, base: additive ? selected : [] };
    setBand({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY });
  }

  function onDesktopPointerMove(e: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (g?.kind !== "band") return;
    const next = { x0: g.x, y0: g.y, x1: e.clientX, y1: e.clientY };
    setBand(next);
    const left = Math.min(next.x0, next.x1), right = Math.max(next.x0, next.x1);
    const top = Math.min(next.y0, next.y1), bottom = Math.max(next.y0, next.y1);
    const hits = DESKTOP_IDS.filter((id) => {
      const p = placeOf(id);
      return p && p.x < right && p.x + ICON_BOX.w > left && p.y < bottom && p.y + ICON_BOX.h > top;
    });
    select([...new Set([...g.base, ...hits])]);
  }

  function onDesktopPointerUp() {
    if (gesture.current?.kind !== "band") return;
    gesture.current = null;
    setBand(null);
  }

  // --- Context menus ---

  function onDesktopContextMenu(e: MouseEvent) {
    e.preventDefault();
    if ((e.target as Element).closest(".desktop-icon")) return;
    clearSelection();
    const items: MenuItem[] = [
      { label: "Arrange Icons", items: [
        { label: "by Name", onClick: () => arrange("name") },
        { label: "by Type", onClick: () => arrange("type") },
      ]},
      { label: "Line up Icons", onClick: lineUp },
      { divider: true },
      { label: "Refresh", onClick: refresh },
      { divider: true },
      { label: "Paste" },
      { label: "Paste Shortcut" },
      { divider: true },
      { label: "New", items: [{ label: "Folder" }, { label: "Shortcut" }, { divider: true }, { label: "Text Document" }] },
      { divider: true },
      { label: "Properties", onClick: () => openWindow(WINDOW_IDS.display) },
    ];
    openContextMenu(e.clientX, e.clientY, items);
  }

  function onIconContextMenu(id: string, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // Right-clicking inside a selection keeps it, so "Open" works on the whole group
    const group = selected.includes(id) ? selected : [id];
    if (!selected.includes(id)) select([id]);
    openContextMenu(e.clientX, e.clientY, [
      { label: "Open", bold: true, onClick: () => openAll(group) },
      { divider: true },
      { label: "Cut" },
      { label: "Copy" },
      { divider: true },
      { label: "Create Shortcut" },
      { label: "Delete" },
      { label: "Rename" },
      { divider: true },
      { label: "Properties" },
    ]);
  }

  const dragging = (id: string) => Boolean(drag) && gesture.current?.kind === "icon" && gesture.current.group.includes(id);

  return (
    <div
      className="fixed inset-0"
      style={wallpaperStyle(display)}
      onPointerDown={onDesktopPointerDown}
      onPointerMove={onDesktopPointerMove}
      onPointerUp={onDesktopPointerUp}
      onPointerCancel={onDesktopPointerUp}
      onContextMenu={onDesktopContextMenu}
    >
      {!refreshing && DESKTOP_IDS.map((id) => {
        const place = placeOf(id);
        if (!place) return null;
        const { Icon } = getWindowDef(id)!;
        const moving = dragging(id);
        return (
          <DesktopIcon
            key={id}
            id={id}
            icon={<Icon variant="32x32_4" />}
            label={labelOf(id)}
            selected={selected.includes(id)}
            dragging={moving}
            style={{
              left: place.x,
              top: place.y,
              transform: moving && drag ? `translate(${drag.dx}px, ${drag.dy}px)` : undefined,
            }}
            onOpen={() => openAll(selected.includes(id) ? selected : [id])}
            onContextMenu={(e) => onIconContextMenu(id, e)}
            onPointerDown={(e) => onIconPointerDown(id, e)}
            onPointerMove={onIconPointerMove}
            onPointerUp={onIconPointerUp}
          />
        );
      })}
      {band && (
        <div
          data-rubber-band
          className="absolute pointer-events-none border border-dotted border-white mix-blend-difference"
          style={{
            left: Math.min(band.x0, band.x1),
            top: Math.min(band.y0, band.y1),
            width: Math.abs(band.x1 - band.x0),
            height: Math.abs(band.y1 - band.y0),
          }}
        />
      )}
    </div>
  );
}

export default Desktop
