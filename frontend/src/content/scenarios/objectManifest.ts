import { ObjectTypes } from 'shared/src/types';
import { generateObject } from './utils';

export const scenarioItems = [
  { key: ObjectTypes.ASTEROID, label: 'Asteroid', maxAmount: 30 },
  { key: ObjectTypes.PLANET, label: 'Planet', maxAmount: 20 },
  { key: ObjectTypes.JOVIAN, label: 'Jovian', maxAmount: 2 },
  { key: ObjectTypes.STAR, label: 'Star', maxAmount: 5 },
  { key: ObjectTypes.SUPERGIANT, label: 'Supergiant', maxAmount: 2 },
  { key: ObjectTypes.BLACK_HOLE, label: 'Black hole', maxAmount: 6 },
  { key: ObjectTypes.RED_GIANT, label: 'Red giant', maxAmount: 2 },
  { key: ObjectTypes.WHITE_DWARF, label: 'White dwarf', maxAmount: 15 },
  { key: ObjectTypes.WORMHOLE, label: 'Wormhole', maxAmount: 20 },
  { key: ObjectTypes.BIG_WORMHOLE, label: 'Big wormhole', maxAmount: 2 },
  { key: ObjectTypes.WHITE_HOLE, label: 'Big wormhole', maxAmount: 20 },
  { key: ObjectTypes.ANOMALY, label: 'Space-time Anomaly', maxAmount: 30 },
  { key: ObjectTypes.LOCUS, label: 'Hyperspace Locus', maxAmount: 1 },
  { key: ObjectTypes.TUNNEL_LOCUS, label: 'Tunnel Locus', maxAmount: 1 },
];

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
export const locus = generateObject(ObjectTypes.LOCUS);
export const tunnelLocus = generateObject(ObjectTypes.TUNNEL_LOCUS);
