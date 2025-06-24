import { ShotInfo, TurnGenerator } from 'shared/src/types';
import { oneIn } from 'shared/src/utils';
import {
  buildTargetCache,
  analyzeLastShot,
  shotTurn,
  checkDangerousShots,
  hyperspaceTurn,
  getClosestDestructible,
  computeFirstShot,
  addError,
  correctFromLastShot,
  simulateShot,
  isStuck,
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
export const generateHardTurn: TurnGenerator = (
  world,
  playerInfo,
  gameState,
  lastTurnInput,
) => {
  const playerId = playerInfo.id;

  const targetCache = buildTargetCache(playerId, world, gameState.objectInfo);

  // 1. Analyze last shot for stations that teleported onto it
  // Fire if you find any of these stations
  let shotInfo: ShotInfo | null = null;
  if (lastTurnInput && gameState.lastTurnShots?.[playerId]) {
    shotInfo = analyzeLastShot(
      gameState.lastTurnShots[playerId].movementTrace,
      targetCache,
    );

    if (shotInfo.willHit) {
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

  // 4. Fire 3 blasts, pick either the one that hits, or the closest one
  const targetEid = getClosestDestructible(
    world,
    playerId,
    gameState.objectInfo,
  );

  const needFreshAim =
    !lastTurnInput || // first turn
    !shotInfo || // no trace (edge-case)
    shotInfo.closest !== targetEid; // our original target warped away

  const input1 = needFreshAim
    ? computeFirstShot({ ownEid: playerId, targetEid })
    : correctFromLastShot(
        { ownEid: playerId, targetEid },
        lastTurnInput,
        shotInfo!,
      );

  const sim1 = simulateShot(world, playerId, input1, targetCache);

  if (sim1.didHit) {
    // console.log('player %s hit on sim 1', playerId);
    return shotTurn(playerId, input1);
  }

  // Missed. Correct and try again
  const target2 =
    sim1.closestEid === 0 || sim1.closestEid === playerId
      ? targetEid
      : sim1.closestEid;

  const lastInput = {
    ...lastTurnInput,
    playerId,
    ...input1,
  };

  const input2 = correctFromLastShot(
    { ownEid: playerId, targetEid: target2 },
    lastInput,
    { ...shotInfo, dist2: sim1.closestDist2 },
  );

  const sim2 = simulateShot(world, playerId, input2, targetCache);

  if (sim2.didHit) {
    // console.log('player %s hit on sim 2', playerId);

    return shotTurn(playerId, input2);
  }

  // Missed again, try one more time
  const target3 =
    sim2.closestEid === 0 || sim2.closestEid === playerId
      ? targetEid
      : sim2.closestEid;

  const input3 = correctFromLastShot(
    { ownEid: playerId, targetEid: target3 },
    { ...lastInput, ...input2 },
    { ...shotInfo, dist2: sim2.closestDist2 },
  );

  const sim3 = simulateShot(world, playerId, input3, targetCache);

  if (sim3.didHit) {
    // console.log('player %s hit on sim 3', playerId);

    return shotTurn(playerId, input3);
  }

  // Missed for the third time. Try exploring

  const stuck = isStuck(sim2, sim3);
  if (stuck) {
    const probeInput = explore(input3);
    const probeSim = simulateShot(world, playerId, probeInput, targetCache);

    if (
      probeSim.didHit ||
      probeSim.closestDist2 <
        Math.min(sim1.closestDist2, sim2.closestDist2, sim3.closestDist2)
    ) {
      return shotTurn(playerId, probeInput, [probeSim.shotTrail]);
    }
  }

  // Shoot at the target that our shot came closest to with a little noise.
  // Maybe we'll get it, maybe next turn we'll figure it out.
  const closestSim = [sim1, sim2, sim3].sort(
    (a, b) => b.closestDist2 - a.closestDist2,
  )[0];

  const finalInput = correctFromLastShot(
    { ownEid: playerId, targetEid: closestSim.closestEid },
    { ...lastInput, ...closestSim.input },
    { ...shotInfo, dist2: closestSim.closestDist2 },
  );
  // console.log('player %s missed after sim 3', playerId);

  return shotTurn(playerId, addError(finalInput, 2, 1), [
    sim1.shotTrail,
    sim2.shotTrail,
    sim3.shotTrail,
  ]);
};
