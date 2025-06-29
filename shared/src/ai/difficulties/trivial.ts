import { TurnGenerator } from 'shared/src/types';
import { oneIn, getPosition, getRandomBetween } from 'shared/src/utils';
import {
  hyperspaceTurn,
  getClosestDestructible,
  getAngleBetween,
  addError,
} from '../functions';

/**
 * Trivial ("failbot")
 * – Aiming is randomized within a quadrant of where the target is
 * – Hyperspace 1/4 of the time (also randomly)
 */
const generateTrivialTurn: TurnGenerator = async (world, playerInfo) => {
  const playerId = playerInfo.id;

  // 1. Bail 1/4 of the time
  if (oneIn(4)) {
    return hyperspaceTurn(playerId);
  }

  // 2. Shoot randomly only in the vaguest direction of the target
  const ownPoint = getPosition(playerInfo.id);
  const closestEid = getClosestDestructible(world, playerInfo.id);
  const target = getPosition(closestEid);
  const angleToTarget = getAngleBetween(ownPoint, target);
  const quadrant = Math.floor(angleToTarget / 90) * 90;
  const angleError = getRandomBetween(0, 90);
  const angle = quadrant + angleError;
  const { power } = addError({ power: 100, angle: 0 }, 0, 10);
  return {
    angle,
    power,
    playerId,
  };
};

export default generateTrivialTurn;
