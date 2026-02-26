import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameState, useGameState } from "../context";
import { startEditor } from "../../functions/gameManagement";
import { gameBus, GameEvents } from "src/util";
import { SelectionClick } from "src/util/event";
import { SerializedEntity } from "shared/src/utils";
import { ObjectTypes } from "shared/src/types";
import { SelectionMenu } from "./SelectionMenu";
import { stopEditorScene } from "src/game";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { FiringPanel } from "./FiringPanel";
import { DraggableInspectWindow } from "./DraggableInspectWindow";
import type { InspectWindowState, MenuKind } from "./editorTypes";
import {
  clamp,
  computeAnchoredMenuPos,
  computeFiringPanelPosition,
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
  getCreatableEntityTypeItems,
  FIRING_PANEL_HEIGHT,
  FIRING_PANEL_WIDTH,
} from "./utils";

const updateInspectWindow = (
  prev: Map<number, InspectWindowState>,
  eid: number,
  updater: (cur: InspectWindowState) => InspectWindowState
): Map<number, InspectWindowState> => {
  const cur = prev.get(eid);
  if (!cur) {
    return prev;
  }
  const next = new Map(prev);
  next.set(eid, updater(cur));
  return next;
};

export const EditorScreen = () => {
  const { setGameState } = useGameState();
  const [lastClick, setLastClick] = useState<SelectionClick | null>(null);
  const [activeEntity, setActiveEntity] = useState<SerializedEntity | null>(null);
  const [menuKind, setMenuKind] = useState<MenuKind | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [menuEntities, setMenuEntities] = useState<Array<SerializedEntity>>([]);
  const [firingFrom, setFiringFrom] = useState<{
    eid: number;
    x: number;
    y: number;
    indicatorRadius: number;
    initialAngle: number;
    initialPower: number;
    panelPosition: { x: number; y: number };
  } | null>(null);
  const [firingPanelPositionByEid, setFiringPanelPositionByEid] = useState<
    Map<number, { x: number; y: number }>
  >(() => new Map());
  const firingPanelPositionByEidRef = useRef(firingPanelPositionByEid);
  firingPanelPositionByEidRef.current = firingPanelPositionByEid;
  const firingFromRef = useRef(firingFrom);
  firingFromRef.current = firingFrom;

  const [inspectWindows, setInspectWindows] = useState<
    Map<number, InspectWindowState>
  >(() => new Map());

  useEffect(() => {
    gameBus.on(GameEvents.ED_ENTITY_CLICKED, (clickPayload) => {
      setLastClick(clickPayload);
    });
    gameBus.on(GameEvents.ED_PH_DELETE_ENTITY, ({ eid }) => {
      setInspectWindows((prev) => {
        const next = new Map(prev);
        next.delete(eid);
        return next;
      });
      closeMenus();
    });
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
        saved ??
        computeFiringPanelPosition(
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
      setInspectWindows((prev) =>
        updateInspectWindow(prev, eid, (cur) => ({
          ...cur,
          entityName: name,
          components,
        }))
      );
    });
    startEditor();

    return () => {
      gameBus.off(GameEvents.ED_ENTITY_CLICKED);
      gameBus.off(GameEvents.ED_PH_DELETE_ENTITY);
      gameBus.off(GameEvents.ED_FIRE_MODE_EXITED);
      gameBus.off(GameEvents.ED_FIRE_SHOT_READY);
      gameBus.off(GameEvents.ED_PH_COMPONENT_REMOVED);
    };
  }, []);

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const selectionMenuRef = useRef<HTMLDivElement>(null);

  const closeMenus = useCallback(() => {
    setMenuKind(null);
    setMenuPos(null);
    setMenuEntities([]);
  }, []);

  useOutsideClick(
    [selectionMenuRef as React.RefObject<HTMLElement>],
    closeMenus,
    menuKind !== null
  );

  useEffect(() => {
    if (!lastClick) {
      return;
    }
    const { clickLoc, entities } = lastClick;
    closeMenus();
    if (!entities || entities.length === 0) {
      setLastClick(null);
      return;
    }
    const basePos =
      entities.length > 1
        ? computeAnchoredMenuPos(clickLoc, 240, 200)
        : computeAnchoredMenuPos(clickLoc, 160, 140);
    setMenuPos(basePos);
    if (entities.length === 1) {
      setActiveEntity(entities[0]);
      setMenuKind("actions");
    } else {
      setMenuEntities(entities);
      setMenuKind("select");
    }
    setLastClick(null);
  }, [lastClick, closeMenus]);

  const openInspectWindow = useCallback(
    (entity: SerializedEntity) => {
      setInspectWindows((prev) => {
        if (prev.has(entity.eid)) {
          return prev;
        }
        const next = new Map(prev);
        const start = menuPos ?? { x: 20, y: 20 };
        next.set(entity.eid, {
          eid: entity.eid,
          entityName: entity.name,
          components: JSON.parse(JSON.stringify(entity.components ?? [])),
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

  const saveFiringPanelPositionAnd = useCallback(
    (then: () => void) => {
      const current = firingFromRef.current;
      if (current) {
        setFiringPanelPositionByEid((prev) => {
          const next = new Map(prev);
          next.set(current.eid, current.panelPosition);
          return next;
        });
      }
      setFiringFrom(null);
      then();
    },
    []
  );

  const openAddEntityMenu = useCallback(() => {
    const rect = addButtonRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({ x: rect.left, y: rect.bottom + 4 });
      setMenuKind("addEntity");
    }
  }, []);

  const onPickEntityFromSelect = useCallback((entity: SerializedEntity) => {
    setActiveEntity(entity);
    setMenuKind("actions");
  }, []);

  const creatableEntityItems = useMemo(() => getCreatableEntityTypeItems(), []);

  const renderSelectionMenu = () => {
    if (
      !menuPos ||
      (menuKind !== "select" && menuKind !== "actions" && menuKind !== "addEntity")
    ) {
      return null;
    }
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
            if (action === "inspect") {
              openInspectWindow(activeEntity);
            } else if (action === "delete") {
              gameBus.emit(GameEvents.ED_UI_DELETE_ENTITY, { eid: activeEntity.eid });
            } else if (action === "move") {
              gameBus.emit(GameEvents.ED_UI_START_MOVE_ENTITY, { eid: activeEntity.eid });
            } else if (action === "fireshot") {
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

  const windowsList = useMemo(
    () => Array.from(inspectWindows.values()),
    [inspectWindows]
  );

  const handleBack = useCallback(() => {
    setGameState(GameState.MAIN_MENU);
    stopEditorScene();
  }, [setGameState]);

  return (
    <div>
      <button onClick={handleBack}>back</button>
      <button ref={addButtonRef} onClick={openAddEntityMenu}>
        add
      </button>
      {renderSelectionMenu()}

      {firingFrom != null && (
        <FiringPanel
          position={firingFrom.panelPosition}
          eid={firingFrom.eid}
          initialAngle={firingFrom.initialAngle}
          initialPower={firingFrom.initialPower}
          onFire={(eid, angle, power) => {
            saveFiringPanelPositionAnd(() => {
              gameBus.emit(GameEvents.ED_UI_FIRE_SHOT_CONFIRM, {
                eid,
                angle,
                power,
              });
            });
          }}
          onCancel={() => {
            saveFiringPanelPositionAnd(() => {
              gameBus.emit(GameEvents.ED_UI_FIRE_SHOT_CANCEL);
            });
          }}
          onMove={(x, y) =>
            setFiringFrom((prev) =>
              prev != null ? { ...prev, panelPosition: { x, y } } : null
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
              if (!prev.has(eid)) {
                return prev;
              }
              const next = new Map(prev);
              next.delete(eid);
              return next;
            });
          }}
          onToggleCollapse={(eid) => {
            setInspectWindows((prev) =>
              updateInspectWindow(prev, eid, (cur) => ({
                ...cur,
                collapsed: !cur.collapsed,
              }))
            );
          }}
          onMove={(eid, x, y) => {
            setInspectWindows((prev) =>
              updateInspectWindow(prev, eid, (cur) => ({ ...cur, x, y }))
            );
          }}
          onResize={(eid, width, height) => {
            setInspectWindows((prev) =>
              updateInspectWindow(prev, eid, (cur) => ({ ...cur, width, height }))
            );
          }}
          onEditProp={(eid, compKey, propName, nextVal) => {
            setInspectWindows((prev) =>
              updateInspectWindow(prev, eid, (cur) => {
                const comps = cur.components.map((c, compIdx) => {
                  if (c.key !== compKey) {
                    return c;
                  }
                  gameBus.emit(GameEvents.ED_UI_PROP_CHANGED, {
                    eid,
                    compIdx,
                    propName,
                    newVal: nextVal,
                  });
                  return {
                    ...c,
                    props: {
                      ...(c.props ?? {}),
                      [propName]: nextVal,
                    },
                  };
                });
                return { ...cur, components: comps };
              })
            );
          }}
          onRemoveComponent={(eid, compKey) => {
            gameBus.emit(GameEvents.ED_UI_REMOVE_COMPONENT, { eid, compKey });
          }}
        />
      ))}
    </div>
  );
};
