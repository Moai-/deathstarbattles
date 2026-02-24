import { GameConfig } from 'shared/src/types';
import { createGame, getGame, startEditorScene, startMainScene, stopEditorScene, stopMainScene } from 'src/game';
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


export const startEditor = async () =>   
  new Promise<void>((resolve) => {
    gameBus.on(GameEvents.SCENE_LOADED, () => {
      gameBus.off(GameEvents.SCENE_LOADED);
      gameBus.emit(GameEvents.START_GAME, {});
      resolve();
    });
    const game = getGame();
    if (game) {
      stopEditorScene().then(startEditorScene);
    } else {
      createGame().then(startEditorScene);
    }
  });