import { useLayoutEffect } from "react";

type UiInsets = { top: number; right: number; bottom: number; left: number };

const setInsetsCssVars = (el: HTMLElement, ins: UiInsets) => {
  el.style.setProperty("--ui-top", `${ins.top}px`);
  el.style.setProperty("--ui-right", `${ins.right}px`);
  el.style.setProperty("--ui-bottom", `${ins.bottom}px`);
  el.style.setProperty("--ui-left", `${ins.left}px`);
};

const computeInsets = (): UiInsets => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const isLandscape = w > h;
  const isMobileish = Math.min(w, h) < 900;

  // Desktop: bottom strip
  if (!isMobileish || !isLandscape) {
    return { top: 0, right: 0, bottom: 50, left: 0 };
  }

  // Mobile landscape: side gutters for thumbs
  return { top: 0, right: 50, bottom: 0, left: 50 };
};

export const useUiInsets = () => {
  useLayoutEffect(() => {
    const container = document.getElementById("game-container");
    if (!container) return;

    const apply = () => setInsetsCssVars(container, computeInsets());
    apply();

    const onResize = () => apply();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
};