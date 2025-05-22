import { createDeathStar } from '../entities/deathStar';
import { createRandomAsteroid } from '../entities/asteroid';
import { getRadius, setPosition } from '../util';
import { GameWorld } from 'shared/src/ecs/world';
import {
  ClearanceFunction,
  GameSetupConfig,
  GameSetupResult,
  GameObject,
} from './types';

export const playerClearance: ClearanceFunction = (a, b) => a + b + 80;
export const objectClearance: ClearanceFunction = (a, b) => a + b + 30;

export function runGameSetup(
  scene: Phaser.Scene,
  world: GameWorld,
  config: GameSetupConfig,
): GameSetupResult {
  const { playerCount, playerColors, minAsteroids, maxAsteroids } = config;
  const width = scene.scale.width;
  const height = scene.scale.height;

  const players: number[] = [];
  for (let i = 0; i < playerCount; i++) {
    players.push(
      createDeathStar(world, 0, 0, playerColors[i % playerColors.length]),
    );
  }

  const playerPositions = generateNonOverlappingPositions(
    width,
    height,
    players.map(getRadius),
    playerClearance,
  );

  players.forEach((eid, i) => {
    const { x, y } = playerPositions[i];
    setPosition(eid, x, y);
    playerPositions[i].eid = eid;
  });

  const asteroidCount = Phaser.Math.Between(minAsteroids, maxAsteroids);
  const asteroids: number[] = [];

  for (let i = 0; i < asteroidCount; i++) {
    asteroids.push(createRandomAsteroid(world));
  }

  const asteroidPositions = generateNonOverlappingPositions(
    width,
    height,
    asteroids.map(getRadius),
    objectClearance,
    playerPositions,
  );

  asteroids.forEach((eid, i) => {
    const { x, y } = asteroidPositions[i];
    setPosition(eid, x, y);
    asteroidPositions[i].eid = eid;
  });

  const allObjects: GameObject[] = [...playerPositions, ...asteroidPositions];

  return {
    playerIds: players,
    asteroidIds: asteroids,
    objectPlacements: allObjects,
  };
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
