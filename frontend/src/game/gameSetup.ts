import { createDeathStar } from '../entities/deathStar';
import { createRandomAsteroid } from '../entities/asteroid';
import { getRadius, setPosition } from '../util';
import { GameWorld } from 'shared/src/ecs/world';
import {
  ClearanceFunction,
  GameSetupConfig,
  GameSetupResult,
  GameObject,
  PlayerInfo,
} from 'shared/src/types';
import { createBlackHole } from '../entities/blackHole';

export const playerClearance: ClearanceFunction = (a, b) => a + b + 80;
export const objectClearance: ClearanceFunction = (a, b) => a + b + 30;

const getPlayerRadius = (player: PlayerInfo) => getRadius(player.id);

export function runGameSetup(
  scene: Phaser.Scene,
  world: GameWorld,
  config: GameSetupConfig,
): GameSetupResult {
  const { players, playerColors, minAsteroids, maxAsteroids } = config;
  const width = scene.scale.width;
  const height = scene.scale.height;

  const parsedPlayers: Array<PlayerInfo> = [];
  for (let i = 0; i < players.length; i++) {
    parsedPlayers.push({
      type: players[i].type,
      id: createDeathStar(world, 0, 0, playerColors[i % playerColors.length]),
      isAlive: true,
    });
  }

  const playerPositions = generateNonOverlappingPositions(
    width,
    height,
    parsedPlayers.map(getPlayerRadius),
    playerClearance,
  );

  parsedPlayers.forEach(({ id }, i) => {
    const { x, y } = playerPositions[i];
    setPosition(id, x, y);
    playerPositions[i].eid = id;
  });

  const asteroidCount = Phaser.Math.Between(minAsteroids, maxAsteroids);
  const asteroids: number[] = [];

  for (let i = 0; i < asteroidCount; i++) {
    asteroids.push(createRandomAsteroid(world));
  }

  asteroids.push(createBlackHole(world, 0, 0));

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
    players: parsedPlayers,
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
