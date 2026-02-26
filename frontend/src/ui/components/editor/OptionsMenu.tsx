import { RefObject } from "react";
import { gameBus, GameEvents } from "src/util";
import { Backgrounds } from "shared/src/types";
import {
  useEditorOptions,
  type DeathStarSizeIndex,
} from "./";

export type OptionsMenuPanel = "root" | "trails" | "deathstars" | "size" | "background";

export type OptionsMenuProps = {
  position: { x: number; y: number } | null;
  menuRef: RefObject<HTMLDivElement | null>;
  panel: OptionsMenuPanel;
  onPanelChange: (panel: OptionsMenuPanel) => void;
  onClose: () => void;
};

const SIZE_LABELS: Record<DeathStarSizeIndex, string> = {
  0: "Tiny",
  1: "Small",
  2: "Large",
  3: "That's no moon",
};

export function OptionsMenu({
  position,
  menuRef,
  panel,
  onPanelChange,
  onClose,
}: OptionsMenuProps) {
  const options = useEditorOptions();
  if (!position) return null;

  const menuStyle: React.CSSProperties = {
    position: "fixed",
    left: position.x,
    top: position.y,
    border: "1px solid #999",
    background: "white",
    padding: 6,
    zIndex: 999,
    minWidth: 200,
  };

  const backButton = (
    <button type="button" onClick={() => onPanelChange("root")}>
      ← Back
    </button>
  );

  if (panel === "root") {
    return (
      <div ref={menuRef} style={menuStyle}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>Options</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>
            <button type="button" onClick={() => onPanelChange("trails")}>
              Trails
            </button>
          </li>
          <li>
            <button type="button" onClick={() => onPanelChange("deathstars")}>
              Death stars
            </button>
          </li>
          <li>
            <button type="button" onClick={() => onPanelChange("background")}>
              Background
            </button>
          </li>
        </ul>
      </div>
    );
  }

  if (panel === "trails") {
    return (
      <div ref={menuRef} style={menuStyle}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>
          {backButton}
          <span style={{ marginLeft: 6 }}>Trails</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>
            <button
              type="button"
              onClick={() => {
                gameBus.emit(GameEvents.ED_UI_CLEAR_TRAILS);
                options.clearShotHistory();
                onClose();
              }}
            >
              Clear trails
            </button>
          </li>
          <li>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={options.persistTrails}
                onChange={(e) => options.setPersistTrails(e.target.checked)}
              />
              Persist trails
            </label>
          </li>
          <li>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={options.labelTrails}
                onChange={(e) => options.setLabelTrails(e.target.checked)}
              />
              Label trails
            </label>
          </li>
        </ul>
      </div>
    );
  }

  if (panel === "deathstars") {
    return (
      <div ref={menuRef} style={menuStyle}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>
          {backButton}
          <span style={{ marginLeft: 6 }}>Death stars</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={options.allDestructible}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  options.setAllDestructible(enabled);
                  gameBus.emit(GameEvents.ED_UI_OPTIONS_ALL_DESTRUCTIBLE, {
                    enabled,
                  });
                }}
              />
              All destructible
            </label>
          </li>
          <li>
            <button type="button" onClick={() => onPanelChange("size")}>
              Size
            </button>
          </li>
        </ul>
      </div>
    );
  }

  if (panel === "size") {
    const current = options.deathStarSizeIndex;
    return (
      <div ref={menuRef} style={menuStyle}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>
          {backButton}
          <span style={{ marginLeft: 6 }}>Size</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {([0, 1, 2, 3] as const).map((idx) => (
            <li key={idx}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="radio"
                  name="deathstar-size"
                  checked={current === idx}
                  onChange={() => {
                    options.setDeathStarSizeIndex(idx);
                    gameBus.emit(GameEvents.ED_UI_OPTIONS_DEATHSTAR_SIZE, {
                      sizeIndex: idx,
                    });
                  }}
                />
                {SIZE_LABELS[idx]}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (panel === "background") {
    const items = [
      { value: Backgrounds.NONE, label: "NONE" },
      { value: Backgrounds.STARS, label: "STARS" },
      { value: Backgrounds.SHARDS, label: "SHARDS" },
      { value: Backgrounds.DEEPSPACE, label: "DEEPSPACE" },
      { value: Backgrounds.NEBULAR, label: "NEBULAR" },
    ];
    return (
      <div ref={menuRef} style={menuStyle}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>
          {backButton}
          <span style={{ marginLeft: 6 }}>Background</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {items.map(({ value, label }) => (
            <li key={value}>
              <button
                type="button"
                onClick={() => {
                  gameBus.emit(GameEvents.ED_UI_OPTIONS_BACKGROUND, { bgType: value });
                  onClose();
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
