import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { optInStorage, registerPersisted } from "./persistence";
import { TASKBAR_HEIGHT } from "./windows";

// Desktop icons sit on an invisible grid, like Win95 with "Auto Arrange" off:
// they can be dragged anywhere and snap to the nearest free cell.
export const CELL_W = 88;
export const CELL_H = 78;
export const GRID_ORIGIN = 6;

export type Cell = { col: number; row: number };

const STORAGE_KEY = "winfolio:desktop:v1";

export function gridSize() {
  return {
    cols: Math.max(1, Math.floor((window.innerWidth - GRID_ORIGIN) / CELL_W)),
    rows: Math.max(1, Math.floor((window.innerHeight - TASKBAR_HEIGHT - GRID_ORIGIN) / CELL_H)),
  };
}

export const cellToPx = ({ col, row }: Cell) => ({ x: GRID_ORIGIN + col * CELL_W, y: GRID_ORIGIN + row * CELL_H });

const cellKey = ({ col, row }: Cell) => `${col},${row}`;

// Column-major order, top to bottom then left to right, as Win95 arranged icons
function nthCell(n: number, rows: number): Cell {
  return { col: Math.floor(n / rows), row: n % rows };
}

// The free cell closest to `target` (by distance), searched in growing rings
function nearestFree(target: Cell, taken: Set<string>): Cell {
  const { cols, rows } = gridSize();
  const clamp = (c: Cell) => ({ col: Math.min(Math.max(c.col, 0), cols - 1), row: Math.min(Math.max(c.row, 0), rows - 1) });
  const start = clamp(target);
  if (!taken.has(cellKey(start))) return start;
  for (let radius = 1; radius < cols + rows; radius++) {
    let best: Cell | null = null;
    let bestDist = Infinity;
    for (let dc = -radius; dc <= radius; dc++) {
      for (let dr = -radius; dr <= radius; dr++) {
        if (Math.max(Math.abs(dc), Math.abs(dr)) !== radius) continue;
        const cell = { col: start.col + dc, row: start.row + dr };
        if (cell.col < 0 || cell.row < 0 || cell.col >= cols || cell.row >= rows || taken.has(cellKey(cell))) continue;
        const dist = dc * dc + dr * dr;
        if (dist < bestDist) { best = cell; bestDist = dist; }
      }
    }
    if (best) return best;
  }
  return start;
}

interface DesktopStore {
  positions: Record<string, Cell>;
  // The icons currently on the desktop; only these can occupy cells
  iconIds: string[];
  selected: string[];
  // Reconciles the layout with the icons on the desktop and the current screen size:
  // forgets icons that were removed, pulls off-screen icons back to the nearest free cell,
  // and places new icons in the first free cells
  syncIcons: (ids: string[]) => void;
  // Lays icons out in the given order, column by column
  layout: (ids: string[]) => void;
  // Moves a group of icons by a pixel offset, snapping each to the nearest free cell
  moveIcons: (ids: string[], dx: number, dy: number) => void;
  select: (ids: string[]) => void;
  toggleSelected: (id: string) => void;
  clearSelection: () => void;
}

export const useDesktop = create<DesktopStore>()(
  persist(
    (set) => ({
      positions: {},
      iconIds: [],
      selected: [],

      syncIcons: (ids) => set((s) => {
        const { cols, rows } = gridSize();
        const positions: Record<string, Cell> = {};
        const taken = new Set<string>();
        const claim = (id: string, cell: Cell) => { positions[id] = cell; taken.add(cellKey(cell)); };

        // Icons already on a free, on-screen cell stay put
        for (const id of ids) {
          const cell = s.positions[id];
          if (cell && cell.col < cols && cell.row < rows && !taken.has(cellKey(cell))) claim(id, cell);
        }
        // Icons off the edge (the screen shrank) or sharing a cell move to the nearest free one
        for (const id of ids) {
          const cell = s.positions[id];
          if (cell && !positions[id]) claim(id, nearestFree(cell, taken));
        }
        // New icons fill the first free cells, column by column
        let n = 0;
        for (const id of ids) {
          if (positions[id]) continue;
          while (taken.has(cellKey(nthCell(n, rows)))) n++;
          claim(id, nthCell(n, rows));
        }

        const unchanged =
          s.iconIds.length === ids.length && s.iconIds.every((id, i) => id === ids[i]) &&
          Object.keys(s.positions).length === ids.length &&
          ids.every((id) => cellKey(s.positions[id] ?? { col: -1, row: -1 }) === cellKey(positions[id]));
        return unchanged ? s : { positions, iconIds: ids };
      }),

      layout: (ids) => set(() => {
        const { rows } = gridSize();
        return { positions: Object.fromEntries(ids.map((id, n) => [id, nthCell(n, rows)])) };
      }),

      moveIcons: (ids, dx, dy) => set((s) => {
        const moving = new Set(ids);
        // Only icons actually on the desktop block a cell
        const taken = new Set(s.iconIds.filter((id) => !moving.has(id) && s.positions[id]).map((id) => cellKey(s.positions[id])));
        const positions = { ...s.positions };
        // Place icons in reading order so a group keeps its shape where it can
        const ordered = [...ids].sort((a, b) => (positions[a].col - positions[b].col) || (positions[a].row - positions[b].row));
        for (const id of ordered) {
          const { x, y } = cellToPx(positions[id]);
          const target = { col: Math.round((x + dx - GRID_ORIGIN) / CELL_W), row: Math.round((y + dy - GRID_ORIGIN) / CELL_H) };
          const cell = nearestFree(target, taken);
          positions[id] = cell;
          taken.add(cellKey(cell));
        }
        return { positions };
      }),

      select: (ids) => set({ selected: ids }),
      toggleSelected: (id) => set((s) => ({
        selected: s.selected.includes(id) ? s.selected.filter((x) => x !== id) : [...s.selected, id],
      })),
      clearSelection: () => set((s) => (s.selected.length ? { selected: [] } : s)),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => optInStorage()),
      // Only the layout is remembered, not what happens to be selected
      partialize: (s) => ({ positions: s.positions }),
    },
  ),
);

registerPersisted(STORAGE_KEY, () => useDesktop.setState({}));
