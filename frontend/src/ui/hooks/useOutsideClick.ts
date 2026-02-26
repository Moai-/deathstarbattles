import { useEffect } from "react";

export const useOutsideClick = (
  refs: Array<React.RefObject<HTMLElement>>,
  onOutside: () => void,
  enabled: boolean
): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside = refs.some((r) => r.current != null && r.current.contains(target));
      if (!inside) {
        onOutside();
      }
    };

    window.addEventListener("mousedown", handler);
    return () => {
      window.removeEventListener("mousedown", handler);
    };
  }, [refs, onOutside, enabled]);
};
