# Winfolio task list

A living backlog. Add ideas anywhere (the **Ideas** section at the bottom is a good inbox), check items off as they ship, and move things between sections as priorities change.

## In progress
<!-- Move items here when work starts on them -->

## Next up
- [ ] **Desktop buddy**: our own assistant (Clippy/Bonzi-style) with tips about the portfolio. Needs sprite art first.
- [ ] **Add your own songs to Winamp**: drop MP3s named `Artist - Title.mp3` in `src/assets/music/` (see the README there; only music you have the rights to publish)
- [ ] **Deploy to Vercel** instead of GitHub Pages
  - Vite `base` from `/winfolio/` to `/`
  - Set `VITE_FORMSPREE_ID` in the Vercel project settings
  - Optional custom domain
  - Retire the `gh-pages` branch and `npm run deploy`
- [ ] **Games** folder on the desktop
  - [ ] Solitaire
  - [ ] Chess vs a bot (`chess.js` for the rules, our own minimax bot)
  - [ ] Checkers vs a bot (our own rules and minimax)
- [ ] **Real wallpaper images**: drop files in `public/wallpapers/` and list them in `src/os/wallpapers.ts`
- [ ] **Formspree**: create the form and set `VITE_FORMSPREE_ID` in `.env.local` (Compose falls back to mailto until then)
- [ ] Update the site URL inside the resume PDF once the Vercel address is final

## Later
- [ ] Recycle Bin (drag icons in, restore them)
- [ ] Sounds (startup chime, window open/close, errors)
- [ ] Boot screen before the login dialog
- [ ] Alt+Tab window switcher and other keyboard shortcuts
- [ ] Screen savers (Display Properties > Screen Saver tab)
- [ ] Guestbook (needs a small backend, e.g. a Vercel function + database)
- [ ] Rename and Properties on desktop icons
- [ ] Start > Find and Start > Run

## Ideas
<!-- Add new ideas here -->
- [ ] 

## Done
- [x] Winamp (Webamp) replaces PianoCat.mp4 and the Spotify player; loads only when opened, keeps playing while minimized, plays your own songs from `src/assets/music/`
- [x] Drag desktop icons anywhere (snaps to a grid, drag several at once)
- [x] Click-and-hold rubber-band selection on the desktop
- [x] Welcome popup after login (reopen from Start > Help > Welcome...)
- [x] "Remember my desktop changes on this computer" (opt-in; saves icon layout, wallpaper, color scheme)
- [x] Window color schemes (Display Properties > Appearance)
- [x] Web resume updated from the new PDF (Eleos, NIWC, Itron, Sunset project, new skills)
- [x] Win95 font on all UI text (the Word document page stays Times New Roman)
- [x] Win95 desktop with login, Start menu and shutdown
- [x] Own window manager: drag, resize from any edge or corner, maximize/restore, minimize to taskbar
- [x] Right-click menus on the desktop and icons
- [x] Display Properties: wallpapers, tile/center/stretch, background colors, upload your own image
- [x] Resume as a Microsoft Word 95 document (Save As PDF downloads the real resume)
- [x] Projects in Windows Media Player (Sunset, Winfolio)
- [x] About Me as an AIM buddy profile
- [x] Contact through Outlook Express, sending via Formspree
- [x] Replaced react95 with our own Tailwind-based interface layer (bundle went from ~17 MB to ~760 KB)
