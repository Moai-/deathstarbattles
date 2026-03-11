import {
  createCleanupSystem,
  createCollisionResolverSystem,
} from 'shared/src/ecs/systems';
import { gameBus, GameEvents } from 'src/util';
import { getSoundManager } from './resourceScene';
import { BaseScene } from './baseScene';
import { AppScenes } from '../types';
import { BackgroundGameManager } from '../managers/backgroundGameManager';

// Runs automatic game between bots
export class BackgroundScene extends BaseScene {
  private gameManager = new BackgroundGameManager(this, this.world, this.renderManager);
  private cleanupSystem = createCleanupSystem(
    this.gameManager.onCleanup.bind(this.gameManager),
  );
  private collisionResolverSystem = createCollisionResolverSystem(
    this.gameManager.onCollision.bind(this.gameManager),
  );

  constructor() {
    super(AppScenes.BACKGROUND);
    // this.debug = true;
  }

  create() {
    super.create();
    this.gameManager.create();
    getSoundManager(this).playSound('songLoop');
    gameBus.emit(GameEvents.SCENE_LOADED);
    this.gameManager.startGame({ justBots: true });
  }

  update(time: number, deltaMs: number) {
    super.update(time, deltaMs);
    this.collisionResolverSystem(this.world);
    this.cleanupSystem(this.world);
  }

  destroy() {
    super.destroy();
    this.gameManager.destroy();
  }
}
