# Winfolio

Kevin Lam's portfolio, built as a Windows 95 desktop. Log in, then open programs from the desktop or the Start menu:

- **Resume.doc**: my resume as a Microsoft Word 95 document (File > Save As PDF downloads the real thing)
- **Projects**: my projects, playing in Windows Media Player
- **About Me**: my AIM buddy profile
- **Mail**: Outlook Express; Compose sends me a real email
- **Winamp**: the classic player, via [Webamp](https://webamp.org)

Windows drag and resize from any edge. Right-click the desktop for Display Properties (wallpapers and color schemes), and drag icons wherever you like.

## Stack

React 19, TypeScript, Vite and Tailwind CSS v4, with state in zustand. The desktop, window manager, taskbar, Start menu and controls are built from scratch in `src/os/`. Icons come from [@react95/icons](https://github.com/React95/React95).

## Running locally

```bash
npm install
npm run dev      # dev server
npm run build    # type-check and production build into dist/
npm run lint
```

## Deploying

The site is hosted on [Vercel](https://vercel.com). Every push to `main` deploys to production, and other branches get preview links.

Optional environment variable (set it in `.env.local` for local builds, and in Vercel's project settings for the live site):

- `VITE_FORMSPREE_ID`: the [Formspree](https://formspree.io) form ID that the Compose window sends to. Without it, Compose falls back to opening the visitor's email app.

## Editing content

| What | Where |
| --- | --- |
| Resume (web version) | `src/data/resume.ts`; the downloadable PDF is `public/resume.pdf` |
| Projects | `src/data/projects.ts`; screenshots go in `public/projects/` |
| About Me and the welcome dialog | `src/data/about.ts` |
| Inbox messages | `src/data/mail.ts` |
| Your own songs for Winamp | drop MP3s in `src/assets/music/` (see the README there) |
| Wallpapers and color schemes | `src/os/wallpapers.ts`, `src/os/schemes.ts` |

Planned work and ideas live in [TASKS.md](TASKS.md).
