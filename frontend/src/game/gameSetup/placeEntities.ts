import { getAllEntities } from 'bitecs';
import { ClearanceFunction, GameObject, ObjectTypes } from 'shared/src/types';
import { GameWorld } from 'shared/src/ecs/world';
import {
  generateNonOverlappingPositions,
  generateSupergiantStarPosition,
  getPosition,
  getRadius,
  getType,
  setPosition,
} from 'shared/src/utils';

export const playerClearance: ClearanceFunction = (a, b) => a + b + 80;
export const objectClearance: ClearanceFunction = (a, b) => a + b + 30;

const getAdjustedRadius = (eid: number) => {
  const type = getType(eid);
  switch (type) {
    case ObjectTypes.BLACK_HOLE:
      return 120;
    default:
      return getRadius(eid);
  }
};

/** Build placed game objects from existing world entities (e.g. after loading a saved scenario). */
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
    out.push({ eid, x, y, radius: getAdjustedRadius(eid) });
  }
  return out;
};

export const placeEntities: (
  width: number,
  height: number,
  items: Array<number>,
  players: Array<number>,
  existingPlaced?: Array<GameObject>,
) => Array<GameObject> = (width, height, items, players, existingPlaced) => {
  // Sort by adjusted radius
  const levelObjects: Array<GameObject> = items
    .map((item) => ({ x: 0, y: 0, radius: getAdjustedRadius(item), eid: item }))
    .sort((a, b) => b.radius - a.radius);

  // Turn players into game objects too
  const playerObjects: Array<GameObject> = players.map((item) => ({
    x: 0,
    y: 0,
    radius: getRadius(item),
    eid: item,
  }));

  const placed = existingPlaced ? [...existingPlaced] : [];

  let lastSupergiantSide = '';

  for (const obj of levelObjects) {
    const type = getType(obj.eid);
    if (type === ObjectTypes.SUPERGIANT || type === ObjectTypes.BIG_WORMHOLE) {
      if (lastSupergiantSide) {
        let actualSide = '';
        switch (lastSupergiantSide) {
          case 'left':
            actualSide = 'right';
            break;
          case 'right':
            actualSide = 'left';
            break;
          case 'top':
            actualSide = 'bottom';
            break;
          case 'bottom':
            actualSide = 'top';
            break;
          default:
            actualSide = 'left';
            break;
        }
        const { x, y } = generateSupergiantStarPosition(
          width,
          height,
          obj.radius,
          actualSide,
        );
        placed.push({ ...obj, x, y });
      } else {
        const { x, y, side } = generateSupergiantStarPosition(
          width,
          height,
          obj.radius,
        );

        lastSupergiantSide = side;

        placed.push({ ...obj, x, y });
      }
    } else {
      const [{ x, y }] = generateNonOverlappingPositions(
        width,
        height,
        [obj.radius],
        objectClearance,
        placed,
      );
      placed.push({ ...obj, x, y });
    }
  }
  for (const obj of playerObjects) {
    const [{ x, y }] = generateNonOverlappingPositions(
      width,
      height,
      [obj.radius],
      playerClearance,
      placed,
    );
    placed.push({ ...obj, x, y });
  }

  placed.forEach((obj) => {
    setPosition(obj.eid, obj);
  });

  return placed;
};
