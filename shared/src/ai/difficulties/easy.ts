import { OtherActions, TurnGenerator } from 'shared/src/types';
import { EMPTY_TURN } from '../consts';
import {
  getAngleBetween,
  getClosestDestructible,
  getPosition,
  getPower,
  getRandomBetween,
} from '../utils';

const generateEasyTurn: TurnGenerator = (world, playerInfo, gameState) => {
  const playerId = playerInfo.id;
  const shouldHyperspace = getRandomBetween(1, 8) === 2;
  if (shouldHyperspace) {
    return {
      ...EMPTY_TURN,
      playerId,
      otherAction: OtherActions.HYPERSPACE,
    };
  }
  const ownPoint = getPosition(playerInfo.id);
  const closestEid = getClosestDestructible(
    world,
    playerInfo.id,
    gameState.objectInfo,
  );
  const target = getPosition(closestEid);
  const angle = getAngleBetween(ownPoint, target) + (Math.random() * 20 - 10);
  const power = getPower(ownPoint, target, getRandomBetween(-5, 5));
  return {
    playerId,
    angle,
    power,
  };
};

export default generateEasyTurn;
