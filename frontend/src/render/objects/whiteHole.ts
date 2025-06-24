import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import generateStarCols from '../elements/starCols';
import { nailToContainer } from 'src/util';
import { drawCoronaSpiky } from '../elements/corona';
import { ui32ToCol } from 'shared/src/utils';

const renderWhiteHole: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
  const baseCol = ui32ToCol(Renderable.col[eid]);
  const cols = generateStarCols(baseCol, 7);
  const coronas = scene.add.container(x, y);
  const outerCorona = drawCoronaSpiky(
    scene,
    { x: 0, y: 0 },
    radius * 6,
    cols[6],
    4,
    100,
    3,
  );
  coronas.add(outerCorona);
  const innerCorona = drawCoronaSpiky(
    scene,
    { x: 0, y: 0 },
    radius * 2,
    cols[5],
    4,
    79,
    2,
  );
  coronas.add(innerCorona);
  coronas.setDepth(Depths.BOTTOM);
  container.add(scene.add.circle(0, 0, radius, cols[1]));
  container.add(scene.add.circle(0, 0, radius * 0.97, cols[0]));
  container.add(scene.add.circle(0, 0, radius * 0.95, baseCol));
  container.setDepth(Depths.STARS);
  return nailToContainer(container, coronas);
};

export default renderWhiteHole;
