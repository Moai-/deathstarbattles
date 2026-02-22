import { useLayoutEffect, useState } from "react"

export const useBreakpoints = () => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    setIsLandscape(w > h);
    setIsMobile(Math.min(w, h) < 900);
  }, []);

  return {isLandscape, isMobile};
}