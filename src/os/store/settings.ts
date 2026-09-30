import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_DISPLAY, type DisplaySettings } from "../wallpapers";
import { optInStorage, registerPersisted } from "./persistence";

const STORAGE_KEY = "winfolio:display:v1";

// An uploaded wallpaper can exceed the storage quota; then save everything else and
// keep the image for this session only
function dropCustomWallpaper(value: string) {
  const parsed = JSON.parse(value);
  parsed.state.customWallpaper = null;
  if (parsed.state.wallpaperId === "custom") parsed.state.wallpaperId = DEFAULT_DISPLAY.wallpaperId;
  return JSON.stringify(parsed);
}

interface DisplayStore extends DisplaySettings {
  applyDisplay: (settings: DisplaySettings) => void;
}

export const useDisplaySettings = create<DisplayStore>()(
  persist(
    (set) => ({
      ...DEFAULT_DISPLAY,
      applyDisplay: (settings) => set(settings),
    }),
    { name: STORAGE_KEY, storage: createJSONStorage(() => optInStorage(dropCustomWallpaper)) },
  ),
);

// setState({}) makes the persist middleware write the current settings
registerPersisted(STORAGE_KEY, () => useDisplaySettings.setState({}));
