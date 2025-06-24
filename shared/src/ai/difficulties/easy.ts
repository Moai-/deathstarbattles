import { TurnGenerator } from 'shared/src/types';
import {
  addError,
  computeFirstShot,
  getClosestDestructible,
  hyperspaceTurn,
  oneIn,
  shotTurn,
} from '../utils';
/**
 * Easy ("aimbot")
 * – Fire in a tight but still noisy arc at the target with 100% power
 * – Hyperspace with 1/8 chance
 */
const generateEasyTurn: TurnGenerator = (world, playerInfo, gameState) => {
  const playerId = playerInfo.id;

  // 1. Bail randomly
  if (oneIn(8)) {
    return hyperspaceTurn(playerId);
  }

  // 2. Shoot randomly but in a tight arc
  const targetEid = getClosestDestructible(
    world,
    playerInfo.id,
    gameState.objectInfo,
  );
  const shotInfo = computeFirstShot({ ownEid: playerId, targetEid });
  const noisyShot = addError(shotInfo);
  return shotTurn(playerId, noisyShot);
};

export default generateEasyTurn;
