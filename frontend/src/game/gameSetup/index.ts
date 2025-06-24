import { GameWorld } from 'shared/src/ecs/world';
import { generateBackgroundStars } from 'src/render/background/stars';
import { generateRandomBots, generatePlayers } from './genPlayers';
import { generateScenarioItems } from './genObjects';
import { scenarioTypes } from 'src/ui/content/scenarioSetup';
import { placeEntities } from './placeEntities';
import { GameConfig } from 'shared/src/types';

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
