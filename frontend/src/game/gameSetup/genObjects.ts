import { GameWorld } from 'shared/src/ecs/world';
import { ObjectTypes, ScenarioItemRule } from 'shared/src/types';
import { createRandom } from 'src/entities';
import { scenarioItems } from 'src/ui/content/scenarioSetup';

export function generateScenarioItems(
  world: GameWorld,
  originalRules: Array<ScenarioItemRule>,
  objectCount: { num?: number; max?: number },
): Array<number> {
  const rules = [...originalRules];
  const items: Array<number> = [];

  // Item generation probability should count twice: whether we generate the item at all,
  // AND whether the item generates if it is allowed to generate
  const canGenerate = new Map<ObjectTypes, boolean>();
  rules.forEach((rule) => {
    const { type, p } = rule;
    const r = Math.random();
    const allowedToGenerate = r < (p || 1);
    canGenerate.set(type, allowedToGenerate);
    // Generate at least one of these if it can exist at all
    if (allowedToGenerate) {
      rule.min = rule.min || 1;
    }
  });

  // If we're given a hard and fast number of items to use, just use that
  let totalNum = objectCount.num || 0;

  if (totalNum === 0) {
    // Figure out minimum amount of items required first
    let minNum = 0;
    rules.forEach((rule) => {
      if (rule.min) {
        minNum = minNum + rule.min;
      }
    });

    // Since we weren't given an exact count, we generate between min and max
    totalNum = Phaser.Math.Between(minNum, objectCount.max!);
  }

  // Keep a running total of each item generated
  const generated = new Map<ObjectTypes, number>();

  let loops = 0;
  // Fill out item array
  while (items.length < totalNum && loops < 1000) {
    loops = loops + 1;
    for (const rule of rules) {
      if (items.length === totalNum) {
        break;
      }
      const itemDef = scenarioItems.find((s) => s.key === rule.type);
      if (!itemDef) {
        // Shouldn't be an issue but just for edge cases
        continue;
      }
      const { type, min = 0, max = itemDef.maxAmount, n, p = 1.0 } = rule;

      const countOfThis = generated.get(type) || 0;

      // Do not generate from this rule if we have enough of this item
      if (countOfThis !== undefined) {
        if (max && countOfThis === max) {
          continue;
        }
        if (n && countOfThis === n) {
          continue;
        }
      }

      // Generate from this rule, ignoring probability, if we don't have enough of this item
      const notEnoughMin = min && countOfThis < min;
      const notEnoughN = n && countOfThis < n;
      if (notEnoughMin || notEnoughN) {
        items.push(createRandom[type](world));
        generated.set(type, countOfThis + 1);
        continue;
      }

      // Generate from this rule normally - skip rule if probability check fails
      if (canGenerate.get(type) && Math.random() < p) {
        items.push(createRandom[type](world));
        generated.set(type, countOfThis + 1);
      }
    }
  }
  return items;
}
