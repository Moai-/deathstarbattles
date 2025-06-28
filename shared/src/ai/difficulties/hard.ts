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
 * Hard ("superbot")
 * – If ANY station is now sitting on our previous trajectory: re-fire previous shot
 * – Otherwise, we MAY hyperspace:
 *     - teleport away if in danger 1/2 of the time
 *     - teleport away 1/8 of the time anyway
 * – Simulate 3 shots and pick the one that hits
 */

const generateHardTurn: TurnGenerator = async (
  world,
  playerInfo,
  gameState,
  lastTurnInput,
  simulateShot,
) => {
  const playerId = playerInfo.id;

  // 1. Analyze last shot for stations that teleported onto it
  // Fire if you find any of these stations
  let shotInfo: ShotInfo | null = null;
  if (lastTurnInput && gameState.lastTurnShots?.[playerId]) {
    shotInfo = analyzeShot(
      gameState.lastTurnShots[playerId].movementTrace,
      world,
    );

    if (shotInfo.willHit && shotInfo.destructible) {
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

  // 3. One eighth of the time, run regardless of danger
  // This prevents being stuck in a position where you can't hit or get hit
  if (oneIn(8)) {
    return hyperspaceTurn(playerId);
  }

  // 4. Identify closest target and try the naive approach first
  const targetEid = getClosestDestructible(world, playerId);

  const targetData = { ownEid: playerId, targetEid };
  const naiveShot = computeFirstShot(targetData);
  const naiveSim = await simulateShot({ playerId, ...naiveShot });

  if (naiveSim.willHit) {
    return shotTurn(playerId, naiveShot, [naiveSim.shotTrail]);
  }

  // 5. Missed. Execute a sequence of 3 shots, see what happens
  const input = { ...naiveShot, playerId };
  const { sim, paths } = await shotSequencer(
    targetData,
    input,
    simulateShot,
    3,
    [naiveSim],
  );

  if (sim.willHit) {
    return shotTurn(playerId, sim.input, paths);
  }

  // 6. Missed. Try a wide exploratory shot
  const exploratoryShot = explore(sim.input);
  const exploreSim = await simulateShot({ playerId, ...exploratoryShot });

  if (exploreSim.willHit) {
    return shotTurn(playerId, sim.input, [...paths, exploreSim.shotTrail]);
  }

  // 7. Missed all shots, return closest between naive, exploratory, and sequenced
  const [closestShot] = [naiveSim, exploreSim, sim].sort(
    (a, b) => a.closestDist2 - b.closestDist2,
  );
  return shotTurn(playerId, closestShot.input, [
    ...paths,
    exploreSim.shotTrail,
  ]);
};

export default generateHardTurn;

// const generateHardTurn: TurnGenerator = async (
//   world,
//   playerInfo,
//   gameState,
//   lastTurnInput,
//   simulateShot,
// ) => {
//   const playerId = playerInfo.id;

//   // 1. Analyze last shot for stations that teleported onto it
//   // Fire if you find any of these stations
//   let shotInfo: ShotInfo | null = null;
//   if (lastTurnInput && gameState.lastTurnShots?.[playerId]) {
//     shotInfo = analyzeShot(
//       gameState.lastTurnShots[playerId].movementTrace,
//       world,
//     );

//     if (shotInfo.willHit && shotInfo.destructible) {
//       console.log('player %s performs last shot as it will hit', playerId);
//       return shotTurn(playerId, lastTurnInput);
//     }
//   }

//   // 2. One half of the time, check for danger and run
//   if (oneIn(2) && gameState.lastTurnShots) {
//     if (checkDangerousShots(playerId, gameState.lastTurnShots)) {
//       return hyperspaceTurn(playerId);
//     }
//   }

//   // 3. One eighth of the time, run regardless of danger
//   // This prevents being stuck in a position where you can't hit or get hit
//   if (oneIn(8)) {
//     return hyperspaceTurn(playerId);
//   }

//   // 4. Identify closest target and try the naive approach first
//   const targetEid = getClosestDestructible(world, playerId);

//   const targetData = { ownEid: playerId, targetEid };
//   const naiveShot = computeFirstShot(targetData);
//   const sim1 = await simulateShot({ playerId, ...naiveShot });

//   if (sim1.willHit) {
//     return shotTurn(playerId, naiveShot, [sim1.shotTrail]);
//   }

//   // 5. Missed. Try again, carefully correct shot
//   const input2: TurnInput = {
//     playerId,
//     ...naiveShot,
//   };

//   const target2 = sim1.hitsSelf ? targetEid : sim1.closestDestructible;
//   targetData.targetEid = target2;

//   const correctedShot = correctShot(targetData, input2, sim1);

//   const sim2 = await simulateShot({ playerId, ...correctedShot });
//   if (sim2.willHit) {
//     return shotTurn(playerId, correctedShot, [sim1.shotTrail, sim2.shotTrail]);
//   }

//   // 6. Missed again. Try to correct some more
//   const target3 = sim2.hitsSelf ? target2 : sim2.closestDestructible;
//   targetData.targetEid = target3;
//   const input3 = {
//     ...input2,
//     ...correctedShot,
//   };

//   const adjustedShot = correctShot(targetData, input3, sim2);

//   const sim3 = await simulateShot({ playerId, ...adjustedShot });

//   if (sim3.willHit) {
//     return shotTurn(playerId, adjustedShot, [
//       sim1.shotTrail,
//       sim2.shotTrail,
//       sim3.shotTrail,
//     ]);
//   }

//   // 7. Missed, let's try an exploratory shot
//   const exploratoryShot = explore(adjustedShot);
//   const sim4 = await simulateShot({ playerId, ...exploratoryShot });

//   if (sim4.willHit) {
//     return shotTurn(playerId, exploratoryShot, [
//       sim1.shotTrail,
//       sim2.shotTrail,
//       sim3.shotTrail,
//       sim4.shotTrail,
//     ]);
//   }

//   // 8. Fire the closest shot we had
//   const [closestShot] = [sim1, sim2, sim3, sim4].sort(
//     (a, b) => a.closestDist2 - b.closestDist2,
//   );

//   return shotTurn(playerId, closestShot.input, [
//     sim1.shotTrail,
//     sim2.shotTrail,
//     sim3.shotTrail,
//     sim4.shotTrail,
//   ]);
// };
