import { PlayerTypes, TurnGenerator } from '../types';
import generateTrivialTurn from './difficulties/trivial';
import generateEasyTurn from './difficulties/easy';
import generateMediumTurn from './difficulties/medium';
import generateHardTurn from './difficulties/hard';
import generateVeryHardTurn from './difficulties/veryHard';

const generateTurn: TurnGenerator = (
  w,
  playerInfo,
  gameState,
  turn,
  simulator,
) => {
  switch (playerInfo.type) {
    case PlayerTypes.BOT_TRIVIAL:
      return generateTrivialTurn(w, playerInfo, gameState, turn, simulator);
    case PlayerTypes.BOT_EASY:
      return generateEasyTurn(w, playerInfo, gameState, turn, simulator);
    case PlayerTypes.BOT_MEDIUM:
      return generateMediumTurn(w, playerInfo, gameState, turn, simulator);
    case PlayerTypes.BOT_HARD:
      return generateHardTurn(w, playerInfo, gameState, turn, simulator);
    case PlayerTypes.BOT_INSANE:
      return generateVeryHardTurn(w, playerInfo, gameState, turn, simulator);
    default:
      return generateTrivialTurn(w, playerInfo, gameState, turn, simulator);
  }
};

export default generateTurn;
