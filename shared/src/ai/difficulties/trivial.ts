import { TurnGenerator } from 'shared/src/types';
import { oneIn, getPosition, getRandomBetween } from 'shared/src/utils';
import {
  hyperspaceTurn,
  getClosestDestructible,
  getAngleBetween,
  getPower,
} from '../functions';

/**
 * Trivial ("randbot")
 * – Aiming is randomized within a quadrant of where the target is
 * – Hyperspace 1/4 of the time (also randomly)
 */
const generateTrivialTurn: TurnGenerator = (world, playerInfo, gameState) => {
  const playerId = playerInfo.id;

  // 1. Bail 1/4 of the time
  if (oneIn(4)) {
    return hyperspaceTurn(playerId);
  }

  const ownPoint = getPosition(playerInfo.id);
  const closestEid = getClosestDestructible(
    world,
    playerInfo.id,
    gameState.objectInfo,
  );
  const target = getPosition(closestEid);
  const angleToTarget = getAngleBetween(ownPoint, target);
  const quadrant = Math.floor(angleToTarget / 90) * 90;
  const angleError = getRandomBetween(0, 90);
  const angle = quadrant + angleError;
  const power = getPower(ownPoint, target, getRandomBetween(-10, 10));
  return {
    angle,
    power,
    playerId,
  };
};

export default generateTrivialTurn;
