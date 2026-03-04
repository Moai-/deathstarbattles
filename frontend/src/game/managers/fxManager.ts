import { BlackHolePipeline } from 'src/shaders/blackHole.pipeline';
import { buildColliderCache } from 'shared/src/ai/functions';
import { ObjectTypes } from 'shared/src/types';
import { getType } from 'shared/src/utils';
import { FXAAPipeline } from 'src/shaders/fxaa.pipeline';
import { BaseScene } from '../scenes/baseScene';

// Handles GLSL pipelines -- updates them and manages their lifecycle
export class FxManager {
  private isReady = false;

  constructor(private scene: BaseScene) {}

  create() {
    const renderer = this.getRenderer();
    if (renderer) {
      if (!renderer.pipelines.has('BlackHoleFX')) {
        renderer.pipelines.addPostPipeline('BlackHoleFX', BlackHolePipeline);
      }
      if (!renderer.pipelines.has('FXAA')) {
        renderer.pipelines.addPostPipeline('FXAA', FXAAPipeline);
      }
      this.scene.cameras.main?.setPostPipeline('BlackHoleFX')

      // .setPostPipeline('FXAA');
    }
  }

  activate() {
    this.isReady = true;
  }

  update() {
    if (this.isReady) {
      const blackHoleFX = this.getPipeline('BlackHoleFX');
      if (blackHoleFX) {
        const blackHoles = buildColliderCache(this.scene.world).filter(
          (o) => getType(o.eid) === ObjectTypes.BLACK_HOLE
        );
        (blackHoleFX as BlackHolePipeline).updateHoles?.(blackHoles);
      }
    }
  }

  destroy() {
    this.isReady = false;
    
    const cam = this.scene.cameras?.main;
    if (cam) {
      cam.removePostPipeline('BlackHoleFX');
      cam.removePostPipeline('FXAA');
    }
    const renderer = this.getRenderer();
    if (renderer) {
      if (renderer.pipelines.has('BlackHoleFX')) renderer.pipelines.remove('BlackHoleFX')
      if (renderer.pipelines.has('FXAA')) renderer.pipelines.remove('FXAA');
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
