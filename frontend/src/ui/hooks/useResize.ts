import { useEffect, useRef } from "react";

const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

export type UseResizeOptions = {
  width: number;
  height: number;
  getMinSize: () => { minW: number; minH: number };
  getMaxSize: () => { maxW: number; maxH: number };
  onResize: (width: number, height: number) => void;
};

export const useResize = (options: UseResizeOptions) => {
  const { width, height, getMinSize, getMaxSize, onResize } = options;
  const resizingRef = useRef(false);
  const resizeStartRef = useRef({
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });
  const getMinSizeRef = useRef(getMinSize);
  const getMaxSizeRef = useRef(getMaxSize);
  const onResizeRef = useRef(onResize);
  getMinSizeRef.current = getMinSize;
  getMaxSizeRef.current = getMaxSize;
  onResizeRef.current = onResize;

  useEffect(() => {
    const onMoveMouse = (e: MouseEvent) => {
      if (!resizingRef.current) {
        return;
      }
      const dx = e.clientX - resizeStartRef.current.startX;
      const dy = e.clientY - resizeStartRef.current.startY;
      const { minW, minH } = getMinSizeRef.current();
      const { maxW, maxH } = getMaxSizeRef.current();
      const nextW = clamp(resizeStartRef.current.startW + dx, minW, maxW);
      const nextH = clamp(resizeStartRef.current.startH + dy, minH, maxH);
      onResizeRef.current(nextW, nextH);
    };

    const onUp = () => {
      resizingRef.current = false;
    };

    window.addEventListener("mousemove", onMoveMouse);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMoveMouse);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    resizingRef.current = true;
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: width,
      startH: height,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  return { onMouseDown };
};
