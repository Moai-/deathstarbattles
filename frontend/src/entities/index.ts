import { GameWorld, NULL_ENTITY } from 'shared/src/ecs/world';
import { ObjectTypes } from 'shared/src/types';
import { createRandomAsteroid } from './asteroid';
import { createRandomBlackHole } from './blackHole';
import { createRandomJovian } from './jovian';
import { createRandomPlanet } from './planet';
import { createRandomStar } from './star';
import { createRandomSupergiant } from './supergiant';
import { createRandomRedGiant } from './redGiant';
import { createRandomWhiteDwarf } from './whiteDwarf';
import { createRandomWormhole } from './wormhole';
import { createRandomBigWormhole } from './bigWormhole';
import { createRandomWhiteHole } from './whiteHole';
import { createRandomAnomaly } from './anomaly';
import { createLocus } from './hyperLocus';
import { createRandomTunnelLocus } from './tunnelLocus';

const none = () => NULL_ENTITY;

export const createRandom: Record<ObjectTypes, (world: GameWorld) => number> = {
  // These three do not get created randomly
  [ObjectTypes.NONE]: none,
  [ObjectTypes.DEATHSTAR]: none,
  [ObjectTypes.DEATHBEAM]: none,
  // Random object generation index
  [ObjectTypes.ASTEROID]: createRandomAsteroid,
  [ObjectTypes.STAR]: createRandomStar,
  [ObjectTypes.BLACK_HOLE]: createRandomBlackHole,
  [ObjectTypes.JOVIAN]: createRandomJovian,
  [ObjectTypes.PLANET]: createRandomPlanet,
  [ObjectTypes.SUPERGIANT]: createRandomSupergiant,
  [ObjectTypes.RED_GIANT]: createRandomRedGiant,
  [ObjectTypes.WHITE_DWARF]: createRandomWhiteDwarf,
  [ObjectTypes.WORMHOLE]: createRandomWormhole,
  [ObjectTypes.BIG_WORMHOLE]: createRandomBigWormhole,
  [ObjectTypes.WHITE_HOLE]: createRandomWhiteHole,
  [ObjectTypes.ANOMALY]: createRandomAnomaly,
  [ObjectTypes.LOCUS]: createLocus,
  [ObjectTypes.TUNNEL_LOCUS]: createRandomTunnelLocus,
};
