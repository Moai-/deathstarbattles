import { createGame, getGame, startMainScene, stopMainScene } from 'src/game';
import { GameConfig } from '../types';
import { gameBus, GameEvents } from 'src/util';

export const startGameWithConfig = async (config: GameConfig) =>
  new Promise<void>((resolve) => {
    gameBus.on(GameEvents.SCENE_LOADED, () => {
      gameBus.off(GameEvents.SCENE_LOADED);
      gameBus.emit(GameEvents.START_GAME, config);
      resolve();
    });
    const game = getGame();
    if (game) {
      stopMainScene().then(startMainScene);
    } else {
      createGame().then(startMainScene);
    }
  });
