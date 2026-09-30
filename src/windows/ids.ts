// Kept apart from registry.tsx so apps can open/close windows without importing the registry (which imports them)
export const WINDOW_IDS = {
  about: "about",
  resume: "resume",
  projects: "projects",
  contact: "contact",
  compose: "compose",
  addressBook: "addressBook",
  display: "display",
  winamp: "winamp",
  browser: "browser",
} as const;
