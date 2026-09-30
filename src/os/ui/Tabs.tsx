import { type ReactNode } from "react";
import { cx } from "./cx";

export type Tab = { id: string; label: string; disabled?: boolean };

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  children: ReactNode;
  className?: string;
}

// Win95 property-sheet tabs: the selected tab is taller and joins the raised panel below it
function Tabs({ tabs, active, onChange, children, className }: TabsProps) {
  return (
    <div className={cx("flex flex-col min-h-0", className)}>
      <div role="tablist" className="flex items-end pl-0.5">
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cx(
                "relative px-2 bg-win-face rounded-t-[3px] disabled:text-win-shadow",
                "shadow-[inset_1px_1px_var(--color-win-highlight),inset_-1px_0_var(--color-win-dark),inset_-2px_0_var(--color-win-shadow)]",
                selected ? "z-10 -mx-0.5 -mb-0.5 pt-0.75 pb-1.25" : "py-0.5",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="flex-1 min-h-0 bg-win-face bevel-raised p-3">{children}</div>
    </div>
  );
}

export default Tabs
