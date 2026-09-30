import { useEffect, useRef, useState } from 'react'
import MenuList, { type MenuItem } from '../../os/components/MenuList'

export type { MenuItem };
export type Menu = { label: string; items: MenuItem[] };

// Win95 menu bar. Items without onClick render greyed out, like unimplemented menu items did.
function MenuBar({ menus }: { menus: Menu[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="menubar" ref={ref}>
      {menus.map((menu) => (
        <div
          key={menu.label}
          className={`menubar-item${open === menu.label ? ' open' : ''}`}
          onPointerDown={() => setOpen(open === menu.label ? null : menu.label)}
          onPointerEnter={() => { if (open) setOpen(menu.label); }}
        >
          <u>{menu.label[0]}</u>{menu.label.slice(1)}
          {open === menu.label && (
            <div className="absolute left-0 top-full z-50" onPointerDown={(e) => e.stopPropagation()}>
              <MenuList items={menu.items} onDone={() => setOpen(null)} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MenuBar
