import { BackgroundScene, BaseScene, EditorScene, GameScene, ResourceScene } from './scenes';
import { BASE_HEIGHT, BASE_WIDTH } from 'shared/src/consts';
import { gameBus, GameEvents } from 'src/util';
import { AppModes, AppScenes } from './types';
import { GameConfig } from 'shared/src/types';

const modeScenes: Record<AppModes, AppScenes> = {
  "BackgroundMode": AppScenes.BACKGROUND,
  "EditorMode": AppScenes.EDITOR,
  "GameMode": AppScenes.GAME
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  backgroundColor: '#000000',
  width: BASE_WIDTH,
  height: BASE_HEIGHT,
  parent: 'phaser-root',
  scale: {
    mode: Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BackgroundScene, EditorScene, GameScene, ResourceScene],
  roundPixels: true,
  physics: { default: 'arcade' },
};

// Manages the Phaser app by switching between scenes
// Basically this is the external point of contact between Phaser and React
class DSBPhaserApp {
  private game: Phaser.Game | null = null;
  private activeMode: AppModes | null = null;

  createGame() {
    return new Promise<void>((resolve) => {
      if (!this.game) {
        gameBus.once(GameEvents.GAME_LOADED, resolve);
        this.game = new Phaser.Game(config);
      } else {
        resolve();
      }
    })
  }

  destroyGame(){
    if (this.game) {
      this.game.destroy(true);
      gameBus.emit(GameEvents.GAME_REMOVED)
    }
  }

  startMode(mode: AppModes, config?: GameConfig) {
    if (this.activeMode) {
      // Throw when we try to launch a mode without exiting the previous mode first
      throw new Error(`Cannot launch mode ${mode}; mode ${this.activeMode} is active`);
    }
    return new Promise<void>((resolve) => {
      const sceneName = modeScenes[mode];
      switch(mode) {
        case AppModes.BACKGROUND: 
        case AppModes.EDITOR: {
          this.activeMode = mode;
          gameBus.once(GameEvents.SCENE_LOADED, resolve);
          break;
        }
        case AppModes.GAME: {
          if (!config) {
            throw new Error('attempted to start game with no config');
          }
          this.activeMode = mode;
          gameBus.once(GameEvents.SCENE_LOADED, () => {
            gameBus.emit(GameEvents.START_GAME, config);
            resolve();
          })
          break;
        }
      }
      this.startScene(sceneName)
    });
  }

  stopMode(mode: AppModes) {
    // If current mode isn't the mode we're trying to stop, do nothing
    if (this.activeMode !== mode) {
      return Promise.resolve();
    }

    // Noop on null mode
    if (this.activeMode === null) {
      return Promise.resolve();
    }
    this.activeMode = null;
    const scene = modeScenes[mode];
    return this.stopScene(scene);
  }

  private getScene(sceneName: AppScenes) {
    const {game} = this;
    if (!game) {
      throw new Error('Cannot get scene when game not initialized');
    }
    const scene = game.scene.getScene(sceneName);
    if (!scene) {
      throw new Error(`Scene ${sceneName} does not exist`);
    }
    return scene;
  }

  private startScene(sceneName: AppScenes) {
    const scene = this.getScene(sceneName);
    if (scene.scene.isActive()) {
      // Scene already started, do nothing
      return;
    }
    scene.scene.start();
  }

  private stopScene(sceneName: AppScenes) {
    const scene = this.getScene(sceneName) as BaseScene;
    if (!scene.scene.isActive()) {
      // Scene already inactive, do nothing
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      // Only resolve once this scene actually ended
      gameBus.on(GameEvents.SCENE_UNLOADED, (removedScene) => {
        if (removedScene === sceneName) {
          gameBus.off(GameEvents.SCENE_UNLOADED);
          resolve();
        }
      });
      scene.scene.stop();
      scene.destroy();
    })
  }

}

export const App = new DSBPhaserApp();