import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameState, useGameState } from "../context";
import { startEditor } from "../../functions/gameManagement";
import { gameBus, GameEvents } from "src/util";
import { SelectionClick } from "src/util/event";
import { SerializedComponent, SerializedEntity } from "shared/src/utils";
import { BASE_HEIGHT, BASE_WIDTH } from "shared/src/consts";
import { ObjectTypes } from "shared/src/types";
import { SelectionMenu } from "./SelectionMenu";
import { stopEditorScene } from "src/game";

export type ClickLoc = { x: number; y: number };

export type MenuKind = "select" | "actions" | "addEntity";

export type InspectWindowState = {
  eid: number;
  entityName: string;
  // editable snapshot (you can later wire this to real ECS updates)
  components:  Array<SerializedComponent>;
  // positioning + UI
  x: number; // page coords
  y: number; // page coords
  collapsed: boolean;
  width?: number;
  height?: number;
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

const PAD = 8;
const FIRING_PANEL_GAP = 5;

/** Panel position ~5px below the firing indicator bottom; if that would go off-screen, place above. */
export function computeFiringPanelPosition(
  deathStarCanvasX: number,
  deathStarCanvasY: number,
  indicatorRadius: number,
  panelW: number,
  panelH: number
): { x: number; y: number } {
  const rect = getCanvasRect();
  if (!rect) return { x: PAD, y: PAD };

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

const DEFAULT_WINDOW_WIDTH = 360;
const DEFAULT_WINDOW_HEIGHT = 260;
const COLLAPSED_HEIGHT = 35;

const ADD_ENTITY_EXCLUDED = ["NONE", "DEATHBEAM"];

const FIRING_PANEL_WIDTH = 270;
const FIRING_PANEL_HEIGHT = 160;

/** Minimal angle (‑180..180) and power (20..100) controls plus Fire/Cancel, for editor Death Star shot. Draggable. */
function FiringPanel(props: {
  position: { x: number; y: number };
  eid: number;
  initialAngle: number;
  initialPower: number;
  onFire: (eid: number, angle: number, power: number) => void;
  onCancel: () => void;
  onMove: (x: number, y: number) => void;
}) {
  const { position, eid, initialAngle, initialPower, onFire, onCancel, onMove } = props;
  const [angle, setAngle] = useState(initialAngle);
  const [power, setPower] = useState(initialPower);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const emitAnglePower = useCallback(() => {
    gameBus.emit(GameEvents.ANGLE_POWER_UI, { angle, power });
  }, [angle, power]);

  useEffect(() => {
    emitAnglePower();
  }, [angle, power, emitAnglePower]);

  useEffect(() => {
    const handler = ({ angle: a, power: p }: { angle: number; power: number }) => {
      setAngle(Math.trunc(a));
      setPower(Math.trunc(p));
    };
    gameBus.on(GameEvents.ANGLE_POWER_GAME, handler);
    return () => gameBus.off(GameEvents.ANGLE_POWER_GAME, handler);
  }, []);

  useEffect(() => {
    const onMoveMouse = (e: MouseEvent) => {
      if (draggingRef.current) {
        const nx = e.clientX - dragOffsetRef.current.dx;
        const ny = e.clientY - dragOffsetRef.current.dy;
        const pad = 6;
        const maxX = window.innerWidth - FIRING_PANEL_WIDTH - pad;
        const maxY = window.innerHeight - FIRING_PANEL_HEIGHT - pad;
        onMoveRef.current(clamp(nx, pad, maxX), clamp(ny, pad, maxY));
      }
    };
    const onUp = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", onMoveMouse);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMoveMouse);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onMouseDownBar = (e: React.MouseEvent) => {
    draggingRef.current = true;
    dragOffsetRef.current = { dx: e.clientX - position.x, dy: e.clientY - position.y };
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: FIRING_PANEL_WIDTH,
        border: "1px solid #999",
        background: "white",
        padding: 0,
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        onMouseDown={onMouseDownBar}
        style={{
          cursor: "move",
          userSelect: "none",
          padding: "6px 8px",
          borderBottom: "1px solid #ddd",
          fontWeight: 600,
        }}
      >
        Fire shot
      </div>
      <div style={{ padding: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ width: 44 }}>Angle</span>
          <input
            type="range"
            min={-180}
            max={180}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ minWidth: 36, textAlign: "right" }}>{angle}°</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ width: 44 }}>Power</span>
          <input
            type="range"
            min={20}
            max={100}
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ minWidth: 36, textAlign: "right" }}>{power}%</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" onClick={() => onFire(eid, angle, power)}>
            Fire
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function getCreatableEntityTypeItems(): { label: string; value: ObjectTypes }[] {
  return (Object.entries(ObjectTypes))
    .filter(([_, label]) => !ADD_ENTITY_EXCLUDED.includes(label as string))
    .filter(([_, label]) => isNaN(Number(label)))
    .map(([_, label]) => ({ label: label as string, value: ObjectTypes[label as keyof typeof ObjectTypes]}));
}

export function DraggableInspectWindow(props: {
  win: InspectWindowState;
  onClose: (eid: number) => void;
  onToggleCollapse: (eid: number) => void;
  onMove: (eid: number, x: number, y: number) => void;
  onResize: (eid: number, width: number, height: number) => void;
  onEditProp: (eid: number, compKey: string, propKey: string, next: any) => void;
  onRemoveComponent: (eid: number, compKey: string) => void;
}) {
  const { win, onClose, onToggleCollapse, onMove, onResize, onEditProp, onRemoveComponent } = props;

  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const resizingRef = useRef(false);
  const resizeStartRef = useRef({
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  const rootRef = useRef<HTMLDivElement>(null);

  const currentWidth = win.width ?? DEFAULT_WINDOW_WIDTH;
  const currentHeight = win.collapsed ? COLLAPSED_HEIGHT : (win.height ?? DEFAULT_WINDOW_HEIGHT);

  const onMouseDownResize = (e: React.MouseEvent) => {
    resizingRef.current = true;
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: currentWidth,
      startH: win.collapsed ? COLLAPSED_HEIGHT : (win.height ?? DEFAULT_WINDOW_HEIGHT),
    };
    e.preventDefault();
    e.stopPropagation();
  };

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
      if (draggingRef.current) {
        const nx = e.clientX - dragOffsetRef.current.dx;
        const ny = e.clientY - dragOffsetRef.current.dy;
  
        const pad = 6;
        const maxX = window.innerWidth - 220;
        const maxY = window.innerHeight - 40;
        onMoveRef.current(win.eid, clamp(nx, pad, maxX), clamp(ny, pad, maxY));
      }

      // resizing window
      if (resizingRef.current) {
        const dx = e.clientX - resizeStartRef.current.startX;
        const dy = e.clientY - resizeStartRef.current.startY;

        const minW = 260;
        const minH = COLLAPSED_HEIGHT;

        // Keep within viewport (roughly) from the window's top-left.
        const maxW = window.innerWidth - win.x - 6;
        const maxH = window.innerHeight - win.y - 6;

        const nextW = clamp(resizeStartRef.current.startW + dx, minW, maxW);
        const nextH = clamp(resizeStartRef.current.startH + dy, minH, maxH);

        onResize(win.eid, nextW, nextH);
      }
    };

    const onUp = () => {
      draggingRef.current = false;
      resizingRef.current = false;
    };

    window.addEventListener("mousemove", onMoveMouse);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMoveMouse);
      window.removeEventListener("mouseup", onUp);
    };
  }, [win.eid, win.x, win.y, onResize]);

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        left: win.x,
        top: win.y,
        width: currentWidth,
        height: currentHeight,
        border: "1px solid #999",
        background: "white",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
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
          borderBottom: win.collapsed ? "none" : "1px solid #ddd",
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
        <div style={{ padding: "8px", overflow: "auto", flex: 1 }}>
          {win.components.map((c) => (
            <div key={c.key} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveComponent(win.eid, c.key);
                  }}
                  title="Remove component"
                  style={{ padding: "0 4px", lineHeight: 1, cursor: "pointer", flexShrink: 0 }}
                >
                  ×
                </button>
                <span>{c.key}</span>
              </div>

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
      {!win.collapsed && (
        <div
          onMouseDown={onMouseDownResize}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 14,
            height: 14,
            cursor: "nwse-resize",
            userSelect: "none",
          }}
          title="Resize"
        />
      )}
    </div>
  );
}

export const EditorScreen = () => {
  const { setGameState } = useGameState();
  const [lastClick, setLastClick] = useState<SelectionClick | null>(null);
  const [showEntityMenu, setShowEntityMenu] = useState(false);
  // Selection / active entity
  const [activeEntity, setActiveEntity] = useState<SerializedEntity | null>(null);

  // Menu state
  const [menuKind, setMenuKind] = useState<MenuKind | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [menuEntities, setMenuEntities] = useState<SerializedEntity[]>([]);
  /** When set, we're in fire-shot mode: show minimal angle/power UI. Set when ED_FIRE_SHOT_READY is received. */
  const [firingFrom, setFiringFrom] = useState<{
    eid: number;
    x: number;
    y: number;
    indicatorRadius: number;
    initialAngle: number;
    initialPower: number;
    panelPosition: { x: number; y: number };
  } | null>(null);
  /** Remember firing panel position per death star eid. */
  const [firingPanelPositionByEid, setFiringPanelPositionByEid] = useState<Map<number, { x: number; y: number }>>(() => new Map());
  const firingPanelPositionByEidRef = useRef(firingPanelPositionByEid);
  firingPanelPositionByEidRef.current = firingPanelPositionByEid;
  const firingFromRef = useRef(firingFrom);
  firingFromRef.current = firingFrom;

  // Inspect windows (index is eid)
  const [inspectWindows, setInspectWindows] = useState<Map<number, InspectWindowState>>(
    () => new Map()
  );
  useEffect(() => {
    gameBus.on(GameEvents.ED_ENTITY_CLICKED, (clickPayload) => {
      setLastClick(clickPayload);
    })
    gameBus.on(GameEvents.ED_PH_DELETE_ENTITY, ({eid}) => {
      const newInspects = new Map(inspectWindows);
      newInspects.delete(eid);
      setInspectWindows(newInspects);
      closeMenus();
    })
    gameBus.on(GameEvents.ED_FIRE_MODE_EXITED, () => {
      const current = firingFromRef.current;
      if (current) {
        setFiringPanelPositionByEid((prev) => {
          const next = new Map(prev);
          next.set(current.eid, current.panelPosition);
          return next;
        });
      }
      setFiringFrom(null);
    });
    gameBus.on(GameEvents.ED_FIRE_SHOT_READY, (payload) => {
      const saved = firingPanelPositionByEidRef.current.get(payload.eid);
      const panelPosition =
        saved ?? computeFiringPanelPosition(
          payload.x,
          payload.y,
          payload.indicatorRadius,
          FIRING_PANEL_WIDTH,
          FIRING_PANEL_HEIGHT
        );
      setFiringFrom({
        eid: payload.eid,
        x: payload.x,
        y: payload.y,
        indicatorRadius: payload.indicatorRadius,
        initialAngle: payload.initialAngle,
        initialPower: payload.initialPower,
        panelPosition,
      });
    });
    gameBus.on(GameEvents.ED_PH_COMPONENT_REMOVED, ({ eid, name, components }) => {
      setInspectWindows((prev) => {
        const cur = prev.get(eid);
        if (!cur) return prev;
        const next = new Map(prev);
        next.set(eid, { ...cur, entityName: name, components });
        return next;
      });
    });
    startEditor();

    return () => {
      gameBus.off(GameEvents.ED_ENTITY_CLICKED);
      gameBus.off(GameEvents.ED_FIRE_MODE_EXITED);
      gameBus.off(GameEvents.ED_FIRE_SHOT_READY);
      gameBus.off(GameEvents.ED_PH_COMPONENT_REMOVED);
    }
  }, []);

  const addButtonRef = useRef<HTMLButtonElement>(null);

  const openAddEntityMenu = () => {
    const rect = addButtonRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({ x: rect.left, y: rect.bottom + 4 });
      setMenuKind("addEntity");
    }
  };

  const selectionMenuRef = useRef<HTMLDivElement>(null);

  const closeMenus = useCallback(() => {
    setMenuKind(null);
    setMenuPos(null);
    setMenuEntities([]);
  }, []);

  useOutsideClick(
    [selectionMenuRef as React.RefObject<HTMLElement>],
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
          width: DEFAULT_WINDOW_WIDTH,
          height: DEFAULT_WINDOW_HEIGHT,
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
  };

  const creatableEntityItems = useMemo(() => getCreatableEntityTypeItems(), []);

  const renderSelectionMenu = () => {
    if (!menuPos || (menuKind !== "select" && menuKind !== "actions" && menuKind !== "addEntity"))
      return null;

    if (menuKind === "select") {
      return (
        <SelectionMenu<SerializedEntity>
          position={menuPos}
          title="Select entity"
          items={menuEntities.map((e) => ({ label: e.name, value: e }))}
          onSelect={onPickEntityFromSelect}
          menuRef={selectionMenuRef}
          width={240}
        />
      );
    }

    if (menuKind === "actions" && activeEntity) {
      const isDeathStar = activeEntity.name.includes("DEATHSTAR");
      const positionComp = activeEntity.components?.find((c) => c.key === "Position");
      const posX = (positionComp?.props?.x as number) ?? 0;
      const posY = (positionComp?.props?.y as number) ?? 0;

      const actionItems = [
        { label: "Move", value: "move" as const },
        { label: "Inspect", value: "inspect" as const },
        ...(isDeathStar ? [{ label: "Fire shot", value: "fireshot" as const }] : []),
        { label: "Delete", value: "delete" as const },
      ];
      return (
        <SelectionMenu<"move" | "inspect" | "delete" | "fireshot">
          position={menuPos}
          title={activeEntity.name}
          items={actionItems}
          onSelect={(action) => {
            if (action === "inspect") openInspectWindow(activeEntity);
            else if (action === "delete")
              gameBus.emit(GameEvents.ED_UI_DELETE_ENTITY, { eid: activeEntity.eid });
            else if (action === "move")
              gameBus.emit(GameEvents.ED_UI_START_MOVE_ENTITY, { eid: activeEntity.eid });
            else if (action === "fireshot") {
              gameBus.emit(GameEvents.ED_UI_START_FIRE_SHOT, {
                eid: activeEntity.eid,
                x: posX,
                y: posY,
              });
            }
            closeMenus();
          }}
          menuRef={selectionMenuRef}
          width={160}
        />
      );
    }

    if (menuKind === "addEntity") {
      return (
        <SelectionMenu<ObjectTypes>
          position={menuPos}
          title="Add entity"
          items={creatableEntityItems}
          onSelect={(objectType) => {
            gameBus.emit(GameEvents.ED_UI_START_PLACE_ENTITY, { objectType });
            closeMenus();
          }}
          menuRef={selectionMenuRef}
          width={240}
        />
      );
    }

    return null;
  };

  const windowsList = useMemo(() => Array.from(inspectWindows.values()), [inspectWindows]);

  const handleBack = () => {
    setGameState(GameState.MAIN_MENU);
    stopEditorScene();
  }
  
  return (
    <div>
      <button onClick={handleBack}>back</button>
      <button ref={addButtonRef} onClick={openAddEntityMenu}>
        add
      </button>
      {renderSelectionMenu()}

      {firingFrom && (
        <FiringPanel
          position={firingFrom.panelPosition}
          eid={firingFrom.eid}
          initialAngle={firingFrom.initialAngle}
          initialPower={firingFrom.initialPower}
          onFire={(eid, angle, power) => {
            const current = firingFromRef.current;
            if (current) {
              setFiringPanelPositionByEid((prev) => {
                const next = new Map(prev);
                next.set(current.eid, current.panelPosition);
                return next;
              });
            }
            gameBus.emit(GameEvents.ED_UI_FIRE_SHOT_CONFIRM, { eid, angle, power });
            setFiringFrom(null);
          }}
          onCancel={() => {
            const current = firingFromRef.current;
            if (current) {
              setFiringPanelPositionByEid((prev) => {
                const next = new Map(prev);
                next.set(current.eid, current.panelPosition);
                return next;
              });
            }
            gameBus.emit(GameEvents.ED_UI_FIRE_SHOT_CANCEL);
            setFiringFrom(null);
          }}
          onMove={(x, y) =>
            setFiringFrom((prev) =>
              prev ? { ...prev, panelPosition: { x, y } } : null
            )
          }
        />
      )}

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
          onResize={(eid, width, height) => {
            setInspectWindows((prev) => {
              const cur = prev.get(eid);
              if (!cur) return prev;
              const next = new Map(prev);
              next.set(eid, { ...cur, width, height });
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
          onRemoveComponent={(eid, compKey) => {
            gameBus.emit(GameEvents.ED_UI_REMOVE_COMPONENT, { eid, compKey });
          }}
        />
      ))}
    </div>
  )
}