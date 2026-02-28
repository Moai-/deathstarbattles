import 'phaser';
export * from './app';
export * from './types';
export * from './scenes';


// declare global {
//   interface Window {
//     __PHASER_GAME__: Phaser.Game | null;
//   }
// }

// window.__PHASER_GAME__ = window.__PHASER_GAME__ || null;


// export const getMainScene = () => {
//   const game = getGame();
//   if (game) {
//     return game.scene.getScene('GameScene')! as GameScene;
//   }
//   return null;
// };

// export const stopMainScene = () => {
//   return new Promise<void>((resolve) => {
//     const scene = getMainScene();
//     if (scene?.scene.isActive()) {
//       gameBus.on(GameEvents.GAME_REMOVED, () => {
//         gameBus.off(GameEvents.GAME_REMOVED);
//         resolve();
//       });
//       scene.scene.stop();
//       scene.destroy();
//     } else {
//       resolve();
//     }
//   });
// };

// export const startMainScene = () => {
//   const scene = getMainScene();
//   if (scene) {
//     scene.scene.start();
//   }
// };

// export const getEditorScene = () => {
//   const game = getGame();
//   if (game) {
//     const scene = game.scene.getScene('EditorScene');
//     if (scene) {
//       return scene as EditorScene;
//     }
//   }
//   return null;
// }

// export const startEditorScene = () => {
//   const scene = getEditorScene();
//   if (scene) {
//     scene.scene.start();
//   }
// }

// export const stopEditorScene = () => {
//   return new Promise<void>((resolve) => {
//     const scene = getEditorScene();
//     if (scene?.scene.isActive()) {
//       gameBus.on(GameEvents.GAME_REMOVED, () => {
//         gameBus.off(GameEvents.GAME_REMOVED);
//         resolve();
//       });
//       scene.scene.stop();
//       scene.destroy();
//     } else {
//       resolve();
//     }
//   });
// }