import { Position } from 'shared/src/ecs/components/position';
import { RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';

const renderAsteroid: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const size = Collision.radius[eid];
  return scene.add.circle(x, y, size, 0x774e00);
};

export default renderAsteroid;
