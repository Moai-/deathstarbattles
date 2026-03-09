import { addComponent, addEntity, entityExists, removeComponent } from "bitecs";
import { 
  Position, 
  Collision, 
  Renderable, 
  Destructible, 
  ObjectInfo, 
  Player, 
  Active, 
  AffectedByGravity, 
  AffectedByJets, 
  HasLifetime, 
  Projectile, 
  Velocity, 
  LeavesTrail 
} from "shared/src/ecs/components";
import { Colour, EntityGenerator, ObjectTypes } from "shared/src/types";
import { BASE_DEATHSTAR_RAD, BASE_DEATHBEAM_RAD } from "../consts";
import { rgb } from "shared/src/utils";
import { NULL_ENTITY } from "shared/src/consts";
import { TrailType } from "shared/src/ecs/components/leavesTrail";
import { GameWorld } from "shared/src/ecs/world";
import { inputsToShot } from "shared/src/ai/functions";

type DeathStarProps = {
  colour: Colour;
  owner: number;
}

export const createDeathStar: EntityGenerator<DeathStarProps> = (world, pos, props) => {
  const eid = addEntity(world);

  addComponent(world, eid, Position);
  Position.x[eid] = pos.x;
  Position.y[eid] = pos.y;

  addComponent(world, eid, Collision);
  Collision.radius[eid] = BASE_DEATHSTAR_RAD;

  addComponent(world, eid, ObjectInfo);
  ObjectInfo.cloneOf[eid] = 0;
  ObjectInfo.owner[eid] = props?.owner ?? 0;
  ObjectInfo.type[eid] = ObjectTypes.DEATHSTAR;

  addComponent(world, eid, Renderable);
  const baseColour = rgb(props?.colour ?? rgb(200, 200, 200)).num()
  Renderable.col[eid] = baseColour;

  addComponent(world, eid, Player);
  addComponent(world, eid, Destructible);
  addComponent(world, eid, Active);

  // Together with the deathstar, we actually also add a projectile
  // This projectile is hidden at first and activated whenever we fire it
  // Then it's cleaned up and reused -- eid economy
  const projEid = addEntity(world);

  // Add relationship between projectile and deathstar
  addComponent(world, projEid, Projectile);
  Player.pooledProjectile[eid] = projEid;
  Projectile.parent[projEid] = eid;
  Projectile.lastCollisionTarget[projEid] = NULL_ENTITY;

  addComponent(world, projEid, Collision);
  Collision.radius[projEid] = BASE_DEATHBEAM_RAD;

  addComponent(world, projEid, Renderable);
  Renderable.col[projEid] = baseColour;

  addComponent(world, projEid, ObjectInfo);
  ObjectInfo.type[projEid] = ObjectTypes.DEATHBEAM;
  ObjectInfo.owner[projEid] = props?.owner || 0;
  ObjectInfo.cloneOf[projEid] = 0;

  addComponent(world, projEid, LeavesTrail);
  LeavesTrail.col[projEid] = baseColour;
  LeavesTrail.type[projEid] = TrailType.BEADS_ON_A_STRING;

  addComponent(world, projEid, HasLifetime);
  HasLifetime.createdAt[projEid] = 0;

  // No need to set any of their variables yet, since the deathbeam
  // isn't created in an active state, but we can still reset them
  addComponent(world, projEid, Position);
  Position.x[projEid] = 0;
  Position.y[projEid] = 0;

  addComponent(world, projEid, Velocity);
  Velocity.x[projEid] = 0;
  Velocity.y[projEid] = 0;

  addComponent(world, projEid, AffectedByGravity);
  addComponent(world, projEid, AffectedByJets)

  // We do not need the projectile eid
  // References to it are stored in deathstar eid components
  return eid;
}

export const fireProjectile = (
  world: GameWorld,
  parentEid: number,
  angle: number,
  power: number,
) => {
  const eid = Player.pooledProjectile[parentEid];
  HasLifetime.createdAt[eid] = Math.floor(world.time);
  Projectile.lastCollisionTarget[eid] = NULL_ENTITY;
  Collision.radius[eid] = Collision.radius[parentEid] / 8;
  addComponent(world, eid, Active);

  inputsToShot(parentEid, eid, { angle, power });

  return eid;
};

export const removeProjectile = (
  removeProp: {
    parentEid?: number;
    projEid?: number;
  },
  world: GameWorld,
) => {
  const { parentEid, projEid } = removeProp;

  const eid = parentEid ? Player.pooledProjectile[parentEid] : projEid!;
  if (!entityExists(world, eid)) {
    return;
  }
  HasLifetime.createdAt[eid] = 0;
  removeComponent(world, eid, Active);
};