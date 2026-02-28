import { ShotInfo, SimShotResult, TurnGenerator } from 'shared/src/types';
import { oneIn } from 'shared/src/utils';
import { getPosition } from 'shared/src/utils';
import {
  shotTurn,
  checkDangerousShots,
  hyperspaceTurn,
  getClosestDestructible,
  computeFirstShot,
  getBlockingObstacle,
  getTangentShots,
  explore,
  analyzeShot,
  shotSequencer,
} from '../functions';

/**
 * Very hard ("megabot")
 * – If ANY station is now sitting on our previous trajectory: re-fire previous shot
 * - If line-of-sight to target is blocked by a planet: try tangent/lob shots first (shoot around the planet)
 * - Else: try naive direct shot first
 * - If a miss, then -- if we had a previous shot -- check if naive/tangent or previous shot is closer
 * - Fire a volley at whichever target was chosen above
 * - If we had a miss, try an exploratory shot
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

  // 1. Analyze last shot for stations that teleported onto it
  let shotInfo: ShotInfo | null = null;
  if (lastTurnInput && gameState.lastTurnShots?.[playerId]) {
    shotInfo = analyzeShot(
      gameState.lastTurnShots[playerId].movementTrace,
      world,
    );

    if (shotInfo.willHit && shotInfo.destructible) {
      return shotTurn(playerId, lastTurnInput);
    }
  }

  // 2. Identify closest target
  const targetEid = getClosestDestructible(world, playerId);
  const targetData = { ownEid: playerId, targetEid };
  const shooterPos = getPosition(playerId);
  const targetPos = getPosition(targetEid);

  // 3. If target is behind a planet, try tangent/lob shots first (gravity-bend around planet)
  const blocker = getBlockingObstacle(world, shooterPos, targetPos, targetEid);
  let initialShot: { angle: number; power: number };
  let naiveSim: Awaited<ReturnType<typeof simulateShot>>;

  if (blocker) {
    const tangentCandidates = getTangentShots(
      shooterPos,
      blocker.x,
      blocker.y,
      blocker.r,
    );
    const sims: Array<SimShotResult> = [];
    const candidateShots = tangentCandidates.map((raw) => ({playerId, ...raw}));
    for (let i = 0; i < candidateShots.length; i++) {
      sims.push(await simulateShot(candidateShots[i]));
    }

    const best = sims.reduce((a, b) =>
      a.willHit
        ? a
        : b.willHit
          ? b
          : a.closestDist2 <= b.closestDist2
            ? a
            : b,
    );
    const bestIdx = sims.indexOf(best);
    initialShot = tangentCandidates[bestIdx];
    naiveSim = best;
  } else {
    initialShot = computeFirstShot(targetData);
    naiveSim = await simulateShot({ playerId, ...initialShot });
  }

  if (naiveSim.willHit) {
    return shotTurn(playerId, initialShot, [naiveSim.shotTrail]);
  }

  // 4. Missed. Check if our last shot or the initial shot went closest to a target,
  // then fire a volley of simulated shots
  const isInitialCloser = shotInfo
    ? naiveSim.closestDist2 < shotInfo.closestDist2
    : true;

  const input = isInitialCloser
    ? { playerId, ...initialShot }
    : lastTurnInput!;
  const target = isInitialCloser
    ? targetData
    : { ...targetData, targetEid: naiveSim.closestDestructible };

  const firstVolleySteps = blocker ? 5 : 3; // extra correction steps when shooting around a planet
  const { paths, sim: firstVolley } = await shotSequencer(
    target,
    input,
    simulateShot,
    firstVolleySteps,
    [naiveSim],
  );

  if (firstVolley.willHit) {
    return shotTurn(playerId, firstVolley.input, paths);
  }

  // 5. Missed first volley. Fire an explorer shot and see how close it gets.
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

  const allShots = [naiveSim, firstVolley, exploreSim, secondVolley];
  const [closestShot] = allShots.sort(
    (a, b) => a.closestDist2 - b.closestDist2,
  );
  return shotTurn(playerId, closestShot.input, allPaths);
};

export default generateVeryHardTurn;
