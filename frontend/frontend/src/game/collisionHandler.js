import { hasComponent, removeEntity } from 'bitecs';
import { Destructible } from 'shared/src/ecs/components/destructible';
import { Projectile } from 'shared/src/ecs/components/projectile';
export class CollisionHandler {
    constructor(world) {
        this.onProjectileDestroyed = () => { };
        this.onTargetDestroyed = () => { };
        this.world = world;
    }
    handleCollision(eid1, eid2) {
        const isProjectile1 = hasComponent(this.world, Projectile, eid1);
        const isProjectile2 = hasComponent(this.world, Projectile, eid2);
        if (isProjectile1 && isProjectile2) {
            // crossing projectiles don't blow themselves up... unless there's a config for this?
            return;
        }
        if (isProjectile1) {
            this.destroyProjectile(eid1);
            this.handleTarget(eid2);
        }
        else if (isProjectile2) {
            this.destroyProjectile(eid2);
            this.handleTarget(eid1);
        }
    }
    destroyProjectile(eid) {
        removeEntity(this.world, eid);
        this.onProjectileDestroyed(eid);
    }
    handleTarget(eid) {
        if (hasComponent(this.world, Destructible, eid)) {
            removeEntity(this.world, eid);
            this.onTargetDestroyed(eid);
        }
    }
    setProjectileDestroyedCallback(cb) {
        this.onProjectileDestroyed = cb;
    }
    setTargetDestroyedCallback(cb) {
        this.onTargetDestroyed = cb;
    }
}
