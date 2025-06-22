export class MusicScene extends Phaser.Scene {
  private bgm?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'MusicScene', active: true }); // auto-starts
  }

  preload() {
    this.load.audio('songLoop', '/assets/songloop.ogg');
  }

  create() {
    if (!this.bgm) {
      this.bgm = this.sound.add('songLoop', { loop: true, volume: 0.1 });
      this.bgm.play();
    }
  }
}
