import { GameWorld } from "shared/src/ecs/world";
import { Backgrounds, GameConfig } from "shared/src/types";
import { generatePlayers, generateRandomBots } from "./generatePlayers";
import { getScenarioTypes } from "./scenarioManifest";
import { generateScenarioItems } from "./generateScenarioItems";
import { finalizeScenario } from "./finalizeScenario";

export const runGameSetup = (world: GameWorld, config: GameConfig) => {

  // 1. If just bots, pick some random values and off we go
  if (config.justBots) {
    const bots = generateRandomBots(world);
    const stationEids = bots.flatMap((b) => b.stationEids)
    const scenario = world.random.pickElement(getScenarioTypes(world));
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

  // 2. Generate a scenario properly
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