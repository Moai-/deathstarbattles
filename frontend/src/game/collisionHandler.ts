import { hasComponent, removeEntity } from 'bitecs';
import { Destructible } from 'shared/src/ecs/components/destructible';
import { Projectile } from 'shared/src/ecs/components/projectile';
import { ExitTypes, Wormhole } from 'shared/src/ecs/components/wormhole';
import { GameWorld } from 'shared/src/ecs/world';
import Explosion, {
  laserCols,
  stationCols,
} from 'src/render/animations/explosion';
import { getPosition, getRadius, setPosition } from 'src/util';
import { generateNonOverlappingPositions } from './util';
import { GameObject } from 'shared/src/types';
import { getSoundManager } from './resourceScene';

type CollisionCallback = (eid: number) => void;

export class CollisionHandler {
  private world: GameWorld;
  private scene: Phaser.Scene;
  private objects: Array<GameObject>;
  private onProjectileDestroyed: CollisionCallback = () => {};
  private onTargetDestroyed: CollisionCallback = () => {};

  constructor(
    world: GameWorld,
    scene: Phaser.Scene,
    objects: Array<GameObject>,
  ) {
    this.world = world;
    this.scene = scene;
    this.objects = objects;
  }

  handleCollision(eid1: number, eid2: number): void {
    const isProjectile1 = hasComponent(this.world, Projectile, eid1);
    const isProjectile2 = hasComponent(this.world, Projectile, eid2);

    const isWormhole = hasComponent(this.world, Wormhole, eid2);

    if (isProjectile1 && isProjectile2) {
      // crossing projectiles don't blow themselves up... unless there's a config for this?
      return;
    }

    if (isWormhole) {
      this.handleWormhole(eid1, eid2);
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
    const pos = getPosition(eid);
    const radius = getRadius(eid);
    new Explosion(this.scene, pos, radius * 4, laserCols).play(700);
    removeEntity(this.world, eid);
    this.onProjectileDestroyed(eid);
  }

  private handleTarget(eid: number) {
    if (hasComponent(this.world, Destructible, eid)) {
      const pos = getPosition(eid);
      const radius = getRadius(eid);
      new Explosion(this.scene, pos, radius * 2, stationCols).play(1000);
      removeEntity(this.world, eid);
      this.onTargetDestroyed(eid);
      getSoundManager(this.scene).playSound('stationHit');
    } else {
      getSoundManager(this.scene).playSound('genericHit');
    }
  }

  private handleWormhole(projEid: number, holeEid: number) {
    const exitType = Wormhole.exitType[holeEid];

    if (exitType === ExitTypes.RANDOM) {
      const { width, height } = this.scene.scale;

      const [newPos] = generateNonOverlappingPositions(
        width,
        height,
        [getRadius(projEid)],
        (a, b) => a + b + 5,
        this.objects,
      );
      setPosition(projEid, newPos);
      return;
    }

    const partnerEid = Wormhole.teleportTarget[holeEid];

    const holePos = getPosition(holeEid);
    const partnerPos = getPosition(partnerEid);
    const partnerRadius = getRadius(partnerEid);
    const projPos = getPosition(projEid);

    if (exitType === ExitTypes.PAIRED_GIANT) {
      // Compute entry angle relative to the source wormhole
      const dx = projPos.x - holePos.x;
      const dy = projPos.y - holePos.y;

      const entryAngle = Math.atan2(dy, dx); // radians
      const exitAngle = entryAngle + Math.PI; // flip 180°

      const offset = 1.5; // push beyond radius to avoid re-triggering
      const exitX =
        partnerPos.x + Math.cos(exitAngle) * (partnerRadius + offset);
      const exitY =
        partnerPos.y + Math.sin(exitAngle) * (partnerRadius + offset);

      setPosition(projEid, exitX, exitY);
      return;
    }

    // Default PAIRED logic
    const dx = projPos.x - holePos.x;
    const dy = projPos.y - holePos.y;

    const outDx = -dx;
    const outDy = -dy;

    const mag = Math.hypot(outDx, outDy);
    const nx = outDx / mag;
    const ny = outDy / mag;

    const offset = 1.5;
    const exitX = partnerPos.x + nx * (partnerRadius + offset);
    const exitY = partnerPos.y + ny * (partnerRadius + offset);

    setPosition(projEid, exitX, exitY);
  }

  setProjectileDestroyedCallback(cb: CollisionCallback): void {
    this.onProjectileDestroyed = cb;
  }

  setTargetDestroyedCallback(cb: CollisionCallback): void {
    this.onTargetDestroyed = cb;
  }
}
