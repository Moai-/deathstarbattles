import { Backgrounds } from "shared/src/types";
import { BaseScene } from "../scenes";
import { generatorMap } from "src/render/background";

const BG_TEXTURE = 'currentBackground';

// Generates, stores, destroys game backgrounds
export class BackgroundArtManager {
  protected scene: BaseScene;
  protected bg: Phaser.GameObjects.Image | null = null;

  constructor(scene: BaseScene) {
    this.scene = scene;
  }

  setBackground(bg: Backgrounds, props: any = {}) {
    this.removeBackground();

    const renderTexture = generatorMap[bg](this.scene, props);
    renderTexture.saveTexture(BG_TEXTURE);

    this.bg = this.scene.add
      .image(0, 0, BG_TEXTURE)
      .setOrigin(0, 0)
      .setDisplaySize(this.scene.scale.width, this.scene.scale.height);

    renderTexture.destroy();
  }

  removeBackground() {
    this.bg?.destroy();
    this.bg = null;

    if (this.scene.textures.exists(BG_TEXTURE)) {
      this.scene.textures.remove(BG_TEXTURE);
    }
  }

  destroy() {
    this.removeBackground();
  }
}