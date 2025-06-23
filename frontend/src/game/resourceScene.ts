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
    const keys = Object.keys(audioManifest);
    keys.forEach((key) => {
      this.load.audio(key, audioManifest[key].url);
    });
  }

  create() {
    this.audioManager.create();
    this.scene.start('GameScene');
    this.audioManager.playSound('songLoop');
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
