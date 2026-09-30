import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Button, Slider } from '../../os/ui/controls'
import { FaGithub } from 'react-icons/fa'
import { Inetcpl1313 } from '@react95/icons'
import MenuBar, { type Menu } from '../chrome/MenuBar'
import StatusBar from '../chrome/StatusBar'
import MessageBox from '../chrome/MessageBox'
import { projects } from '../../data/projects'
import { useWindows } from '../../os/store/windows'
import { useElementWidth } from '../../hooks/useElementWidth'
import { asset } from '../../utils/asset'
import { WINDOW_IDS } from '../../windows/ids'

const SLIDE_MS = 3000;

const formatTime = (seconds: number) => {
  const s = Math.floor(seconds || 0);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

const openLink = (url: string) => window.open(url, "_blank", "noopener");

function MediaPlayer() {
  const closeWindow = useWindows((s) => s.closeWindow);
  const toggleMaximize = useWindows((s) => s.toggleMaximize);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const width = useElementWidth(rootRef);

  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState({ current: 0, duration: 0 });
  const [showAbout, setShowAbout] = useState(false);

  const project = projects[index];
  const images = project.images ?? [];
  const hasSlides = !project.video && images.length > 0;

  // Screenshots advance like a slideshow while "playing"
  useEffect(() => {
    if (!playing || !hasSlides) return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % images.length), SLIDE_MS);
    return () => clearInterval(timer);
  }, [playing, hasSlides, images.length]);

  function selectProject(next: number) {
    const wrapped = (next + projects.length) % projects.length;
    setIndex(wrapped);
    setSlide(0);
    setPlaying(false);
    setVideoTime({ current: 0, duration: 0 });
  }

  function togglePlay() {
    const video = videoRef.current;
    if (video) {
      if (video.paused) void video.play(); else video.pause();
      return;
    }
    setPlaying((p) => !p);
  }

  function stop() {
    const video = videoRef.current;
    if (video) { video.pause(); video.currentTime = 0; }
    setPlaying(false);
    setSlide(0);
  }

  function seek(percent: number) {
    const video = videoRef.current;
    if (video && video.duration) video.currentTime = (percent / 100) * video.duration;
    else if (images.length > 1) setSlide(Math.round((percent / 100) * (images.length - 1)));
  }

  function handlePlaylistKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); selectProject(index + 1); }
    if (e.key === "ArrowUp") { e.preventDefault(); selectProject(index - 1); }
    if (e.key === "Enter") togglePlay();
  }

  const progress = project.video
    ? (videoTime.duration ? (videoTime.current / videoTime.duration) * 100 : 0)
    : (images.length > 1 ? (slide / (images.length - 1)) * 100 : 0);
  const timeReadout = project.video
    ? `${formatTime(videoTime.current)} / ${formatTime(videoTime.duration)}`
    : hasSlides ? `Slide ${slide + 1} / ${images.length}` : "00:00";

  const menus: Menu[] = [
    { label: "File", items: [{ label: "Open..." }, { divider: true }, { label: "Close", onClick: () => closeWindow(WINDOW_IDS.projects) }] },
    { label: "View", items: [{ label: "Full Screen", onClick: () => toggleMaximize(WINDOW_IDS.projects) }, { label: "Zoom" }, { label: "Options..." }] },
    { label: "Play", items: [
      { label: playing ? "Pause" : "Play", onClick: togglePlay },
      { label: "Stop", onClick: stop },
      { divider: true },
      { label: "Previous Project", onClick: () => selectProject(index - 1) },
      { label: "Next Project", onClick: () => selectProject(index + 1) },
    ]},
    { label: "Favorites", items: projects.flatMap((p) => [
      ...(p.demo ? [{ label: `${p.name}: Live demo`, onClick: () => openLink(p.demo!) }] : []),
      ...(p.github ? [{ label: `${p.name}: Source code`, onClick: () => openLink(p.github!) }] : []),
    ])},
    { label: "Help", items: [{ label: "About Media Player", onClick: () => setShowAbout(true) }] },
  ];

  return (
    <div className={`app mp${width > 0 && width < 560 ? ' compact' : ''}`} ref={rootRef}>
      <MenuBar menus={menus}/>
      <div className="mp-body">
        <div className="mp-playlist sunken" role="listbox" tabIndex={0} aria-label="Projects" onKeyDown={handlePlaylistKey}>
          <div className="mp-playlist-title">Playlist</div>
          {projects.map((p, i) => (
            <div
              key={p.id}
              role="option"
              aria-selected={i === index}
              className={`list-row mp-track${i === index ? ' selected' : ''}`}
              onClick={() => selectProject(i)}
              onDoubleClick={() => { selectProject(i); setPlaying(true); }}
            >
              {i + 1}. {p.name}
            </div>
          ))}
        </div>

        <div className="mp-main">
          <div className="mp-stage">
            {project.video ? (
              <video
                key={project.id}
                ref={videoRef}
                src={asset(`projects/${project.video}`)}
                poster={images[0] ? asset(`projects/${images[0]}`) : undefined}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => setVideoTime({ current: e.currentTarget.currentTime, duration: e.currentTarget.duration })}
                onLoadedMetadata={(e) => setVideoTime({ current: 0, duration: e.currentTarget.duration })}
              />
            ) : hasSlides ? (
              <img src={asset(`projects/${images[slide]}`)} alt={`${project.name} screenshot ${slide + 1}`}/>
            ) : (
              <span className="mp-novis">No visualization available</span>
            )}
          </div>

          <div className="mp-transport">
            <button type="button" className="mp-btn" title="Previous project" onClick={() => selectProject(index - 1)}>|◀</button>
            <button type="button" className="mp-btn" title={playing ? "Pause" : "Play"} onClick={togglePlay}>{playing ? "❚❚" : "▶"}</button>
            <button type="button" className="mp-btn" title="Stop" onClick={stop}>■</button>
            <button type="button" className="mp-btn" title="Next project" onClick={() => selectProject(index + 1)}>▶|</button>
            <Slider
              className="mp-seek"
              aria-label="Seek"
              min={0}
              max={100}
              value={progress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => seek(Number(e.target.value))}
            />
            <span className="mp-time sunken">{timeReadout}</span>
          </div>

          <div className="mp-info sunken">
            <h2>{project.name}</h2>
            <p className="mp-summary">{project.summary}</p>
            <div className="flex gap-2" style={{ flexWrap: "wrap", marginBottom: 10 }}>
              {project.demo && (
                <Button onClick={() => openLink(project.demo!)}>
                  <span className="flex items-center gap-2"><Inetcpl1313 variant="16x16_4"/>Live demo</span>
                </Button>
              )}
              {project.github && (
                <Button onClick={() => openLink(project.github!)}>
                  <span className="flex items-center gap-2"><FaGithub size={16}/>Source code</span>
                </Button>
              )}
            </div>
            {project.description.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
              {project.tech.map((tech) => <span key={tech} className="tech-tag">{tech}</span>)}
            </div>
          </div>
        </div>
      </div>
      <StatusBar cells={[`${playing ? "Playing" : "Stopped"}: ${project.name}`, `Project ${index + 1} of ${projects.length}`]}/>
      {showAbout && (
        <MessageBox
          title="About Media Player"
          message="Kevin's projects, now playing. Pick one from the playlist, or use Play > Next Project."
          buttons={[{ value: "OK", onClick: () => setShowAbout(false) }]}
          onClose={() => setShowAbout(false)}
        />
      )}
    </div>
  );
}

export default MediaPlayer
