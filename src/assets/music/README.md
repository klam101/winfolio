# Your music for Winamp

Drop audio files in this folder and they show up at the top of Winamp's playlist automatically
(no code changes; just rebuild or restart `npm run dev`).

- Formats: `.mp3`, `.ogg`, `.m4a`, `.wav`
- Name files `Artist - Title.mp3`, e.g. `Kevin Lam - My Song.mp3`. Anything without ` - ` is used as the title.
- Files play in alphabetical order. Prefix with numbers (`01 Artist - Title.mp3`) to control the order.

Before adding a song:
- **Only add music you have the rights to publish.** These files are served publicly with the site,
  so commercial songs you bought or downloaded generally can't go here. Your own music, or tracks with a
  license that allows sharing (e.g. Creative Commons), are fine.
- Every file is committed to the repo and uploaded with each deploy, so keep an eye on sizes
  (a 3-4 minute MP3 is usually 3-8 MB).

Visitors can also play their own files without uploading anything: drag MP3s onto the Winamp window,
or use the eject button.
