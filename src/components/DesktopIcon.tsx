import { type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { cx } from '../os/ui/cx'

// Touch screens have no reliable double-click, so open on a single tap there
const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

interface DesktopIconProps {
  id: string;
  icon: ReactNode;
  label: string;
  selected: boolean;
  dragging: boolean;
  style: CSSProperties;
  onOpen: () => void;
  onContextMenu: (e: MouseEvent) => void;
  // Selection and dragging are handled by the desktop
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: PointerEvent<HTMLDivElement>) => void;
}

function DesktopIcon({ id, icon, label, selected, dragging, style, onOpen, onContextMenu, onPointerDown, onPointerMove, onPointerUp }: DesktopIconProps) {
  return (
    <div
      data-icon={id}
      className={cx(
        "desktop-icon absolute flex flex-col items-center gap-1.5 w-21 p-1 text-center cursor-default outline-none touch-none",
        selected && "selected",
        dragging && "z-10 opacity-80",
      )}
      style={style}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={isTouch ? undefined : onOpen}
      onClick={isTouch ? onOpen : undefined}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}
      onContextMenu={onContextMenu}
    >
      <span className={cx("flex", selected && "[filter:sepia(1)_saturate(6)_hue-rotate(190deg)_brightness(0.6)]")}>{icon}</span>
      <span
        className={cx(
          "px-0.5 leading-3.5 break-words max-w-full",
          selected ? "bg-win-select text-win-select-text outline-1 outline-dotted outline-win-tooltip" : "text-white [text-shadow:1px_1px_1px_rgba(0,0,0,0.7)]",
        )}
      >
        {label}
      </span>
    </div>
  )
}

export default DesktopIcon
