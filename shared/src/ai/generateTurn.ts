import { PlayerTypes, TurnGenerator } from '../types';
import generateEasyTurn from './difficulties/easy';
import generateTrivialTurn from './difficulties/trivial';

const generateTurn: TurnGenerator = (world, playerInfo, gameState) => {
  switch (playerInfo.type) {
    case PlayerTypes.BOT_TRIVIAL:
      return generateTrivialTurn(world, playerInfo, gameState);
    default:
      return generateEasyTurn(world, playerInfo, gameState);
  }
};

export default generateTurn;
