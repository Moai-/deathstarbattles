import { gameBus, GameEvents } from 'src/util';
import { AudioManager, audioManifest } from './audioManager';

const RESOURCE_SCENE = 'ResourceScene';

export class ResourceScene extends Phaser.Scene {
  private audioManager: AudioManager;

  constructor() {
    super({ key: RESOURCE_SCENE, active: true });
    this.audioManager = new AudioManager(this);
  }

  preload() {
    // console.time('load resources');
    const keys = Object.keys(audioManifest);
    keys.forEach((key) => {
      this.load.audio(key, audioManifest[key].url);
    });
    // this.load.text('gravityShaderFragment', 'src/shaders/gravity.frag');
    // this.load.text('blackHoleFragment', 'src/shaders/blackHole.frag');
  }

  create() {
    this.audioManager.create();
    gameBus.on(
      GameEvents.SET_VOLUME,
      ({ musicVolume, effectsVolume, mute }) => {
        if (musicVolume) {
          this.audioManager.setVolume(musicVolume, 'music');
        }
        if (effectsVolume) {
          this.audioManager.setVolume(effectsVolume, 'effects');
        }
        if (typeof mute !== 'undefined') {
          this.audioManager.setMuted(mute);
        }
      },
    );
    // console.timeEnd('load resources');

    gameBus.emit(GameEvents.GAME_LOADED);
  }

  destroy() {
    gameBus.off(GameEvents.SET_VOLUME);
    this.audioManager.destroy();
  }

  sounds() {
    return this.audioManager;
  }
}

export const getSoundManager = (scene: Phaser.Scene) => {
  return (scene.scene.get(RESOURCE_SCENE) as ResourceScene).sounds();
};
