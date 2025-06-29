import { BlackHolePipeline } from 'src/shaders/blackHole.pipeline';
import { GameScene } from './gameScene';
import { buildColliderCache } from 'shared/src/ai/functions';
import { ObjectTypes } from 'shared/src/types';
import { getType } from 'shared/src/utils';
import { FXAAPipeline } from 'src/shaders/fxaa.pipeline';

export class FxManager {
  constructor(private scene: GameScene) {}

  create() {
    const renderer = this.getRenderer();
    if (renderer) {
      renderer.pipelines.addPostPipeline('BlackHoleFX', BlackHolePipeline);
      renderer.pipelines.addPostPipeline('FXAA', FXAAPipeline);
      this.scene.cameras.main.setPostPipeline('BlackHoleFX');
      // .setPostPipeline('FXAA');
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
    const bh = this.getPipeline('BlackHoleFX');
    if (bh) {
      this.getRenderer()!.pipelines.removePostPipeline(bh as BlackHolePipeline);
    }
    const fxaa = this.getPipeline('FXAA');
    if (fxaa) {
      this.getRenderer()!.pipelines.removePostPipeline(fxaa as FXAAPipeline);
    }
  }

  private getPipeline(name: string) {
    if (this.getRenderer()) {
      switch (name) {
        case 'BlackHoleFX':
          return (
            this.scene.cameras?.main?.getPostPipeline('BlackHoleFX') || null
          );
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
