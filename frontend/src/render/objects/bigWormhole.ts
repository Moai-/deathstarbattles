import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import { ui32ToCol } from '../../util/col';
import generateStarCols from '../elements/starCols';
import { nailToContainer } from 'src/util';

const renderBigWormhole: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
  const baseCol = ui32ToCol(Renderable.col[eid]);
  const cols = generateStarCols(baseCol, 3);
  const corona = scene.add.container(x, y);

  corona.add(scene.add.circle(0, 0, radius * 1.13, cols[2]));
  corona.add(scene.add.circle(0, 0, radius * 1.08, cols[1]));
  corona.add(scene.add.circle(0, 0, radius * 1.05, cols[0]));
  corona.add(scene.add.circle(0, 0, radius * 1.01, baseCol));
  corona.setDepth(Depths.BOTTOM);

  container.add(scene.add.circle(0, 0, radius, 0));
  container.setDepth(Depths.STARS);
  return nailToContainer(container, corona);
};

export default renderBigWormhole;
