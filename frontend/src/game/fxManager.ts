import { BlackHolePipeline } from 'src/shaders/blackHole.pipeline';
import { GameScene } from './gameScene';
import { buildColliderCache } from 'shared/src/ai/functions';
import { ObjectTypes } from 'shared/src/types';
import { getType } from 'shared/src/utils';

export class FxManager {
  constructor(private scene: GameScene) {}

  create() {
    const renderer = this.getRenderer();
    if (renderer) {
      renderer.pipelines.addPostPipeline('BlackHoleFX', BlackHolePipeline);
      this.scene.cameras.main.setPostPipeline('BlackHoleFX');
    }
  }

  update() {
    setTimeout(() => {
      const blackHoleFX = this.getPipeline('BlackHoleFX');
      if (blackHoleFX) {
        const blackHoles = buildColliderCache(this.scene.world).filter(
          (o) => getType(o.eid) === ObjectTypes.BLACK_HOLE,
        );
        if (blackHoles.length) {
          (blackHoleFX as BlackHolePipeline).updateHoles(blackHoles);
        }
      }
    });
  }

  destroy() {
    const pipeline = this.getPipeline('BlackHoleFX');
    if (pipeline) {
      this.getRenderer()!.pipelines.removePostPipeline(
        pipeline as BlackHolePipeline,
      );
    }
  }

  private getPipeline(name: string) {
    if (this.getRenderer()) {
      switch (name) {
        case 'BlackHoleFX':
          return this.scene.cameras.main.getPostPipeline('BlackHoleFX');
        default:
          return null;
      }
    }
    return null;
  }

  private getRenderer() {
    const renderer = this.scene.game
      .renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (renderer.pipelines) {
      return renderer;
    }
    return null;
  }
}
