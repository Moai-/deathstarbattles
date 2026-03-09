import { GameWorld } from "shared/src/ecs/world";
import { Backgrounds, GameConfig, ObjectPlacement, UnplacedGameObject } from "shared/src/types";
import { generatePlayers, generateRandomBots } from "./generatePlayers";
import { getScenarioTypes } from "./scenarioManifest";
import { generateScenarioItems } from "./generateScenarioItems";
import { finalizeScenario } from "./finalizeScenario";
import { instantiateScenario } from "shared/src/ecs/serde";
import { generateNonOverlappingPositions, getAllObjects, getRadius, setPosition } from "shared/src/utils";
import { playerClearance } from "./placement";

export const runGameSetup = (world: GameWorld, config: GameConfig) => {

  // 1. If just bots, pick some random values and off we go
  if (config.justBots) {
    const bots = generateRandomBots(world);
    const stationEids = bots.flatMap((b) => b.stationEids)
    const scenario = getScenarioTypes(world)[6];
    // const scenario = world.random.pickElement(getScenarioTypes(world));
    const num = world.random.between(10, 20);
    const objects = generateScenarioItems(world, scenario.items, {num}, stationEids);
    const size = world.random.between(1, 3);
    finalizeScenario(world, size);
    return {
      players: bots,
      objectPlacements: objects,
      bg: scenario.background
    }
  }

  // 2. If provided a serialized scenario, we can load it
  if (config.savedScenario) {
    if (!config.players) {
      throw new Error('runGameSetup: failed to generate players as there is no players rule');
    }
    // 2.1 Just load and place serialized entities
    instantiateScenario(config.savedScenario, world);

    // 2.2 Generate and place players
    // TODO: this is copy pasted from generateScenarioItems, extract into a util
    const players = generatePlayers(world, config.players, config.stationPerPlayer);
    const stationEids = players.flatMap((b) => b.stationEids);
    const playerObjects: Array<UnplacedGameObject> = stationEids
      .map((item) => ({ radius: getRadius(item), eid: item, placement: ObjectPlacement.ANYWHERE }));
    const placedPlayers = generateNonOverlappingPositions(world, playerObjects, playerClearance);
    placedPlayers.forEach((p) => setPosition(p.eid, p.x, p.y));

    // 2.3 For finalization, all we need is to inflate stations. Deserializer should take care of wormholes
    const size = config.stationSize === undefined ? 2 : config.stationSize;
    finalizeScenario(world, size, true);
    const objectPlacements = getAllObjects(world);
    return {
      players,
      objectPlacements,
      bg: config.savedScenario.background,
    }
  }

  // 3. If none of the above, we use selected options to load the scenario
  if (!config.players) {
    throw new Error('runGameSetup: failed to generate players as there is no players rule');
  }
  const players = generatePlayers(world, config.players, config.stationPerPlayer);
  const stationEids = players.flatMap((b) => b.stationEids);
  if (!config.itemRules) {
    throw new Error('runGameSetup: failed to generate scenario as there is no items rule');
  }
  const itemCounts = {max: config.maxItems || 20, num: config.numItems};
  const objects = generateScenarioItems(world, config.itemRules, itemCounts, stationEids)
  const size = config.stationSize === undefined ? 2 : config.stationSize;
  finalizeScenario(world, size);
  return {
    players,
    objectPlacements: objects,
    bg: config.background || Backgrounds.STARS
  }
}