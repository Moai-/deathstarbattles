import { OtherActions } from 'shared/src/types';
import { getAngleBetween, getClosestDestructible, getPosition, getPower, getRandomBetween, } from '../utils';
import { EMPTY_TURN } from '../consts';
const generateTrivialTurn = (world, playerInfo, gameState) => {
    const playerId = playerInfo.id;
    const shouldHyperspace = getRandomBetween(1, 4) === 2;
    if (shouldHyperspace) {
        return {
            ...EMPTY_TURN,
            playerId,
            otherAction: OtherActions.HYPERSPACE,
        };
    }
    const ownPoint = getPosition(playerInfo.id);
    const closestEid = getClosestDestructible(world, playerInfo.id, gameState.objectInfo);
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
