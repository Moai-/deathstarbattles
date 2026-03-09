import { getAllEntities } from "bitecs";
import { GameWorld } from "shared/src/ecs/world";
import { ClearanceFunction, GameObject} from "shared/src/types";
import { getRadius, getPosition } from "shared/src/utils";

export const playerClearance: ClearanceFunction = (a, b) => a + b + 80;
export const objectClearance: ClearanceFunction = (a, b) => a + b + 30;


export const getPlacedFromWorld = (
  world: GameWorld,
  excludeEids: Array<number>,
): Array<GameObject> => {
  const exclude = new Set(excludeEids);
  const eids = getAllEntities(world);
  const out: Array<GameObject> = [];
  for (const eid of eids) {
    if (exclude.has(eid)) continue;
    const r = getRadius(eid);
    if (r <= 0) continue;
    const { x, y } = getPosition(eid);
    out.push({ eid, x, y, radius: getRadius(eid) });
  }
  return out;
};
