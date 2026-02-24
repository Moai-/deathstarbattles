import {
  createCleanupSystem,
  createCollisionResolverSystem,
} from 'shared/src/ecs/systems';
import { gameBus, GameEvents } from 'src/util';
import { BaseScene } from './baseScene';
import EditorManager from './editorManager';

export class EditorScene extends BaseScene {
  private editorManager = new EditorManager(this, this.world, this.objectManager);
  private cleanupSystem = createCleanupSystem(
    this.editorManager.onCleanup.bind(this.editorManager),
  );
  private collisionResolverSystem = createCollisionResolverSystem(
    this.editorManager.onCollision.bind(this.editorManager),
  );

  constructor() {
    super('EditorScene');
  }

  create() {
    super.create();
    gameBus.on(GameEvents.START_GAME, () => {
      this.editorManager.ready();
    });
    gameBus.on(GameEvents.ED_ADD_ENTITY, () => {
      this.editorManager.addEntity();
    })
    this.editorManager.create();
    gameBus.emit(GameEvents.SCENE_LOADED);
  }

  update(time: number, deltaMs: number) {
    super.update(time, deltaMs);
    this.collisionResolverSystem(this.world);
    this.cleanupSystem(this.world);
  }

  destroy() {
    super.destroy();
    this.editorManager.destroy();
  }
}
