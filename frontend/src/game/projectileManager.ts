import { fireProjectile } from '../entities/deathStar';
import { removeEntity } from 'bitecs';
import { GameWorld } from 'shared/src/ecs/world';

type CleanupCallback = () => void;

type ProjectileReference = {
  ownId: number;
  playerId: number;
};

export class ProjectileManager {
  private world: GameWorld;
  private activeProjectiles: Array<ProjectileReference> = [];
  private cleanedCount = 0;
  private onAllCleaned: CleanupCallback = () => {};

  constructor(world: GameWorld) {
    this.world = world;
  }

  fireFrom(playerId: number, angle: number, power: number): number {
    const eid = fireProjectile(this.world, playerId, angle, power);
    this.activeProjectiles.push({ ownId: eid, playerId });
    return eid;
  }

  removeProjectile(eid: number): void {
    removeEntity(this.world, eid);

    const thisRef = this.getByEid(eid);
    if (thisRef) {
      this.cleanedCount++;
    }

    if (this.cleanedCount === this.activeProjectiles.length) {
      setTimeout(() => this.onAllCleaned(), 1000); // optional delay for effect
    }
  }

  setCleanupCallback(cb: CleanupCallback): void {
    this.onAllCleaned = cb;
  }

  reset(): void {
    this.activeProjectiles = [];
    this.cleanedCount = 0;
  }

  getByEid(eid: number) {
    return this.activeProjectiles.find((projRef) => projRef.ownId === eid);
  }

  getByPlayerId(playerId: number) {
    return this.activeProjectiles.find(
      (projRef) => projRef.playerId === playerId,
    );
  }
}
