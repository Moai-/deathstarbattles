import { GameWorld } from 'shared/src/ecs/world';
import { generateBackgroundStars } from 'src/render/background/stars';
import { GameConfig } from 'src/ui/types';
import { generateRandomBots, generatePlayers } from './genPlayers';
import { generateScenarioItems } from './genObjects';
import { scenarioTypes } from 'src/ui/content/scenarioSetup';
import { placeEntities } from './placeEntities';

// export const playerClearance: ClearanceFunction = (a, b) => a + b + 80;
// export const objectClearance: ClearanceFunction = (a, b) => a + b + 30;
// export const blackHClearance: ClearanceFunction = (a, b) => a + b + 100;

// const getPlayerRadius = (player: PlayerInfo) => getRadius(player.id);

// export function runGameSetup(
//   scene: Phaser.Scene,
//   world: GameWorld,
//   config: GameConfig,
// ): GameSetupResult {
//   const { players, playerColors } = config;
//   const width = scene.scale.width;
//   const height = scene.scale.height;

//   generateBackgroundStars(scene);

//   const generateAndPlace = (
//     generator: (world: GameWorld) => number,
//     amount: number,
//     existing: Array<GameObject> = [],
//   ) => {
//     const generated: Array<number> = [];
//     for (let i = 0; i < amount; i++) {
//       generated.push(generator(world));
//     }
//     const radii = generated.map(getRadius);
//     const positioned = generateNonOverlappingPositions(
//       width,
//       height,
//       radii,
//       objectClearance,
//       existing,
//     );
//     positioned.forEach((pos, i) => {
//       const eid = generated[i];
//       setPosition(eid, pos);
//       pos.eid = eid;
//     });
//     return positioned;
//   };

//   // 1. Generate players
//   const parsedPlayers: Array<PlayerInfo> = [];
//   for (let i = 0; i < players.length; i++) {
//     parsedPlayers.push({
//       type: players[i].type,
//       id: createDeathStar(world, 0, 0, playerColors[i % playerColors.length]),
//       isAlive: true,
//     });
//   }

//   // 2. Generate and place objects from largest to smallest
//   let levelObjects: Array<GameObject> = [];

//   const starsInsteadOfSupergiant = Phaser.Math.Between(1, 10) > 3;
//   if (starsInsteadOfSupergiant) {
//     const twoStars = Phaser.Math.Between(0, 1);
//     if (twoStars) {
//       levelObjects = generateAndPlace(createRandomStar, 2);
//     } else {
//       levelObjects = generateAndPlace(createRandomStar, 1);
//     }
//   } else {
//     const star = createRandomSupergiant(world);
//     const radius = getRadius(star);
//     const { x, y } = generateSupergiantStarPosition(
//       scene.scale.width,
//       scene.scale.height,
//       radius,
//     );
//     setPosition(star, x, y);
//     const obj: GameObject = { eid: star, radius, x, y };
//     levelObjects = [obj];
//   }

//   const planetCount = Phaser.Math.Between(1, 3);
//   const planets = generateAndPlace(
//     createRandomPlanet,
//     planetCount,
//     levelObjects,
//   );
//   levelObjects = [...levelObjects, ...planets];

//   const asteroidCount = Phaser.Math.Between(1, 5);
//   const asteroids = generateAndPlace(
//     createRandomAsteroid,
//     asteroidCount,
//     levelObjects,
//   );
//   levelObjects = [...levelObjects, ...asteroids];

//   if (starsInsteadOfSupergiant) {
//     const blackHole = generateAndPlace(createRandomBlackHole, 1, levelObjects);
//     levelObjects = [...levelObjects, ...blackHole];
//   }

//   // 3. Place players

//   const playerPositions = generateNonOverlappingPositions(
//     width,
//     height,
//     parsedPlayers.map(getPlayerRadius),
//     playerClearance,
//     levelObjects,
//   );

//   parsedPlayers.forEach(({ id }, i) => {
//     const { x, y } = playerPositions[i];
//     setPosition(id, x, y);
//     playerPositions[i].eid = id;
//   });

//   levelObjects = [...levelObjects, ...playerPositions];

//   return {
//     players: parsedPlayers,
//     objectPlacements: levelObjects,
//   };
// }

export const runGameSetup = (
  scene: Phaser.Scene,
  world: GameWorld,
  config: GameConfig,
) => {
  const { width, height } = scene.scale;
  // 0. Generate scene background
  generateBackgroundStars(scene);

  // 1. If all bots, randomize
  if (config.justBots) {
    const bots = generateRandomBots(world);
    const objects = generateScenarioItems(world, scenarioTypes[0].items, 10);
    return {
      players: bots,
      objectPlacements: placeEntities(
        width,
        height,
        objects,
        bots.map((b) => b.id),
      ),
    };
  }

  // 2. Generate players
  const players = generatePlayers(world, config.players!);
  const playerIds = players.map((p) => p.id);

  // 3. Determine and generate appropriate item counts
  const items = generateScenarioItems(
    world,
    config.itemRules!,
    config.maxItems || 16,
  );

  // 4. Place everything
  const objectPlacements = placeEntities(width, height, items, playerIds);

  return {
    players,
    objectPlacements,
  };
};
