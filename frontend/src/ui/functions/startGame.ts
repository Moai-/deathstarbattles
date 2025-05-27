import { createGame, destroyGame } from 'src/game';
import { GameConfig } from '../types';
import { gameBus, GameEvents } from 'src/util';

export const startGameWithConfig = (config: GameConfig) => {
  destroyGame();
  gameBus.on(GameEvents.SCENE_LOADED, () => {
    console.log('scene loaded');
    gameBus.off(GameEvents.SCENE_LOADED);
    gameBus.emit(GameEvents.START_GAME, config);
  });
  setTimeout(() => {
    createGame();
  }, 1000);
};
