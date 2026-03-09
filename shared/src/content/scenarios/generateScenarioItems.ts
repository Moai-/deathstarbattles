import { GameWorld } from 'shared/src/ecs/world';
import { GameObject, ObjectPlacement, ObjectTypes, ScenarioItemRule, UnplacedGameObject } from 'shared/src/types';
import { scenarioItemMap } from '../objectManifest';
import { getAllObjects, getRadius, getType, setPosition, generateNonOverlappingPositions } from 'shared/src/utils';
import { objectClearance, playerClearance } from './placement';

const NULL_POS = {x: 0, y: 0}

export const generateScenarioItems = (
  world: GameWorld,
  originalRules: Array<ScenarioItemRule>,
  objectCount: { num?: number; max?: number },
  players: Array<number>,
): Array<GameObject> => {
  const rules = [...originalRules];
  const items: Array<number> = [];

  // 1. Determine whether we can even generate this item this time
  const canGenerate = new Map<ObjectTypes, boolean>();
  rules.forEach((rule) => {
    const { type, p } = rule;
    const r = world.random.rnd();
    const allowedToGenerate = r < (p || 1);
    canGenerate.set(type, allowedToGenerate);
    // Generate at least one of these if we have a minimum
    if (allowedToGenerate) {
      rule.min = rule.min || 1;
    }
  });

  // 2. Determine a total number of this object
  // If we're given a specific number, use that
  let totalNum = objectCount.num ?? 0;

  if (totalNum === 0) {
    // Figure out minimum amount of items required first
    let minNum = 0;
    rules.forEach((rule) => {
      if (rule.min && canGenerate.get(rule.type)) {
        minNum = minNum + rule.min;
      }
    });

    // Since we weren't given an exact count, we assume there must be a maximum
    if (!objectCount.max) {
      throw new Error(`Could not generate scenario item: objectCount.num is not available (${objectCount.num}), and there was no maximum specified (${objectCount.max})`)
    }
    // Generate amount between min and max
    totalNum = world.random.between(minNum, objectCount.max);
  }

  // 3. Generate items until we have enough
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
      const itemDef = scenarioItemMap.get(rule.type)
      if (!itemDef) {
        // Shouldn't be an issue but just for edge cases
        continue;
      }
      const { 
        type, 
        min = 0, // No minimum if minimum is not present
        max = itemDef.maxAmount, // Maximum is defined by the item's manifest rule
        n, 
        p = 1.0 // If probability is not defined, we assume 100% probability
      } = rule;

      const countOfThis = generated.get(type) || 0;

      // Do not generate from this rule if we have enough of this item
      if (countOfThis > 0) {
        if (max && countOfThis === max) {
          continue;
        }
        if (n && countOfThis === n) {
          continue;
        }
      }

      // Generate from this rule, ignoring probability, if we don't have enough of this item
      // (and this item is allowed to be generated)
      const notEnoughMin = min && countOfThis < min;
      const notEnoughN = n && countOfThis < n;
      if (canGenerate.get(type) && (notEnoughMin || notEnoughN)) {
        items.push(itemDef.generator(world, NULL_POS));
        generated.set(type, countOfThis + 1);
        continue;
      }

      // Generate from this rule normally - skip rule if probability check fails
      if (canGenerate.get(type) && world.random.rnd() < p) {
        items.push(itemDef.generator(world, NULL_POS));
        generated.set(type, countOfThis + 1);
      }
    }
  }


  // 4. Generate UnplacedGameObjects and prepare for placement
  // Sort by radius so we place the chonkiest ones first
  const levelObjects: Array<UnplacedGameObject> = items
    .map((item) => ({ radius: getRadius(item), eid: item, placement: getPlacementRule(item, rules) }))
    .sort((a, b) => b.radius - a.radius);

  // Turn players into game objects too
  const playerObjects: Array<UnplacedGameObject> = players
    .map((item) => ({ radius: getRadius(item), eid: item, placement: ObjectPlacement.ANYWHERE }));


  // 5. Place objects (exclude level object eids from existing so we don't treat
  // unpositioned level entities at (0,0) as obstacles)
  const levelEids = new Set(levelObjects.map((o) => o.eid));
  const existingForLevel = getAllObjects(world).filter((o) => !levelEids.has(o.eid));
  const placedObjects = generateNonOverlappingPositions(world, levelObjects, objectClearance, existingForLevel);
  const placedPlayers = generateNonOverlappingPositions(world, playerObjects, playerClearance, placedObjects);

  const all = [...placedObjects, ...placedPlayers];

  all.forEach((obj) => {
    setPosition(obj.eid, obj.x, obj.y)
  })

  return all;
}

const getPlacementRule = (eid: number, rules: Array<ScenarioItemRule>) => {
  const type = getType(eid);
  const overrideRule = rules.find((rule) => rule.type === type);
  if (overrideRule?.plc) {
    return overrideRule.plc
  }
  const defaultRule = scenarioItemMap.get(type);
  if (defaultRule?.placement) {
    return defaultRule.placement
  }
  return ObjectPlacement.ANYWHERE;
}