import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameState, useGameState } from "../context";
import { startEditor } from "../../functions/gameManagement";
import { gameBus, GameEvents } from "src/util";
import { SelectionClick } from "src/util/event";
import { SerializedComponent, SerializedEntity } from "shared/src/utils";
import { BASE_HEIGHT, BASE_WIDTH } from "shared/src/consts";

export type ClickLoc = { x: number; y: number };

export type MenuKind = "select" | "actions";

export type InspectWindowState = {
  eid: number;
  entityName: string;
  // editable snapshot (you can later wire this to real ECS updates)
  components:  Array<SerializedComponent>;
  // positioning + UI
  x: number; // page coords
  y: number; // page coords
  collapsed: boolean;
};

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function coerceInputValue(raw: string, original: any) {
  // Keep it simple:
  // - boolean -> checkbox uses checked, handled elsewhere
  // - number -> parseFloat (allow empty -> NaN -> keep empty string)
  // - otherwise string
  if (typeof original === "number") {
    const v = raw.trim();
    if (v === "") return "";
    const parsed = Number(v);
    return Number.isFinite(parsed) ? parsed : original;
  }
  return raw;
}

function getCanvasRect(): DOMRect | null {
  const root = document.getElementById("phaser-root");
  if (!root) return null;
  const canvas = root.querySelector("canvas");
  if (!canvas) return null;
  return canvas.getBoundingClientRect();
}

export function computeAnchoredMenuPos(clickLocCanvas: ClickLoc, menuW = 220, menuH = 140) {
  // clickLocCanvas is in Phaser game coords (0..BASE_WIDTH, 0..BASE_HEIGHT).
  // Map to page coords using the canvas's display rect (scaled/letterboxed).
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
}

export function useOutsideClick(
  refs: React.RefObject<HTMLElement>[],
  onOutside: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside = refs.some((r) => r.current && r.current.contains(target));
      if (!inside) onOutside();
    };

    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [refs, onOutside, enabled]);
}

export function DraggableInspectWindow(props: {
  win: InspectWindowState;
  onClose: (eid: number) => void;
  onToggleCollapse: (eid: number) => void;
  onMove: (eid: number, x: number, y: number) => void;
  onEditProp: (eid: number, compKey: string, propKey: string, next: any) => void;
}) {
  const { win, onClose, onToggleCollapse, onMove, onEditProp } = props;

  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const onMouseDownBar = (e: React.MouseEvent) => {
    draggingRef.current = true;
    dragOffsetRef.current = {
      dx: e.clientX - win.x,
      dy: e.clientY - win.y,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const onMoveMouse = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const nx = e.clientX - dragOffsetRef.current.dx;
      const ny = e.clientY - dragOffsetRef.current.dy;

      const pad = 6;
      const maxX = window.innerWidth - 220;
      const maxY = window.innerHeight - 40;
      onMoveRef.current(win.eid, clamp(nx, pad, maxX), clamp(ny, pad, maxY));
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
  }, [win.eid]);

  return (
    <div
      style={{
        position: "fixed",
        left: win.x,
        top: win.y,
        width: 360,
        border: "1px solid #999",
        background: "white",
        zIndex: 1000,
      }}
    >
      <div
        onMouseDown={onMouseDownBar}
        style={{
          cursor: "move",
          userSelect: "none",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div style={{ flex: 1 }}>
          Inspecting entity {win.entityName}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse(win.eid);
          }}
          title={win.collapsed ? "Expand" : "Collapse"}
        >
          __
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose(win.eid);
          }}
          title="Close"
        >
          X
        </button>
      </div>

      {!win.collapsed && (
        <div style={{ padding: "8px", maxHeight: 320, overflow: "auto" }}>
          {win.components.map((c) => (
            <div key={c.key} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.key}</div>

              <div style={{ paddingLeft: 10 }}>
                {Object.entries(c.props ?? {}).length === 0 ? (
                  <div>(no props)</div>
                ) : (
                  Object.entries(c.props).map(([propKey, value]) => {
                    const inputId = `eid-${win.eid}-${c.key}-${propKey}`;
                    const valueType = typeof value;

                    if (valueType === "boolean") {
                      return (
                        <div key={propKey} style={{ marginBottom: 4 }}>
                          <label htmlFor={inputId} style={{ marginRight: 6 }}>
                            {propKey}
                          </label>
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={Boolean(value)}
                            onChange={(e) =>
                              onEditProp(win.eid, c.key, propKey, e.target.checked)
                            }
                          />
                        </div>
                      );
                    }

                    const isNumber = valueType === "number";
                    const isNullish = value === null || value === undefined;

                    return (
                      <div key={propKey} style={{ marginBottom: 4, display: 'flex' }}>
                        <label htmlFor={inputId} style={{ display: "inline-block", width: 120 }}>
                          {propKey}
                        </label>
                        <input
                          id={inputId}
                          type={isNumber ? "number" : "text"}
                          value={isNullish ? "" : String(value)}
                          onChange={(e) =>
                            onEditProp(
                              win.eid,
                              c.key,
                              propKey,
                              coerceInputValue(e.target.value, value)
                            )
                          }
                          style={{ width: 200 }}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const EditorScreen = () => {
  const { setGameState } = useGameState();
  const [lastClick, setLastClick] = useState<SelectionClick | null>(null);
  useEffect(() => {
    gameBus.on(GameEvents.ED_ENTITY_CLICKED, (clickPayload) => {
      setLastClick(clickPayload);
    })
    startEditor();

    return () => gameBus.off(GameEvents.ED_ENTITY_CLICKED);
  }, []);

  const addEntity = () => {
    gameBus.emit(GameEvents.ED_ADD_ENTITY)
  }

  // Selection / active entity
  const [activeEntity, setActiveEntity] = useState<SerializedEntity | null>(null);

  // Menu state
  const [menuKind, setMenuKind] = useState<MenuKind | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [menuEntities, setMenuEntities] = useState<SerializedEntity[]>([]);

  // Inspect windows (one per eid)
  const [inspectWindows, setInspectWindows] = useState<Map<number, InspectWindowState>>(
    () => new Map()
  );

  const selectMenuRef = useRef<HTMLDivElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  const closeMenus = useCallback(() => {
    setMenuKind(null);
    setMenuPos(null);
    setMenuEntities([]);
  }, []);

  useOutsideClick(
    [selectMenuRef as any, actionsMenuRef as any],
    () => closeMenus(),
    menuKind !== null
  );

  // React to new click payload
  useEffect(() => {
    if (!lastClick) return;

    const { clickLoc, entities } = lastClick;

    // Always reset menus for new click
    closeMenus();

    if (!entities || entities.length === 0) {
      // do not show anything
      return;
    }

    // compute a menu position anchored to canvas click location
    // (use a slightly bigger size for the selection list than the actions menu)
    const basePos =
      entities.length > 1
        ? computeAnchoredMenuPos(clickLoc, 240, 200)
        : computeAnchoredMenuPos(clickLoc, 160, 140);

    setMenuPos(basePos);

    if (entities.length === 1) {
      setActiveEntity(entities[0]);
      // show actions menu at click
      setMenuKind("actions");
    } else {
      // show selection dialog
      setMenuEntities(entities);
      setMenuKind("select");
    }
    setLastClick(null);
  }, [lastClick, closeMenus]);

  const openInspectWindow = useCallback(
    (entity: SerializedEntity) => {
      setInspectWindows((prev) => {
        if (prev.has(entity.eid)) return prev; // do nothing if already open

        const next = new Map(prev);

        // place new inspect window near current menu pos (or default)
        const start = menuPos ?? { x: 20, y: 20 };

        next.set(entity.eid, {
          eid: entity.eid,
          entityName: entity.name,
          components: JSON.parse(JSON.stringify(entity.components ?? [])), // snapshot
          x: clamp(start.x + 20, 6, window.innerWidth - 240),
          y: clamp(start.y + 20, 6, window.innerHeight - 60),
          collapsed: false,
        });
        setMenuKind(null);
        return next;
      });
    },
    [menuPos]
  );

  const onPickEntityFromSelect = (entity: SerializedEntity) => {
    setActiveEntity(entity);
    setMenuKind("actions");

    // keep the same menuPos/menuClickLoc; just swap content
  };

  const renderSelectionMenu = () => {
    if (menuKind !== "select" || !menuPos) return null;

    return (
      <div
        ref={selectMenuRef}
        style={{
          position: "fixed",
          left: menuPos.x,
          top: menuPos.y,
          border: "1px solid #999",
          background: "white",
          padding: 6,
          zIndex: 999,
          width: 240,
        }}
      >
        <div style={{ marginBottom: 6, fontWeight: 600 }}>Select entity</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {menuEntities.map((e) => (
            <li key={e.eid}>
              <button type="button" onClick={() => onPickEntityFromSelect(e)}>
                {e.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderActionsMenu = () => {
    if (menuKind !== "actions" || !menuPos || !activeEntity) return null;

    return (
      <div
        ref={actionsMenuRef}
        style={{
          position: "fixed",
          left: menuPos.x,
          top: menuPos.y,
          border: "1px solid #999",
          background: "white",
          padding: 6,
          zIndex: 999,
          width: 160,
        }}
      >
        <div style={{ marginBottom: 6, fontWeight: 600 }}>{activeEntity.name}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button type="button" onClick={() => { /* noop for now */ }}>
            Move
          </button>

          <button
            type="button"
            onClick={() => {
              openInspectWindow(activeEntity);
            }}
          >
            Inspect
          </button>

          <button type="button" onClick={() => { /* noop for now */ }}>
            Delete
          </button>
        </div>
      </div>
    );
  };

  const windowsList = useMemo(() => Array.from(inspectWindows.values()), [inspectWindows]);
  
  return (
    <div>
      <button onClick={() => setGameState(GameState.MAIN_MENU)}>back</button>
      <button onClick={addEntity}>add</button>
      {renderSelectionMenu()}
      {renderActionsMenu()}

      {windowsList.map((w) => (
        <DraggableInspectWindow
          key={w.eid}
          win={w}
          onClose={(eid) => {
            setInspectWindows((prev) => {
              if (!prev.has(eid)) return prev;
              const next = new Map(prev);
              next.delete(eid);
              return next;
            });
          }}
          onToggleCollapse={(eid) => {
            setInspectWindows((prev) => {
              const cur = prev.get(eid);
              if (!cur) return prev;
              const next = new Map(prev);
              next.set(eid, { ...cur, collapsed: !cur.collapsed });
              return next;
            });
          }}
          onMove={(eid, x, y) => {
            setInspectWindows((prev) => {
              const cur = prev.get(eid);
              if (!cur) return prev;
              const next = new Map(prev);
              next.set(eid, { ...cur, x, y });
              return next;
            });
          }}
          onEditProp={(eid, compKey, propName, nextVal) => {
            setInspectWindows((prev) => {
              const cur = prev.get(eid);
              if (!cur) return prev;
              const next = new Map(prev);

              const comps = cur.components.map((c, compIdx) => {
                if (c.key !== compKey) return c;
                gameBus.emit(GameEvents.ED_UI_PROP_CHANGED, {
                  eid,
                  compIdx,
                  propName,
                  newVal: nextVal,
                })
                return {
                  ...c,
                  props: {
                    ...(c.props ?? {}),
                    [propName]: nextVal,
                  },
                };
              });

              next.set(eid, { ...cur, components: comps });
              return next;
            });
          }}
        />
      ))}
    </div>
  )
}