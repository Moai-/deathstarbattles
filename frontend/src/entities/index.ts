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
import { createRandomNeutronStar } from './neutronStar';
import { createRandomJetBlackHole } from './jetBlackHole';
import { createDeathStar } from './deathStar';
import { playerCols } from 'shared/src/utils';

const none = () => NULL_ENTITY;

export const createRandomDeathStar = (world: GameWorld) =>
  createDeathStar(world, 0, 0, playerCols[0]);

export const createRandom: Record<ObjectTypes, (world: GameWorld) => number> = {
  // These two do not get created from the editor
  [ObjectTypes.NONE]: none,
  [ObjectTypes.DEATHBEAM]: none,
  // Random object generation index
  [ObjectTypes.DEATHSTAR]: createRandomDeathStar,
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
  [ObjectTypes.NEUTRON_STAR]: createRandomNeutronStar,
  [ObjectTypes.JET_BLACK_HOLE]: createRandomJetBlackHole,
};
