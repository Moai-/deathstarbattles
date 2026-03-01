import { ShotInfo, TurnGenerator } from 'shared/src/types';
import { oneIn } from 'shared/src/utils';
import {
  shotTurn,
  checkDangerousShots,
  hyperspaceTurn,
  getClosestDestructible,
  computeFirstShot,
  addError,
  analyzeShot,
  correctShot,
} from '../functions';
import generateVeryHardTurn from './veryHard';

/**
 * Medium ("cleverbot")
 * - 1 in 10 times, behave like a very hard opponent -trollface.png-
 * – If ANY station is now sitting on our previous trajectory: re-fire previous shot
 * – Otherwise, we MAY hyperspace:
 *     - only run the danger-zone scan 1/3 of the time
 *     - if that scan says "safe", there’s still a flat 1/8 chance to jump away anyway
 * – If we stay put, nudge aim half-way toward the ideal angle/power with a small error
 */
const generateMediumTurn: TurnGenerator = async (
  world,
  stationId,
  gameState,
  lastTurnInput,
  simulateShot,
) => {
  // 0. -trollface.png-
  if (oneIn(10)) {
    return generateVeryHardTurn(
      world,
      stationId,
      gameState,
      lastTurnInput,
      simulateShot,
    );
  }


  // 1. Analyze last shot for stations that teleported onto it
  // Fire if you find any of these stations
  let shotInfo: ShotInfo | null = null;
  if (lastTurnInput && gameState.lastTurnShots?.[stationId]) {
    shotInfo = analyzeShot(
      gameState.lastTurnShots[stationId].movementTrace,
      world,
    );

    if (shotInfo.willHit) {
      return shotTurn(stationId, lastTurnInput);
    }
  }

  // 2. One third of the time, check for danger and run
  if (oneIn(3) && gameState.lastTurnShots) {
    if (checkDangerousShots(stationId, gameState.lastTurnShots)) {
      return hyperspaceTurn(stationId);
    }
  }

  // 3. One eighth of the time, run
  // This prevents being stuck in a position where you can't hit or get hit
  if (oneIn(8)) {
    return hyperspaceTurn(stationId);
  }

  // 4. If we need fresh aim (target teleported, first shot), do this
  const targetEid = getClosestDestructible(world, stationId);

  const needFreshAim =
    !lastTurnInput || // first turn
    !shotInfo || // no trace (edge-case)
    shotInfo.closestDestructible !== targetEid; // our original target warped away

  if (needFreshAim) {
    const inputs = computeFirstShot({ ownEid: stationId, targetEid });
    return shotTurn(stationId, addError(inputs, 10, 5));
  }

  // 5. Otherwise, try to correct your aim based on your last shot
  const inputs = correctShot(
    { ownEid: stationId, targetEid },
    lastTurnInput,
    shotInfo!,
  );
  return shotTurn(stationId, addError(inputs, 2, 1));
};

export default generateMediumTurn;
