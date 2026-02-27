import { useDraggable } from "../../hooks/useDraggable";
import { useResize } from "../../hooks/useResize";
import type { InspectWindowState } from "./types";
import {
  COLLAPSED_HEIGHT,
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
  coerceInputValue,
} from "./utils";

const DRAG_PAD = 6;
const MIN_WIDTH = 260;

export type DraggableInspectWindowProps = {
  win: InspectWindowState;
  onClose: (eid: number) => void;
  onToggleCollapse: (eid: number) => void;
  onMove: (eid: number, x: number, y: number) => void;
  onResize: (eid: number, width: number, height: number) => void;
  onEditProp: (eid: number, compKey: string, propKey: string, next: unknown) => void;
  onRemoveComponent: (eid: number, compKey: string) => void;
};

export const DraggableInspectWindow = (props: DraggableInspectWindowProps) => {
  const { win, onClose, onToggleCollapse, onMove, onResize, onEditProp, onRemoveComponent } =
    props;

  const currentWidth = win.width ?? DEFAULT_WINDOW_WIDTH;
  const currentHeight = win.collapsed
    ? COLLAPSED_HEIGHT
    : (win.height ?? DEFAULT_WINDOW_HEIGHT);

  const getDragBounds = () => ({
    minX: DRAG_PAD,
    minY: DRAG_PAD,
    maxX: window.innerWidth - 220,
    maxY: window.innerHeight - 40,
  });

  const { onMouseDown: onDragStart } = useDraggable({
    position: { x: win.x, y: win.y },
    getBounds: getDragBounds,
    onMove: (x, y) => onMove(win.eid, x, y),
  });

  const getResizeMin = () => ({ minW: MIN_WIDTH, minH: COLLAPSED_HEIGHT });
  const getResizeMax = () => ({
    maxW: window.innerWidth - win.x - DRAG_PAD,
    maxH: window.innerHeight - win.y - DRAG_PAD,
  });

  const { onMouseDown: onResizeStart } = useResize({
    width: currentWidth,
    height: win.collapsed ? COLLAPSED_HEIGHT : (win.height ?? DEFAULT_WINDOW_HEIGHT),
    getMinSize: getResizeMin,
    getMaxSize: getResizeMax,
    onResize: (width, height) => onResize(win.eid, width, height),
  });

  return (
    <div
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
        onMouseDown={onDragStart}
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
        <div style={{ flex: 1 }}>Inspecting entity {win.entityName}</div>
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
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveComponent(win.eid, c.key);
                  }}
                  title="Remove component"
                  style={{
                    padding: "0 4px",
                    lineHeight: 1,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  x
                </button>
                <span>{c.key}</span>
              </div>

              <div style={{ paddingLeft: 10 }}>
                {Object.entries(c.props ?? {}).length === 0 ? (
                  <div>(no props)</div>
                ) : (
                  Object.entries(c.props).filter(([propKey]) => propKey[0] !== '_').map(([propKey, value]) => {
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
                      <div key={propKey} style={{ marginBottom: 4, display: "flex" }}>
                        <label
                          htmlFor={inputId}
                          style={{ display: "inline-block", width: 120 }}
                        >
                          {propKey}
                        </label>
                        <input
                          id={inputId}
                          type={isNumber ? "number" : "text"}
                          step={propKey === 'rotation' ? 0.01 : 1}
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
          onMouseDown={onResizeStart}
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
};
