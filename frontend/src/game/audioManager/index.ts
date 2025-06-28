import { gameBus, GameEvents } from 'src/util';
import { AudioCategory, audioManifest } from './manifest';

export { audioManifest };

export class AudioManager {
  private allSounds: Map<string, Phaser.Sound.BaseSound> = new Map();
  private effectsVolume = 1;
  private musicVolume = 1;
  private muted = false;

  constructor(private scene: Phaser.Scene) {}

  create() {
    gameBus.on(GameEvents.SET_VOLUME, (gameVolume) => {
      if (gameVolume.mute !== undefined) {
        this.muted = gameVolume.mute;
      }
    });
    Object.keys(audioManifest).forEach((audioKey) => {
      const { rp, vol } = audioManifest[audioKey];
      const sound = this.scene.sound.add(audioKey, {
        volume: vol,
        loop: rp,
      });
      this.allSounds.set(audioKey, sound);
    });
  }

  destroy() {
    this.allSounds.forEach((sound) => {
      if (sound.isPlaying) {
        sound.stop();
      }
      sound.destroy();
    });
    this.allSounds.clear();
    gameBus.off(GameEvents.SET_VOLUME);
  }

  setMuted(mute: boolean) {
    this.muted = mute;
    if (mute) {
      this.stopAllSounds();
    }
  }

  getMute() {
    return this.muted;
  }

  getSound(key: string) {
    const sound = this.allSounds.get(key);
    const config = audioManifest[key];
    if (sound) {
      if (config) {
        return { sound, config };
      } else {
        throw new Error('No config found for sound:' + key);
      }
    } else {
      throw new Error('Non-existent sound requested:' + key);
    }
  }

  playSound(key: string) {
    if (this.muted) {
      return;
    }
    if (this.scene.sound.locked) {
      return;
    }
    const { config, sound } = this.getSound(key);
    const channelVolume = this.getVolumeForCategory(config.cat);
    if (!sound.isPlaying) {
      sound.play();
    } else if (!config.rp) {
      // Play a "spare" copy of the sound
      this.scene.sound.play(key, {
        volume: config.vol * channelVolume,
      });
    }
  }

  stopSound(key: string) {
    const { sound } = this.getSound(key);
    if (sound.isPlaying) {
      sound.stop();
    }
  }

  stopAllSounds(cat?: AudioCategory) {
    this.allSounds.forEach((sound, audioKey) => {
      if (cat) {
        const conf = audioManifest[audioKey];
        if (cat === conf.cat) {
          sound.stop();
        }
      } else {
        sound.stop();
      }
    });
    if (!cat) {
      this.scene.sound.stopAll();
    }
  }

  setVolume(volume: number, cat?: AudioCategory) {
    const clamped = Phaser.Math.Clamp(volume, 0, 1);
    if (cat === 'music') {
      this.musicVolume = clamped;
    } else if (cat === 'effects') {
      this.effectsVolume = clamped;
    } else {
      this.musicVolume = clamped;
      this.effectsVolume = clamped;
    }

    this.allSounds.forEach((sound, key) => {
      const conf = audioManifest[key];
      (sound as Phaser.Sound.HTML5AudioSound).setVolume(
        this.getVolumeForCategory(conf.cat),
      );
    });
  }

  private getVolumeForCategory(category: AudioCategory): number {
    return category === 'music' ? this.musicVolume : this.effectsVolume;
  }
}
