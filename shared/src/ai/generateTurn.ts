import { PlayerTypes, TurnGenerator } from '../types';
import generateTrivialTurn from './difficulties/trivial';
import generateEasyTurn from './difficulties/easy';
import generateMediumTurn from './difficulties/medium';
import generateHardTurn from './difficulties/hard';
import generateVeryHardTurn from './difficulties/veryHard';

const generateTurn: TurnGenerator = (
  w,
  stationId,
  gameState,
  turn,
  simulator,
  type,
) => {
  switch (type) {
    case PlayerTypes.BOT_TRIVIAL:
      return generateTrivialTurn(w, stationId, gameState, turn, simulator);
    case PlayerTypes.BOT_EASY:
      return generateEasyTurn(w, stationId, gameState, turn, simulator);
    case PlayerTypes.BOT_MEDIUM:
      return generateMediumTurn(w, stationId, gameState, turn, simulator);
    case PlayerTypes.BOT_HARD:
      return generateHardTurn(w, stationId, gameState, turn, simulator);
    case PlayerTypes.BOT_INSANE:
      return generateVeryHardTurn(w, stationId, gameState, turn, simulator);
    default:
      return generateTrivialTurn(w, stationId, gameState, turn, simulator);
  }
};

export default generateTurn;
