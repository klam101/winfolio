import { useRef, useState, type KeyboardEvent } from "react";
import Tabs from "../ui/Tabs";
import { Button, GroupBox, Select } from "../ui/controls";
import { TitleBar, TitleButton } from "../ui/TitleBar";
import { cx } from "../ui/cx";
import { useDisplaySettings } from "../store/settings";
import { useWindows } from "../store/windows";
import {
  BACKGROUND_COLORS, CUSTOM_WALLPAPER_ID, WALLPAPERS, wallpaperStyle,
  type DisplaySettings, type WallpaperMode,
} from "../wallpapers";
import { SCHEMES, schemeById, schemeVars } from "../schemes";
import { WINDOW_IDS } from "../../windows/ids";

const MODES: Record<string, WallpaperMode> = { Tile: "tile", Center: "center", Stretch: "stretch" };
const SCREEN_WIDTH = 152;

// The little CRT in Display Properties, showing the pending wallpaper at scale
function MonitorPreview({ settings }: { settings: DisplaySettings }) {
  const scale = SCREEN_WIDTH / window.innerWidth;
  return (
    <div className="flex flex-col items-center" aria-hidden>
      <div className="bg-win-face bevel-raised rounded-[3px] p-2.5 pb-3.5">
        <div className="bevel-sunken p-0.5">
          <div className="w-38 h-28" style={wallpaperStyle(settings, scale)} />
        </div>
      </div>
      <div className="w-17.5 h-1.5 bg-win-face bevel-raised" />
      <div className="w-30 h-2 bg-win-face bevel-raised" />
    </div>
  );
}

const previewButtons = (
  <>
    <TitleButton glyph="minimize" label="Minimize" />
    <TitleButton glyph="maximize" label="Maximize" />
    <TitleButton glyph="close" label="Close" />
  </>
);

// Win95's Appearance preview: sample windows drawn in the pending scheme. The scheme's CSS
// variables are set on this box only, so the rest of the screen keeps the current colors.
function SchemePreview({ schemeId, desktop }: { schemeId: string; desktop: string }) {
  return (
    <div className="relative h-44 bevel-sunken overflow-hidden" style={{ ...schemeVars(schemeId), background: desktop }} aria-hidden>
      <div className="absolute left-2 top-2 w-[78%] bg-win-face bevel-raised p-0.75">
        <TitleBar title="Inactive Window" active={false} buttons={previewButtons} />
      </div>
      <div className="absolute left-5 top-9 w-[80%] bg-win-face bevel-raised p-0.75">
        <TitleBar title="Active Window" buttons={previewButtons} />
        <div className="flex gap-3 px-1.5 py-0.5">
          <span>Normal</span>
          <span className="text-win-shadow [text-shadow:1px_1px_var(--color-win-highlight)]">Disabled</span>
          <span className="px-1 bg-win-select text-win-select-text">Selected</span>
        </div>
        <div className="h-10 m-0.5 px-1.5 py-1 bg-white bevel-sunken">Window Text</div>
      </div>
      <div className="absolute left-[28%] top-26 w-[52%] bg-win-face bevel-raised p-0.75">
        <TitleBar title="Message Box" buttons={<TitleButton glyph="close" label="Close" />} />
        <div className="flex items-center justify-between gap-2 p-1.5">
          <span>Message Text</span>
          <Button primary className="min-w-12 h-5.5">OK</Button>
        </div>
      </div>
    </div>
  );
}

function DisplayProperties() {
  const saved = useDisplaySettings();
  const applyDisplay = useDisplaySettings((s) => s.applyDisplay);
  const closeWindow = useWindows((s) => s.closeWindow);
  const fileInput = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState("background");
  const [pending, setPending] = useState<DisplaySettings>({
    wallpaperId: saved.wallpaperId,
    wallpaperMode: saved.wallpaperMode,
    backgroundColor: saved.backgroundColor,
    customWallpaper: saved.customWallpaper,
    schemeId: saved.schemeId,
  });

  const dirty = (Object.keys(pending) as (keyof DisplaySettings)[]).some((key) => pending[key] !== saved[key]);
  const change = (changes: Partial<DisplaySettings>) => setPending((p) => ({ ...p, ...changes }));
  const close = () => closeWindow(WINDOW_IDS.display);

  const options = [
    ...WALLPAPERS.map((w) => ({ id: w.id, name: w.name })),
    ...(pending.customWallpaper ? [{ id: CUSTOM_WALLPAPER_ID, name: "(Custom image)" }] : []),
  ];

  function onListKey(e: KeyboardEvent) {
    const index = options.findIndex((o) => o.id === pending.wallpaperId);
    const next = e.key === "ArrowDown" ? index + 1 : e.key === "ArrowUp" ? index - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const option = options[Math.max(0, Math.min(options.length - 1, next))];
    change({ wallpaperId: option.id });
  }

  function onBrowse(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => change({ wallpaperId: CUSTOM_WALLPAPER_ID, customWallpaper: reader.result as string, wallpaperMode: "stretch" });
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-2 p-1.5 bg-win-face">
      <Tabs
        className="flex-1"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "background", label: "Background" },
          { id: "screensaver", label: "Screen Saver", disabled: true },
          { id: "appearance", label: "Appearance" },
        ]}
      >
        {tab === "appearance" ? (
          <div className="flex flex-col gap-3">
            <SchemePreview schemeId={pending.schemeId} desktop={pending.backgroundColor} />
            <label className="flex items-center gap-2">
              <span>Scheme:</span>
              <Select
                className="flex-1"
                aria-label="Scheme"
                options={SCHEMES.map((scheme) => scheme.name)}
                value={schemeById(pending.schemeId).name}
                onChange={(e) => change({ schemeId: SCHEMES.find((scheme) => scheme.name === e.target.value)!.id })}
              />
            </label>
          </div>
        ) : (
        <div className="flex flex-col gap-2.5">
          <MonitorPreview settings={pending} />
          <div className="flex gap-2">
            <GroupBox label="Wallpaper" className="flex-1 min-w-0">
              <div
                role="listbox"
                tabIndex={0}
                aria-label="Wallpaper"
                onKeyDown={onListKey}
                className="h-24 overflow-y-auto bg-white bevel-sunken p-0.5 outline-none"
              >
                {options.map((option) => (
                  <div
                    key={option.id}
                    role="option"
                    aria-selected={option.id === pending.wallpaperId}
                    onClick={() => change({ wallpaperId: option.id })}
                    className={cx("px-0.75 leading-4 truncate", option.id === pending.wallpaperId && "bg-win-select text-win-select-text")}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span>Display:</span>
                <Select
                  className="w-20"
                  aria-label="Display"
                  options={Object.keys(MODES)}
                  value={Object.keys(MODES).find((k) => MODES[k] === pending.wallpaperMode)}
                  onChange={(e) => change({ wallpaperMode: MODES[e.target.value] })}
                />
                <Button className="min-w-0 ml-auto" onClick={() => fileInput.current?.click()}>Browse...</Button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Upload wallpaper"
                  onChange={(e) => { onBrowse(e.target.files?.[0]); e.target.value = ""; }}
                />
              </div>
            </GroupBox>
            <GroupBox label="Color" className="w-24 shrink-0">
              <div className="grid grid-cols-3 gap-1">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Background color ${color}`}
                    aria-pressed={pending.backgroundColor === color}
                    onClick={() => change({ backgroundColor: color })}
                    className={cx("w-5.5 h-4.5 p-0.75 bg-win-face", pending.backgroundColor === color ? "bevel-pressed" : "bevel-button")}
                  >
                    <span className="block w-full h-full border border-black" style={{ background: color }} />
                  </button>
                ))}
              </div>
            </GroupBox>
          </div>
        </div>
        )}
      </Tabs>
      <div className="flex justify-end gap-1.5">
        <Button primary onClick={() => { applyDisplay(pending); close(); }}>OK</Button>
        <Button onClick={close}>Cancel</Button>
        <Button disabled={!dirty} onClick={() => applyDisplay(pending)}>Apply</Button>
      </div>
    </div>
  );
}

export default DisplayProperties
