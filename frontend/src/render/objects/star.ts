import { Position } from 'shared/src/ecs/components/position';
import { RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import { ui32ToCol } from '../../util/col';
import generateStarCols from '../elements/starCols';
import drawCorona from '../elements/corona';

const renderStar: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
  const baseCol = ui32ToCol(Renderable.col[eid]);
  const cols = generateStarCols(baseCol, 6);
  container.add(drawCorona(scene, { x: 0, y: 0 }, radius, cols[5]));
  container.add(scene.add.circle(0, 0, radius, cols[1]).setDepth(2));
  container.add(scene.add.circle(0, 0, radius * 0.97, cols[0]).setDepth(2));
  container.add(scene.add.circle(0, 0, radius * 0.95, baseCol)).setDepth(2);
  return container;
};

export default renderStar;
