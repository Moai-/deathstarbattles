import { EntityGenerator, ObjectPlacement, ObjectTypes, ScenarioItemRule } from 'shared/src/types';
import { createAnomaly, createAsteroid, createBigWormhole, createBlackHole, createJetBlackHole, createJovian, createLocus, createNeutronStar, createPlanet, createRedGiant, createStar, createSupergiant, createWhiteDwarf, createWhiteHole, createWormhole } from './entities';

type ScenarioItemArray = Array<{
  key: ObjectTypes,
  label: string,
  maxAmount: number,
  generator: EntityGenerator,
  placement?: ObjectPlacement,
}>;

type ScenarioInfo = {
  label: string,
  maxAmount: number,
  generator: EntityGenerator,
  placement?: ObjectPlacement,
}

export const scenarioItems: ScenarioItemArray = [
  { key: ObjectTypes.ANOMALY, label: 'Space-time Anomaly', maxAmount: 20, generator: createAnomaly },
  { key: ObjectTypes.ASTEROID, label: 'Asteroid', maxAmount: 20, generator: createAsteroid },
  { key: ObjectTypes.BIG_WORMHOLE, label: 'Big wormhole', maxAmount: 2, generator: createBigWormhole, placement: ObjectPlacement.SUPERGIANT },
  { key: ObjectTypes.BLACK_HOLE, label: 'Black hole', maxAmount: 6, generator: createBlackHole, placement: ObjectPlacement.OUTSKIRTS},
  { key: ObjectTypes.JET_BLACK_HOLE, label: 'Jet Black Hole', maxAmount: 1, generator: createJetBlackHole, placement: ObjectPlacement.DEAD_CENTER },
  { key: ObjectTypes.JOVIAN, label: 'Jovian', maxAmount: 2, generator: createJovian, placement: ObjectPlacement.CLOSE_TO_CENTER},
  { key: ObjectTypes.LOCUS, label: 'Hyperlocus', maxAmount: 1, generator: createLocus},
  { key: ObjectTypes.NEUTRON_STAR, label: 'Neutron Star', maxAmount: 1, generator: createNeutronStar, placement: ObjectPlacement.DEAD_CENTER },
  { key: ObjectTypes.PLANET, label: 'Planet', generator: createPlanet, maxAmount: 8 },
  { key: ObjectTypes.RED_GIANT, label: 'Red giant', maxAmount: 1, generator: createRedGiant, placement: ObjectPlacement.CLOSE_TO_CENTER },
  { key: ObjectTypes.STAR, label: 'Star', maxAmount: 3, generator: createStar, },
  { key: ObjectTypes.SUPERGIANT, label: 'Supergiant', maxAmount: 2, generator: createSupergiant, placement: ObjectPlacement.SUPERGIANT },
  { key: ObjectTypes.WHITE_DWARF, label: 'White dwarf', maxAmount: 10, generator: createWhiteDwarf },
  { key: ObjectTypes.WHITE_HOLE, label: 'Big wormhole', maxAmount: 10, generator: createWhiteHole, },
  { key: ObjectTypes.WORMHOLE, label: 'Wormhole', maxAmount: 15, generator: createWormhole, placement: ObjectPlacement.OUTSKIRTS },
];

export const scenarioItemMap = new Map<ObjectTypes, ScenarioInfo>()

scenarioItems.forEach((item) => {
  const {key, ...rest} = item;
  scenarioItemMap.set(key, rest);
})

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


export const planet = generateObject(ObjectTypes.PLANET);
export const asteroid = generateObject(ObjectTypes.ASTEROID);
export const jovian = generateObject(ObjectTypes.JOVIAN);
export const star = generateObject(ObjectTypes.STAR);
export const supergiant = generateObject(ObjectTypes.SUPERGIANT);
export const blackHole = generateObject(ObjectTypes.BLACK_HOLE);
export const redGiant = generateObject(ObjectTypes.RED_GIANT);
export const whiteDwarf = generateObject(ObjectTypes.WHITE_DWARF);
export const wormhole = generateObject(ObjectTypes.WORMHOLE);
export const bigWormhole = generateObject(ObjectTypes.BIG_WORMHOLE);
export const whiteHole = generateObject(ObjectTypes.WHITE_HOLE);
export const anomaly = generateObject(ObjectTypes.ANOMALY);
export const neutronStar = generateObject(ObjectTypes.NEUTRON_STAR);
export const jetBlackHole = generateObject(ObjectTypes.JET_BLACK_HOLE);
export const locus = generateObject(ObjectTypes.LOCUS);