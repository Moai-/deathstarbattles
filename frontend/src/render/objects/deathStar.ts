import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Renderable } from '../components/renderable';
import { Collision } from 'shared/src/ecs/components/collision';
import { addShadow } from '../elements/shadow';
import { addEquatorialRidge } from '../elements/equatorialRidge';
import { addEllipse } from '../elements/ellipse';
import { ui32ToCol } from 'shared/src/utils';

const renderDeathStar: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const circle = scene.add.circle(0, 0, radius, ui32ToCol(Renderable.col[eid]));
  const container = scene.add.container(x, y);
  const thirdRad = radius / 3;
  container.add(circle);
  addShadow(scene, container, radius);
  addEquatorialRidge(scene, container, radius);
  addEllipse(scene, container, {
    offset: { x: thirdRad, y: -thirdRad * 1.1 },
    radiusX: thirdRad,
  });
  container.setDepth(Depths.STATIONS);
  return container;
};

export default renderDeathStar;
