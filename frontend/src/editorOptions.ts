/**
 * Editor options: single source of truth for trails, death stars, etc.
 * Read by EditorManager, render/trail, and UI. UI updates via setters and subscribe().
 */

export type DeathStarSizeIndex = 0 | 1 | 2 | 3; // Tiny, Small, Large, That's no moon

export type ShotRecord = {
  angle: number;
  power: number;
  color: number;
};

type Listener = () => void;
const listeners: Listener[] = [];

let persistTrails = false;
let labelTrails = false;
let allDestructible = true;
let deathStarSizeIndex: DeathStarSizeIndex = 1; // Small = default
const removedDestructibleEids = new Set<number>();
const shotHistoryByDeathStarEid = new Map<number, ShotRecord[]>();

function notify() {
  listeners.forEach((cb) => cb());
}

export function getPersistTrails(): boolean {
  return persistTrails;
}

export function setPersistTrails(value: boolean): void {
  persistTrails = value;
  notify();
}

export function getLabelTrails(): boolean {
  return labelTrails;
}

export function setLabelTrails(value: boolean): void {
  labelTrails = value;
  notify();
}

export function getAllDestructible(): boolean {
  return allDestructible;
}

export function setAllDestructible(value: boolean): void {
  allDestructible = value;
  notify();
}

export function getDeathStarSizeIndex(): DeathStarSizeIndex {
  return deathStarSizeIndex;
}

export function setDeathStarSizeIndex(value: DeathStarSizeIndex): void {
  deathStarSizeIndex = value;
  notify();
}

export function getRemovedDestructibleEids(): Set<number> {
  return removedDestructibleEids;
}

export function addRemovedDestructibleEid(eid: number): void {
  removedDestructibleEids.add(eid);
}

export function clearRemovedDestructibleEids(): void {
  removedDestructibleEids.clear();
}

export function getShotHistory(deathStarEid: number): ShotRecord[] {
  return shotHistoryByDeathStarEid.get(deathStarEid) ?? [];
}

export const clearShotHistory = () => {
  shotHistoryByDeathStarEid.clear();
}

export function recordShot(deathStarEid: number, angle: number, power: number, color: number): void {
  let list = shotHistoryByDeathStarEid.get(deathStarEid);
  if (!list) {
    list = [];
    shotHistoryByDeathStarEid.set(deathStarEid, list);
  }
  list.push({ angle, power, color });
  notify();
}

export function subscribe(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    const i = listeners.indexOf(listener);
    if (i !== -1) listeners.splice(i, 1);
  };
}
