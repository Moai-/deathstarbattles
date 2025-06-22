import { createGame, destroyGame, getGame } from 'src/game';
import { GameConfig } from '../types';
import { gameBus, GameEvents } from 'src/util';

export const startGameWithConfig = (config: GameConfig) => {
  const game = getGame();
  if (game) {
    gameBus.on(GameEvents.GAME_REMOVED, () => {
      gameBus.off(GameEvents.GAME_REMOVED);
      // voodoo programming -- timeout just to be safe
      setTimeout(() => {
        createGame();
      }, 100);
    });
    destroyGame();
  } else {
    createGame();
  }
  gameBus.on(GameEvents.SCENE_LOADED, () => {
    gameBus.off(GameEvents.SCENE_LOADED);
    gameBus.emit(GameEvents.START_GAME, config);
  });
};

export const softDestroyGame = () =>
  new Promise((resolve) => {
    gameBus.on(GameEvents.GAME_REMOVED, resolve);
    destroyGame();
  });
