import { getShotHistory, getLabelTrails, type ShotRecord } from "src/editorOptions";
import { canvasToScreen } from "./utils";

function colorToHex(color: number): string {
  return "#" + (color & 0xffffff).toString(16).padStart(6, "0");
}

type TrailLegendTooltipProps = {
  hoverPayload: { clickLoc: { x: number; y: number }; entities: Array<{ eid: number; name: string }> } | null;
};

export function TrailLegendTooltip({ hoverPayload }: TrailLegendTooltipProps) {
  if (!getLabelTrails() || !hoverPayload?.entities?.length) return null;

  const deathStar = hoverPayload.entities.find((e) =>
    e.name.toUpperCase().includes("DEATHSTAR")
  );
  if (!deathStar) return null;

  const shots = getShotHistory(deathStar.eid);
  if (shots.length === 0) return null;

  const { x, y } = canvasToScreen(hoverPayload.clickLoc.x, hoverPayload.clickLoc.y);
  const style: React.CSSProperties = {
    position: "fixed",
    left: x + 12,
    top: y,
    border: "1px solid #999",
    background: "white",
    padding: "6px 8px",
    zIndex: 998,
    fontSize: 12,
    maxWidth: 200,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  };

  return (
    <div style={style}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Shots</div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {shots.map((s: ShotRecord, i: number) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: colorToHex(s.color),
                flexShrink: 0,
              }}
            />
            <span>
              angle {Math.round(s.angle)}°, power {Math.round(s.power)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
