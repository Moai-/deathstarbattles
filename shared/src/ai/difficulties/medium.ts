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
} from '../functions';

/**
 * Medium ("cleverbot")
 * – If ANY station is now sitting on our previous trajectory: re-fire previous shot
 * – Otherwise, we MAY hyperspace:
 *     - only run the danger-zone scan 1/3 of the time
 *     - if that scan says "safe", there’s still a flat 1/8 chance to jump away anyway
 * – If we stay put, nudge aim half-way toward the ideal angle/power,
 *   with a tiny bit of noise so it doesn’t look robotic
 */
export const generateMediumTurn: TurnGenerator = (
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

  // 2. One third of the time, check for danger and run
  if (oneIn(3) && gameState.lastTurnShots) {
    if (checkDangerousShots(playerId, gameState.lastTurnShots)) {
      return hyperspaceTurn(playerId);
    }
  }

  // 3. One eighth of the time, run
  // This prevents being stuck in a position where you can't hit or get hit
  if (oneIn(8)) {
    return hyperspaceTurn(playerId);
  }

  // 4. If we need fresh aim (target teleported, first shot), do this
  const targetEid = getClosestDestructible(
    world,
    playerId,
    gameState.objectInfo,
  );

  const needFreshAim =
    !lastTurnInput || // first turn
    !shotInfo || // no trace (edge-case)
    shotInfo.closest !== targetEid; // our original target warped away

  if (needFreshAim) {
    const inputs = computeFirstShot({ ownEid: playerId, targetEid });
    return shotTurn(playerId, addError(inputs, 10, 5));
  }

  // 5. Otherwise, try to correct your aim based on your last shot
  const inputs = correctFromLastShot(
    { ownEid: playerId, targetEid },
    lastTurnInput,
    shotInfo!,
  );
  return shotTurn(playerId, addError(inputs, 2, 1));
};
