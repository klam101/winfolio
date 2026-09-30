import type { CSSProperties } from "react";

// Window color schemes for Display Properties > Appearance. Our own approximations of the
// schemes Windows 95 shipped. Each sets the Win95 color variables from src/index.css.

type SchemeColors = {
  face: string;
  light: string;
  highlight: string;
  shadow: string;
  dark: string;
  select: string;
  title: string;
  title2: string;
  titleInactive: string;
  titleInactive2: string;
  titleInactiveText: string;
};

export type Scheme = { id: string; name: string; colors: SchemeColors };

const VARIABLES: Record<keyof SchemeColors, string> = {
  face: "--color-win-face",
  light: "--color-win-light",
  highlight: "--color-win-highlight",
  shadow: "--color-win-shadow",
  dark: "--color-win-dark",
  select: "--color-win-select",
  title: "--color-win-title",
  title2: "--color-win-title-2",
  titleInactive: "--color-win-title-inactive",
  titleInactive2: "--color-win-title-inactive-2",
  titleInactiveText: "--color-win-title-inactive-text",
};

// A scheme built on a face color: bevel shades and inactive title bars follow from it
const scheme = (id: string, name: string, face: string, light: string, shadow: string, title: string, title2: string): Scheme => ({
  id,
  name,
  colors: {
    face, light, shadow, title, title2,
    highlight: "#ffffff",
    dark: "#000000",
    select: title,
    // Inactive title bars are a solid bar, as in Win95, so their text stays readable
    titleInactive: shadow,
    titleInactive2: shadow,
    titleInactiveText: light,
  },
});

export const DEFAULT_SCHEME_ID = "standard";

export const SCHEMES: Scheme[] = [
  scheme("standard", "Windows Standard", "#c0c0c0", "#dfdfdf", "#808080", "#000080", "#1084d0"),
  scheme("brick", "Brick", "#c2bfa5", "#e1dfd3", "#8d8966", "#800000", "#c04830"),
  scheme("desert", "Desert", "#d5ccbb", "#e8e3da", "#a28d68", "#008080", "#40a8a8"),
  scheme("eggplant", "Eggplant", "#90b0a8", "#c0d4cf", "#587870", "#580058", "#a050a0"),
  scheme("lilac", "Lilac", "#aea8d9", "#d3cfec", "#5a4eb1", "#5a4eb1", "#9890e0"),
  scheme("marine", "Marine", "#88c0b8", "#c0e0dc", "#448880", "#000080", "#3070c8"),
  scheme("rainy-day", "Rainy Day", "#8099b0", "#b4c4d4", "#4f657d", "#4f657d", "#90a8c0"),
  scheme("rose", "Rose", "#cfafb7", "#e5d5d9", "#9f6070", "#9f6070", "#d898a8"),
  scheme("slate", "Slate", "#a8b8c8", "#d0d8e0", "#5c7088", "#5c7088", "#98b0c8"),
  scheme("spruce", "Spruce", "#a2c8a9", "#d0e4d4", "#588c65", "#588c65", "#88c098"),
  scheme("storm", "Storm", "#c0c0c0", "#dfdfdf", "#808080", "#800080", "#c060c0"),
  scheme("teal", "Teal", "#c0c0c0", "#dfdfdf", "#808080", "#008080", "#40c0c0"),
  scheme("wheat", "Wheat", "#e0dcb0", "#f0eed8", "#a0a060", "#808000", "#c0b840"),
];

export const schemeById = (id: string) => SCHEMES.find((s) => s.id === id) ?? SCHEMES[0];

// The scheme as CSS variables, for an element's style (the Appearance preview) or the whole page
export function schemeVars(id: string): CSSProperties {
  const { colors } = schemeById(id);
  return Object.fromEntries(
    (Object.keys(VARIABLES) as (keyof SchemeColors)[]).map((key) => [VARIABLES[key], colors[key]]),
  ) as CSSProperties;
}

export function applyScheme(id: string) {
  const root = document.documentElement.style;
  for (const [variable, value] of Object.entries(schemeVars(id))) root.setProperty(variable, String(value));
}
