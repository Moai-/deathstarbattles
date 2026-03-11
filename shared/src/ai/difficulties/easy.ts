import { TurnGenerator } from 'shared/src/types';
import {
  hyperspaceTurn,
  getClosestDestructible,
  computeFirstShot,
  addError,
  shotTurn,
} from '../functions';

/**
 * Easy ("aimbot")
 * – Fire in a tight but still noisy arc at the target with 100% power
 * – Hyperspace with 1/8 chance
 */
const generateEasyTurn: TurnGenerator = async (world, stationId) => {

  // 1. Bail randomly
  if (world.random.oneIn(8)) {
    return hyperspaceTurn(stationId);
  }

  // 2. Shoot in a tight arc towards closest target
  const targetEid = getClosestDestructible(world, stationId);
  const shotInfo = computeFirstShot({ ownEid: stationId, targetEid });
  const noisyShot = addError(shotInfo);
  return shotTurn(stationId, noisyShot);
};

export default generateEasyTurn;
