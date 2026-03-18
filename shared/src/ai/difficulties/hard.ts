import { ShotInfo, TurnGenerator } from 'shared/src/types';
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
 * Hard ("superbot")
 * – If ANY station is now sitting on our previous trajectory: re-fire previous shot
 * – Otherwise, we MAY hyperspace:
 *     - teleport away if in danger 1/2 of the time
 *     - teleport away 1/8 of the time anyway
 * – Simulate 3 shots and pick the one that hits
 */

const generateHardTurn: TurnGenerator = async (
  world,
  stationId,
  gameState,
  lastTurnInput,
  simulateShot,
) => {

  // 1. Analyze last shot for stations that teleported onto it
  // Fire if you find any of these stations
  let shotInfo: ShotInfo | null = null;
  if (lastTurnInput && gameState.lastTurnShots?.[stationId]) {
    shotInfo = analyzeShot(
      gameState.lastTurnShots[stationId].movementTrace,
      world,
    );

    if (shotInfo.willHit && shotInfo.destructible) {
      // console.log('player %s performs last shot as it will hit', stationId);
      return shotTurn(stationId, lastTurnInput);
    }
  }

  // 2. One half of the time, check for danger and run
  if (world.random.oneIn(2) && gameState.lastTurnShots) {
    if (checkDangerousShots(stationId, gameState.lastTurnShots)) {
      return hyperspaceTurn(stationId);
    }
  }

  // 3. One eighth of the time, run regardless of danger
  // This prevents being stuck in a position where you can't hit or get hit
  if (world.random.oneIn(8)) {
    return hyperspaceTurn(stationId);
  }

  // 4. Identify closest target and try the naive approach first
  const targetEid = getClosestDestructible(world, stationId);

  const targetData = { ownEid: stationId, targetEid };
  const naiveShot = computeFirstShot(targetData);
  const naiveSim = await simulateShot({ stationId, ...naiveShot });

  if (naiveSim.willHit) {
    return shotTurn(stationId, naiveShot, [naiveSim.shotTrail]);
  }

  // 5. Missed. Execute a sequence of 3 shots, see what happens
  const input = { ...naiveShot, stationId };
  const { sim, paths } = await shotSequencer(
    targetData,
    input,
    simulateShot,
    3,
    [naiveSim],
  );

  if (sim.willHit) {
    return shotTurn(stationId, sim.input, paths);
  }

  // 6. Missed. Try a wide exploratory shot
  const exploratoryShot = explore(sim.input);
  const exploreSim = await simulateShot({ stationId, ...exploratoryShot });

  if (exploreSim.willHit) {
    return shotTurn(stationId, sim.input, [...paths, exploreSim.shotTrail]);
  }

  // 7. Missed all shots, return closest between naive, exploratory, and sequenced
  const [closestShot] = [naiveSim, exploreSim, sim].sort(
    (a, b) => a.closestDist2 - b.closestDist2,
  );
  return shotTurn(stationId, closestShot.input, [
    ...paths,
    exploreSim.shotTrail,
  ]);
};

export default generateHardTurn;