import { GameWorld } from 'shared/src/ecs/world';
import { createRandom } from 'src/entities';
import { scenarioItems } from 'src/ui/content/scenarioSetup';
import { ScenarioItemRule, ScenarioItem } from 'src/ui/types';

const generateEntity: (
  world: GameWorld,
) => (item: ScenarioItem) => Array<number> = (world) => (item) =>
  new Array(item.amount).fill(null).map(() => createRandom[item.type](world));

export function generateScenarioItems(
  world: GameWorld,
  rules: Array<ScenarioItemRule>,
  maxObjects: number,
): Array<number> {
  const initial: Array<ScenarioItem & { min: number }> = [];

  // Step 1: Roll per rule
  for (let i = 0; i < rules.length; i++) {
    const { type, min = 0, max, p = 1.0 } = rules[i];
    if (Math.random() > p) continue;

    const itemDef = scenarioItems.find((s) => s.key === type);
    if (!itemDef) continue;

    const maxFromMap = itemDef.maxAmount;
    const hardMax = Math.min(max ?? maxFromMap, maxFromMap);
    const amount = Math.floor(Math.random() * (hardMax - min + 1)) + min;

    initial.push({ id: i, type, amount, min });
  }

  const total = initial.reduce((acc, item) => acc + item.amount, 0);

  if (total <= maxObjects) {
    // Within budget, return directly (drop `min` field)
    return initial
      .map(({ id, type, amount }) => ({ id, type, amount }))
      .map(generateEntity(world))
      .flat();
  }

  // Step 2: Proportional redistribution with min preservation
  const proportionalTargets = initial.map(({ amount, min }) =>
    Math.max(min, Math.floor((amount / total) * maxObjects)),
  );

  let trimmedTotal = proportionalTargets.reduce((a, b) => a + b, 0);

  // If still too high or low, adjust while honoring min
  while (trimmedTotal !== maxObjects) {
    const delta = trimmedTotal > maxObjects ? -1 : 1;

    // Sort by how far each target is from original `amount`
    const sortedIndices = proportionalTargets
      .map((val, i) => ({
        i,
        diff: initial[i].amount - val,
        canChange: delta > 0 || val > initial[i].min, // Only increase if allowed
      }))
      .filter((x) => x.canChange)
      .sort((a, b) => delta * (b.diff - a.diff)); // Add to most undercut, remove from least

    if (sortedIndices.length === 0) break; // No more adjustments possible

    proportionalTargets[sortedIndices[0].i] += delta;
    trimmedTotal += delta;
  }

  // Return final
  return initial
    .map(({ id, type }, i) => ({
      id,
      type,
      amount: proportionalTargets[i],
    }))
    .map(generateEntity(world))
    .flat();
}
