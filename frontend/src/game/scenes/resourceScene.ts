import { gameBus, GameEvents } from 'src/util';
import { AudioManager, audioManifest } from '../managers/audioManager';
import { AppScenes } from '../types';

// Keep track of static resources here
export class ResourceScene extends Phaser.Scene {
  private audioManager: AudioManager;

  constructor() {
    super({ key: AppScenes.RESOURCE, active: true });
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
  return (scene.scene.get(AppScenes.RESOURCE) as ResourceScene).sounds();
};
