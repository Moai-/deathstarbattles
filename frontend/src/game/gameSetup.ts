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
// import { createBlackHole } from '../entities/blackHole';
import {
  generateNonOverlappingPositions,
  generateSupergiantStarPosition,
} from './util';
// import { createRandomPlanet } from '../entities/planet';
// import { createRandomStar } from '../entities/star';
// import { createRandomJovian } from '../entities/jovian';
import { createRandomSupergiant } from '../entities/supergiant';

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

  const supergiant = createRandomSupergiant(world);
  const superRadius = getRadius(supergiant);
  const supergiantPos = generateSupergiantStarPosition(
    scene.scale.width,
    scene.scale.height,
    superRadius,
  );

  setPosition(supergiant, supergiantPos);

  const supergiantObject: GameObject = {
    ...supergiantPos,
    radius: superRadius,
    eid: supergiant,
  };

  console.log('resulting supergiant object', supergiantObject);

  const playerPositions = generateNonOverlappingPositions(
    width,
    height,
    parsedPlayers.map(getPlayerRadius),
    playerClearance,
    [supergiantObject],
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

  // asteroids.push(createBlackHole(world, 0, 0));

  const asteroidPositions = generateNonOverlappingPositions(
    width,
    height,
    asteroids.map(getRadius),
    objectClearance,
    [...playerPositions, supergiantObject],
  );

  asteroids.forEach((eid, i) => {
    const { x, y } = asteroidPositions[i];
    setPosition(eid, x, y);
    asteroidPositions[i].eid = eid;
  });

  const allObjects: GameObject[] = [
    ...playerPositions,
    ...asteroidPositions,
    supergiantObject,
  ];

  return {
    players: parsedPlayers,
    asteroidIds: asteroids,
    objectPlacements: allObjects,
  };
}
