import { GameWorld } from 'shared/src/ecs/world';
import Explosion, {
  laserCols,
  stationCols,
} from 'src/render/animations/explosion';
import { getSoundManager } from './resourceScene';
import { getPosition, getRadius, getProjectileOwner } from 'shared/src/utils';
import { removeProjectile } from 'src/entities/deathStar';

type CollisionCallback = (targetEid: number) => void;

export class CollisionHandler {
  private world: GameWorld;
  private scene: Phaser.Scene;
  private onProjectileDestroyed: CollisionCallback = () => {};
  private onTargetDestroyed: CollisionCallback = () => {};

  constructor(world: GameWorld, scene: Phaser.Scene) {
    this.world = world;
    this.scene = scene;
  }

  handleCollision(
    projEid: number,
    targetEid: number,
    killed: boolean,
  ): boolean {
    const owner = getProjectileOwner(projEid);
    this.destroyProjectile(projEid);

    if (killed) {
      const pos = getPosition(targetEid);
      const radius = getRadius(targetEid);
      new Explosion(this.scene, pos, radius * 2, stationCols).play(1000);
      if (this.world.movements) {
        this.world.movements[owner].destroyedTarget = targetEid;
      }
      this.onTargetDestroyed(targetEid);
      getSoundManager(this.scene).playSound('stationHit');
    } else {
      getSoundManager(this.scene).playSound('genericHit');
    }
    return true;
  }

  private destroyProjectile(eid: number) {
    removeProjectile({ projEid: eid }, this.world);
    const pos = getPosition(eid);
    const radius = getRadius(eid);
    new Explosion(this.scene, pos, radius * 4, laserCols).play(700);
    this.onProjectileDestroyed(eid);
  }

  setProjectileDestroyedCallback(cb: CollisionCallback): void {
    this.onProjectileDestroyed = cb;
  }

  setTargetDestroyedCallback(cb: CollisionCallback): void {
    this.onTargetDestroyed = cb;
  }
}
