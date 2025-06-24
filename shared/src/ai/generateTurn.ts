import { PlayerTypes, TurnGenerator } from '../types';
import generateEasyTurn from './difficulties/easy';
import { generateMediumTurn } from './difficulties/medium';
import generateTrivialTurn from './difficulties/trivial';

const generateTurn: TurnGenerator = (
  world,
  playerInfo,
  gameState,
  lastTurnInput,
) => {
  switch (playerInfo.type) {
    case PlayerTypes.BOT_TRIVIAL:
      return generateTrivialTurn(world, playerInfo, gameState, lastTurnInput);
    case PlayerTypes.BOT_EASY:
      return generateEasyTurn(world, playerInfo, gameState, lastTurnInput);
    case PlayerTypes.BOT_MEDIUM:
      return generateMediumTurn(world, playerInfo, gameState, lastTurnInput);
    default:
      return generateEasyTurn(world, playerInfo, gameState, lastTurnInput);
  }
};

export default generateTurn;
