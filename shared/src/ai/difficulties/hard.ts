import { ShotInfo, TurnGenerator, TurnInput } from 'shared/src/types';
import { oneIn } from 'shared/src/utils';
import {
  buildTargetCache,
  analyzeLastShot,
  shotTurn,
  checkDangerousShots,
  hyperspaceTurn,
  getClosestDestructible,
  computeFirstShot,
  // addError,
  correctFromLastShot,
  // isStuck,
  explore,
} from '../functions';

/**
 * Hard ("superbot")
 * – If ANY station is now sitting on our previous trajectory: re-fire previous shot
 * – Otherwise, we MAY hyperspace:
 *     - teleport away if in danger 1/2 of the time
 *     - teleport away 1/8 of the time anyway
 * – Simulate 3 shots and pick the one that hits
 */
export const generateHardTurn: TurnGenerator = async (
  world,
  playerInfo,
  gameState,
  lastTurnInput,
  simulateShot,
) => {
  const playerId = playerInfo.id;

  const targetCache = buildTargetCache(playerId, world);

  // 1. Analyze last shot for stations that teleported onto it
  // Fire if you find any of these stations
  let shotInfo: ShotInfo | null = null;
  if (lastTurnInput && gameState.lastTurnShots?.[playerId]) {
    shotInfo = analyzeLastShot(
      gameState.lastTurnShots[playerId].movementTrace,
      targetCache,
    );

    if (shotInfo.willHit) {
      console.log('player %s performs last shot as it will hit', playerId);
      return shotTurn(playerId, lastTurnInput);
    }
  }

  // 2. One half of the time, check for danger and run
  if (oneIn(2) && gameState.lastTurnShots) {
    if (checkDangerousShots(playerId, gameState.lastTurnShots)) {
      return hyperspaceTurn(playerId);
    }
  }

  // 3. One eighth of the time, run
  // This prevents being stuck in a position where you can't hit or get hit
  if (oneIn(8)) {
    return hyperspaceTurn(playerId);
  }

  // 4. Identify closest target and try the naive approach first
  const targetEid = getClosestDestructible(world, playerId);

  const targetData = { ownEid: playerId, targetEid };
  const naiveShot = computeFirstShot(targetData);
  const sim1 = await simulateShot({ playerId, ...naiveShot });

  if (sim1.didHit) {
    return shotTurn(playerId, naiveShot);
  }

  // 5. Missed. Try again, carefully correct shot
  const input2: TurnInput = {
    playerId,
    ...naiveShot,
  };

  const target2 = sim1.closestEid === playerId ? targetEid : sim1.closestEid;
  targetData.targetEid = target2;

  const correctedShot = correctFromLastShot(targetData, input2, {
    dist2: sim1.closestDist2,
  });

  const sim2 = await simulateShot({ playerId, ...correctedShot });
  if (sim2.didHit) {
    return shotTurn(playerId, correctedShot, [sim1.shotTrail]);
  }

  // 6. Missed again. Try to correct some more
  const target3 = sim2.closestEid === playerId ? target2 : sim2.closestEid;
  targetData.targetEid = target3;
  const input3 = {
    ...input2,
    ...correctedShot,
  };

  const adjustedShot = correctFromLastShot(targetData, input3, {
    dist2: sim2.closestDist2,
  });

  const sim3 = await simulateShot({ playerId, ...adjustedShot });

  if (sim3.didHit) {
    return shotTurn(playerId, adjustedShot, [sim1.shotTrail, sim2.shotTrail]);
  }

  // 7. Missed, let's try an exploratory shot
  const exploratoryShot = explore(adjustedShot);
  const sim4 = await simulateShot({ playerId, ...exploratoryShot });

  if (sim4.didHit) {
    return shotTurn(playerId, exploratoryShot, [
      sim1.shotTrail,
      sim2.shotTrail,
      sim3.shotTrail,
    ]);
  }

  // 8. Aaaand one more correction from the exploratory, maybe we almost struck gold
  const target4 = sim3.closestEid === playerId ? target3 : sim3.closestEid;
  const input4 = { ...input3, ...exploratoryShot };
  targetData.targetEid = target4;
  const adjustedExploratory = correctFromLastShot(targetData, input4, {
    dist2: sim4.closestDist2,
  });
  console.log('%s missed all sim shots', playerId);

  return shotTurn(playerId, adjustedExploratory, [
    sim1.shotTrail,
    sim2.shotTrail,
    sim3.shotTrail,
    sim4.shotTrail,
  ]);
};
