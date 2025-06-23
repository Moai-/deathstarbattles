import { createGame, getGame, startMainScene, stopMainScene } from 'src/game';
import { GameConfig } from '../types';
import { gameBus, GameEvents } from 'src/util';

export const startGameWithConfig = (config: GameConfig) => {
  const game = getGame();
  console.log('start game with config', config);
  if (game) {
    gameBus.on(GameEvents.GAME_REMOVED, () => {
      console.log('game removed');
      gameBus.off(GameEvents.GAME_REMOVED);
      // voodoo programming -- timeout just to be safe
      setTimeout(() => {
        startMainScene();
      }, 100);
    });
    stopMainScene();
  } else {
    console.log('game missing so create game runs');
    createGame();
  }
  gameBus.on(GameEvents.SCENE_LOADED, () => {
    console.log('scene loaded');
    gameBus.off(GameEvents.SCENE_LOADED);
    gameBus.emit(GameEvents.START_GAME, config);
  });
};

export const softDestroyGame = () =>
  new Promise((resolve) => {
    gameBus.on(GameEvents.GAME_REMOVED, resolve);
    stopMainScene();
  });
