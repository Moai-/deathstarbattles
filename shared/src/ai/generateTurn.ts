import { PlayerTypes, TurnGenerator } from '../types';
import generateEasyTurn from './difficulties/easy';
import { generateHardTurn } from './difficulties/hard';
import { generateMediumTurn } from './difficulties/medium';
import generateTrivialTurn from './difficulties/trivial';

const generateTurn: TurnGenerator = (
  w,
  playerInfo,
  gameState,
  turnInfo,
  simulator,
) => {
  switch (playerInfo.type) {
    case PlayerTypes.BOT_TRIVIAL:
      return generateTrivialTurn(w, playerInfo, gameState, turnInfo, simulator);
    case PlayerTypes.BOT_EASY:
      return generateEasyTurn(w, playerInfo, gameState, turnInfo, simulator);
    case PlayerTypes.BOT_MEDIUM:
      return generateMediumTurn(w, playerInfo, gameState, turnInfo, simulator);
    case PlayerTypes.BOT_HARD:
      return generateHardTurn(w, playerInfo, gameState, turnInfo, simulator);
    default:
      return generateEasyTurn(w, playerInfo, gameState, turnInfo, simulator);
  }
};

export default generateTurn;
