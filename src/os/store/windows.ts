import { create } from "zustand";

export const TASKBAR_HEIGHT = 28;
const CASCADE_STEP = 26;
const CASCADE_COUNT = 8;
// Below this width there's no room for floating windows, so they open maximized
export const NARROW_SCREEN = 600;

export type Rect = { x: number; y: number; width: number; height: number };

export type WindowState = Rect & {
  id: string;
  minimized: boolean;
  // The rect is kept while maximized, so restoring returns the window to where it was
  maximized: boolean;
};

interface WindowStore {
  // Kept in open order so windows never reorder in the DOM (moving an iframe reloads it)
  openWindows: WindowState[];
  // Back-to-front stacking order of window ids
  zOrder: string[];
  activeId: string | null;
  // Opens a window, or restores and focuses it if it's already open
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  closeAll: () => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setRect: (id: string, rect: Rect) => void;
}

// The registry supplies each window's default size; set once at startup so this store doesn't import the apps
let defaultSize: (id: string) => { width: number; height: number } = () => ({ width: 480, height: 360 });
export function setDefaultWindowSize(lookup: typeof defaultSize) {
  defaultSize = lookup;
}

function initialRect(id: string, index: number): Rect {
  const { width, height } = defaultSize(id);
  const step = (index % CASCADE_COUNT) * CASCADE_STEP;
  const maxW = window.innerWidth - 8;
  const maxH = window.innerHeight - TASKBAR_HEIGHT - 8;
  const w = Math.min(width, maxW);
  const h = Math.min(height, maxH);
  return {
    x: Math.max(0, Math.min(120 + step, window.innerWidth - w)),
    y: Math.max(0, Math.min(16 + step, window.innerHeight - TASKBAR_HEIGHT - h)),
    width: w,
    height: h,
  };
}

// The topmost window that isn't minimized, which becomes active when the current one goes away
function topVisible(zOrder: string[], windows: WindowState[], except?: string) {
  for (let i = zOrder.length - 1; i >= 0; i--) {
    const w = windows.find((win) => win.id === zOrder[i]);
    if (w && !w.minimized && w.id !== except) return w.id;
  }
  return null;
}

const update = (windows: WindowState[], id: string, changes: Partial<WindowState>) =>
  windows.map((w) => (w.id === id ? { ...w, ...changes } : w));

export const useWindows = create<WindowStore>((set) => ({
  openWindows: [],
  zOrder: [],
  activeId: null,

  openWindow: (id) => set((s) => {
    if (s.openWindows.some((w) => w.id === id)) {
      return {
        openWindows: update(s.openWindows, id, { minimized: false }),
        zOrder: [...s.zOrder.filter((z) => z !== id), id],
        activeId: id,
      };
    }
    const win: WindowState = {
      id,
      ...initialRect(id, s.openWindows.length),
      minimized: false,
      maximized: window.innerWidth < NARROW_SCREEN,
    };
    return { openWindows: [...s.openWindows, win], zOrder: [...s.zOrder, id], activeId: id };
  }),

  closeWindow: (id) => set((s) => {
    const openWindows = s.openWindows.filter((w) => w.id !== id);
    const zOrder = s.zOrder.filter((z) => z !== id);
    return { openWindows, zOrder, activeId: s.activeId === id ? topVisible(zOrder, openWindows) : s.activeId };
  }),

  closeAll: () => set({ openWindows: [], zOrder: [], activeId: null }),

  focusWindow: (id) => set((s) => {
    if (s.activeId === id && s.zOrder.at(-1) === id) return s;
    if (!s.openWindows.some((w) => w.id === id)) return s;
    return { zOrder: [...s.zOrder.filter((z) => z !== id), id], activeId: id };
  }),

  minimizeWindow: (id) => set((s) => {
    const openWindows = update(s.openWindows, id, { minimized: true });
    return { openWindows, activeId: topVisible(s.zOrder, openWindows, id) };
  }),

  toggleMaximize: (id) => set((s) => ({
    openWindows: s.openWindows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
  })),

  setRect: (id, rect) => set((s) => ({ openWindows: update(s.openWindows, id, rect) })),
}));

export const useOpenWindow = () => useWindows((s) => s.openWindow);
