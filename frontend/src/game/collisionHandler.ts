import { hasComponent, removeEntity } from 'bitecs';
import { Destructible } from 'shared/src/ecs/components/destructible';
import { Projectile } from 'shared/src/ecs/components/projectile';
import { GameWorld } from 'shared/src/ecs/world';

type CollisionCallback = (eid: number) => void;

export class CollisionHandler {
  private world: GameWorld;
  private onProjectileDestroyed: CollisionCallback = () => {};
  private onTargetDestroyed: CollisionCallback = () => {};

  constructor(world: GameWorld) {
    this.world = world;
  }

  handleCollision(eid1: number, eid2: number): void {
    const isProjectile1 = hasComponent(this.world, Projectile, eid1);
    const isProjectile2 = hasComponent(this.world, Projectile, eid2);

    if (isProjectile1 && isProjectile2) {
      // crossing projectiles don't blow themselves up... unless there's a config for this?
      return;
    }

    if (isProjectile1) {
      this.destroyProjectile(eid1);
      this.handleTarget(eid2);
    } else if (isProjectile2) {
      this.destroyProjectile(eid2);
      this.handleTarget(eid1);
    }
  }

  private destroyProjectile(eid: number) {
    removeEntity(this.world, eid);
    this.onProjectileDestroyed(eid);
  }

  private handleTarget(eid: number) {
    if (hasComponent(this.world, Destructible, eid)) {
      removeEntity(this.world, eid);
      this.onTargetDestroyed(eid);
    }
  }

  setProjectileDestroyedCallback(cb: CollisionCallback): void {
    this.onProjectileDestroyed = cb;
  }

  setTargetDestroyedCallback(cb: CollisionCallback): void {
    this.onTargetDestroyed = cb;
  }
}
