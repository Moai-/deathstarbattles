import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import generateStarCols from '../elements/starCols';
import { nailToContainer } from 'src/util';
import { ui32ToCol } from 'shared/src/utils';

const renderWormhole: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
  const baseCol = ui32ToCol(Renderable.col[eid]);
  const cols = generateStarCols(baseCol, 3);
  const corona = scene.add.container(x, y);

  corona.add(scene.add.circle(0, 0, radius * 2, cols[2]));
  corona.add(scene.add.circle(0, 0, radius * 1.6, cols[1]));
  corona.add(scene.add.circle(0, 0, radius * 1.3, cols[0]));
  corona.add(scene.add.circle(0, 0, radius * 1.08, baseCol));
  corona.setDepth(Depths.BOTTOM);

  container.add(scene.add.circle(0, 0, radius, 0));
  container.setDepth(Depths.STARS);
  return nailToContainer(container, corona);
};

export default renderWormhole;
