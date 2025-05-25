import { ClearanceFunction, GameObject } from 'shared/src/types';

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

  for (const radius of radii) {
    let attempt = 0;
    let found = false;

    while (attempt++ < 1000 && !found) {
      const x = Phaser.Math.Between(radius, width - radius);
      const y = Phaser.Math.Between(radius, height - radius);

      const candidate = { x, y, radius, eid: -1 };

      const tooClose = [...existing, ...placed].some((other) => {
        const dx = x - other.x;
        const dy = y - other.y;
        const distSq = dx * dx + dy * dy;
        const minDist = clearanceFn(radius, other.radius);
        return distSq < minDist * minDist;
      });

      if (!tooClose) {
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
) => {
  // Distance from the edge of the screen (randomly selected side)
  const edgeBuffer = 50; // A small margin to ensure part of the star is visible

  // Define possible positions: off-screen to the top, bottom, left, or right
  const sides = ['left', 'right', 'top', 'bottom'];
  const side = sides[Math.floor(Math.random() * sides.length)];

  let x = 0,
    y = 0;

  switch (side) {
    case 'left':
      // x is between -starRadius and -edgeBuffer
      x = -starRadius + Math.random() * (starRadius - edgeBuffer);
      // y can be anywhere from slightly above to slightly below the screen height
      y = -starRadius + Math.random() * (height + 2 * starRadius);
      break;
    case 'right':
      // x is between width + edgeBuffer and width + starRadius
      x = width + edgeBuffer + Math.random() * (starRadius - edgeBuffer);
      y = -starRadius + Math.random() * (height + 2 * starRadius);
      break;
    case 'top':
      x = -starRadius + Math.random() * (width + 2 * starRadius);
      // y is between -starRadius and -edgeBuffer
      y = -starRadius + Math.random() * (starRadius - edgeBuffer);
      break;
    case 'bottom':
      x = -starRadius + Math.random() * (width + 2 * starRadius);
      // y is between height + edgeBuffer and height + starRadius
      y = height + edgeBuffer + Math.random() * (starRadius - edgeBuffer);
      break;
  }

  return { x, y };
};
