import { Position } from 'shared/src/ecs/components/position';
import { RenderObject } from '../types';
import { Renderable } from '../components/renderable';

const renderAsteroid: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  return scene.add.circle(x, y, Renderable.size[eid], 0x774e00);
};

export default renderAsteroid;
