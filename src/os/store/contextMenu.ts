import { create } from "zustand";
import type { MenuItem } from "../components/MenuList";

// One context menu at a time, rendered by <ContextMenuHost/>. Any component can open one.
interface ContextMenuStore {
  menu: { x: number; y: number; items: MenuItem[] } | null;
  openContextMenu: (x: number, y: number, items: MenuItem[]) => void;
  closeContextMenu: () => void;
}

export const useContextMenu = create<ContextMenuStore>((set) => ({
  menu: null,
  openContextMenu: (x, y, items) => set({ menu: { x, y, items } }),
  closeContextMenu: () => set({ menu: null }),
}));
