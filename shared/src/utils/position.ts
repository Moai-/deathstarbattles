import { BASE_HEIGHT, BASE_WIDTH } from '../consts';
import { GameWorld } from '../ecs/world';
import { AnyPoint, ClearanceFunction, GameObject, ObjectPlacement, UnplacedGameObject } from '../types';
import { getAllObjects, getPosition, getRadius } from './entity';

export function getRandomEdgePosition(
  width: number,
  height: number,
  borderSize: number,
) {
  let x, y;
  // Randomly choose edge (left/right or top/bottom) and pick point within borderSize
  if (Math.random() < 0.5) {
    // Vertical edges
    x =
      Math.random() < 0.5
        ? Math.random() * borderSize
        : width - Math.random() * borderSize;
    y = Math.random() * height;
  } else {
    // Horizontal edges
    x = Math.random() * width;
    y =
      Math.random() < 0.5
        ? Math.random() * borderSize
        : height - Math.random() * borderSize;
  }
  return { x, y };
}

export function getRandomCenterPosition(
  width: number,
  height: number,
  centerSize: number,
) {
  const centerX = width / 2;
  const centerY = height / 2;
  // Choose point within centerSize around center
  const x = centerX + (Math.random() - 0.5) * 2 * centerSize;
  const y = centerY + (Math.random() - 0.5) * 2 * centerSize;
  return { x, y };
}

export const doCirclesOverlap = (
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
): boolean => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distSq = dx * dx + dy * dy;
  const radSum = r1 + r2;
  return distSq < radSum * radSum;
};

export const doObjectsOverlap = (eid1: number, eid2: number) => {
  const { x: x1, y: y1 } = getPosition(eid1);
  const r1 = getRadius(eid1);
  const { x: x2, y: y2 } = getPosition(eid2);
  const r2 = getRadius(eid2);
  return doCirclesOverlap(x1, y1, r1, x2, y2, r2);
};

export const isVisible = (point: AnyPoint) => {
  if (point.x < 0 || point.y < 0) {
    return false;
  }
  if (point.x > BASE_WIDTH || point.y > BASE_HEIGHT) {
    return false;
  }
  return true;
}

type Side = 'left' | 'right' | 'bottom' | 'top';

export function generateNonOverlappingPositions(
  world: GameWorld,
  objects: UnplacedGameObject[],
  clearanceFn: ClearanceFunction,
  existing: Array<GameObject> = getAllObjects(world),
): Array<GameObject> {
  const placed: Array<GameObject> = [];

  let lastSupergiantSide = '';



  for (const object of objects) {
    const { radius, eid } = object;
    const placement = object.placement ?? ObjectPlacement.ANYWHERE;


    let attempt = 0;
    let found = false;

    while (attempt++ < 1000 && !found) {

      if (placement === ObjectPlacement.SUPERGIANT) {
        const {x, y, side} = generateBigCandidate(world, radius, lastSupergiantSide);
        lastSupergiantSide = side;

        const candidate: GameObject = { x, y, radius, eid };

        placed.push(candidate);
        found = true;
        break;
      }

      const {x, y} = generateCandidate(world, radius, placement, attempt)

      const tooClose = [...existing, ...placed].some((other) => {
        const otherRadius = other.radius;

        const dx = x - other.x;
        const dy = y - other.y;
        const distSq = dx * dx + dy * dy;
        const minDist = clearanceFn(radius, otherRadius);
        const minDistSq = minDist * minDist;

        return distSq < minDistSq;
      });
      
      const candidate: GameObject = { x, y, radius, eid };

      if (!tooClose) {
        placed.push(candidate);
        found = true;
      }
    }

    if (!found) {
      console.log(
        `Failed to place object with radius ${radius} after 1000 attempts.`,
      );
      placed.push({ x: 10, y: 10, radius, eid });
    }
  }

  return placed;
}

const getOppositeSide = (side: Side) => {
  switch (side) {
    case 'left': return 'right';
    case 'right': return 'left';
    case 'top': return 'bottom';
    case 'bottom': return 'top';
  }
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const getRelaxationFactor = (attempt: number) => {
  if (attempt <= 20) return 0;
  return (attempt - 20) * 0.05;
};


const getPlacementBounds = (
  radius: number,
  placement: ObjectPlacement,
  attempt: number,
) => {
  const width = BASE_WIDTH;
  const height = BASE_HEIGHT;
  const centerX = width / 2;
  const centerY = height / 2;

  const relaxation = getRelaxationFactor(attempt);

  const minX = radius;
  const maxX = width - radius;
  const minY = radius;
  const maxY = height - radius;

  switch (placement) {
    case ObjectPlacement.DEAD_CENTER: {
      // Starts as a tiny 50px bias around center, then expands outward.
      const baseHalfRange = 25;
      const expandX = relaxation * width;
      const expandY = relaxation * height;

      return {
        minX: clamp(centerX - baseHalfRange - expandX, minX, maxX),
        maxX: clamp(centerX + baseHalfRange + expandX, minX, maxX),
        minY: clamp(centerY - baseHalfRange - expandY, minY, maxY),
        maxY: clamp(centerY + baseHalfRange + expandY, minY, maxY),
      };
    }

    case ObjectPlacement.CLOSE_TO_CENTER: {
      // Starts in the central 25% of the map, then expands toward full map.
      const baseHalfWidth = width * 0.125;
      const baseHalfHeight = height * 0.125;
      const expandX = relaxation * width;
      const expandY = relaxation * height;

      return {
        minX: clamp(centerX - baseHalfWidth - expandX, minX, maxX),
        maxX: clamp(centerX + baseHalfWidth + expandX, minX, maxX),
        minY: clamp(centerY - baseHalfHeight - expandY, minY, maxY),
        maxY: clamp(centerY + baseHalfHeight + expandY, minY, maxY),
      };
    }

    case ObjectPlacement.OUTSKIRTS: {
      // Starts in the outermost 25%, then relaxes inward until effectively anywhere.
      const insetX = clamp(width * (0.25 - relaxation), 0, width * 0.25);
      const insetY = clamp(height * (0.25 - relaxation), 0, height * 0.25);

      return {
        minX,
        maxX,
        minY,
        maxY,
        outskirtsInsetX: insetX,
        outskirtsInsetY: insetY,
      };
    }

    case ObjectPlacement.ANYWHERE:
    default:
      return { minX, maxX, minY, maxY };
  }
};

const generateCandidate = (
  world: GameWorld,
  radius: number,
  placement: ObjectPlacement,
  attempt: number,
) => {
  const bounds = getPlacementBounds(radius, placement, attempt);
  const width = BASE_WIDTH;
  const height = BASE_HEIGHT;

  if (placement === ObjectPlacement.OUTSKIRTS) {
    const {
      minX,
      maxX,
      minY,
      maxY,
      outskirtsInsetX = 0,
      outskirtsInsetY = 0,
    } = bounds;

    const innerMinX = clamp(radius + outskirtsInsetX, minX, maxX);
    const innerMaxX = clamp(width - radius - outskirtsInsetX, minX, maxX);
    const innerMinY = clamp(radius + outskirtsInsetY, minY, maxY);
    const innerMaxY = clamp(height - radius - outskirtsInsetY, minY, maxY);

    // If fully relaxed, outskirts becomes anywhere.
    if (
      innerMinX <= minX &&
      innerMaxX >= maxX &&
      innerMinY <= minY &&
      innerMaxY >= maxY
    ) {
      return {
        x: world.random.between(minX, maxX),
        y: world.random.between(minY, maxY),
      };
    }

    let x = 0;
    let y = 0;
    let valid = false;
    let tries = 0;

    while (!valid && tries++ < 50) {
      x = world.random.between(minX, maxX);
      y = world.random.between(minY, maxY);

      const inInnerBox =
        x >= innerMinX &&
        x <= innerMaxX &&
        y >= innerMinY &&
        y <= innerMaxY;

      valid = !inInnerBox;
    }

    // If we somehow fail to sample the outskirts region, just fall back to anywhere.
    if (!valid) {

      return {
        x: world.random.between(minX, maxX),
        y: world.random.between(minY, maxY),
      };
    }

    return { x, y };
  }

  return {
    x: world.random.between(bounds.minX, bounds.maxX),
    y: world.random.between(bounds.minY, bounds.maxY),
  };
};

const generateBigCandidate = (world: GameWorld, radius: number, specifiedSide?: Side | string) => {
  if (specifiedSide?.length) {
    const otherSide = getOppositeSide(specifiedSide as Side);
    const {x, y} = generateSupergiantStarPosition(world, radius, otherSide);
    return {x, y, side: otherSide}
  }
  const {x, y, side} = generateSupergiantStarPosition(world, radius);
  return {x, y, side};
}


export const generateSupergiantStarPosition = (
  world: GameWorld,
  starRadius: number,
  specifiedSide?: string,
) => {
  const width = BASE_WIDTH;
  const height = BASE_HEIGHT;

  // Determine how much of the star's radius to extend into the screen
  const visibleFraction = world.random.rnd() * 0.2 + 0.05; // Between 5% to 25% of the star visible
  const visibleDistance = starRadius * visibleFraction;

  // Define possible positions: off-screen in any direction
  const sides: Array<Side> = ['left', 'right', 'top', 'bottom'];
  const side = specifiedSide || sides[Math.floor(world.random.rnd() * sides.length)];

  let x = 0,
    y = 0;

  switch (side) {
    case 'left':
      x = -starRadius + visibleDistance; // Place far left with some star visible
      y = world.random.rnd() * height; // Anywhere along vertical screen
      break;
    case 'right':
      x = width + starRadius - visibleDistance; // Place far right
      y = world.random.rnd() * height;
      break;
    case 'top':
      x = world.random.rnd() * width;
      y = -starRadius + visibleDistance; // Place far top
      break;
    case 'bottom':
      x = world.random.rnd() * width;
      y = height + starRadius - visibleDistance; // Place far bottom
      break;
  }
  return { x, y, side };
};
