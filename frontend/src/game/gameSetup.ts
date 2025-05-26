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
import { createRandomBlackHole } from '../entities/blackHole';
import { generateNonOverlappingPositions } from './util';
import { createRandomPlanet } from '../entities/planet';
import { createRandomStar } from '../entities/star';
// import { createRandomJovian } from '../entities/jovian';
import { generateBackgroundStars } from '../background/stars';
// import { createRandomSupergiant } from '../entities/supergiant';

export const playerClearance: ClearanceFunction = (a, b) => a + b + 80;
export const objectClearance: ClearanceFunction = (a, b) => a + b + 30;

const getPlayerRadius = (player: PlayerInfo) => getRadius(player.id);

export function runGameSetup(
  scene: Phaser.Scene,
  world: GameWorld,
  config: GameSetupConfig,
): GameSetupResult {
  const { players, playerColors } = config;
  const width = scene.scale.width;
  const height = scene.scale.height;

  generateBackgroundStars(scene);

  const generateAndPlace = (
    generator: (world: GameWorld) => number,
    amount: number,
    existing: Array<GameObject> = [],
  ) => {
    const generated: Array<number> = [];
    for (let i = 0; i < amount; i++) {
      generated.push(generator(world));
    }
    const radii = generated.map(getRadius);
    const positioned = generateNonOverlappingPositions(
      width,
      height,
      radii,
      objectClearance,
      existing,
    );
    positioned.forEach((pos, i) => {
      const eid = generated[i];
      setPosition(eid, pos);
      pos.eid = eid;
    });
    return positioned;
  };

  // 1. Generate players
  const parsedPlayers: Array<PlayerInfo> = [];
  for (let i = 0; i < players.length; i++) {
    parsedPlayers.push({
      type: players[i].type,
      id: createDeathStar(world, 0, 0, playerColors[i % playerColors.length]),
      isAlive: true,
    });
  }

  // 2. Generate and place objects from largest to smallest
  let levelObjects: Array<GameObject> = [];

  //const starsInsteadOfSupergiant = Phaser.Math.Between(1, 10) > 3;
  //if (starsInsteadOfSupergiant) {
  const twoStars = Phaser.Math.Between(0, 1);
  if (twoStars) {
    levelObjects = generateAndPlace(createRandomStar, 2);
  } else {
    levelObjects = generateAndPlace(createRandomStar, 1);
  }
  //} else {
  //  console.log('Generating supergiant');
  //  levelObjects = generateAndPlace(createRandomSupergiant, 1);
  //}

  const planetCount = Phaser.Math.Between(1, 3);
  const planets = generateAndPlace(
    createRandomPlanet,
    planetCount,
    levelObjects,
  );
  levelObjects = [...levelObjects, ...planets];

  const asteroidCount = Phaser.Math.Between(1, 5);
  const asteroids = generateAndPlace(
    createRandomAsteroid,
    asteroidCount,
    levelObjects,
  );
  levelObjects = [...levelObjects, ...asteroids];

  const blackHole = generateAndPlace(createRandomBlackHole, 1, levelObjects);
  levelObjects = [...levelObjects, ...blackHole];

  // 3. Place players

  const playerPositions = generateNonOverlappingPositions(
    width,
    height,
    parsedPlayers.map(getPlayerRadius),
    playerClearance,
    levelObjects,
  );

  parsedPlayers.forEach(({ id }, i) => {
    const { x, y } = playerPositions[i];
    setPosition(id, x, y);
    playerPositions[i].eid = id;
  });

  levelObjects = [...levelObjects, ...playerPositions];

  return {
    players: parsedPlayers,
    objectPlacements: levelObjects,
  };
}
