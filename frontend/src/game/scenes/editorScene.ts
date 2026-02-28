import {
  createCleanupSystem,
  createCollisionResolverSystem,
} from 'shared/src/ecs/systems';
import { gameBus, GameEvents } from 'src/util';
import { BaseScene } from './baseScene';
import {EditorManager} from '../managers';
import { AppScenes } from '../types';

export class EditorScene extends BaseScene {
  private editorManager = new EditorManager(this, this.world, this.objectManager);
  private cleanupSystem = createCleanupSystem(
    this.editorManager.onCleanup.bind(this.editorManager),
  );
  private collisionResolverSystem = createCollisionResolverSystem(
    this.editorManager.onCollision.bind(this.editorManager),
  );

  constructor() {
    super(AppScenes.EDITOR);
    // this.debug = true;
  }

  create() {
    super.create();
    this.editorManager.create();
    gameBus.emit(GameEvents.SCENE_LOADED);
    this.editorManager.ready();
  }

  update(time: number, deltaMs: number) {
    super.update(time, deltaMs);
    this.editorManager.update();
    this.collisionResolverSystem(this.world);
    this.cleanupSystem(this.world);
  }

  destroy() {
    super.destroy();
    this.editorManager.destroy();
  }
}
