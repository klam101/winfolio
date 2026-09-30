import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";

// "Remember my desktop changes on this computer": opt-in, off by default.
// While it's off, desktop changes (icon layout, wallpaper, color scheme) last for this visit only.
// Turning it off also deletes what was saved.

const FLAG_KEY = "winfolio:persist";

// Stores that save through optInStorage register here, so turning the switch on can save them right away
const persisted = new Map<string, () => void>();

function readFlag() {
  try { return localStorage.getItem(FLAG_KEY) === "1"; } catch { return false; }
}

interface PersistenceStore {
  enabled: boolean;
  setEnabled: (on: boolean) => void;
}

export const usePersistence = create<PersistenceStore>((set) => ({
  enabled: readFlag(),
  setEnabled: (on) => {
    try {
      localStorage.setItem(FLAG_KEY, on ? "1" : "0");
      if (!on) for (const key of persisted.keys()) localStorage.removeItem(key);
    } catch { /* storage unavailable: nothing to remember either way */ }
    set({ enabled: on });
    if (on) for (const save of persisted.values()) save();
  },
}));

// localStorage that only reads and writes while the switch is on, and never throws.
// `shrink` gets a second chance when the quota is exceeded (e.g. drop a large uploaded image).
export function optInStorage(shrink?: (value: string) => string): StateStorage {
  return {
    getItem: (name) => {
      if (!usePersistence.getState().enabled) return null;
      try { return localStorage.getItem(name); } catch { return null; }
    },
    setItem: (name, value) => {
      if (!usePersistence.getState().enabled) return;
      try {
        localStorage.setItem(name, value);
      } catch {
        try { if (shrink) localStorage.setItem(name, shrink(value)); } catch { /* keep it for this session only */ }
      }
    },
    removeItem: (name) => {
      try { localStorage.removeItem(name); } catch { /* ignore */ }
    },
  };
}

// Called by each persisted store with its storage key and a function that saves its current state
export function registerPersisted(key: string, save: () => void) {
  persisted.set(key, save);
}
