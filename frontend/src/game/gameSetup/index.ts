import { GameWorld } from 'shared/src/ecs/world';
import { generateBackgroundStars } from 'src/render/background/stars';
import { generateRandomBots, generatePlayers } from './genPlayers';
import { generateScenarioItems } from './genObjects';
import { placeEntities } from './placeEntities';
import { GameConfig, ScenarioType } from 'shared/src/types';
import { getScenarioTypes } from 'src/content/scenarios';
import { randomFromArray } from 'shared/src/utils';
import { finalizeSetup } from './finalize';

export const runGameSetup = (
  scene: Phaser.Scene,
  world: GameWorld,
  config: GameConfig,
) => {
  const { width, height } = scene.scale;
  // 0. Generate scene background
  // console.time('bg stars');
  generateBackgroundStars(scene);
  // console.timeEnd('bg stars');

  // 1. If all bots, randomize
  if (config.justBots) {
    const bots = generateRandomBots(world);
    // const scenario = randomFromArray<ScenarioType>(getScenarioTypes());
    const scenario = getScenarioTypes()[21];
    const num = Phaser.Math.Between(15, 30);
    const objects = generateScenarioItems(world, scenario.items, {
      num,
    });
    finalizeSetup(world);
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
  const items = generateScenarioItems(world, config.itemRules!, {
    max: config.maxItems || 20,
    num: config.numItems,
  });

  // 4. Place everything
  const objectPlacements = placeEntities(width, height, items, playerIds);

  // 5. Finalize (currently, tie wormholes together)
  finalizeSetup(world);

  return {
    players,
    objectPlacements,
  };
};
