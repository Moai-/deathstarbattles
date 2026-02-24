import { query } from 'bitecs';
import { GameWorld } from '../world';
import { Active, Position, Velocity } from '../components';

const slow = 1 / 300;
const movingEntities = [Position, Velocity, Active];

export const createMovementSystem = () => {
  return (world: GameWorld) => {
    const dt = world.delta;
    const entities = query(world, movingEntities);

    for (const eid of entities) {
      const vx = Velocity.x[eid];
      const vy = Velocity.y[eid];
      const dx = vx * dt * slow;
      const dy = vy * dt * slow;
      const newX = Position.x[eid] + dx;
      const newY = Position.y[eid] + dy;
      Position.x[eid] = newX;
      Position.y[eid] = newY;
    }
    return world;
  }
};
