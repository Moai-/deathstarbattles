import { ScenarioItemRule, ScenarioType } from 'shared/src/types';
import {
  asteroid,
  bigWormhole,
  blackHole,
  jovian,
  planet,
  redGiant,
  scenarioItems,
  star,
  supergiant,
  whiteDwarf,
  whiteHole,
  wormhole,
} from './objectManifest';
import { randomFromArray } from 'shared/src/utils';

export { scenarioItems };

const rare = { p: 0.05 };
const oneOf = (...args: Array<ScenarioItemRule>) =>
  randomFromArray<ScenarioItemRule>(args);

const rareGoodies = () =>
  oneOf(
    blackHole({ max: 2, ...rare }),
    wormhole({ min: 2, ...rare }),
    whiteHole({ max: 3, ...rare }),
    whiteDwarf({ max: 3, ...rare }),
  );

// prettier-ignore
export const getScenarioTypes = (): Array<ScenarioType> => [
  { name: 'Lucky Dip', items: [oneOf(star({max: 2, p: 0.5}), redGiant({max: 1})), asteroid(), planet(), rareGoodies()] },
  { name: 'Planetary', items: [planet({min: 1}), asteroid({p: 0.3}), rareGoodies()] },
  { name: 'Asteroids', items: [planet({p: 0.1}), asteroid(), rareGoodies()] },
  { name: 'Star System', items: [star({n: 1}), planet({max: 2}), asteroid(), rareGoodies()] },
  { name: 'Binary System', items: [star({n: 2}), planet(), asteroid(), rareGoodies()] },
  { name: 'Jovian', items: [jovian({n: 1}), asteroid(), rareGoodies()] },
  { name: 'Supergiant', items: [supergiant({n: 1}), planet({p: 0.5}), asteroid()] },
  { name: 'Super Binary', items: [supergiant({n: 1}), oneOf(supergiant({n: 1}), bigWormhole({n: 1})), asteroid()] },
  { name: 'Uneven Binary', items: [supergiant({n: 1}), oneOf(star({n: 1}), blackHole({n: 1})), asteroid()] },
  { name: 'Red Giant', items: [redGiant({n: 1}), asteroid(), rareGoodies()] },
  { name: 'Star Cluster', items: [star({min: 3, max: 9}), whiteDwarf(rare)] },
  { name: 'Mixture', items: [star(), planet(), asteroid(), rareGoodies()] },
  { name: 'White Dwarf', items: [whiteDwarf({n: 1}), asteroid(), oneOf(planet({max: 1, p: 0.3}), jovian(rare))] },
  { name: 'White Dwarfs', items: [whiteDwarf({min: 3}), whiteHole(rare)] },
  { name: 'Wormhole', items: [wormhole({min: 2, max: 3}), planet(rare), asteroid()] },
  { name: 'Wormholes', items: [wormhole({min: 2, max: 20})] },
  { name: 'Big Wormhole', items: [bigWormhole({min: 1, max: 2}), asteroid(), rareGoodies()] },
  { name: 'Black Hole', items: [blackHole({min: 1}), asteroid(), planet(rare), jovian(rare)] },
  { name: 'Black holes', items: [blackHole({min: 2}), whiteHole({max: 3, ...rare})] },
  { name: 'White Hole', items: [whiteHole({n: 1}), asteroid(), planet(rare), jovian(rare)] },
  { name: 'White Holes', items: [whiteHole({min: 1})] },
  { name: 'Hyperspace', items: [] },
];
