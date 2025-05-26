import { fireProjectile } from '../entities/deathStar';
import { removeEntity } from 'bitecs';
export class ProjectileManager {
    constructor(world) {
        this.activeProjectiles = [];
        this.cleanedCount = 0;
        this.onAllCleaned = () => { };
        this.onCleaned = () => { };
        this.world = world;
    }
    fireFrom(playerId, angle, power) {
        const eid = fireProjectile(this.world, playerId, angle, power);
        this.activeProjectiles.push({ ownId: eid, playerId });
        return eid;
    }
    removeProjectile(eid) {
        removeEntity(this.world, eid);
        this.onCleaned(eid);
        const thisRef = this.getByEid(eid);
        if (thisRef) {
            this.cleanedCount++;
        }
        if (this.cleanedCount === this.activeProjectiles.length) {
            this.onAllCleaned();
        }
    }
    setCleanupCallback(cb) {
        this.onAllCleaned = cb;
    }
    setSingleCleanupCallback(cb) {
        this.onCleaned = cb;
    }
    reset() {
        this.activeProjectiles = [];
        this.cleanedCount = 0;
    }
    getByEid(eid) {
        return this.activeProjectiles.find((projRef) => projRef.ownId === eid);
    }
    getByPlayerId(playerId) {
        return this.activeProjectiles.find((projRef) => projRef.playerId === playerId);
    }
}
