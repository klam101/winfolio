import { useEffect, useRef, useState } from 'react'
import { useWindows } from '../../os/store/windows'
import { playlist } from '../../data/music'
import { WINDOW_IDS } from '../../windows/ids'

// Winamp 2.9, via Webamp (https://webamp.org, MIT). Webamp draws its own skinned, draggable windows,
// so this renders into a full-screen pass-through layer instead of one of our window frames.
// The library is only downloaded the first time someone opens Winamp.
function Winamp() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let disposed = false;
    let instance: { dispose: () => void } | null = null;
    // Webamp mounts its own DOM, so it gets a node React never renders into
    const host = document.createElement('div');
    host.className = 'absolute inset-0 pointer-events-none';
    layerRef.current?.appendChild(host);

    (async () => {
      try {
        const { default: Webamp } = await import('webamp');
        if (disposed) return;
        const webamp = new Webamp({ initialTracks: playlist });
        instance = webamp;
        // Webamp's own close and minimize buttons drive our window store, so the taskbar stays in sync
        const { closeWindow, minimizeWindow } = useWindows.getState();
        webamp.onClose(() => closeWindow(WINDOW_IDS.winamp));
        webamp.onMinimize(() => minimizeWindow(WINDOW_IDS.winamp));
        await webamp.renderInto(host);
        if (!disposed) setStatus('ready');
      } catch {
        if (!disposed) setStatus('error');
      }
    })();

    return () => {
      disposed = true;
      instance?.dispose();
      host.remove();
    };
  }, []);

  return (
    <div ref={layerRef} data-winamp className="winamp-layer absolute inset-0">
      {status !== 'ready' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-2 bg-win-face bevel-raised pointer-events-auto">
          {status === 'loading' ? 'Loading Winamp...' : 'Winamp could not start in this browser.'}
        </div>
      )}
    </div>
  );
}

export default Winamp
