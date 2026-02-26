import { useEffect, useRef } from "react";

type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

export type UseDraggableOptions = {
  position: { x: number; y: number };
  getBounds: () => Bounds;
  onMove: (x: number, y: number) => void;
};

const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

export const useDraggable = (options: UseDraggableOptions) => {
  const { position, getBounds, onMove } = options;
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const onMoveRef = useRef(onMove);
  const getBoundsRef = useRef(getBounds);
  onMoveRef.current = onMove;
  getBoundsRef.current = getBounds;

  useEffect(() => {
    const onMoveMouse = (e: MouseEvent) => {
      if (!draggingRef.current) {
        return;
      }
      const { minX, minY, maxX, maxY } = getBoundsRef.current();
      const nx = clamp(e.clientX - dragOffsetRef.current.dx, minX, maxX);
      const ny = clamp(e.clientY - dragOffsetRef.current.dy, minY, maxY);
      onMoveRef.current(nx, ny);
    };

    const onUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", onMoveMouse);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMoveMouse);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    dragOffsetRef.current = {
      dx: e.clientX - position.x,
      dy: e.clientY - position.y,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  return { onMouseDown };
};
