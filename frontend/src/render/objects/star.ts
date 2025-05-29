import { Position } from 'shared/src/ecs/components/position';
import { Depths, RenderObject } from '../types';
import { Collision } from 'shared/src/ecs/components/collision';
import { Renderable } from '../components/renderable';
import { ui32ToCol } from '../../util/col';
import generateStarCols from '../elements/starCols';
import drawCorona from '../elements/corona';
import { MIN_SUPERGIANT_RAD } from 'src/entities/supergiant';

const renderStar: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  const radius = Collision.radius[eid];
  const container = scene.add.container(x, y);
  const baseCol = ui32ToCol(Renderable.col[eid]);
  const cols = generateStarCols(baseCol, 6);
  const coronaSteps = radius < MIN_SUPERGIANT_RAD ? 300 : 1000;
  const coronaLayers = radius < MIN_SUPERGIANT_RAD ? 3 : 5;
  const coronaRadius = radius < MIN_SUPERGIANT_RAD ? radius : radius * 0.9;
  container.add(
    drawCorona(
      scene,
      { x: 0, y: 0 },
      coronaRadius,
      cols[5],
      coronaLayers,
      coronaSteps,
    ),
  );
  container.add(scene.add.circle(0, 0, radius, cols[1]));
  container.add(scene.add.circle(0, 0, radius * 0.97, cols[0]));
  container.add(scene.add.circle(0, 0, radius * 0.95, baseCol));
  container.setDepth(Depths.STARS);
  return container;
};

export default renderStar;
