import { GameWorld } from 'shared/src/ecs/world';
import { generateRandomBots, generatePlayers } from './genPlayers';
import { generateScenarioItems } from './genObjects';
import { placeEntities } from './placeEntities';
import { Backgrounds, GameConfig, ScenarioType } from 'shared/src/types';
import { getScenarioTypes } from 'src/content/scenarios';
import { randomFromArray } from 'shared/src/utils';
import { finalizeSetup } from './finalize';

export const runGameSetup = (
  scene: Phaser.Scene,
  world: GameWorld,
  config: GameConfig,
) => {
  const { width, height } = scene.scale;
  // 1. If all bots, randomize
  if (config.justBots) {
    const bots = generateRandomBots(world);
    const scenario = randomFromArray<ScenarioType>(getScenarioTypes());
    const num = Phaser.Math.Between(15, 30);
    const bg =
      scenario.background === undefined
        ? Backgrounds.STARS
        : scenario.background;
    const objects = generateScenarioItems(world, scenario.items, {
      num,
    });
    const placements = placeEntities(
      width,
      height,
      objects,
      bots.map((b) => b.id),
    );
    const size = Phaser.Math.Between(1, 3);
    finalizeSetup(world, scene, bg, size);
    return {
      players: bots,
      objectPlacements: placements,
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

  // 5. Background generation
  const bg =
    config.background === undefined ? Backgrounds.STARS : config.background;

  // 6. Finalize
  const size = config.stationSize === undefined ? 2 : config.stationSize;
  finalizeSetup(world, scene, bg, size);

  return {
    players,
    objectPlacements,
  };
};
