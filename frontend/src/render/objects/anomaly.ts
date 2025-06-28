import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import generateStarCols from '../elements/starCols';
import drawCorona from '../elements/corona';
import { nailToContainer } from 'src/util';
import { ui32ToCol } from 'shared/src/utils';

const renderAnomaly: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
  const baseCol = ui32ToCol(Renderable.col[eid]);
  const cols = generateStarCols(baseCol, 3);
  const coronaSteps = 50;
  const coronaLayers = 8;
  const corona = drawCorona(
    scene,
    { x: 0, y: 0 },
    radius,
    cols[2],
    coronaLayers,
    coronaSteps,
  );
  container.add(scene.add.circle(0, 0, radius, cols[1]));
  container.add(scene.add.circle(0, 0, radius * 0.8, cols[0]));
  container.add(scene.add.circle(0, 0, radius * 0.6, baseCol));
  container.setDepth(Depths.STARS);
  return nailToContainer(container, corona);
};

export default renderAnomaly;
