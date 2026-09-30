import { type ReactNode } from 'react'

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="toolbar">{children}</div>;
}

interface ToolbarButtonProps {
  icon?: ReactNode;
  // Shown under the icon (Outlook-style big buttons); omit for small icon-only buttons
  label?: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// Flat until hovered, like Office 95 toolbars. No onClick means disabled.
export function ToolbarButton({ icon, label, title, onClick, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`tb-btn${label ? ' labeled' : ''}`}
      title={title ?? label}
      aria-label={title ?? label}
      disabled={disabled || !onClick}
      onClick={onClick}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

export function ToolbarSeparator() {
  return <span className="tb-sep" />;
}
