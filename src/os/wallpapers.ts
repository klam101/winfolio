import type { CSSProperties } from "react";
import { asset } from "../utils/asset";
import { DEFAULT_SCHEME_ID } from "./schemes";

// Desktop wallpapers. The patterns are our own small SVG tiles, drawn in the spirit of the
// ones Windows 95 shipped; Winfolio and Clouds are images from public/.

export type WallpaperMode = "tile" | "center" | "stretch";

export type Wallpaper = {
  id: string;
  name: string;
  // A CSS background-image value, or null for a plain color
  image: string | null;
  // Tile size in px, used to scale the Display Properties preview
  tile?: [number, number];
  // Fixed display size for centered images (a CSS length)
  size?: string;
};

export type DisplaySettings = {
  wallpaperId: string;
  wallpaperMode: WallpaperMode;
  backgroundColor: string;
  // A visitor-uploaded image as a data URL; used when wallpaperId is "custom"
  customWallpaper: string | null;
  // Window color scheme (Appearance tab), from src/os/schemes.ts
  schemeId: string;
};

export const CUSTOM_WALLPAPER_ID = "custom";

const svgTile = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" shape-rendering="crispEdges">${body}</svg>`,
  )}")`;

// A fixed scatter of stars, so the pattern is the same on every visit
const STARS = [[5, 9], [22, 3], [40, 14], [58, 6], [12, 30], [33, 26], [51, 37], [7, 48], [27, 55], [45, 50], [60, 60], [18, 42]]
  .map(([x, y], i) => `<rect x="${x}" y="${y}" width="${i % 4 === 0 ? 2 : 1}" height="${i % 4 === 0 ? 2 : 1}" fill="${i % 3 ? "#fff" : "#ffff80"}"/>`)
  .join("");

export const WALLPAPERS: Wallpaper[] = [
  { id: "none", name: "(None)", image: null },
  { id: "winfolio", name: "Winfolio", image: `url("${asset("logo.png")}")`, size: "min(400px, 80vw)" },
  { id: "clouds", name: "Clouds", image: `url("${asset("startupBG.png")}")`, tile: [200, 150] },
  {
    id: "bricks", name: "Bricks", tile: [32, 16],
    image: svgTile(32, 16, `<rect width="32" height="16" fill="#9c3b2a"/><path d="M0 0h32v1H0zM0 8h32v1H0zM0 0h1v8H0zM16 8h1v8h-1z" fill="#d8c8a8"/><path d="M1 1h15v1H1zM17 1h15v1H17zM0 9h16v1H0zM17 9h15v1H17z" fill="#b95a45"/>`),
  },
  {
    id: "tiles", name: "Tiles", tile: [32, 32],
    image: svgTile(32, 32, `<rect width="32" height="32" fill="#006060"/><rect width="16" height="16" fill="#007a7a"/><rect x="16" y="16" width="16" height="16" fill="#007a7a"/><path d="M0 0h16v1H0zM0 0h1v16H0zM16 16h16v1H16zM16 16h1v16h-1z" fill="#40a0a0"/><path d="M0 15h16v1H0zM15 0h1v16h-1zM16 31h16v1H16zM31 16h1v16h-1z" fill="#003838"/>`),
  },
  {
    id: "pinstripe", name: "Pinstripe", tile: [6, 6],
    image: svgTile(6, 6, `<rect width="6" height="6" fill="#20205a"/><rect x="0" width="1" height="6" fill="#4a4a9a"/>`),
  },
  {
    id: "weave", name: "Weave", tile: [16, 16],
    image: svgTile(16, 16, `<rect width="16" height="16" fill="#c8a860"/><path d="M0 1h8v1H0zM0 4h8v1H0zM0 7h8v1H0zM9 8h1v8H9zM12 8h1v8h-1zM15 8h1v8h-1z" fill="#8a6a28"/><path d="M9 0h1v8H9zM12 0h1v8h-1zM15 0h1v8h-1zM0 9h8v1H0zM0 12h8v1H0zM0 15h8v1H0z" fill="#e8d098"/>`),
  },
  {
    id: "waves", name: "Waves", tile: [40, 16],
    image: svgTile(40, 16, `<rect width="40" height="16" fill="#000060"/><path d="M0 8c5-6 15-6 20 0s15 6 20 0" fill="none" stroke="#2a6fd0" stroke-width="2" shape-rendering="auto"/>`),
  },
  {
    id: "dots", name: "Polka Dots", tile: [16, 16],
    image: svgTile(16, 16, `<rect width="16" height="16" fill="#800040"/><circle cx="4" cy="4" r="2.5" fill="#ff80c0" shape-rendering="auto"/><circle cx="12" cy="12" r="2.5" fill="#ff80c0" shape-rendering="auto"/>`),
  },
  {
    id: "argyle", name: "Argyle", tile: [16, 16],
    image: svgTile(16, 16, `<rect width="16" height="16" fill="#404040"/><path d="M8 0l8 8-8 8-8-8z" fill="#606060" shape-rendering="auto"/><path d="M0 0l16 16M16 0L0 16" stroke="#a08040" stroke-width="1" shape-rendering="auto"/>`),
  },
  { id: "stars", name: "Starfield", tile: [64, 64], image: svgTile(64, 64, `<rect width="64" height="64" fill="#000010"/>${STARS}`) },
];

export const BACKGROUND_COLORS = ["#008080", "#000000", "#000080", "#008000", "#800000", "#800080", "#808080", "#808000", "#004040", "#c0c0c0"];

export const DEFAULT_DISPLAY: DisplaySettings = {
  wallpaperId: "winfolio",
  wallpaperMode: "center",
  backgroundColor: "#008080",
  customWallpaper: null,
  schemeId: DEFAULT_SCHEME_ID,
};

// CSS for the desktop background. `scale` shrinks centered images for the small preview monitor.
export function wallpaperStyle(settings: DisplaySettings, scale = 1): CSSProperties {
  const { wallpaperId, wallpaperMode, backgroundColor, customWallpaper } = settings;
  const wallpaper: Wallpaper | undefined = wallpaperId === CUSTOM_WALLPAPER_ID
    ? (customWallpaper ? { id: CUSTOM_WALLPAPER_ID, name: "Custom", image: `url("${customWallpaper}")` } : undefined)
    : WALLPAPERS.find((w) => w.id === wallpaperId);

  const style: CSSProperties = { backgroundColor };
  if (!wallpaper?.image) return style;

  style.backgroundImage = wallpaper.image;
  if (wallpaperMode === "stretch") {
    return { ...style, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat" };
  }

  // Tiled patterns keep their real size even in the preview, as Win95's did; centered images shrink with it
  let size = "auto";
  if (wallpaperMode === "tile") size = wallpaper.tile ? `${wallpaper.tile[0]}px ${wallpaper.tile[1]}px` : "auto";
  else if (wallpaper.size) size = scale === 1 ? wallpaper.size : `calc(${wallpaper.size} * ${scale})`;
  else if (wallpaper.tile) size = `${wallpaper.tile[0] * scale}px ${wallpaper.tile[1] * scale}px`;
  // An uploaded image has no known size, so the preview just fits it
  else if (scale !== 1) size = "contain";

  return {
    ...style,
    backgroundSize: size,
    backgroundRepeat: wallpaperMode === "tile" ? "repeat" : "no-repeat",
    backgroundPosition: wallpaperMode === "center" ? "center" : "0 0",
  };
}
