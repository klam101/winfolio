import { create } from "zustand";

// Shell-level UI that isn't a window: the welcome dialog shown after each login
interface ShellStore {
  welcomeOpen: boolean;
  setWelcomeOpen: (open: boolean) => void;
}

export const useShell = create<ShellStore>((set) => ({
  welcomeOpen: true,
  setWelcomeOpen: (open) => set({ welcomeOpen: open }),
}));
