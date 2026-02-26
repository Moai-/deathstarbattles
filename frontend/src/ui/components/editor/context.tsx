/**
 * Editor options: single source of truth for trails, death stars, etc.
 * Read by EditorManager, render/trail, and UI. UI updates via context setters or subscribe().
 */

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

export type DeathStarSizeIndex = 0 | 1 | 2 | 3; // Tiny, Small, Large, That's no moon

export type ShotRecord = {
  angle: number;
  power: number;
  color: number;
};

type Listener = () => void;

type Store = {
  persistTrails: boolean;
  labelTrails: boolean;
  allDestructible: boolean;
  deathStarSizeIndex: DeathStarSizeIndex;
  removedDestructibleEids: Set<number>;
  shotHistoryByDeathStarEid: Map<number, Array<ShotRecord>>;
};

const initialStore: Store = {
  persistTrails: false,
  labelTrails: false,
  allDestructible: true,
  deathStarSizeIndex: 1,
  removedDestructibleEids: new Set<number>(),
  shotHistoryByDeathStarEid: new Map<number, Array<ShotRecord>>(),
};

let store: Store = { ...initialStore };
let snapshotVersion = 0;
const listeners = new Set<Listener>();

type StoreSnapshot = Readonly<Store> & { _v: number };
let cachedSnapshot: StoreSnapshot | null = null;
let cachedVersion = -1;

const getSnapshot = (): StoreSnapshot => {
  if (cachedVersion === snapshotVersion && cachedSnapshot !== null) {
    return cachedSnapshot;
  }
  cachedVersion = snapshotVersion;
  cachedSnapshot = { ...store, _v: snapshotVersion };
  return cachedSnapshot;
};

const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notify = (): void => {
  snapshotVersion += 1;
  listeners.forEach((cb) => cb());
};

// Public API for non-React code (editorManager, trail, etc.)
export const getPersistTrails = (): boolean => store.persistTrails;

export const setPersistTrails = (value: boolean): void => {
  store.persistTrails = value;
  notify();
};

export const getLabelTrails = (): boolean => store.labelTrails;

export const setLabelTrails = (value: boolean): void => {
  store.labelTrails = value;
  notify();
};

export const getAllDestructible = (): boolean => store.allDestructible;

export const setAllDestructible = (value: boolean): void => {
  store.allDestructible = value;
  notify();
};

export const getDeathStarSizeIndex = (): DeathStarSizeIndex => store.deathStarSizeIndex;

export const setDeathStarSizeIndex = (value: DeathStarSizeIndex): void => {
  store.deathStarSizeIndex = value;
  notify();
};

export const getRemovedDestructibleEids = (): Set<number> => store.removedDestructibleEids;

export const addRemovedDestructibleEid = (eid: number): void => {
  store.removedDestructibleEids.add(eid);
};

export const clearRemovedDestructibleEids = (): void => {
  store.removedDestructibleEids.clear();
};

export const getShotHistory = (deathStarEid: number): Array<ShotRecord> =>
  store.shotHistoryByDeathStarEid.get(deathStarEid) ?? [];

export const clearShotHistory = (): void => {
  store.shotHistoryByDeathStarEid.clear();
};

export const recordShot = (
  deathStarEid: number,
  angle: number,
  power: number,
  color: number
): void => {
  let list = store.shotHistoryByDeathStarEid.get(deathStarEid);
  if (!list) {
    list = [];
    store.shotHistoryByDeathStarEid.set(deathStarEid, list);
  }
  list.push({ angle, power, color });
  notify();
};

export { subscribe };

// React context
export type EditorOptionsContextValue = Store & {
  setPersistTrails: (value: boolean) => void;
  setLabelTrails: (value: boolean) => void;
  setAllDestructible: (value: boolean) => void;
  setDeathStarSizeIndex: (value: DeathStarSizeIndex) => void;
  addRemovedDestructibleEid: (eid: number) => void;
  clearRemovedDestructibleEids: () => void;
  clearShotHistory: () => void;
  recordShot: (deathStarEid: number, angle: number, power: number, color: number) => void;
};

const EditorOptionsContext = createContext<EditorOptionsContextValue | null>(null);

export const EditorOptionsProvider = ({ children }: { children: React.ReactNode }) => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot) as StoreSnapshot;
  const { _v: _, ...storeState } = snapshot;

  const setPersistTrailsCb = useCallback((value: boolean) => {
    setPersistTrails(value);
  }, []);

  const setLabelTrailsCb = useCallback((value: boolean) => {
    setLabelTrails(value);
  }, []);

  const setAllDestructibleCb = useCallback((value: boolean) => {
    setAllDestructible(value);
  }, []);

  const setDeathStarSizeIndexCb = useCallback((value: DeathStarSizeIndex) => {
    setDeathStarSizeIndex(value);
  }, []);

  const addRemovedDestructibleEidCb = useCallback((eid: number) => {
    addRemovedDestructibleEid(eid);
  }, []);

  const clearRemovedDestructibleEidsCb = useCallback(() => {
    clearRemovedDestructibleEids();
  }, []);

  const clearShotHistoryCb = useCallback(() => {
    clearShotHistory();
  }, []);

  const recordShotCb = useCallback(
    (deathStarEid: number, angle: number, power: number, color: number) => {
      recordShot(deathStarEid, angle, power, color);
    },
    []
  );

  const value: EditorOptionsContextValue = {
    ...storeState,
    setPersistTrails: setPersistTrailsCb,
    setLabelTrails: setLabelTrailsCb,
    setAllDestructible: setAllDestructibleCb,
    setDeathStarSizeIndex: setDeathStarSizeIndexCb,
    addRemovedDestructibleEid: addRemovedDestructibleEidCb,
    clearRemovedDestructibleEids: clearRemovedDestructibleEidsCb,
    clearShotHistory: clearShotHistoryCb,
    recordShot: recordShotCb,
  };

  return (
    <EditorOptionsContext.Provider value={value}>
      {children}
    </EditorOptionsContext.Provider>
  );
};

export const useEditorOptions = (): EditorOptionsContextValue => {
  const ctx = useContext(EditorOptionsContext);
  if (ctx == null) {
    throw new Error("useEditorOptions must be used within EditorOptionsProvider");
  }
  return ctx;
};
