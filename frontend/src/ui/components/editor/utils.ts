import { BASE_HEIGHT, BASE_WIDTH } from "shared/src/consts";
import { ObjectTypes } from "shared/src/types";
import type { ClickLoc } from "./editorTypes";

export const clamp = (n: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, n));
};

export const coerceInputValue = (raw: string, original: unknown): string | number => {
  if (typeof original === "number") {
    const v = raw.trim();
    if (v === "") {
      return "";
    }
    const parsed = Number(v);
    return Number.isFinite(parsed) ? parsed : original;
  }
  return raw;
};

export const getCanvasRect = (): DOMRect | null => {
  const root = document.getElementById("phaser-root");
  if (!root) {
    return null;
  }
  const canvas = root.querySelector("canvas");
  if (!canvas) {
    return null;
  }
  return canvas.getBoundingClientRect();
};

export const computeAnchoredMenuPos = (
  clickLocCanvas: ClickLoc,
  menuW = 220,
  menuH = 140
): { x: number; y: number } => {
  const rect = getCanvasRect();
  if (!rect) {
    return { x: 8, y: 8 };
  }

  const scaleX = rect.width / BASE_WIDTH;
  const scaleY = rect.height / BASE_HEIGHT;
  const pageX = rect.left + clickLocCanvas.x * scaleX;
  const pageY = rect.top + clickLocCanvas.y * scaleY;

  const pad = 8;
  const maxX = window.innerWidth - menuW - pad;
  const maxY = window.innerHeight - menuH - pad;

  return {
    x: clamp(pageX, pad, maxX),
    y: clamp(pageY, pad, maxY),
  };
};

export const PAD = 8;
export const FIRING_PANEL_GAP = 5;

export const computeFiringPanelPosition = (
  deathStarCanvasX: number,
  deathStarCanvasY: number,
  indicatorRadius: number,
  panelW: number,
  panelH: number
): { x: number; y: number } => {
  const rect = getCanvasRect();
  if (!rect) {
    return { x: PAD, y: PAD };
  }

  const scaleX = rect.width / BASE_WIDTH;
  const scaleY = rect.height / BASE_HEIGHT;

  const centerPageX = rect.left + deathStarCanvasX * scaleX;
  const centerPageY = rect.top + deathStarCanvasY * scaleY;
  const indicatorBottomPageY = centerPageY + indicatorRadius * scaleY;

  const left = centerPageX - panelW / 2;
  const maxX = window.innerWidth - panelW - PAD;
  const minX = PAD;
  const clampedLeft = clamp(left, minX, maxX);

  const topBelow = indicatorBottomPageY + FIRING_PANEL_GAP;
  const topAbove = centerPageY - indicatorRadius * scaleY - FIRING_PANEL_GAP - panelH;

  const wouldGoBelow = topBelow + panelH > window.innerHeight - PAD;
  const wouldGoAbove = topAbove < PAD;

  let y: number;
  if (wouldGoBelow && !wouldGoAbove) {
    y = topAbove;
  } else if (wouldGoAbove && !wouldGoBelow) {
    y = topBelow;
  } else if (wouldGoBelow && wouldGoAbove) {
    y = clamp(topBelow, PAD, window.innerHeight - panelH - PAD);
  } else {
    y = topBelow;
  }

  return { x: clampedLeft, y: clamp(y, PAD, window.innerHeight - panelH - PAD) };
};

export const DEFAULT_WINDOW_WIDTH = 360;
export const DEFAULT_WINDOW_HEIGHT = 260;
export const COLLAPSED_HEIGHT = 35;
export const ADD_ENTITY_EXCLUDED = ["NONE", "DEATHBEAM"];
export const FIRING_PANEL_WIDTH = 270;
export const FIRING_PANEL_HEIGHT = 160;

export const getCreatableEntityTypeItems = (): Array<{ label: string; value: ObjectTypes }> => {
  return Object.entries(ObjectTypes)
    .filter(([, label]) => !ADD_ENTITY_EXCLUDED.includes(label as string))
    .filter(([, label]) => isNaN(Number(label)))
    .map(([, label]) => ({
      label: label as string,
      value: ObjectTypes[label as keyof typeof ObjectTypes],
    }));
};
