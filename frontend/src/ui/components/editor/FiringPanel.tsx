import { useCallback, useEffect, useState } from "react";
import { gameBus, GameEvents } from "src/util";
import { useDraggable } from "../../hooks/useDraggable";
import { FIRING_PANEL_HEIGHT, FIRING_PANEL_WIDTH } from "./utils";

const PAD = 6;

export type FiringPanelProps = {
  position: { x: number; y: number };
  eid: number;
  initialAngle: number;
  initialPower: number;
  onFire: (eid: number, angle: number, power: number) => void;
  onCancel: () => void;
  onMove: (x: number, y: number) => void;
};

export const FiringPanel = (props: FiringPanelProps) => {
  const { position, eid, initialAngle, initialPower, onFire, onCancel, onMove } = props;
  const [angle, setAngle] = useState(initialAngle);
  const [power, setPower] = useState(initialPower);

  const getBounds = useCallback(() => {
    return {
      minX: PAD,
      minY: PAD,
      maxX: window.innerWidth - FIRING_PANEL_WIDTH - PAD,
      maxY: window.innerHeight - FIRING_PANEL_HEIGHT - PAD,
    };
  }, []);

  const { onMouseDown } = useDraggable({ position, getBounds, onMove });

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
    return () => {
      gameBus.off(GameEvents.ANGLE_POWER_GAME, handler);
    };
  }, []);

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
        onMouseDown={onMouseDown}
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
};
