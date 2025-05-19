import { Position } from 'shared/src/ecs/components/position';
import { RenderObject } from '../types';
import { ui32ToCol } from '../../util/col';
import { Renderable } from '../components/renderable';

const renderDeathStar: RenderObject = (scene, eid) => {
  const x = Position.x[eid];
  const y = Position.y[eid];
  return scene.add.circle(x, y, 30, ui32ToCol(Renderable.col[eid]));
};

export default renderDeathStar;
