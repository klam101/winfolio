import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import MenuList from "./MenuList";
import { useContextMenu } from "../store/contextMenu";

// Renders the open context menu at the pointer, nudged back on screen if it would overflow
function ContextMenuHost() {
  const { menu, closeContextMenu } = useContextMenu();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !menu) return;
    const { width, height } = el.getBoundingClientRect();
    el.style.left = `${Math.max(0, Math.min(menu.x, window.innerWidth - width - 2))}px`;
    el.style.top = `${Math.max(0, Math.min(menu.y, window.innerHeight - height - 2))}px`;
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) closeContextMenu();
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") closeContextMenu(); };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", closeContextMenu);
    window.addEventListener("blur", closeContextMenu);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", closeContextMenu);
      window.removeEventListener("blur", closeContextMenu);
    };
  }, [menu, closeContextMenu]);

  if (!menu) return null;
  return createPortal(
    <div ref={ref} className="fixed z-2000" style={{ left: menu.x, top: menu.y }} onContextMenu={(e) => e.preventDefault()}>
      <MenuList items={menu.items} onDone={closeContextMenu} />
    </div>,
    document.body,
  );
}

export default ContextMenuHost
