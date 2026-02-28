import {
  createCleanupSystem,
  createCollisionResolverSystem,
} from 'shared/src/ecs/systems';
import {SinglePlayerGameManager as GameManager} from '../managers';
import { gameBus, GameEvents } from 'src/util';
import { getSoundManager } from './resourceScene';
import { BaseScene } from './baseScene';
import { AppScenes } from '../types';

export class GameScene extends BaseScene {
  private gameManager = new GameManager(this, this.world, this.objectManager);
  private cleanupSystem = createCleanupSystem(
    this.gameManager.onCleanup.bind(this.gameManager),
  );
  private collisionResolverSystem = createCollisionResolverSystem(
    this.gameManager.onCollision.bind(this.gameManager),
  );

  constructor() {
    super(AppScenes.GAME);
  }

  create() {
    super.create();
    gameBus.on(GameEvents.START_GAME, (config) => {
      this.gameManager.startGame(config);
    });
    this.gameManager.create();
    getSoundManager(this).playSound('songLoop');
    gameBus.emit(GameEvents.SCENE_LOADED);
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
