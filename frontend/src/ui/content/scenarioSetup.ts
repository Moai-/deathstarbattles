import { ObjectTypes, ScenarioItemRule } from 'shared/src/types';

export const scenarioItems = [
  { key: ObjectTypes.ASTEROID, label: 'Asteroid', maxAmount: 16 },
  { key: ObjectTypes.PLANET, label: 'Planet', maxAmount: 10 },
  { key: ObjectTypes.JOVIAN, label: 'Jovian', maxAmount: 2 },
  { key: ObjectTypes.STAR, label: 'Star', maxAmount: 4 },
  { key: ObjectTypes.SUPERGIANT, label: 'Supergiant', maxAmount: 2 },
  { key: ObjectTypes.BLACK_HOLE, label: 'Black hole', maxAmount: 6 },
  { key: ObjectTypes.RED_GIANT, label: 'Red giant', maxAmount: 2 },
  { key: ObjectTypes.WHITE_DWARF, label: 'White dwarf', maxAmount: 15 },
  { key: ObjectTypes.WORMHOLE, label: 'Wormhole', maxAmount: 20 },
  { key: ObjectTypes.BIG_WORMHOLE, label: 'Big wormhole', maxAmount: 2 },
  { key: ObjectTypes.WHITE_HOLE, label: 'Big wormhole', maxAmount: 20 },
];

type GenParams = Partial<ScenarioItemRule>;
const generateObject = (type: ObjectTypes) => {
  const generator = (params: GenParams = {}) =>
    ({
      type,
      min: params.min || params.n || 0,
      n: params.n,
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
const redGiant = generateObject(ObjectTypes.RED_GIANT);
const whiteDwarf = generateObject(ObjectTypes.WHITE_DWARF);
const wormhole = generateObject(ObjectTypes.WORMHOLE);
const bigWormhole = generateObject(ObjectTypes.BIG_WORMHOLE);
const whiteHole = generateObject(ObjectTypes.WHITE_HOLE);

const rare = { p: 0.05 };

// prettier-ignore
export const scenarioTypes: Array<{
  name: string;
  items: Array<ScenarioItemRule>;
}> = [
  { name: 'Lucky Dip', items: [planet(), asteroid(), jovian(), star(), supergiant()] },
  { name: 'Planetary', items: [planet({min: 1}), asteroid({p: 0.3})] },
  { name: 'Asteroids', items: [planet({p: 0.1}), asteroid(), blackHole(rare)] },
  { name: 'Star System', items: [star({n: 1}), planet({max: 2}), asteroid(), blackHole(rare)] },
  { name: 'Binary System', items: [star({n: 2}), blackHole({p: 0.1}), planet(), asteroid()] },
  { name: 'Jovian', items: [jovian({n: 1}), asteroid()] },
  { name: 'Supergiant', items: [supergiant({n: 1}), planet({p: 0.5}), asteroid()] },
  { name: 'Super Binary', items: [supergiant({n: 2}), asteroid()] },
  { name: 'Uneven Binary', items: [supergiant({n: 1}), star({n: 1}), asteroid()] },
  { name: 'Red Giant', items: [redGiant({n: 1}), asteroid()] },
  { name: 'Star Cluster', items: [star({min: 3, max: 9})] },
  { name: 'Mixture', items: [star(), planet(), asteroid()] },
  { name: 'White Dwarf', items: [whiteDwarf({n: 1})] },
  { name: 'White Dwarfs', items: [whiteDwarf({min: 3})] },
  { name: 'Wormhole', items: [wormhole({min: 2, max: 3}), planet(rare), asteroid()] },
  { name: 'Wormholes', items: [wormhole({min: 2, max: 20})] },
  { name: 'Big Wormhole', items: [bigWormhole({min: 1, max: 2}), asteroid()] },
  { name: 'Black Hole', items: [blackHole({min: 1}), asteroid(), planet(rare), jovian(rare)] },
  { name: 'Black holes', items: [blackHole({min: 2})] },
  { name: 'White Hole', items: [whiteHole({n: 1}), asteroid(), planet(rare), jovian(rare)] },
  { name: 'White Holes', items: [whiteHole({min: 1})] },
  { name: 'Hyperspace', items: [] },
];
