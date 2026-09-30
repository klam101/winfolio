import { useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "../ui/cx";

export type MenuItem =
  | {
      label: string;
      onClick?: () => void;
      // A submenu that opens to the right on hover or click
      items?: MenuItem[];
      icon?: ReactNode;
      // The default action, drawn bold (e.g. "Open" on an icon's context menu)
      bold?: boolean;
      disabled?: boolean;
    }
  | { divider: true };

interface MenuListProps {
  items: MenuItem[];
  // Called after any item runs, so the owner can close the whole menu
  onDone: () => void;
  // Start-menu size: 32px icons and tall rows
  large?: boolean;
  // No frame of its own, for a menu embedded in another frame (the Start menu)
  flat?: boolean;
  className?: string;
  style?: CSSProperties;
}

const Arrow = () => (
  <svg width="4" height="7" viewBox="0 0 4 7" shapeRendering="crispEdges" fill="currentColor" className="ml-3 shrink-0">
    <path d="M0 0h1v1h1v1h1v1h1v1H3v1H2v1H1v1H0z" />
  </svg>
);

// Shared by the Start menu, context menus and app menu bars.
// Items with neither onClick nor a submenu are drawn greyed out, like unimplemented Win95 commands.
function MenuList({ items, onDone, large, flat, className, style }: MenuListProps) {
  const [openSub, setOpenSub] = useState<number | null>(null);

  return (
    <ul role="menu" className={cx("m-0 list-none bg-win-face text-win-text", !flat && "bevel-raised p-0.75", large ? "min-w-47.5" : "min-w-42.5", className)} style={style}>
      {items.map((item, i) => {
        if ("divider" in item) {
          return <li key={i} role="separator" className="my-0.75 mx-px border-t border-t-win-shadow border-b border-b-white" />;
        }
        const hasSub = Boolean(item.items?.length);
        const enabled = !item.disabled && (Boolean(item.onClick) || hasSub);
        const highlighted = openSub === i;
        return (
          <li
            key={item.label}
            role="menuitem"
            aria-disabled={!enabled}
            aria-haspopup={hasSub || undefined}
            className={cx(
              "relative flex items-center whitespace-nowrap cursor-default",
              large ? "h-8 pr-2" : "h-5 pr-2",
              !large && !item.icon && "pl-5",
              item.bold && "font-bold",
              enabled
                ? cx("hover:bg-win-select hover:text-win-select-text", highlighted && "bg-win-select text-win-select-text")
                : "text-win-shadow [text-shadow:1px_1px_var(--color-win-highlight)]",
            )}
            onPointerEnter={() => setOpenSub(hasSub && enabled ? i : null)}
            onClick={(e) => {
              e.stopPropagation();
              if (!enabled) return;
              if (hasSub) { setOpenSub(i); return; }
              onDone();
              item.onClick?.();
            }}
          >
            {item.icon && (
              <span className={cx("flex items-center justify-center shrink-0", large ? "w-10" : "w-5")}>{item.icon}</span>
            )}
            <span className="flex-1">{item.label}</span>
            {hasSub && <Arrow />}
            {highlighted && hasSub && (
              <MenuList items={item.items!} onDone={onDone} className="absolute left-full top-[-3px] z-10 font-normal" />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default MenuList
