import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
// import { ui32ToCol } from '../../util/col';
// import { Renderable } from '../components/renderable';
import { Collision } from 'shared/src/ecs/components/collision';

const renderDeathBeam: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const beamHead = scene.add.circle(0, 0, Collision.radius[eid], 0xffffff, 1);
  const container = scene.add.container(x, y);
  container.add(beamHead);
  container.setDepth(Depths.PROJECTILES);
  return container;
};

export default renderDeathBeam;
