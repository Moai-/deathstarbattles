import { ObjectTypes } from 'shared/src/types';
import { ScenarioItemRule } from '../types';

export const scenarioItems = [
  { key: ObjectTypes.ASTEROID, label: 'Asteroid', maxAmount: 16 },
  { key: ObjectTypes.PLANET, label: 'Planet', maxAmount: 10 },
  { key: ObjectTypes.JOVIAN, label: 'Jovian', maxAmount: 6 },
  { key: ObjectTypes.STAR, label: 'Star', maxAmount: 4 },
  { key: ObjectTypes.SUPERGIANT, label: 'Supergiant', maxAmount: 2 },
  { key: ObjectTypes.BLACK_HOLE, label: 'Black hole', maxAmount: 6 },
];

type GenParams = Partial<ScenarioItemRule>;
const generateObject = (type: ObjectTypes) => {
  const generator = (params: GenParams = {}) =>
    ({
      type,
      min: params.min || 0,
      max:
        params.max || scenarioItems.find((o) => o.key === type)?.maxAmount || 1,
      p: params.p || 1,
    }) as ScenarioItemRule;
  return generator;
};

const planet = generateObject(ObjectTypes.PLANET);
const asteroid = generateObject(ObjectTypes.ASTEROID);
const jovian = generateObject(ObjectTypes.JOVIAN);
const star = generateObject(ObjectTypes.STAR);
const supergiant = generateObject(ObjectTypes.SUPERGIANT);
const blackHole = generateObject(ObjectTypes.BLACK_HOLE);

// prettier-ignore
export const scenarioTypes: Array<{
  name: string;
  items: Array<ScenarioItemRule>;
}> = [
  { name: 'Lucky Dip', items: [planet(), asteroid(), jovian(), star(), supergiant(), blackHole()] },
  { name: 'Planetary', items: [planet({min: 1}), asteroid({p: 0.3})] },
  { name: 'Asteroids', items: [planet({p: 0.1}), asteroid(), blackHole({p: 0.05})] },
  { name: 'Star System', items: [star({min: 1}), planet(), asteroid(), blackHole({p: 0.05})] },
  { name: 'Binary System', items: [star({min: 1}), blackHole({p: 0.1}), planet(), asteroid()] },
  { name: 'Jovian', items: [jovian({min: 1}), planet(), asteroid()] },
  { name: 'Supergiant', items: [supergiant({min: 1, max: 1}), planet(), asteroid()] },
  { name: 'Super Binary', items: [supergiant({min: 2}), asteroid()] },
  { name: 'Uneven Binary', items: [supergiant({max: 1}), star({min: 1}), asteroid()] },
  { name: 'Red Giant', items: [] },
  { name: 'Star Cluster', items: [] },
  { name: 'Mixture', items: [] },
  { name: 'White Dwarf', items: [] },
  { name: 'White Dwarfs', items: [] },
  { name: 'Wormhole', items: [] },
  { name: 'Wormholes', items: [] },
  { name: 'Big Wormhole', items: [] },
  { name: 'Black Hole', items: [] },
  { name: 'Black holes', items: [] },
  { name: 'White Hole', items: [] },
  { name: 'White Holes', items: [] },
  { name: 'Hyperspace', items: [] },
];
