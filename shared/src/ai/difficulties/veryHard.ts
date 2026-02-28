import { ShotInfo, TurnGenerator } from 'shared/src/types';
import { oneIn } from 'shared/src/utils';
import {
  shotTurn,
  checkDangerousShots,
  hyperspaceTurn,
  getClosestDestructible,
  computeFirstShot,
  // addError,
  // isStuck,
  explore,
  analyzeShot,
  shotSequencer,
} from '../functions';

/**
 * Very hard ("megabot")
 * – If ANY station is now sitting on our previous trajectory: re-fire previous shot
 * - Check right next to you ("naive shot"). If you can hit someone there, do it
 * - If a miss, then -- if we had a previous shot -- check if naive shot or previous shot is closer
 * - Fire a volley at whichever target was chosen above
 * - If we had a miss, try an exploratory shot.
 * - If this shot misses, we teleport away 1/3 of the time if we're in danger
 * - If we're still there: compare shots from first volley and exploratory shot
 * - Fire a second volley at whichever target is closest to whichever shot from above
 * - If EVERYTHING missed, teleport away 1/2 of the time
 */
const generateVeryHardTurn: TurnGenerator = async (
  world,
  playerInfo,
  gameState,
  lastTurnInput,
  simulateShot,
) => {
  const playerId = playerInfo.id;
  console.log('simulation for player', playerId);

  // 1. Analyze last shot for stations that teleported onto it
  // Fire if you find any of these stations
  let shotInfo: ShotInfo | null = null;
  if (lastTurnInput && gameState.lastTurnShots?.[playerId]) {
    shotInfo = analyzeShot(
      gameState.lastTurnShots[playerId].movementTrace,
      world,
    );

    if (shotInfo.willHit && shotInfo.destructible) {
      // console.log('player %s performs last shot as it will hit', playerId);
      return shotTurn(playerId, lastTurnInput);
    }
  }

  // 2. Identify closest target and try the naive approach first
  const targetEid = getClosestDestructible(world, playerId);

  const targetData = { ownEid: playerId, targetEid };
  const naiveShot = computeFirstShot(targetData);
  const naiveSim = await simulateShot({ playerId, ...naiveShot });

  if (naiveSim.willHit) {
    return shotTurn(playerId, naiveShot, [naiveSim.shotTrail]);
  }

  // 3. Missed. Check if our last shot or the naive shot went closest to a target,
  // then fire a volley of simulated shots
  const isNaiveCloser = shotInfo
    ? naiveSim.closestDist2 < shotInfo.closestDist2
    : true;

  const input = isNaiveCloser ? { playerId, ...naiveShot } : lastTurnInput!;
  const target = isNaiveCloser
    ? targetData
    : { ...targetData, targetEid: naiveSim.closestDestructible };

  const { paths, sim: firstVolley } = await shotSequencer(
    target,
    input,
    simulateShot,
    3,
    [naiveSim],
  );

  if (firstVolley.willHit) {
    return shotTurn(playerId, firstVolley.input, paths);
  }

  // 4. Missed first volley. Let's fire an explorer shot and see how close it gets.
  const exploratoryShot = explore(firstVolley.input);
  const exploreSim = await simulateShot({ playerId, ...exploratoryShot });

  if (exploreSim.willHit) {
    return shotTurn(playerId, exploratoryShot, [
      ...paths,
      exploreSim.shotTrail,
    ]);
  }

  const didFindCloserTarget =
    exploreSim.closestDist2 < firstVolley.closestDist2;

  // 5. If we didn't, see if we wanna bail -- 1/3 of the time
  const lastTurnShots = gameState.lastTurnShots || null;
  if (!didFindCloserTarget && lastTurnShots) {
    if (checkDangerousShots(playerId, lastTurnShots) && oneIn(3)) {
      return hyperspaceTurn(playerId);
    }
  }

  // 6. Another volley! See if we want to continue the exploration path or if we'd rather
  // try to pursue the same path as from the first volley
  const nextRaw = didFindCloserTarget ? exploreSim.input : firstVolley.input;
  const nextInput = { playerId, ...nextRaw };
  const nextTargetEid = didFindCloserTarget
    ? exploreSim.closestDestructible
    : firstVolley.closestDestructible;
  const nextTarget = { ...targetData, targetEid: nextTargetEid };
  const { paths: secondPaths, sim: secondVolley } = await shotSequencer(
    nextTarget,
    nextInput,
    simulateShot,
    3,
    [firstVolley, exploreSim],
  );

  const allPaths = [...paths, exploreSim.shotTrail, ...secondPaths];
  if (secondVolley.willHit) {
    return shotTurn(playerId, nextInput, allPaths);
  }

  // 7. Missed again, drat! Bail half the time, the other half, just brave the closest shot we have
  if (oneIn(2)) {
    return hyperspaceTurn(playerId);
  }

  const [closestShot] = [naiveSim, firstVolley, exploreSim, secondVolley].sort(
    (a, b) => a.closestDist2 - b.closestDist2,
  );
  return shotTurn(playerId, closestShot.input, allPaths);
};

export default generateVeryHardTurn;
