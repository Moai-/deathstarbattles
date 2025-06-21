import { ClearanceFunction, GameObject, ObjectTypes } from 'shared/src/types';
import { Renderable } from 'src/render/components/renderable';
import { getRadius, setPosition } from 'src/util';
import {
  generateNonOverlappingPositions,
  generateSupergiantStarPosition,
} from '../util';

export const playerClearance: ClearanceFunction = (a, b) => a + b + 80;
export const objectClearance: ClearanceFunction = (a, b) => a + b + 30;

const getAdjustedRadius = (eid: number) => {
  const type = Renderable.type[eid];
  switch (type) {
    case ObjectTypes.BLACK_HOLE:
      return 120;
    default:
      return getRadius(eid);
  }
};

export const placeEntities: (
  width: number,
  height: number,
  items: Array<number>,
  players: Array<number>,
) => Array<GameObject> = (width, height, items, players) => {
  // Sort by radius
  const levelObjects: Array<GameObject> = items
    .map((item) => ({ x: 0, y: 0, radius: getAdjustedRadius(item), eid: item }))
    .sort((a, b) => b.radius - a.radius);
  console.log('sorted', levelObjects);

  // Turn players into game objects too
  const playerObjects: Array<GameObject> = players.map((item) => ({
    x: 0,
    y: 0,
    radius: getRadius(item),
    eid: item,
  }));

  const placed = [];

  for (const obj of levelObjects) {
    if (obj.radius > 800) {
      const { x, y } = generateSupergiantStarPosition(
        width,
        height,
        obj.radius,
      );

      placed.push({ ...obj, x, y });
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
