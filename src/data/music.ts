import { asset } from "../utils/asset";

// Winamp's playlist: your own songs first, then Webamp's Creative Commons demo tracks.

export type MusicTrack = {
  url: string;
  // Known length in seconds, so the playlist shows it before the file loads
  duration?: number;
  // An empty artist shows just the title in the playlist
  metaData: { artist: string; title: string; album?: string };
};

// --- Your own songs ---------------------------------------------------------
// Any audio file in src/assets/music/ is picked up automatically at build time.
// Name files "Artist - Title.mp3"; anything else is used as the title. See src/assets/music/README.md.
const ownFiles = import.meta.glob("../assets/music/*.{mp3,ogg,m4a,wav}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const ownTracks: MusicTrack[] = Object.entries(ownFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url]) => {
    const name = path.split("/").pop()!.replace(/\.[^.]+$/, "");
    const [artist, ...rest] = name.split(" - ");
    return rest.length
      ? { url, metaData: { artist: artist.trim(), title: rest.join(" - ").trim() } }
      : { url, metaData: { artist: "", title: name.trim() } };
  });

// --- Demo tracks --------------------------------------------------------------
// The same playlist Webamp's own demo uses (https://webamp.org), streamed from jsDelivr's CDN.
// From "netBloc Vol. 24: tiuqottigeloot" on Free Music Archive
// (https://freemusicarchive.org/music/netBloc_Artists/netBloc_Vol_24_tiuqottigeloot/).
// Each track's Creative Commons license is noted below; all allow non-commercial sharing with credit.
const ALBUM = "netBloc Vol. 24: tiuqottigeloot";
const cdn = (file: string) => `https://cdn.jsdelivr.net/gh/captbaritone/webamp-music@4b556fbf/${file}.mp3`;

const demoTracks: MusicTrack[] = [
  // The classic Winamp intro, from the Webamp repository's demo (MIT)
  { url: asset("audio/llama-2.91.mp3"), duration: 5.32, metaData: { artist: "DJ Mike Llama", title: "Llama Whippin' Intro" } },
  // CC BY-NC-ND 3.0
  { url: cdn("Diablo_Swing_Orchestra_-_01_-_Heroines"), duration: 322.61, metaData: { artist: "Diablo Swing Orchestra", title: "Heroines", album: ALBUM } },
  // CC BY-NC-SA 3.0
  { url: cdn("Eclectek_-_02_-_We_Are_Going_To_Eclecfunk_Your_Ass"), duration: 190.09, metaData: { artist: "Eclectek", title: "We Are Going To Eclecfunk Your Ass", album: ALBUM } },
  // CC BY-NC-ND 3.0
  { url: cdn("Auto-Pilot_-_03_-_Seventeen"), duration: 214.62, metaData: { artist: "Auto-Pilot", title: "Seventeen", album: ALBUM } },
  // CC BY-NC-SA 3.0
  { url: cdn("Muha_-_04_-_Microphone"), duration: 181.84, metaData: { artist: "Muha", title: "Microphone", album: ALBUM } },
  // CC BY-ND 3.0 US
  { url: cdn("Just_Plain_Ant_-_05_-_Stumble"), duration: 86.05, metaData: { artist: "Just Plain Ant", title: "Stumble", album: ALBUM } },
  // CC BY-ND 3.0 US
  { url: cdn("Sleaze_-_06_-_God_Damn"), duration: 226.8, metaData: { artist: "Sleaze", title: "God Damn", album: ALBUM } },
  // CC BY 2.0 FR
  { url: cdn("Juanitos_-_07_-_Hola_Hola_Bossa_Nova"), duration: 207.07, metaData: { artist: "Juanitos", title: "Hola Hola Bossa Nova", album: ALBUM } },
  // CC BY-NC-SA 3.0
  { url: cdn("Entertainment_for_the_Braindead_-_08_-_Resolutions_Chris_Summer_Remix"), duration: 314.33, metaData: { artist: "Entertainment for the Braindead", title: "Resolutions (Chris Summer Remix)", album: ALBUM } },
  // CC BY-NC-ND 3.0
  { url: cdn("Nobara_Hayakawa_-_09_-_Trail"), duration: 204.04, metaData: { artist: "Nobara Hayakawa", title: "Trail", album: ALBUM } },
  // CC BY-NC-SA 3.0
  { url: cdn("Paper_Navy_-_10_-_Tongue_Tied"), duration: 201.12, metaData: { artist: "Paper Navy", title: "Tongue Tied", album: ALBUM } },
  // CC BY-NC-SA 2.5 MX
  { url: cdn("60_Tigres_-_11_-_Garage"), duration: 245.39, metaData: { artist: "60 Tigres", title: "Garage", album: ALBUM } },
  // CC BY-NC-ND 3.0
  { url: cdn("CM_aka_Creative_-_12_-_The_Cycle_Featuring_Mista_Mista"), duration: 221.44, metaData: { artist: "CM aka Creative", title: "The Cycle (Featuring Mista Mista)", album: ALBUM } },
];

export const playlist: MusicTrack[] = [...ownTracks, ...demoTracks];
