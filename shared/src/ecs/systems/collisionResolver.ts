import { defineQuery, defineSystem, removeEntity, hasComponent } from 'bitecs';
import { getPosition, getRadius, setPosition } from 'shared/src/utils';
import { Collision } from '../components/collision';
import { Position } from '../components/position';
import { Projectile } from '../components/projectile';
import { Wormhole, ExitTypes } from '../components/wormhole';
import { GameWorld, NULL_ENTITY } from '../world';
import { Destructible } from '../components/destructible';
import { BASE_HEIGHT, BASE_WIDTH } from 'shared/src/consts';
import { generateNonOverlappingPositions } from 'shared/src/utils';

const projectileQuery = defineQuery([Projectile, Position, Collision]);

export const createCollisionResolverSystem = (
  onCollision: (
    projEid: number,
    targetEid: number,
    hitDestructible: boolean,
  ) => void = () => {},
) => {
  return defineSystem((world: GameWorld) => {
    if (!world.movements) return world; // no shots this frame

    const projectiles = projectileQuery(world);

    for (const projEid of projectiles) {
      const parent = Projectile.parent[projEid];
      const target = Projectile.lastCollisionTarget[projEid];

      // Nothing to resolve
      if (target === NULL_ENTITY) {
        continue;
      }

      // Another projectile, we don't care -- strip out the target
      if (hasComponent(world, Projectile, target)) {
        Projectile.lastCollisionTarget[projEid] = NULL_ENTITY;
        continue;
      }

      // Target can be destroyed
      if (hasComponent(world, Destructible, target)) {
        onCollision(projEid, target, true);
        removeEntity(world, projEid);
        removeEntity(world, target); // Maybe remove later if target takes multiple shots to kill
        world.movements[parent].destroyedTarget = target;
        continue;
      }

      // Target is a wormhole
      // Teleport and strip out target
      if (hasComponent(world, Wormhole, target)) {
        handleWormholeTeleport(projEid, target, world);
        Projectile.lastCollisionTarget[projEid] = NULL_ENTITY;
        continue;
      }

      // Target is not a wormhole, not destructible, but has collision
      onCollision(projEid, target, false);
      removeEntity(world, projEid);
    }

    return world;
  });
};

const handleWormholeTeleport = (
  projEid: number,
  holeEid: number,
  world: GameWorld,
) => {
  const exitType = Wormhole.exitType[holeEid];

  if (exitType === ExitTypes.RANDOM) {
    const [newPos] = generateNonOverlappingPositions(
      BASE_WIDTH,
      BASE_HEIGHT,
      [getRadius(projEid)],
      (a, b) => a + b + 5,
      world.allObjects,
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
    const exitAngle = entryAngle + Math.PI; // flip 180

    const offset = 1.5; // push beyond radius to avoid re-triggering
    const exitX = partnerPos.x + Math.cos(exitAngle) * (partnerRadius + offset);
    const exitY = partnerPos.y + Math.sin(exitAngle) * (partnerRadius + offset);

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
};
