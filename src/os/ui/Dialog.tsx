import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { TitleBar, TitleButton } from "./TitleBar";
import { cx } from "./cx";

interface DialogProps {
  title: string;
  icon?: ReactNode;
  // Shows the caption close button when provided
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  zIndex?: number;
}

// A fixed-size modal-style window, centered on screen and movable by its title bar.
// Rendered on <body> so it sits above every app window.
function Dialog({ title, icon, onClose, children, className, zIndex = 1000 }: DialogProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, ...offset };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (d) setOffset({ x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py });
  }

  return createPortal(
    <div
      role="dialog"
      aria-label={title}
      className={cx("fixed left-1/2 top-[45%] flex flex-col bg-win-face bevel-raised p-0.75 max-w-[calc(100vw-16px)]", className)}
      style={{ zIndex, transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))` }}
    >
      <TitleBar
        title={title}
        icon={icon}
        buttons={onClose && <TitleButton glyph="close" label="Close" onClick={onClose} />}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => { drag.current = null; }}
      />
      <div className="p-2">{children}</div>
    </div>,
    document.body,
  );
}

export default Dialog
