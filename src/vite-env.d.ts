/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Formspree form id (the part after /f/ in the form's endpoint). Unset = Compose falls back to mailto:
  readonly VITE_FORMSPREE_ID?: string;
}
