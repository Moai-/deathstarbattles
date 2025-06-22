import { GameWorld } from 'shared/src/ecs/world';
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

export const createRandom: Record<ObjectTypes, (world: GameWorld) => number> = {
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
};
