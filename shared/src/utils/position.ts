import { ClearanceFunction, GameObject } from '../types';
import { getRandomBetween } from './random';

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

export function generateNonOverlappingPositions(
  width: number,
  height: number,
  radii: number[],
  clearanceFn: ClearanceFunction,
  existing: GameObject[] = [],
): GameObject[] {
  const placed: GameObject[] = [];

  // console.log(
  //   'check against existing',
  //   existing.map((ex) => ex.radius).join(', '),
  // );

  for (const radius of radii) {
    let attempt = 0;
    let found = false;

    while (attempt++ < 1000 && !found) {
      const x = getRandomBetween(radius, width - radius);
      const y = getRandomBetween(radius, height - radius);

      const candidate = { x, y, radius, eid: -1 };
      // console.log('Checking candidate %s, %s (radius %s)...', x, y, radius);

      const tooClose = [...existing, ...placed].some((other) => {
        const dx = x - other.x;
        const dy = y - other.y;
        const distSq = dx * dx + dy * dy;
        const minDist = clearanceFn(radius, other.radius);
        const minDistSq = minDist * minDist;
        const isTooClose = distSq < minDistSq;
        // console.log(
        //   '...against %s (%s, %s, rad %s). Min dist %s, where %s < %s == %s',
        //   other.eid,
        //   other.x,
        //   other.y,
        //   other.radius,
        //   minDist,
        //   distSq,
        //   minDistSq,
        //   isTooClose,
        // );
        return isTooClose;
      });

      if (!tooClose) {
        // console.log(
        //   'candidate location %s,%s successfully picked',
        //   candidate.x,
        //   candidate.y,
        // );
        placed.push(candidate);
        found = true;
      }
    }

    if (!found) {
      throw new Error(
        `Failed to place object with radius ${radius} after 1000 attempts.`,
      );
    }
  }

  return placed;
}

export const generateSupergiantStarPosition = (
  width: number,
  height: number,
  starRadius: number,
  specifiedSide?: string,
) => {
  // Determine how much of the star's radius to extend into the screen
  const visibleFraction = Math.random() * 0.2 + 0.05; // Between 5% to 25% of the star visible
  const visibleDistance = starRadius * visibleFraction;

  // Define possible positions: off-screen in any direction
  const sides = ['left', 'right', 'top', 'bottom'];
  const side = specifiedSide || sides[Math.floor(Math.random() * sides.length)];

  let x = 0,
    y = 0;

  switch (side) {
    case 'left':
      x = -starRadius + visibleDistance; // Place far left with some star visible
      y = Math.random() * height; // Anywhere along vertical screen
      break;
    case 'right':
      x = width + starRadius - visibleDistance; // Place far right
      y = Math.random() * height;
      break;
    case 'top':
      x = Math.random() * width;
      y = -starRadius + visibleDistance; // Place far top
      break;
    case 'bottom':
      x = Math.random() * width;
      y = height + starRadius - visibleDistance; // Place far bottom
      break;
  }

  return { x, y, side };
};
