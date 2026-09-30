import { type HTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";

type Glyph = "minimize" | "maximize" | "restore" | "close";

// Pixel glyphs for the caption buttons, drawn the way Win95 drew them
const GLYPHS: Record<Glyph, ReactNode> = {
  minimize: <path d="M1 6h6v2H1z" />,
  maximize: <path d="M0 0h9v9H0zM1 2v6h7V2z" fillRule="evenodd" />,
  restore: <path d="M2 0h6v6H6V2H2zM0 3h6v6H0zM1 5v3h4V5z" fillRule="evenodd" />,
  close: <path d="M0 0h2v1h1v1h2V1h1V0h2v1H7v1H6v1H5v1h1v1h1v1h1v1H6V6H5V5H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1V1H0z" />,
};

type TitleButtonProps = {
  glyph: Glyph;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function TitleButton({ glyph, label, onClick, disabled }: TitleButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      // Keep presses on a caption button from starting a window drag
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onClick={onClick}
      className={cx(
        "w-4 h-3.5 flex items-center justify-center bg-win-face text-win-text bevel-button active:bevel-pressed",
        "disabled:text-win-shadow disabled:active:bevel-button",
        glyph === "close" && "ml-0.5",
      )}
    >
      <svg width={glyph === "close" ? 8 : 9} height={glyph === "close" ? 7 : 9} shapeRendering="crispEdges" fill="currentColor">
        {GLYPHS[glyph]}
      </svg>
    </button>
  );
}

type TitleBarProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  icon?: ReactNode;
  active?: boolean;
  // Caption buttons, right-aligned
  buttons?: ReactNode;
};

export function TitleBar({ title, icon, active = true, buttons, className, ...props }: TitleBarProps) {
  return (
    <div
      data-titlebar
      className={cx(
        "flex items-center gap-0.75 h-4.5 pl-0.5 pr-0.5 font-bold text-[13px] bg-linear-to-r shrink-0",
        active ? "from-win-title to-win-title-2 text-win-title-text" : "from-win-title-inactive to-win-title-inactive-2 text-win-title-inactive-text",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex shrink-0 w-4 h-4 items-center justify-center">{icon}</span>}
      <span className="flex-1 min-w-0 truncate">{title}</span>
      {buttons && <span className="flex items-center shrink-0">{buttons}</span>}
    </div>
  );
}
